import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { TourScene } from '../../data/tourScenes';

interface SubtitleBarProps {
  scene: TourScene;
  lang?: 'en' | 'kn';
}

export const SubtitleBar: React.FC<SubtitleBarProps> = React.memo(({ scene, lang = 'en' }) => {
  const text = scene.placeholderNarration[lang] || scene.placeholderNarration.en;

  return (
    <div 
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-blue-200 rounded-2xl shadow-md relative overflow-hidden"
      aria-live="polite"
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Sparkles size={16} className="text-blue-700 animate-pulse" />
        </div>

        <div className="flex-1">
          <div className="text-[10px] font-black uppercase tracking-widest text-blue-900 mb-0.5 flex items-center gap-1.5">
            <span>AI Virtual Guide Narration</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${scene.id}-${lang}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed font-sans"
            >
              "{text}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
