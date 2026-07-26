import React from 'react';
import { Shield } from 'lucide-react';

interface OfficerAvatarProps {
  animationState: string;
  isSpeaking?: boolean;
}

export function OfficerAvatar({ animationState, isSpeaking = false }: OfficerAvatarProps) {
  const isSaluting = animationState === 'salute' || animationState === 'greeting';

  return (
    <div className="relative flex flex-col items-center justify-center flex-shrink-0">
      {/* Outer Glowing Halo Ring */}
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 p-0.5 shadow-xl transition-all duration-300 ${isSpeaking ? 'scale-105 shadow-cyan-400/40 ring-2 ring-cyan-400/50' : 'hover:scale-102'}`}>
        <div className="w-full h-full rounded-[14px] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 bg-radial-at-c from-cyan-900/40 to-transparent pointer-events-none" />

          {/* Vector Animated Police Officer Character Badge */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Police Officer Peak Cap */}
            <div className="relative flex flex-col items-center -mb-1">
              <div className="w-9 h-2 bg-amber-600 rounded-t-md border-b border-amber-400/50 shadow-sm" />
              <div className="w-11 h-2.5 bg-slate-900 rounded-t-lg border border-amber-500/40 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-400 shadow-sm animate-pulse" />
              </div>
            </div>

            {/* Officer Face Silhouette & Expression */}
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-amber-400/60 flex flex-col items-center justify-center shadow-inner relative">
              {/* Eyes */}
              <div className="flex gap-2 mb-0.5">
                <div className={`w-1.5 h-1.5 rounded-full bg-cyan-300 ${isSpeaking ? 'animate-ping' : ''}`} />
                <div className={`w-1.5 h-1.5 rounded-full bg-cyan-300 ${isSpeaking ? 'animate-ping' : ''}`} />
              </div>

              {/* Moustache */}
              <div className="w-4 h-1 bg-slate-900 rounded-full -mt-0.5 mb-0.5 shadow-sm" />

              {/* Smile / Mouth */}
              <div className={`w-2.5 h-1 border-b-2 border-cyan-400 rounded-full transition-all ${isSpeaking ? 'h-2 border-cyan-300 bg-cyan-400/30' : ''}`} />
            </div>

            {/* Karnataka State Police Emblem Badge */}
            <div className="flex items-center gap-0.5 mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-cyan-500/40">
              <Shield size={10} className="text-amber-400" />
              <span className="text-[8px] font-extrabold text-cyan-300 font-mono tracking-tighter">KSP AI</span>
            </div>

          </div>

          {/* Officer Salute Hand Animation */}
          {isSaluting && (
            <div className="absolute top-2 right-1 flex items-center animate-bounce">
              <div className="w-3 h-1.5 bg-amber-400 rounded-full rotate-45 shadow-sm" />
            </div>
          )}

        </div>
      </div>

      {/* Audio Waveform Visualizer */}
      {isSpeaking && (
        <div className="flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-slate-900/90 border border-cyan-400/40 shadow-md">
          <span className="w-1 h-3 rounded-full bg-cyan-400 animate-bounce" />
          <span className="w-1 h-4 rounded-full bg-cyan-400 animate-bounce delay-100" />
          <span className="w-1 h-2 rounded-full bg-cyan-400 animate-bounce delay-200" />
        </div>
      )}
    </div>
  );
}
