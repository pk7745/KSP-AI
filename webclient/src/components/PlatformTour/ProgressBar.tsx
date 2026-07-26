import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

interface ProgressBarProps {
  currentSceneIndex: number;
  totalScenes: number;
  progress: number;
  onSelectScene: (index: number) => void;
  lang?: 'en' | 'kn';
  onToggleLang?: () => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  currentSceneIndex,
  totalScenes,
  progress,
  onSelectScene,
  lang = 'en',
  onToggleLang
}) => {
  const isKn = lang === 'kn';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 flex flex-col gap-2 select-none">
      <div className="flex items-center justify-between text-xs font-black text-slate-800">
        <span className="font-mono text-blue-900 tracking-wider">
          {isKn 
            ? `ದೃಶ್ಯ ${currentSceneIndex + 1} / ${totalScenes}` 
            : `SCENE ${currentSceneIndex + 1} OF ${totalScenes}`}
        </span>

        <div className="flex items-center gap-3">
          {onToggleLang && (
            <button
              onClick={onToggleLang}
              aria-label={isKn ? 'Switch to English' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ'}
              className="px-2.5 py-1 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-[11px] font-black text-blue-900 flex items-center gap-1 transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
              title={isKn ? 'English ಗೆ ಬದಲಾಯಿಸಿ' : 'ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಿ'}
            >
              <Globe size={13} className="text-blue-600" />
              <span>{isKn ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>
          )}

          <span className="text-slate-600 font-bold hidden sm:inline">
            {Math.round(((currentSceneIndex + 1) / totalScenes) * 100)}% {isKn ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'COMPLETED'}
          </span>
        </div>
      </div>

      <div 
        className="flex items-center gap-1.5 w-full"
        role="progressbar"
        aria-valuenow={currentSceneIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalScenes}
      >
        {Array.from({ length: totalScenes }).map((_, idx) => {
          const isActive = idx === currentSceneIndex;
          const isCompleted = idx < currentSceneIndex;

          return (
            <button
              key={idx}
              onClick={() => onSelectScene(idx)}
              aria-label={`Jump to Scene ${idx + 1}`}
              className="flex-1 h-2.5 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative transition-all duration-300 hover:scale-y-125 cursor-pointer focus:ring-2 focus:ring-blue-400"
              title={`Jump to Scene ${idx + 1}`}
            >
              {isCompleted && (
                <div className="w-full h-full bg-blue-600 rounded-full" />
              )}

              {isActive && (
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
