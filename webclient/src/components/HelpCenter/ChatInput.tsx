import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  lang?: 'en' | 'kn';
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false, lang = 'en' }) => {
  const isKn = lang === 'kn';
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 bg-white border-t border-slate-200">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={isKn ? 'ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ. ಪ್ರಕರಣ ಹೇಗೆ ಸೃಷ್ಟಿಸುವುದು?)...' : 'Ask support assistant (e.g., How do I upload evidence?)...'}
        disabled={disabled}
        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50 focus:bg-white outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder-slate-400"
        aria-label={isKn ? 'ಸಹಾಯಕನಿಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ' : 'Ask support assistant'}
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm shrink-0"
        title="Send Message"
      >
        <Send size={16} />
      </button>
    </form>
  );
};
