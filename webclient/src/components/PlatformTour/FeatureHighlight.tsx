import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FeatureHighlightProps {
  features: {
    en: string[];
    kn: string[];
  };
  lang?: 'en' | 'kn';
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = React.memo(({ features, lang = 'en' }) => {
  const featureList = features[lang] || features.en;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-3">
      {featureList.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.08, duration: 0.25 }}
          style={{ transform: 'translate3d(0,0,0)' }}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white border-2 border-blue-200 text-blue-900 text-[11px] sm:text-xs font-black flex items-center gap-1.5 shadow-sm"
        >
          <Sparkles size={14} className="text-blue-600 shrink-0" />
          <span>{feature}</span>
        </motion.div>
      ))}
    </div>
  );
});
