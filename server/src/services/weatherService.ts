import axios from 'axios';
import { prisma } from '../utils/prisma.js';
import { env } from '../config/env.js';
import { SOILING_CONFIG } from '../config/constants.js';
import { WeatherDataPoint } from '../engine/types.js';
import { logger } from '../utils/logger.js';

interface OwmForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  pop: number;
  rain?: {
    '3h'?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
}

export class WeatherService {
  /**
   * Fetch weather forecast for installation coordinates with PostgreSQL/SQLite caching.
   */
  public static async getForecastForInstallation(
    installationId: string,
    latitude: number,
    longitude: number,
    forceRefresh = false
  ): Promise<{
    current: WeatherDataPoint;
    forecast: WeatherDataPoint[];
    isCached: boolean;
  }> {
    const now = new Date();
    const cacheThreshold = new Date(now.getTime() - SOILING_CONFIG.WEATHER_CACHE_TTL_MS);

    // 1. Check database cache
    if (!forceRefresh) {
      const cachedSnapshots = await prisma.weatherSnapshot.findMany({
        where: {
          installationId,
          timestamp: { gte: now }, // Upcoming forecast points
        },
        orderBy: { timestamp: 'asc' },
      });

      const latestCurrent = await prisma.weatherSnapshot.findFirst({
        where: {
          installationId,
          timestamp: { lte: now },
          createdAt: { gte: cacheThreshold },
        },
        orderBy: { timestamp: 'desc' },
      });

      if (latestCurrent && cachedSnapshots.length >= 8) {
        return {
          current: this.mapSnapshotToPoint(latestCurrent),
          forecast: cachedSnapshots.map(this.mapSnapshotToPoint),
          isCached: true,
        };
      }
    }

    // 2. Fetch fresh weather from OpenWeatherMap API
    try {
      if (!env.OPENWEATHERMAP_API_KEY || env.OPENWEATHERMAP_API_KEY === 'demo_key') {
        throw new Error('Using demo simulated weather provider');
      }

      const response = await axios.get<{ list: OwmForecastItem[] }>(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat: latitude,
            lon: longitude,
            units: 'metric',
            appid: env.OPENWEATHERMAP_API_KEY,
          },
          timeout: 6000,
        }
      );

      const items = response.data.list;
      if (!items || items.length === 0) {
        throw new Error('No weather data received from OpenWeatherMap');
      }

      const currentItem = items[0];
      const current: WeatherDataPoint = {
        timestamp: new Date(currentItem.dt * 1000),
        temperature: Math.round(currentItem.main.temp),
        humidity: currentItem.main.humidity,
        windSpeed: currentItem.wind.speed,
        rainProbability: currentItem.pop,
        rainfallMm: currentItem.rain?.['3h'] || 0,
        cloudCoverage: currentItem.clouds.all,
        condition: currentItem.weather[0]?.main || 'Clear',
        description: currentItem.weather[0]?.description || 'Clear sky',
        icon: currentItem.weather[0]?.icon || '01d',
      };

      const forecast: WeatherDataPoint[] = items.slice(1).map((item) => ({
        timestamp: new Date(item.dt * 1000),
        temperature: Math.round(item.main.temp),
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
        rainProbability: item.pop,
        rainfallMm: item.rain?.['3h'] || 0,
        cloudCoverage: item.clouds.all,
        condition: item.weather[0]?.main || 'Clear',
        description: item.weather[0]?.description || 'Clear sky',
        icon: item.weather[0]?.icon || '01d',
      }));

      // 3. Cache snapshot asynchronously to database
      this.persistWeatherSnapshots(installationId, [current, ...forecast]).catch((err) =>
        logger.error('Failed to cache weather snapshots:', err)
      );

      return {
        current,
        forecast,
        isCached: false,
      };
    } catch (error) {
      logger.warn('OpenWeatherMap API unavailable or in demo mode. Serving fallback data:', error);
      const simulated = this.generateFallbackForecast(latitude, longitude);
      return {
        current: simulated.current,
        forecast: simulated.forecast,
        isCached: false,
      };
    }
  }

  private static mapSnapshotToPoint(snapshot: {
    timestamp: Date;
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
    rainfallMm: number;
    cloudCoverage: number;
    weatherCondition: string;
  }): WeatherDataPoint {
    return {
      timestamp: snapshot.timestamp,
      temperature: snapshot.temperature,
      humidity: snapshot.humidity,
      windSpeed: snapshot.windSpeed,
      rainProbability: snapshot.rainProbability,
      rainfallMm: snapshot.rainfallMm,
      cloudCoverage: snapshot.cloudCoverage,
      condition: snapshot.weatherCondition,
      description: snapshot.weatherCondition,
      icon: '01d',
    };
  }

  private static async persistWeatherSnapshots(
    installationId: string,
    points: WeatherDataPoint[]
  ) {
    // Delete existing upcoming snapshots to avoid duplicates
    await prisma.weatherSnapshot.deleteMany({
      where: {
        installationId,
        timestamp: { gte: new Date() },
      },
    });

    // Bulk insert normalized points (limited to next 40 points = 5 days)
    const records = points.slice(0, 40).map((pt) => ({
      installationId,
      timestamp: pt.timestamp,
      temperature: pt.temperature,
      humidity: pt.humidity,
      windSpeed: pt.windSpeed,
      rainProbability: pt.rainProbability,
      rainfallMm: pt.rainfallMm,
      cloudCoverage: pt.cloudCoverage,
      weatherCondition: pt.condition,
    }));

    await prisma.weatherSnapshot.createMany({
      data: records,
    });
  }

  /**
   * Generates realistic meteorological fallback data based on geographical coordinates.
   */
  public static generateFallbackForecast(
    lat: number,
    _lon: number
  ): { current: WeatherDataPoint; forecast: WeatherDataPoint[] } {
    const isArid = Math.abs(lat) < 35;
    const baseTemp = isArid ? 28 : 22;
    const baseHum = isArid ? 40 : 65;
    const now = new Date();

    const current: WeatherDataPoint = {
      timestamp: now,
      temperature: baseTemp,
      humidity: baseHum,
      windSpeed: 4.2,
      rainProbability: 0.1,
      rainfallMm: 0.0,
      cloudCoverage: 15,
      condition: 'Clear',
      description: 'Clear and sunny with mild dust',
      icon: '01d',
    };

    const forecast: WeatherDataPoint[] = [];
    for (let i = 1; i <= 32; i++) {
      const ptTime = new Date(now.getTime() + i * 3 * 3600 * 1000);
      const isDay = ptTime.getHours() >= 6 && ptTime.getHours() <= 18;
      const tempVariation = isDay ? 3 : -4;
      
      forecast.push({
        timestamp: ptTime,
        temperature: baseTemp + tempVariation,
        humidity: baseHum + (isDay ? -10 : 15),
        windSpeed: 3.5 + (i % 3),
        rainProbability: 0.05,
        rainfallMm: 0.0,
        cloudCoverage: 20,
        condition: 'Clear',
        description: 'Partly sunny',
        icon: isDay ? '01d' : '01n',
      });
    }

    return { current, forecast };
  }
}
