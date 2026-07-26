import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, MessageSquare, Shield } from 'lucide-react';
import { useHelpChat } from '../../hooks/useHelpChat';
import { ChatWindow } from './ChatWindow';

interface ChatbotProps {
  lang?: 'en' | 'kn';
}

export const Chatbot: React.FC<ChatbotProps> = ({ lang = 'en' }) => {
  const isKn = lang === 'kn';
  const {
    messages,
    isTyping,
    isMinimized,
    isMaximized,
    sendMessage,
    clearChat,
    toggleMinimize,
    toggleMaximize
  } = useHelpChat(lang);

  return (
    <>
      <AnimatePresence>
        {!isMinimized && (
          <ChatWindow
            messages={messages}
            isTyping={isTyping}
            isMinimized={isMinimized}
            isMaximized={isMaximized}
            onSend={sendMessage}
            onClear={clearChat}
            onMinimize={toggleMinimize}
            onMaximize={toggleMaximize}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Floating Trigger Button when Minimized */}
      {isMinimized && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={toggleMinimize}
          className="fixed right-6 bottom-6 z-50 px-4 py-3 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl border-2 border-blue-500 cursor-pointer transition-all hover:scale-105"
          title="Open Help Assistant"
        >
          <LifeBuoy size={20} className="animate-spin text-amber-300" style={{ animationDuration: '10s' }} />
          <span>{isKn ? '24×7 ನೆರವು ಚಾಟ್‌ಬಾಟ್' : '24×7 Support Chatbot'}</span>
        </motion.button>
      )}
    </>
  );
};
