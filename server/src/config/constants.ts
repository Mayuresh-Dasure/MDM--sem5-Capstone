export const SOILING_CONFIG = {
  // Base daily loss in clear dry conditions (% efficiency loss per day)
  BASE_DAILY_SOILING_RATE: 0.6,
  
  // Maximum optical saturation cap (% total loss)
  MAX_SOILING_CAP: 35.0,
  
  // Dry day compounding escalation factor
  DRY_DAY_ESCALATION_FACTOR: 0.025,
  
  // Rain washing thresholds (mm)
  RAIN_MIN_WASH_THRESHOLD_MM: 1.0, // < 1mm considered ineffective/slight mudding
  RAIN_PARTIAL_WASH_THRESHOLD_MM: 5.0,
  RAIN_FULL_WASH_THRESHOLD_MM: 15.0,
  
  // Environmental modifier thresholds
  WIND_HIGH_THRESHOLD_MS: 7.0,
  WIND_LOW_THRESHOLD_MS: 2.0,
  HUMIDITY_DEW_THRESHOLD_PERCENT: 80.0,
  
  // Recommendation decision thresholds
  CLEAN_NOW_LOSS_THRESHOLD: 15.0, // >= 15% efficiency loss
  CLEAN_SOON_LOSS_THRESHOLD: 8.0, // >= 8% efficiency loss
  URGENT_LOSS_THRESHOLD_DESPITE_RAIN: 18.0, // >= 18% loss
  
  // Forecast lookahead parameters
  RAIN_LOOKAHEAD_HOURS: 72, // 3 days
  SIGNIFICANT_RAIN_PROBABILITY: 0.60, // 60%
  SIGNIFICANT_RAIN_VOLUME_MM: 4.0, // 4mm total over window
  
  // Caching TTL
  WEATHER_CACHE_TTL_MS: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
  
  // Rate limits
  AUTH_RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 mins
  AUTH_RATE_LIMIT_MAX: 20,
  API_RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 min
  API_RATE_LIMIT_MAX: 120,
  
  // Email deduplication
  EMAIL_THROTTLE_HOURS: 48,
};
