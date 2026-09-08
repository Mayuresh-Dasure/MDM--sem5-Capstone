export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  state?: string | null;
  notificationPreference?: NotificationPreference;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  cleaningAlerts: boolean;
  rainAlerts: boolean;
  weeklySummary: boolean;
  emailEnabled: boolean;
  lastNotifiedAt?: string | null;
}

export interface SolarInstallation {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  locationName: string;
  capacityKw: number;
  panelCount: number;
  panelType: string;
  tiltDegrees: number;
  lastCleaningDate: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    cleaningRecords: number;
  };
}

export interface CleaningRecord {
  id: string;
  installationId: string;
  cleanedAt: string;
  efficiencyBefore?: number | null;
  efficiencyAfter?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface WeatherDataPoint {
  timestamp: string | Date;
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  rainfallMm: number;
  cloudCoverage: number;
  condition: string;
  description: string;
  icon: string;
}

export type RecommendationType = 'CLEAN_NOW' | 'CLEAN_SOON' | 'WAIT_FOR_RAIN' | 'NO_ACTION';

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

export interface RecommendationResult {
  type: RecommendationType;
  efficiencyLoss: number;
  estimatedEfficiency: number;
  recommendedDate: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  title: string;
  reason: string;
  bulletPoints: string[];
  factors: SoilingCalculationFactors;
  estimatedEnergyLostKwhDaily: number;
}

export interface EfficiencyHistoryPoint {
  date: string;
  dayIndex: number;
  estimatedEfficiency: number;
  soilingLoss: number;
  event?: string;
}

export interface EfficiencyProjectionPoint {
  date: string;
  dayIndex: number;
  projectedEfficiency: number;
  projectedLoss: number;
}

export interface EfficiencyTimelineResponse {
  history: EfficiencyHistoryPoint[];
  projection: EfficiencyProjectionPoint[];
  currentLoss: number;
  currentEfficiency: number;
  type: RecommendationType;
}

export interface SummaryStats {
  totalCleanings: number;
  totalSpent: number;
  avgDaysBetweenCleanings: number;
  totalRecoveredKwh: number;
  estimatedValueRecovered: number;
  netRoi: number;
  installationCapacityKw: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: {
    timestamp: string;
    cached?: boolean;
    scenario?: string;
  };
}
