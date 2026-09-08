export type RecommendationType = 'CLEAN_NOW' | 'CLEAN_SOON' | 'WAIT_FOR_RAIN' | 'NO_ACTION';

export type PanelType = 'MONOCRYSTALLINE' | 'POLYCRYSTALLINE' | 'THIN_FILM';

export interface WeatherDataPoint {
  timestamp: Date;
  temperature: number; // Celsius
  humidity: number; // % (0-100)
  windSpeed: number; // m/s
  rainProbability: number; // 0.0 - 1.0
  rainfallMm: number; // mm
  cloudCoverage: number; // % (0-100)
  condition: string; // 'Clear', 'Rain', 'Clouds', 'Dust', etc.
  description: string;
  icon: string;
}

export interface InstallationProfile {
  id: string;
  name: string;
  capacityKw: number;
  panelCount: number;
  panelType: string;
  tiltDegrees: number;
  lastCleaningDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
}

export interface SoilingCalculationFactors {
  daysSinceCleaning: number;
  consecutiveDryDays: number;
  averageWindSpeed: number;
  averageHumidity: number;
  upcomingRainProbability: number;
  upcomingRainVolumeMm: number;
  rainLookaheadHours: number;
  tiltDegrees: number;
  baseAccumulationRate: number;
  effectiveAccumulationRate: number;
}

export interface SoilingCalculationResult {
  efficiencyLoss: number; // Percentage, e.g., 16.4%
  estimatedEfficiency: number; // Percentage, e.g., 83.6%
  factors: SoilingCalculationFactors;
}

export interface RecommendationResult {
  type: RecommendationType;
  efficiencyLoss: number;
  estimatedEfficiency: number;
  recommendedDate: Date;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  title: string;
  reason: string;
  bulletPoints: string[];
  factors: SoilingCalculationFactors;
  estimatedEnergyLostKwhDaily: number;
}
