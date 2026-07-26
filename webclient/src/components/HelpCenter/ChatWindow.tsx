import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Minimize2, Maximize2, Trash2, X, Sparkles, Loader2 
} from 'lucide-react';
import type { ChatMessage } from '../../hooks/useHelpChat';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  onSend: (text: string) => void;
  onClear: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  lang?: 'en' | 'kn';
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isTyping,
  isMinimized,
  isMaximized,
  onSend,
  onClear,
  onMinimize,
  onMaximize,
  lang = 'en'
}) => {
  const isKn = lang === 'kn';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (isMinimized) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`fixed right-4 sm:right-8 bottom-4 z-50 bg-white border-2 border-blue-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col justify-between font-sans text-slate-900 transition-all duration-300 ${
        isMaximized 
          ? 'w-[92vw] sm:w-[580px] h-[82vh] max-h-[700px]' 
          : 'w-[92vw] sm:w-[380px] h-[480px]'
      }`}
      role="dialog"
      aria-label="KSP AI Help Center Support Chatbot"
    >
      {/* Government-Themed Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-4 text-white flex items-center justify-between shadow-md shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
            <Shield size={18} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider font-heading flex items-center gap-1.5">
              <span>{isKn ? 'ಕರ್ನಾಟಕ ಎಐ ಬೆಂಬಲ ಸಹಾಯಕ' : 'KSP Virtual Support Assistant'}</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300">
                {isKn ? '24×7 ಲೈವ್ ಸಕ್ರಿಯ' : '24×7 Active Officer Support'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title={isKn ? 'ಚಾಟ್ ಅಳಿಸಿ' : 'Clear Chat'}
          >
            <Trash2 size={15} />
          </button>

          <button
            onClick={onMaximize}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors hidden sm:block"
            title={isMaximized ? 'Normal View' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>

          <button
            onClick={onMinimize}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 size={15} />
          </button>
        </div>
      </div>

      {/* Messages List Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-1">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} lang={lang} />
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-blue-700 text-xs font-bold p-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm w-fit my-2 shadow-sm">
            <Loader2 size={14} className="animate-spin text-blue-600" />
            <span>{isKn ? 'ಸಹಾಯಕ ಬರೆಯುತ್ತಿದ್ದಾನೆ...' : 'Support Assistant is typing...'}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <ChatInput onSend={onSend} disabled={isTyping} lang={lang} />
    </motion.div>
  );
};
