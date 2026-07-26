import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../context/NavigationContext';
import { api } from '../../services/api';
import { speechService } from '../../services/speechService';
import type { FullGreetingPayload } from '../../utils/greeting';
import { generateFullGreetingPayload } from '../../utils/greeting';

const SESSION_KEY = 'ksp_vpg_intro_session_v4';
const GREETED_KEY = 'ksp_vpg_greeted_session_v4';
const SETTINGS_KEY = 'ksp_vpg_enabled';

export function useVirtualGuide() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { currentView, setCurrentView } = useNavigation();
  const lang: 'en' | 'kn' = i18n.language === 'kn' ? 'kn' : 'en';

  const [visible, setVisible] = useState<boolean>(true);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'greeting' | 'intro' | 'brief'>('greeting');
  const [greetingPayload, setGreetingPayload] = useState<FullGreetingPayload | null>(null);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [isMuted, setIsMuted] = useState<boolean>(speechService.getMuted());
  const [guideEnabled, setGuideEnabled] = useState<boolean>(true);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoMinimizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check Settings Preference
  useEffect(() => {
    const pref = localStorage.getItem(SETTINGS_KEY);
    if (pref !== null) {
      setGuideEnabled(pref === 'true');
    }
  }, []);

  // Fetch Dashboard metrics for Mission Briefing
  useEffect(() => {
    if (user) {
      api.getDashboardData()
        .then(data => {
          setDashboardMetrics(data);
          const payload = generateFullGreetingPayload(user, data);
          setGreetingPayload(payload);
        })
        .catch(() => {
          const payload = generateFullGreetingPayload(user, null);
          setGreetingPayload(payload);
        });
    }
  }, [user]);

  // Page Introductions Dictionary (<20s per page)
  const moduleIntros: Record<string, { en: string; kn: string }> = {
    home: {
      en: "Welcome to KSP AI Home Portal. Access quick metrics, daily officer briefing, and instant intelligence search.",
      kn: "ಕೆ.ಎಸ್.ಪಿ ಎಐ ಮುಖ್ಯ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ. ತ್ವರಿತ ಮಾಪನಗಳು ಮತ್ತು ದೈನಂದಿನ ಬ್ರೀಫಿಂಗ್ ವೀಕ್ಷಿಸಿ."
    },
    dashboard: {
      en: "Welcome to State Intelligence Dashboard. This module provides a live overview of crime activity, officer workload, pending investigations and district statistics.",
      kn: "ರಾಜ್ಯ ಗುಪ್ತಚರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಸ್ವಾಗತ. ಈ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಪರಾಧ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ಅಂಕಿಅಂಶಗಳ ಲೈವ್ ಅವಲೋಕನವನ್ನು ಒದಗಿಸುತ್ತದೆ."
    },
    cases: {
      en: "Welcome to Case 360 Workspace. Manage FIRs, investigations, evidence and case assignments from this module.",
      kn: "ಕೇಸ್ 360 ವರ್ಕ್‌ಸ್ಪೇಸ್‌ಗೆ ಸ್ವಾಗತ. ಈ ಮಾಡ್ಯೂಲ್‌ನಿಂದ ಎಫ್‌ಐಆರ್‌ಗಳು ಮತ್ತು ತನಿಖಾ ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ."
    },
    people: {
      en: "Welcome to People Intelligence CRM. Search citizens, suspects, victims, witnesses and related individuals.",
      kn: "ಪೀಪಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಿಆರ್‌ಎಮ್‌ಗೆ ಸ್ವಾಗತ. ಆರೋಪಿಗಳು, ಸಂತ್ರಸ್ತರು ಮತ್ತು ಸಾಕ್ಷಿಗಳ ಏಕೀಕೃತ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕಿ."
    },
    network: {
      en: "Welcome to Criminal Nexus. Discover hidden relationships between criminals, gangs, organizations and cases.",
      kn: "ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್‌ಗೆ ಸ್ವಾಗತ. ಅಪರಾಧಿಗಳು ಮತ್ತು ಸಂಘಟನೆಗಳ ನಡುವಿನ ಗುಪ್ತ ನೆಟ್‌ವರ್ಕ್ ಬಾಂಧವ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ."
    },
    command: {
      en: "Welcome to Emergency Command Center. Track live station dispatches, emergency access, and tactical alerts.",
      kn: "ಎಮರ್ಜೆನ್ಸಿ ಕಮಾಂಡ್ ಸೆಂಟರ್‌ಗೆ ಸ್ವಾಗತ. ಲೈವ್ ಡಿಸ್ಪ್ಯಾಚ್‌ಗಳು ಮತ್ತು ತುರ್ತು ಪ್ರವೇಶ ನವೀಕರಣಗಳನ್ನು ವೀಕ್ಷಿಸಿ."
    },
    reports: {
      en: "Welcome to Automated Reports. Generate analytical reports and export intelligence summaries.",
      kn: "ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳ ವಿಭಾಗಕ್ಕೆ ಸ್ವಾಗತ. ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವರದಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ರಫ್ತು ಮಾಡಿ."
    },
    officer: {
      en: "Welcome to Officer Management. Manage officers, assignments, permissions and district allocations.",
      kn: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ. ಅಧಿಕಾರಿಗಳ ನಿಯೋಜಿತ ಕೆಲಸ ಮತ್ತು ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ."
    },
    predictive: {
      en: "Welcome to Crime Map. Visualize crime hotspots and district-wise incidents using interactive mapping.",
      kn: "ಅಪರಾಧ ನಕ್ಷೆಗೆ ಸ್ವಾಗತ. ಅಪರಾಧ ವಲಯಗಳನ್ನು ಮತ್ತು ಘಟನೆಗಳನ್ನು ಭೌಗೋಳಿಕ ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ."
    },
    analysis: {
      en: "Welcome to AI Evidence Analysis. Manage digital and physical evidence associated with investigations.",
      kn: "ಎಐ ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆಗೆ ಸ್ವಾಗತ. ಸಾಕ್ಷ್ಯಗಳು ಮತ್ತು ಫೊರೆನ್ಸಿಕ್ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ."
    },
    settings: {
      en: "Welcome to System Settings. Configure application preferences, language and account options.",
      kn: "ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಿಗೆ ಸ್ವಾಗತ. ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು ಮತ್ತು ಭಾಷೆಯನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ."
    }
  };

  // Clear Auto-Minimize Timers
  const clearAutoTimers = () => {
    if (autoMinimizeTimerRef.current) {
      clearTimeout(autoMinimizeTimerRef.current);
      autoMinimizeTimerRef.current = null;
    }
  };

  // Speak Text Function with Text-to-Speech & Typing effect
  const speakText = useCallback((text: string, tab: 'greeting' | 'intro' | 'brief' = 'greeting', autoMinimizeSec?: number) => {
    clearAutoTimers();
    setActiveSpeechText(text);
    setActiveTab(tab);
    setIsTyping(true);

    speechService.speak(
      text,
      lang,
      () => {
        setIsSpeaking(true);
        setIsTyping(false);
      },
      () => {
        setIsSpeaking(false);
        setIsTyping(false);

        // Schedule Auto-minimize after speech finishes if configured
        if (autoMinimizeSec && autoMinimizeSec > 0) {
          autoMinimizeTimerRef.current = setTimeout(() => {
            setMinimized(true);
          }, autoMinimizeSec * 1000);
        }
      }
    );
  }, [lang]);

  // Dynamic Language Switching Handler: Re-evaluates speech immediately upon language toggle
  useEffect(() => {
    if (!visible || minimized || !activeSpeechText) return;

    if (activeTab === 'intro') {
      const introObj = moduleIntros[currentView] || moduleIntros['dashboard'];
      speakText(introObj[lang], 'intro', 6);
    } else if (activeTab === 'brief') {
      if (greetingPayload) {
        speakText(lang === 'kn' ? greetingPayload.missionBriefKn : greetingPayload.missionBriefEn, 'brief', 5);
      }
    } else if (activeTab === 'greeting') {
      if (greetingPayload) {
        const msg = lang === 'kn' ? greetingPayload.greetingTextKn : greetingPayload.greetingTextEn;
        speakText(msg, 'greeting', 5);
      }
    }
  }, [i18n.language]);

  // Automatic Login Greeting & Session-based Page Introductions
  useEffect(() => {
    if (!user || !guideEnabled) {
      setVisible(false);
      return;
    }

    const greeted = sessionStorage.getItem(GREETED_KEY);
    const introducedRaw = sessionStorage.getItem(SESSION_KEY);
    const introducedSet = new Set<string>(introducedRaw ? JSON.parse(introducedRaw) : []);

    // 1. Initial Login Greeting (POPS UP ONLY ONCE per login)
    if (!greeted) {
      sessionStorage.setItem(GREETED_KEY, 'true');
      setVisible(true);
      setMinimized(false);

      const payload = generateFullGreetingPayload(user, dashboardMetrics);
      setGreetingPayload(payload);
      const msg = lang === 'kn' ? payload.greetingTextKn : payload.greetingTextEn;

      timerRef.current = setTimeout(() => {
        speakText(msg, 'greeting', 5); // Auto-minimize 5s after speech completes
      }, 400);
      return;
    }

    // 2. Page Introductions (POPS UP ONLY ONCE per session per module)
    if (!introducedSet.has(currentView)) {
      introducedSet.add(currentView);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(introducedSet)));

      setVisible(true);
      setMinimized(false);

      const introObj = moduleIntros[currentView] || moduleIntros['dashboard'];
      timerRef.current = setTimeout(() => {
        speakText(introObj[lang], 'intro', 6); // Auto-minimize 6s after speech completes
      }, 300);
    }
  }, [currentView, user, guideEnabled, lang, speakText]);

  // Actions
  const show = useCallback(() => {
    clearAutoTimers();
    setVisible(true);
    setMinimized(false);
    const introObj = moduleIntros[currentView] || moduleIntros['dashboard'];
    speakText(introObj[lang], 'intro');
  }, [currentView, lang, speakText]);

  const hide = useCallback(() => {
    clearAutoTimers();
    speechService.stop();
    setIsSpeaking(false);
    setIsTyping(false);
    setVisible(false);
  }, []);

  const minimize = useCallback(() => {
    clearAutoTimers();
    speechService.stop();
    setIsSpeaking(false);
    setIsTyping(false);
    setMinimized(true);
  }, []);

  const handleGotIt = useCallback(() => {
    minimize();
  }, [minimize]);

  const handleActionClick = useCallback((targetView?: string, actionTab?: string) => {
    if (targetView) {
      setCurrentView(targetView);
    } else if (actionTab === 'brief' && greetingPayload) {
      const msg = lang === 'kn' ? greetingPayload.missionBriefKn : greetingPayload.missionBriefEn;
      speakText(msg, 'brief', 5);
    } else {
      const introObj = moduleIntros[currentView] || moduleIntros['dashboard'];
      speakText(introObj[lang], 'intro', 6);
    }
  }, [currentView, lang, greetingPayload, setCurrentView, speakText]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      speechService.setMuted(next);
      return next;
    });
  }, []);

  const replayIntro = useCallback(() => {
    clearAutoTimers();
    setVisible(true);
    setMinimized(false);
    const introObj = moduleIntros[currentView] || moduleIntros['dashboard'];
    speakText(introObj[lang], 'intro');
  }, [currentView, lang, speakText]);

  return {
    user,
    lang,
    visible,
    minimized,
    isSpeaking,
    isTyping,
    activeSpeechText,
    activeTab,
    greetingPayload,
    isMuted,
    guideEnabled,
    show,
    hide,
    minimize,
    handleGotIt,
    handleActionClick,
    toggleMute,
    replayIntro
  };
}
