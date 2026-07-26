import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from './NavigationContext';
import { speechService } from '../services/speechService';
import { fetchOfficerGreeting } from '../services/greetingService';
import type { FullGreetingPayload } from '../utils/greeting';

export type AssistantState = 
  | 'hidden'
  | 'opening'
  | 'typing'
  | 'speaking'
  | 'idle'
  | 'minimized'
  | 'closing';

export interface AssistantContextType {
  assistantState: AssistantState;
  greetingData: FullGreetingPayload | null;
  currentMessage: string;
  activeTitle: string;
  isMuted: boolean;
  lang: 'en' | 'kn';
  openAssistant: () => void;
  closeAssistant: () => void;
  minimizeAssistant: () => void;
  skipAssistant: () => void;
  toggleMute: () => void;
  replayGreeting: () => void;
  speakText: (text: string, title?: string) => void;
}

export const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const SESSION_KEY = 'ksp_ai_intro_session_v1';
const GREETED_KEY = 'ksp_ai_greeted_session_v1';

export const AssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const { currentView } = useNavigation();
  const lang: 'en' | 'kn' = i18n.language === 'kn' ? 'kn' : 'en';

  const [assistantState, setAssistantState] = useState<AssistantState>('hidden');
  const [greetingData, setGreetingData] = useState<FullGreetingPayload | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [activeTitle, setActiveTitle] = useState<string>('KSP AI Assistant');
  const [isMuted, setIsMuted] = useState<boolean>(speechService.getMuted());

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Module Introduction Descriptions
  const pageIntros: Record<string, { en: string; kn: string; titleEn: string; titleKn: string }> = {
    dashboard: {
      en: "This dashboard provides a live overview of crime activity, officer workload, pending investigations and district statistics.",
      kn: "ಈ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅಪರಾಧ ಚಟುವಟಿಕೆಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ಅಂಕಿಅಂಶಗಳ ಲೈವ್ ಅವಲೋಕನವನ್ನು ಒದಗಿಸುತ್ತದೆ.",
      titleEn: "Dashboard Overview",
      titleKn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ"
    },
    cases: {
      en: "Manage FIRs, investigations, evidence and case assignments from this module.",
      kn: "ಈ ಮಾಡ್ಯೂಲ್‌ನಿಂದ ಎಫ್‌ಐಆರ್‌ಗಳು ಮತ್ತು ತನಿಖಾ ದಾಖಲೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      titleEn: "Cases Database",
      titleKn: "ಪ್ರಕರಣಗಳ ಡೇಟಾಬೇಸ್"
    },
    predictive: {
      en: "Visualize crime hotspots and district-wise incidents using interactive mapping.",
      kn: "ಅಪರಾಧ ವಲಯಗಳನ್ನು ಮತ್ತು ಘಟನೆಗಳನ್ನು ಭೌಗೋಳಿಕ ನಕ್ಷೆಯಲ್ಲಿ ವೀಕ್ಷಿಸಿ.",
      titleEn: "Predictive Analytics & Patrol",
      titleKn: "ಮುನ್ಸೂಚನೆ ವಿಶ್ಲೇಷಣೆ"
    },
    people: {
      en: "Search citizens, suspects, victims, witnesses and related individuals.",
      kn: "ಆರೋಪಿಗಳು, ಸಂತ್ರಸ್ತರು ಮತ್ತು ಸಾಕ್ಷಿಗಳ ಏಕೀಕೃತ ಮಾಹಿತಿಯನ್ನು ಹುಡುಕಿ.",
      titleEn: "People Intelligence CRM",
      titleKn: "ಪೀಪಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್"
    },
    network: {
      en: "Discover hidden relationships between criminals, gangs, organizations and cases.",
      kn: "ಅಪರಾಧಿಗಳು ಮತ್ತು ಸಂಘಟನೆಗಳ ನಡುವಿನ ಗುಪ್ತ ನೆಟ್‌ವರ್ಕ್ ಬಾಂಧವ್ಯಗಳನ್ನು ಅನ್ವೇಷಿಸಿ.",
      titleEn: "Criminal Nexus",
      titleKn: "ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್"
    },
    analysis: {
      en: "Manage digital and physical evidence associated with investigations.",
      kn: "ಸಾಕ್ಷ್ಯಗಳು ಮತ್ತು ಫೊರೆನ್ಸಿಕ್ ಮಾಹಿತಿಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ.",
      titleEn: "AI Evidence Analysis",
      titleKn: "ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆ"
    },
    reports: {
      en: "Generate analytical reports and export intelligence summaries.",
      kn: "ವಿಶ್ಲೇಷಣಾತ್ಮಕ ವರದಿಗಳನ್ನು ರಚಿಸಿ ಮತ್ತು ರಫ್ತು ಮಾಡಿ.",
      titleEn: "Automated Reports",
      titleKn: "ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು"
    },
    officer: {
      en: "Manage officers, assignments, permissions and district allocations.",
      kn: "ಅಧಿಕಾರಿಗಳ ನಿಯೋಜಿತ ಕೆಲಸ ಮತ್ತು ವೇಳಾಪಟ್ಟಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
      titleEn: "Officer Management",
      titleKn: "ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್"
    },
    settings: {
      en: "Configure application preferences, language and account options.",
      kn: "ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು ಮತ್ತು ಭಾಷಾ ಸಂರಚನೆಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ.",
      titleEn: "System Settings",
      titleKn: "ಸಿಸ್ಟಮ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು"
    }
  };

  // Speak & Type Handler
  const speakText = useCallback((text: string, title: string = 'KSP AI Assistant') => {
    setActiveTitle(title);
    setCurrentMessage(text);
    setAssistantState('typing');

    speechService.speak(
      text,
      lang,
      () => setAssistantState('speaking'),
      () => setAssistantState('idle')
    );
  }, [lang]);

  // Initial Login Greeting & Page-by-Page Introduction Flow
  useEffect(() => {
    if (!user) {
      setAssistantState('hidden');
      return;
    }

    async function initFlow() {
      const data = await fetchOfficerGreeting(user);
      setGreetingData(data);

      const greeted = sessionStorage.getItem(GREETED_KEY);
      const introducedRaw = sessionStorage.getItem(SESSION_KEY);
      const introducedSet = new Set<string>(introducedRaw ? JSON.parse(introducedRaw) : []);

      // 1. Initial Login Greeting
      if (!greeted) {
        sessionStorage.setItem(GREETED_KEY, 'true');
        setAssistantState('opening');

        timerRef.current = setTimeout(() => {
          const msg = lang === 'kn' ? data.greetingTextKn : data.greetingTextEn;
          const title = lang === 'kn' ? `${data.timeGreetingKn}, ${user?.rank || 'Officer'} ${user?.name || 'Officer'}` : `${data.timeGreetingEn}, ${user?.rank || 'Officer'} ${user?.name || 'Officer'}`;
          speakText(msg, title);
        }, 400);
        return;
      }

      // 2. Page Introduction (First visit of current session ONLY)
      if (!introducedSet.has(currentView)) {
        introducedSet.add(currentView);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(Array.from(introducedSet)));

        setAssistantState('opening');
        const intro = pageIntros[currentView] || pageIntros['dashboard'];
        const msg = intro[lang];
        const title = lang === 'kn' ? intro.titleKn : intro.titleEn;

        timerRef.current = setTimeout(() => {
          speakText(msg, title);
        }, 300);
      }
    }

    initFlow();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, currentView, lang, speakText]);

  // Skip: Immediately stop speech, typing, and minimize assistant without delay
  const skipAssistant = useCallback(() => {
    speechService.stop();
    if (timerRef.current) clearTimeout(timerRef.current);
    setAssistantState('minimized');
  }, []);

  const closeAssistant = useCallback(() => {
    speechService.stop();
    if (timerRef.current) clearTimeout(timerRef.current);
    setAssistantState('minimized');
  }, []);

  const minimizeAssistant = useCallback(() => {
    speechService.stop();
    if (timerRef.current) clearTimeout(timerRef.current);
    setAssistantState('minimized');
  }, []);

  const openAssistant = useCallback(() => {
    setAssistantState('idle');
    if (greetingData) {
      const msg = lang === 'kn' ? greetingData.greetingTextKn : greetingData.greetingTextEn;
      const title = lang === 'kn' ? `${greetingData.timeGreetingKn}, ${user?.rank} ${user?.name}` : `${greetingData.timeGreetingEn}, ${user?.rank} ${user?.name}`;
      speakText(msg, title);
    }
  }, [greetingData, lang, user, speakText]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const next = !prev;
      speechService.setMuted(next);
      return next;
    });
  }, []);

  const replayGreeting = useCallback(() => {
    if (greetingData) {
      setAssistantState('idle');
      const msg = lang === 'kn' ? greetingData.greetingTextKn : greetingData.greetingTextEn;
      const title = lang === 'kn' ? `${greetingData.timeGreetingKn}, ${user?.rank} ${user?.name}` : `${greetingData.timeGreetingEn}, ${user?.rank} ${user?.name}`;
      speakText(msg, title);
    }
  }, [greetingData, lang, user, speakText]);

  return (
    <AssistantContext.Provider
      value={{
        assistantState,
        greetingData,
        currentMessage,
        activeTitle,
        isMuted,
        lang,
        openAssistant,
        closeAssistant,
        minimizeAssistant,
        skipAssistant,
        toggleMute,
        replayGreeting,
        speakText
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};
