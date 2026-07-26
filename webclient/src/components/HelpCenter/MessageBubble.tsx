import React from 'react';
import { Shield, User, Mail, Phone } from 'lucide-react';
import type { ChatMessage } from '../../hooks/useHelpChat';

interface MessageBubbleProps {
  message: ChatMessage;
  lang?: 'en' | 'kn';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, lang = 'en' }) => {
  const isBot = message.sender === 'bot';

  return (
    <div className={`flex items-start gap-2.5 my-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-xl bg-blue-700 border border-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
          <Shield size={16} />
        </div>
      )}

      <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-sm text-left ${
            isBot
              ? message.isOutOfScope
                ? 'bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-tl-sm'
                : 'bg-white border-2 border-slate-200 text-slate-900 rounded-tl-sm'
              : 'bg-blue-700 text-white rounded-tr-sm font-semibold'
          }`}
          style={{ whiteSpace: 'pre-line' }}
        >
          {message.text}
        </div>

        <span className="text-[10px] font-extrabold text-slate-600 mt-1 px-1 font-mono">
          {message.timestamp}
        </span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 text-slate-800 flex items-center justify-center shrink-0 shadow-sm">
          <User size={16} />
        </div>
      )}
    </div>
  );
};
