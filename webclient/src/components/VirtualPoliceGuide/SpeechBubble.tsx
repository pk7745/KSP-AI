import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, RotateCcw, Check, Sparkles, HelpCircle, FileText, Search, Map, Bell } from 'lucide-react';
import type { FullGreetingPayload } from '../../utils/greeting';

interface SpeechBubbleProps {
  user: any;
  lang: 'en' | 'kn';
  activeSpeechText: string;
  activeTab: 'greeting' | 'intro' | 'brief';
  greetingPayload: FullGreetingPayload | null;
  isSpeaking: boolean;
  isMuted: boolean;
  isTyping: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMute: () => void;
  onReplay: () => void;
  onGotIt: () => void;
  onActionClick: (view?: string, actionName?: string) => void;
}

export function SpeechBubble({
  user,
  lang,
  activeSpeechText,
  activeTab,
  greetingPayload,
  isSpeaking,
  isMuted,
  isTyping,
  onClose,
  onMinimize,
  onToggleMute,
  onReplay,
  onGotIt,
  onActionClick
}: SpeechBubbleProps) {
  const quickActions = [
    { label: lang === 'kn' ? 'ಪುಟ ವಿವರಣೆ' : 'Explain this page', icon: HelpCircle, action: () => onActionClick() },
    { label: lang === 'kn' ? 'ಮಿಷನ್ ಬ್ರೀಫ್' : 'Mission Brief', icon: Sparkles, action: () => onActionClick(undefined, 'brief') },
    { label: lang === 'kn' ? 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಿ' : 'Search FIR', icon: Search, action: () => onActionClick('cases') },
    { label: lang === 'kn' ? 'ಅಪರಾಧ ನಕ್ಷೆ' : 'Crime Map Help', icon: Map, action: () => onActionClick('predictive') },
    { label: lang === 'kn' ? 'ವರದಿ ರಚಿಸಿ' : 'Generate Report', icon: FileText, action: () => onActionClick('reports') },
    { label: lang === 'kn' ? 'ಸೂಚನೆಗಳು' : 'Open Notifications', icon: Bell, action: () => onActionClick('dashboard') }
  ];

  return (
    <div className="w-[360px] max-w-[90vw] max-h-[500px] flex flex-col bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-[24px] p-4 shadow-2xl text-slate-100 font-sans">
      
      {/* Header: AI Assistant | Status: Online (Glowing Green Dot) | Mute | Close */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-cyan-300 flex items-center gap-1.5 leading-none">
              {lang === 'kn' ? 'ಎಐ ಸಹಾಯಕ' : 'AI Assistant'}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="text-[10px] text-slate-400 font-medium">
                {lang === 'kn' ? 'ಸ್ಥಿತಿ: ಆನ್‌ಲೈನ್' : 'Status: Online'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={onReplay}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title={lang === 'kn' ? 'ಪುನರಾವರ್ತಿಸಿ' : 'Replay Speech'}
            aria-label="Replay Speech"
          >
            <RotateCcw size={14} />
          </button>

          <button 
            onClick={onToggleMute}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-cyan-400" />}
          </button>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1.5 rounded-lg hover:bg-slate-800"
            title={lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close Assistant'}
            aria-label="Close Assistant"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Messaging Application Chat Bubbles */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-start"
        >
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-sm p-3.5 text-xs text-slate-200 leading-relaxed shadow-sm w-full relative">
            
            {/* Animated Three Dots Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 py-1 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-100" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce delay-200" />
              </div>
            )}

            <p>
              {activeSpeechText || (
                lang === 'kn'
                  ? `ಸ್ವಾಗತ, ${user?.rank || 'ಅಧಿಕಾರಿ'} ${user?.name}.`
                  : `Welcome back, ${user?.rank || 'Officer'} ${user?.name}.`
              )}
            </p>

            {/* Login Greeting Bullet Summary */}
            {activeTab === 'greeting' && greetingPayload && (
              <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] space-y-1.5">
                <div className="text-slate-300 font-semibold">
                  {lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:' : 'You currently have:'}
                </div>
                <div className="flex items-center gap-2 text-rose-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  <span>2 {lang === 'kn' ? 'ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು' : 'Active Cases'}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>1 {lang === 'kn' ? 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ತನಿಖೆ' : 'High Priority Investigation'}</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span>5 {lang === 'kn' ? 'ಸೂಚನೆಗಳು' : 'Notifications'}</span>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-cyan-950/50 border border-cyan-800/40 text-[11px]">
                  <span className="font-bold text-amber-400 block mb-0.5">
                    {lang === 'kn' ? 'ಇಂದಿನ ಶಿಫಾರಸು:' : "Today's Recommendation:"}
                  </span>
                  <span className="text-slate-200 leading-snug">
                    {lang === 'kn' ? greetingPayload.recommendationKn : greetingPayload.recommendationEn}
                  </span>
                </div>
              </div>
            )}

            {/* Got It Button for Page Introductions */}
            {activeTab === 'intro' && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={onGotIt}
                  className="flex items-center gap-1 text-[11px] font-semibold px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow transition-all cursor-pointer"
                >
                  <Check size={12} /> {lang === 'kn' ? 'ಅರ್ಥವಾಯಿತು' : 'Got it'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Action Chips Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80">
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((act, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={act.action}
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              <act.icon size={11} className="text-cyan-400" />
              <span>{act.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
