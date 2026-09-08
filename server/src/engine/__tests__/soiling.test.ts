import { describe, it, expect } from 'vitest';
import { SoilingModel } from '../SoilingModel.js';
import { RecommendationEngine } from '../DecisionTree.js';
import { InstallationProfile, WeatherDataPoint } from '../types.js';

const sampleInstallation: InstallationProfile = {
  id: 'test_inst_1',
  name: 'Test Rooftop Array',
  capacityKw: 10,
  panelCount: 26,
  panelType: 'MONOCRYSTALLINE',
  tiltDegrees: 25,
  lastCleaningDate: new Date(Date.now() - 14 * 86400000), // 14 days ago
  locationName: 'San Jose, CA',
  latitude: 37.3382,
  longitude: -121.8863,
};

const dryForecast: WeatherDataPoint[] = [
  {
    timestamp: new Date(Date.now() + 86400000),
    temperature: 28,
    humidity: 45,
    windSpeed: 4.0,
    rainProbability: 0.05,
    rainfallMm: 0.0,
    cloudCoverage: 10,
    condition: 'Clear',
    description: 'Clear sky',
    icon: '01d',
  },
  {
    timestamp: new Date(Date.now() + 2 * 86400000),
    temperature: 29,
    humidity: 42,
    windSpeed: 4.5,
    rainProbability: 0.1,
    rainfallMm: 0.0,
    cloudCoverage: 15,
    condition: 'Clear',
    description: 'Clear sky',
    icon: '01d',
  },
];

const rainForecast: WeatherDataPoint[] = [
  {
    timestamp: new Date(Date.now() + 86400000),
    temperature: 19,
    humidity: 85,
    windSpeed: 6.5,
    rainProbability: 0.85,
    rainfallMm: 8.5,
    cloudCoverage: 95,
    condition: 'Rain',
    description: 'Heavy rain',
    icon: '10d',
  },
  {
    timestamp: new Date(Date.now() + 2 * 86400000),
    temperature: 18,
    humidity: 80,
    windSpeed: 5.0,
    rainProbability: 0.75,
    rainfallMm: 5.0,
    cloudCoverage: 90,
    condition: 'Rain',
    description: 'Showers',
    icon: '10d',
  },
];

describe('SoilingModel', () => {
  it('should calculate 0% or minimal loss for newly cleaned panels (0 days)', () => {
    const freshlyCleaned = {
      ...sampleInstallation,
      lastCleaningDate: new Date(),
    };
    const result = SoilingModel.calculateSoiling(freshlyCleaned, null, dryForecast);
    expect(result.efficiencyLoss).toBe(0);
    expect(result.estimatedEfficiency).toBe(100);
  });

  it('should accumulate soiling progressively over dry days', () => {
    const result = SoilingModel.calculateSoiling(sampleInstallation, null, dryForecast);
    expect(result.efficiencyLoss).toBeGreaterThan(5);
    expect(result.efficiencyLoss).toBeLessThan(25);
    expect(result.estimatedEfficiency).toBeCloseTo(100 - result.efficiencyLoss, 1);
  });

  it('should respect maximum optical saturation cap (35%) even after 100 dry days', () => {
    const veryOldInstallation = {
      ...sampleInstallation,
      lastCleaningDate: new Date(Date.now() - 100 * 86400000),
    };
    const result = SoilingModel.calculateSoiling(veryOldInstallation, null, dryForecast);
    expect(result.efficiencyLoss).toBeLessThanOrEqual(35.0);
  });

  it('should return correct natural washing factors for rain volumes', () => {
    expect(SoilingModel.evaluateRainWash(0.5)).toBe(0.0); // Drizzle ineffective
    expect(SoilingModel.evaluateRainWash(5.0)).toBeGreaterThan(0.4);
    expect(SoilingModel.evaluateRainWash(20.0)).toBe(0.95); // Thorough wash
  });
});

describe('RecommendationEngine Decision Tree', () => {
  it('should recommend CLEAN_NOW when soiling loss >= 15% and no rain is coming', () => {
    const dirtyInstallation = {
      ...sampleInstallation,
      lastCleaningDate: new Date(Date.now() - 20 * 86400000), // 20 dry days
    };
    const result = RecommendationEngine.evaluate(dirtyInstallation, null, dryForecast);
    expect(result.type).toBe('CLEAN_NOW');
    expect(result.urgency).toBe('HIGH');
    expect(result.bulletPoints.length).toBeGreaterThanOrEqual(3);
  });

  it('should recommend WAIT_FOR_RAIN when moderate soiling exists and heavy rain is arriving in 48h', () => {
    const result = RecommendationEngine.evaluate(sampleInstallation, null, rainForecast);
    expect(result.type).toBe('WAIT_FOR_RAIN');
    expect(result.urgency).toBe('LOW');
    expect(result.reason).toContain('Rain is forecasted');
  });

  it('should recommend NO_ACTION when panels are freshly cleaned', () => {
    const cleanInstallation = {
      ...sampleInstallation,
      lastCleaningDate: new Date(Date.now() - 2 * 86400000),
    };
    const result = RecommendationEngine.evaluate(cleanInstallation, null, dryForecast);
    expect(result.type).toBe('NO_ACTION');
    expect(result.urgency).toBe('NONE');
  });
});
