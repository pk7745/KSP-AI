import React from 'react';
import { Sparkles, ShieldAlert, Clock, Bell, Lightbulb } from 'lucide-react';
import type { FullGreetingPayload } from '../../utils/greeting';

interface GreetingCardProps {
  data: FullGreetingPayload | null;
  lang: 'en' | 'kn';
}

export function GreetingCard({ data, lang }: GreetingCardProps) {
  if (!data) return null;

  return (
    <div className="mt-3 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200">
      {/* Officer Summary Pills */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-slate-900 border border-rose-500/20 flex flex-col items-center justify-center text-center">
          <ShieldAlert size={14} className="text-rose-400 mb-1" />
          <span className="font-bold text-rose-400 text-sm">4</span>
          <span className="text-[10px] text-slate-400">{lang === 'kn' ? 'ಹೆಚ್ಚಿನ ಅಪಾಯ' : 'High Risk Cases'}</span>
        </div>
        
        <div className="p-2 rounded-lg bg-slate-900 border border-amber-500/20 flex flex-col items-center justify-center text-center">
          <Clock size={14} className="text-amber-400 mb-1" />
          <span className="font-bold text-amber-400 text-sm">2</span>
          <span className="text-[10px] text-slate-400">{lang === 'kn' ? 'ಬಾಕಿ ವಿಚಾರಣೆಗಳು' : 'Pending Cases'}</span>
        </div>

        <div className="p-2 rounded-lg bg-slate-900 border border-cyan-500/20 flex flex-col items-center justify-center text-center">
          <Bell size={14} className="text-cyan-400 mb-1" />
          <span className="font-bold text-cyan-400 text-sm">5</span>
          <span className="text-[10px] text-slate-400">{lang === 'kn' ? 'ಸೂಚನೆಗಳು' : 'Notifications'}</span>
        </div>
      </div>

      {/* Today's Recommendation Box */}
      <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-start gap-2">
        <Lightbulb size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 block text-[11px]">
            {lang === 'kn' ? 'ಇಂದಿನ ಶಿಫಾರಸು:' : "Today's Recommendation:"}
          </strong>
          <p className="text-slate-300 mt-0.5 leading-relaxed text-[11px]">
            {lang === 'kn' ? data.recommendationKn : data.recommendationEn}
          </p>
        </div>
      </div>
    </div>
  );
}
