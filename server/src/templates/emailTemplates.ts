import { RecommendationResult } from '../engine/types.js';

export const generateRecommendationEmailHtml = (
  userName: string,
  installationName: string,
  recommendation: RecommendationResult
): string => {
  const statusColors: Record<string, { bg: string; text: string; badge: string }> = {
    CLEAN_NOW: { bg: '#fee2e2', text: '#991b1b', badge: '#dc2626' },
    CLEAN_SOON: { bg: '#fef3c7', text: '#92400e', badge: '#d97706' },
    WAIT_FOR_RAIN: { bg: '#e0f2fe', text: '#075985', badge: '#0284c7' },
    NO_ACTION: { bg: '#dcfce7', text: '#166534', badge: '#16a34a' },
  };

  const currentTheme = statusColors[recommendation.type] || statusColors.NO_ACTION;

  const bulletItems = recommendation.bulletPoints
    .map(
      (bp) =>
        `<li style="margin-bottom: 8px; color: #334155; font-size: 14px; line-height: 1.5;">${bp}</li>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SunTrack Solar Maintenance Alert</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 30px; text-align: left;">
              <table width="100%">
                <tr>
                  <td>
                    <h1 style="color: #f59e0b; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">☀ SunTrack</h1>
                    <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 13px;">Solar Cleaning & Efficiency Intelligence</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #0f172a; margin-top: 0; font-size: 18px;">Hello ${userName},</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                SunTrack has evaluated latest meteorological and accumulation data for your solar array: <strong style="color: #0f172a;">${installationName}</strong>.
              </p>

              <!-- Recommendation Card -->
              <div style="background-color: ${currentTheme.bg}; border-left: 4px solid ${currentTheme.badge}; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; color: ${currentTheme.text}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                  Recommendation Status
                </div>
                <div style="font-size: 18px; font-weight: 700; color: ${currentTheme.text}; margin-bottom: 8px;">
                  ${recommendation.title}
                </div>
                <p style="font-size: 14px; color: #334155; margin: 0; line-height: 1.5;">
                  ${recommendation.reason}
                </p>
              </div>

              <!-- Key Metrics Grid -->
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="50%" style="padding-right: 8px;">
                    <div style="background-color: #f1f5f9; padding: 14px; border-radius: 8px; text-align: center;">
                      <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">Estimated Efficiency</div>
                      <div style="color: #0f172a; font-size: 20px; font-weight: 700;">${recommendation.estimatedEfficiency}%</div>
                    </div>
                  </td>
                  <td width="50%" style="padding-left: 8px;">
                    <div style="background-color: #f1f5f9; padding: 14px; border-radius: 8px; text-align: center;">
                      <div style="color: #64748b; font-size: 12px; margin-bottom: 4px;">Soiling Loss</div>
                      <div style="color: #e11d48; font-size: 20px; font-weight: 700;">-${recommendation.efficiencyLoss}%</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Why this recommendation? -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                <h3 style="color: #0f172a; font-size: 14px; margin-top: 0; margin-bottom: 12px;">📊 Factor Breakdown</h3>
                <ul style="margin: 0; padding-left: 18px;">
                  ${bulletItems}
                </ul>
              </div>

              <!-- Action Link -->
              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background-color: #f59e0b; color: #0f172a; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; display: inline-block;">
                  View Live Dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Disclaimer: Estimated software model based on weather telemetry. Not a physical sensor.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
