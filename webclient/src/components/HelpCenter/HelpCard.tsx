import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Microscope, Map, MessageSquare, 
  Network, BarChart2, Users, Bell, Globe, ShieldAlert, CheckCircle2,
  ChevronRight, Sparkles
} from 'lucide-react';
import type { HelpArticle } from '../../data/helpArticles';

interface HelpCardProps {
  article: HelpArticle;
  onSelectArticle: (article: HelpArticle) => void;
  lang?: 'en' | 'kn';
}

const iconMap: Record<string, any> = {
  LayoutDashboard,
  FileText,
  Microscope,
  Map,
  MessageSquare,
  Network,
  BarChart2,
  Users,
  Bell,
  Globe,
  ShieldAlert,
  CheckCircle2
};

export const HelpCard: React.FC<HelpCardProps> = ({ article, onSelectArticle, lang = 'en' }) => {
  const isKn = lang === 'kn';
  const IconComponent = iconMap[article.iconName] || FileText;

  const title = article.title[lang] || article.title.en;
  const description = article.description[lang] || article.description.en;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelectArticle(article)}
      className="bg-white border-2 border-slate-200/90 hover:border-blue-500 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group relative overflow-hidden text-left"
    >
      {article.popular && (
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
          <Sparkles size={10} className="text-amber-600" />
          <span>{isKn ? 'ಜನಪ್ರಿಯ' : 'Popular'}</span>
        </span>
      )}

      <div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
          <IconComponent size={20} />
        </div>

        <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 mb-1 block">
          {article.category}
        </span>

        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 mb-1.5 font-heading">
          {title}
        </h3>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 font-medium">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-900 group-hover:text-blue-700 transition-colors">
        <span>{isKn ? 'ಲೇಖನ ಓದಿ' : 'Read Article'}</span>
        <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform text-blue-600" />
      </div>
    </motion.div>
  );
};
