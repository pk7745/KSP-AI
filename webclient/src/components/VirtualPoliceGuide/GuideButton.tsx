import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

interface GuideButtonProps {
  onClick: () => void;
  lang: 'en' | 'kn';
  hasPulse?: boolean;
}

export function GuideButton({ onClick, lang, hasPulse = true }: GuideButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-3 rounded-full bg-slate-950/95 border border-cyan-500/40 shadow-2xl text-slate-100 hover:border-cyan-400 hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
      title={lang === 'kn' ? 'ಎಐ ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ' : 'Open AI Assistant'}
      aria-label="Open AI Assistant"
    >
      <div className="w-7 h-7 rounded-full bg-slate-900 border border-cyan-400/60 flex items-center justify-center relative">
        <Shield size={15} className="text-cyan-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-0 right-0 border border-slate-950" />
      </div>

      <span className="text-xs font-extrabold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center gap-1">
        <Sparkles size={13} className="text-cyan-400 animate-spin-slow" />
        {lang === 'kn' ? 'ಎಐ ಸಹಾಯಕ' : 'AI Assistant'}
      </span>

      {hasPulse && (
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
      )}
    </button>
  );
}
