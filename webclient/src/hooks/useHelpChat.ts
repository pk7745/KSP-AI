import { useState, useCallback, useEffect } from 'react';
import { FAQ_DATA, type FAQItem } from '../data/faqData';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isOutOfScope?: boolean;
}

export function useHelpChat(lang: 'en' | 'kn' = 'en') {
  const isKn = lang === 'kn';

  const welcomeMessage: ChatMessage = {
    id: 'welcome-msg',
    text: isKn 
      ? 'ನಮಸ್ಕಾರ ಅಧಿಕಾರಿ. ಕೆಎಸ್‌ಪಿ ಎಐ ಹೆಲ್ಪ್ ಸೆಂಟರ್‌ಗೆ ಸುಸ್ವಾಗತ. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬಳಕೆಯ ಕುರಿತು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಲು ನಾನು ಇಲ್ಲಿದ್ದೇನೆ. ಇಂದು ನಿಮಗೆ ಹೇಗೆ ನೆರವಾಗಲಿ?'
      : 'Hello Officer. Welcome to the KSP AI Help Center. I can help you understand how to use the platform, locate features, and answer common questions. How may I assist you today?',
    sender: 'bot',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Update welcome message text if language changes and chat has only welcome message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome-msg') {
        return [welcomeMessage];
      }
      return prev;
    });
  }, [lang]);

  /**
   * FUTURE READY AI BACKEND CONNECTOR
   * To connect Google Gemini, OpenAI, or Vertex AI in the future:
   * Replace this local intent matcher function with an async API call (e.g., fetch('/api/help-assistant'))
   */
  const findAnswer = useCallback((query: string, language: 'en' | 'kn'): { text: string; isOutOfScope: boolean } => {
    const lower = query.toLowerCase().trim();

    // Match FAQ items by keyword overlap score
    let bestMatch: FAQItem | null = null;
    let maxScore = 0;

    FAQ_DATA.forEach(item => {
      let score = 0;
      item.keywords.forEach(kw => {
        if (lower.includes(kw.toLowerCase())) {
          score += 2;
        }
      });

      const qEn = item.question.en.toLowerCase();
      const qKn = item.question.kn.toLowerCase();
      if (lower.includes(qEn) || qEn.includes(lower) || lower.includes(qKn) || qKn.includes(lower)) {
        score += 5;
      }

      if (score > maxScore) {
        maxScore = score;
        bestMatch = item;
      }
    });

    if (bestMatch && maxScore >= 2) {
      const matchText = language === 'kn' ? (bestMatch as FAQItem).answer.kn : (bestMatch as FAQItem).answer.en;
      return { text: matchText, isOutOfScope: false };
    }

    // Out of scope fallback response as explicitly requested by user
    const outOfScopeText = language === 'kn'
      ? `ಕ್ಷಮಿಸಿ ಅಧಿಕಾರಿ, ನಾನು ಪ್ರಸ್ತುತ KSP AI ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬಳಕೆಯ ಕುರಿತು ಮಾತ್ರ ನೆರವಾಗಬಲ್ಲೆ.\n\nತಾಂತ್ರಿಕ ಬೆಂಬಲಕ್ಕಾಗಿ ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ:\nkarnataka@ksp.gov.in\nಅಥವಾ\n+91 80 2345 6789`
      : `I'm sorry, I currently assist only with questions about using the KSP AI Crime Intelligence Platform.\n\nFor technical issues please contact:\nkarnataka@ksp.gov.in\nor\n+91 80 2345 6789`;

    return { text: outOfScopeText, isOutOfScope: true };
  }, []);

  const sendMessage = useCallback((userQuery: string) => {
    if (!userQuery.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: userQuery,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate natural response latency (400ms)
    setTimeout(() => {
      const { text, isOutOfScope } = findAnswer(userQuery, lang);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        text,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOutOfScope
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  }, [findAnswer, lang]);

  const clearChat = useCallback(() => {
    setMessages([welcomeMessage]);
  }, [welcomeMessage]);

  const toggleMinimize = useCallback(() => {
    setIsMinimized(prev => !prev);
    setIsMaximized(false);
  }, []);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
    setIsMinimized(false);
  }, []);

  return {
    messages,
    isTyping,
    isMinimized,
    isMaximized,
    sendMessage,
    clearChat,
    toggleMinimize,
    toggleMaximize
  };
}
