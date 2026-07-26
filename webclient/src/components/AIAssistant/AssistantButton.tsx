import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface AssistantButtonProps {
  onClick: () => void;
  lang: 'en' | 'kn';
}

export function AssistantButton({ onClick, lang }: AssistantButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/95 border border-cyan-500/40 shadow-xl text-slate-100 hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all duration-200 group"
      title="Open KSP AI Assistant"
      aria-label="Open KSP AI Assistant"
    >
      <div className="w-7 h-7 rounded-full bg-slate-800 border border-cyan-400/60 overflow-hidden flex items-center justify-center">
        <Shield size={16} className="text-cyan-400" />
      </div>
      <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center gap-1">
        <Sparkles size={13} className="text-cyan-400 animate-spin-slow" />
        {lang === 'kn' ? 'ಎಐ ಮಾರ್ಗದರ್ಶಿ' : 'AI Assistant'}
      </span>
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
    </button>
  );
}
