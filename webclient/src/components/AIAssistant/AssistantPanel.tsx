import React from 'react';
import { X, Sparkles, Volume2, VolumeX, FastForward, RotateCcw, Shield } from 'lucide-react';
import { useAssistant } from '../../hooks/useAssistant';
import { TypingText } from './TypingText';
import { GreetingCard } from './GreetingCard';
import { QuickActions } from './QuickActions';

export function AssistantPanel() {
  const {
    greetingData,
    currentMessage,
    activeTitle,
    isMuted,
    lang,
    closeAssistant,
    skipAssistant,
    toggleMute,
    replayGreeting
  } = useAssistant();

  return (
    <div 
      className="w-full bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/35 rounded-2xl p-4 shadow-2xl text-slate-100 transition-all duration-300 ease-out"
      aria-label="KSP AI Contextual Assistant Panel"
    >
      {/* Header Controls Bar */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center">
            <Shield size={16} className="text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1 leading-none">
              <Sparkles size={12} className="text-cyan-400" />
              {activeTitle || 'KSP AI Assistant'}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">Karnataka State Police</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={replayGreeting}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-slate-800"
            title={lang === 'kn' ? 'ಪುನರಾವರ್ತಿಸಿ' : 'Replay Greeting'}
            aria-label="Replay Greeting"
          >
            <RotateCcw size={14} />
          </button>
          
          <button 
            onClick={toggleMute}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1 rounded-md hover:bg-slate-800"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-cyan-400" />}
          </button>

          <button 
            onClick={skipAssistant}
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/40 text-amber-400 hover:bg-amber-500/20 transition-all ml-1"
            title="Skip Greeting (Stop Speech & Minimize)"
            aria-label="Skip Greeting"
          >
            <FastForward size={11} /> {lang === 'kn' ? 'ಸ್ಕಿಪ್' : 'Skip'}
          </button>

          <button 
            onClick={closeAssistant}
            className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-md hover:bg-slate-800 ml-1"
            title="Close Assistant"
            aria-label="Close Assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Typing Text Message Area */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm leading-relaxed text-slate-200">
        <TypingText text={currentMessage || 'Welcome Officer.'} speed={20} />
      </div>

      {/* Greeting Summary Card */}
      <GreetingCard data={greetingData} lang={lang} />

      {/* Contextual Quick Actions */}
      <QuickActions lang={lang} />
    </div>
  );
}
