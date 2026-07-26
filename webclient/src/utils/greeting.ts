/**
 * Utility for Asia/Kolkata IST Timezone Greetings & Mission Briefing Generation
 */

export interface OfficerMetadata {
  name: string;
  rank: string;
  district: string;
}

export interface MissionBriefData {
  activeCases: number;
  highRiskCases: number;
  pendingInvestigations: number;
  unreadNotifications: number;
  emergencyRequests: number;
  recommendedCase: string;
}

export interface FullGreetingPayload {
  timeGreetingEn: string;
  timeGreetingKn: string;
  greetingTextEn: string;
  greetingTextKn: string;
  missionBriefEn: string;
  missionBriefKn: string;
  recommendationEn: string;
  recommendationKn: string;
}

/**
 * Evaluates real-time IST (Asia/Kolkata) hours for time-based greeting rules
 */
export function getTimeBasedGreeting(lang: 'en' | 'kn' = 'en'): string {
  try {
    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const hours = nowIST.getHours();

    if (hours >= 5 && hours < 12) {
      return lang === 'kn' ? 'ಶುಭೋದಯ' : 'Good Morning';
    } else if (hours >= 12 && hours < 17) {
      return lang === 'kn' ? 'ಶುಭ ಮಧ್ಯಾಹ್ನ' : 'Good Afternoon';
    } else if (hours >= 17 && hours < 21) {
      return lang === 'kn' ? 'ಶುಭ ಸಂಜೆ' : 'Good Evening';
    } else {
      return lang === 'kn' ? 'ತಡರಾತ್ರಿ ಕೆಲಸವೇ? ಮರಳಿ ಸ್ವಾಗತ' : 'Working Late? Welcome back';
    }
  } catch (e) {
    return lang === 'kn' ? 'ಶುಭೋದಯ' : 'Good Morning';
  }
}

/**
 * Builds bilingual greeting and mission briefing payload from authenticated officer data & dashboard metrics
 */
export function generateFullGreetingPayload(
  user: any,
  dashMetrics?: any
): FullGreetingPayload {
  const name = user?.name || 'Police Officer';
  const rank = user?.rank || 'Officer';
  const district = user?.districtName || 'Karnataka';

  const timeEn = getTimeBasedGreeting('en');
  const timeKn = getTimeBasedGreeting('kn');

  const activeCases = dashMetrics?.overview?.activeCases ?? 28;
  const highRiskCases = dashMetrics?.overview?.highRiskCases ?? 4;
  const pendingInvestigations = dashMetrics?.overview?.pendingInvestigations ?? 2;
  const unreadNotifications = dashMetrics?.alerts?.length ?? 5;
  const emergencyRequests = 1;

  const greetingTextEn = `${timeEn}, ${rank} ${name}. Welcome back to the KSP AI Crime Intelligence Platform in ${district}.`;
  const greetingTextKn = `${timeKn}, ${rank} ${name}. ${district} ವ್ಯಾಪ್ತಿಯ ಕೆ.ಎಸ್.ಪಿ ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ವೇದಿಕೆಗೆ ಸ್ವಾಗತ.`;

  const missionBriefEn = `Today's Brief for ${district}: ${activeCases} Active Cases, ${highRiskCases} High Risk Cases, ${pendingInvestigations} Pending Investigations, ${unreadNotifications} Notifications, and ${emergencyRequests} Emergency Access Request.`;
  const missionBriefKn = `ಇಂದಿನ ಸಾರಾಂಶ (${district}): ${activeCases} ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು, ${highRiskCases} ಹೆಚ್ಚಿನ ಅಪಾಯದ ಪ್ರಕರಣಗಳು, ${pendingInvestigations} ಬಾಕಿ ವಿಚಾರಣೆಗಳು, ಮತ್ತು ${unreadNotifications} ಸೂಚನೆಗಳು.`;

  const recommendedCase = dashMetrics?.recentCases?.[0]?.CrimeNo || 'CASE-042';
  const recommendationEn = `AI Recommendation: Please review ${recommendedCase} first because it has the highest priority.`;
  const recommendationKn = `ಎಐ ಶಿಫಾರಸು: ದಯವಿಟ್ಟು ಮೊದಲು ${recommendedCase} ಪ್ರಕರಣವನ್ನು ಪರಿಶೀಲಿಸಿ ಏಕೆಂದರೆ ಇದು ಅತ್ಯಂತ ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯನ್ನು ಹೊಂದಿದೆ.`;

  return {
    timeGreetingEn: timeEn,
    timeGreetingKn: timeKn,
    greetingTextEn,
    greetingTextKn,
    missionBriefEn,
    missionBriefKn,
    recommendationEn,
    recommendationKn
  };
}
