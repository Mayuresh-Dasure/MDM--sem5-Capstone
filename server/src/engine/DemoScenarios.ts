import {
  InstallationProfile,
  RecommendationResult,
  WeatherDataPoint,
} from './types.js';
import { RecommendationEngine } from './DecisionTree.js';

export interface DemoScenario {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  installation: InstallationProfile;
  currentWeather: WeatherDataPoint;
  forecast: WeatherDataPoint[];
  historicalRainDays: number;
}

const mockDate = (offsetDays = 0, offsetHours = 0): Date => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(d.getHours() + offsetHours);
  return d;
};

export const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  scenario_1: {
    id: 'scenario_1',
    name: 'Scenario 1: Prolonged Dry Weather',
    shortDesc: '18 dry days, high dust, 0% rain forecast',
    description:
      'Extended drought period with high wind dust deposition causing severe efficiency degradation (~19% loss). Immediate manual wash recommended.',
    installation: {
      id: 'demo_inst_1',
      name: 'Rooftop Solar Array (Demo)',
      capacityKw: 8.5,
      panelCount: 22,
      panelType: 'MONOCRYSTALLINE',
      tiltDegrees: 20.0,
      lastCleaningDate: mockDate(-18),
      locationName: 'Phoenix, AZ (Arid)',
      latitude: 33.4484,
      longitude: -112.074,
    },
    currentWeather: {
      timestamp: mockDate(0),
      temperature: 34,
      humidity: 32,
      windSpeed: 8.2, // High wind
      rainProbability: 0.05,
      rainfallMm: 0.0,
      cloudCoverage: 10,
      condition: 'Clear',
      description: 'Hot and breezy with airborne dust',
      icon: '01d',
    },
    forecast: [
      {
        timestamp: mockDate(1),
        temperature: 35,
        humidity: 30,
        windSpeed: 7.5,
        rainProbability: 0.0,
        rainfallMm: 0.0,
        cloudCoverage: 5,
        condition: 'Clear',
        description: 'Sunny and dry',
        icon: '01d',
      },
      {
        timestamp: mockDate(2),
        temperature: 33,
        humidity: 35,
        windSpeed: 6.0,
        rainProbability: 0.1,
        rainfallMm: 0.0,
        cloudCoverage: 15,
        condition: 'Clear',
        description: 'Clear skies',
        icon: '01d',
      },
      {
        timestamp: mockDate(3),
        temperature: 32,
        humidity: 38,
        windSpeed: 5.0,
        rainProbability: 0.05,
        rainfallMm: 0.0,
        cloudCoverage: 20,
        condition: 'Clouds',
        description: 'Scattered clouds',
        icon: '02d',
      },
    ],
    historicalRainDays: 0,
  },

  scenario_2: {
    id: 'scenario_2',
    name: 'Scenario 2: Natural Rain Approaching',
    shortDesc: '12 days since wash, 85% rain (~14mm) in 36h',
    description:
      'Moderate soiling exists, but a substantial storm front is arriving in 36 hours. The system advises waiting for rain to save water and cleaning expenses.',
    installation: {
      id: 'demo_inst_2',
      name: 'Residential Rooftop PV',
      capacityKw: 6.0,
      panelCount: 16,
      panelType: 'MONOCRYSTALLINE',
      tiltDegrees: 25.0,
      lastCleaningDate: mockDate(-12),
      locationName: 'Seattle, WA',
      latitude: 47.6062,
      longitude: -122.3321,
    },
    currentWeather: {
      timestamp: mockDate(0),
      temperature: 18,
      humidity: 78,
      windSpeed: 4.2,
      rainProbability: 0.45,
      rainfallMm: 0.5,
      cloudCoverage: 75,
      condition: 'Clouds',
      description: 'Overcast with incoming front',
      icon: '04d',
    },
    forecast: [
      {
        timestamp: mockDate(1),
        temperature: 16,
        humidity: 88,
        windSpeed: 6.5,
        rainProbability: 0.85,
        rainfallMm: 8.5,
        cloudCoverage: 95,
        condition: 'Rain',
        description: 'Heavy continuous rain',
        icon: '10d',
      },
      {
        timestamp: mockDate(2),
        temperature: 17,
        humidity: 82,
        windSpeed: 5.0,
        rainProbability: 0.70,
        rainfallMm: 6.0,
        cloudCoverage: 80,
        condition: 'Rain',
        description: 'Showers throughout the day',
        icon: '10d',
      },
      {
        timestamp: mockDate(3),
        temperature: 19,
        humidity: 65,
        windSpeed: 3.5,
        rainProbability: 0.20,
        rainfallMm: 0.0,
        cloudCoverage: 40,
        condition: 'Clouds',
        description: 'Clearing skies post-storm',
        icon: '03d',
      },
    ],
    historicalRainDays: 0,
  },

  scenario_3: {
    id: 'scenario_3',
    name: 'Scenario 3: Pristine / Freshly Cleaned',
    shortDesc: 'Cleaned yesterday, 100% baseline health',
    description:
      'Panels were cleaned yesterday. Loss is negligible (<1%). System registers optimal generation and issues NO_ACTION.',
    installation: {
      id: 'demo_inst_3',
      name: 'Suburban Solar Array',
      capacityKw: 10.0,
      panelCount: 26,
      panelType: 'MONOCRYSTALLINE',
      tiltDegrees: 28.0,
      lastCleaningDate: mockDate(-1),
      locationName: 'San Diego, CA',
      latitude: 32.7157,
      longitude: -117.1611,
    },
    currentWeather: {
      timestamp: mockDate(0),
      temperature: 24,
      humidity: 50,
      windSpeed: 3.0,
      rainProbability: 0.0,
      rainfallMm: 0.0,
      cloudCoverage: 0,
      condition: 'Clear',
      description: 'Pleasant and sunny',
      icon: '01d',
    },
    forecast: [
      {
        timestamp: mockDate(1),
        temperature: 25,
        humidity: 48,
        windSpeed: 3.2,
        rainProbability: 0.0,
        rainfallMm: 0.0,
        cloudCoverage: 5,
        condition: 'Clear',
        description: 'Sunny skies',
        icon: '01d',
      },
      {
        timestamp: mockDate(2),
        temperature: 24,
        humidity: 52,
        windSpeed: 3.8,
        rainProbability: 0.05,
        rainfallMm: 0.0,
        cloudCoverage: 10,
        condition: 'Clear',
        description: 'Clear with light breeze',
        icon: '01d',
      },
      {
        timestamp: mockDate(3),
        temperature: 23,
        humidity: 55,
        windSpeed: 3.0,
        rainProbability: 0.1,
        rainfallMm: 0.0,
        cloudCoverage: 15,
        condition: 'Clouds',
        description: 'Partly cloudy',
        icon: '02d',
      },
    ],
    historicalRainDays: 0,
  },

  scenario_4: {
    id: 'scenario_4',
    name: 'Scenario 4: Moderate Soiling Accumulation',
    shortDesc: '9 dry days, 10.8% loss, no rain ahead',
    description:
      'Panels have accumulated moderate particulate build-up. System advises scheduling a wash in the next 2-4 days before losses compound further.',
    installation: {
      id: 'demo_inst_4',
      name: 'Commercial Solar Canopy',
      capacityKw: 15.0,
      panelCount: 40,
      panelType: 'POLYCRYSTALLINE',
      tiltDegrees: 18.0,
      lastCleaningDate: mockDate(-9),
      locationName: 'Austin, TX',
      latitude: 30.2672,
      longitude: -97.7431,
    },
    currentWeather: {
      timestamp: mockDate(0),
      temperature: 29,
      humidity: 58,
      windSpeed: 4.5,
      rainProbability: 0.15,
      rainfallMm: 0.0,
      cloudCoverage: 25,
      condition: 'Clouds',
      description: 'Warm and hazy',
      icon: '02d',
    },
    forecast: [
      {
        timestamp: mockDate(1),
        temperature: 30,
        humidity: 54,
        windSpeed: 4.0,
        rainProbability: 0.10,
        rainfallMm: 0.0,
        cloudCoverage: 20,
        condition: 'Clear',
        description: 'Sunny intervals',
        icon: '01d',
      },
      {
        timestamp: mockDate(2),
        temperature: 31,
        humidity: 50,
        windSpeed: 4.8,
        rainProbability: 0.15,
        rainfallMm: 0.0,
        cloudCoverage: 30,
        condition: 'Clouds',
        description: 'Partly cloudy',
        icon: '02d',
      },
      {
        timestamp: mockDate(3),
        temperature: 28,
        humidity: 60,
        windSpeed: 3.5,
        rainProbability: 0.20,
        rainfallMm: 0.2,
        cloudCoverage: 45,
        condition: 'Clouds',
        description: 'Overcast skies',
        icon: '04d',
      },
    ],
    historicalRainDays: 0,
  },
};

export const getDemoRecommendation = (scenarioId: string): RecommendationResult => {
  const scenario = DEMO_SCENARIOS[scenarioId] || DEMO_SCENARIOS.scenario_1;
  return RecommendationEngine.evaluate(
    scenario.installation,
    scenario.currentWeather,
    scenario.forecast,
    scenario.historicalRainDays
  );
};
