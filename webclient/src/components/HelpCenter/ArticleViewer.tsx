import React from 'react';
import { ArrowLeft, CheckCircle2, Lightbulb, Link2, BookOpen, Share2 } from 'lucide-react';
import type { HelpArticle } from '../../data/helpArticles';
import { HELP_ARTICLES } from '../../data/helpArticles';

interface ArticleViewerProps {
  article: HelpArticle;
  onBack: () => void;
  onSelectArticle: (article: HelpArticle) => void;
  lang?: 'en' | 'kn';
}

export const ArticleViewer: React.FC<ArticleViewerProps> = ({ article, onBack, onSelectArticle, lang = 'en' }) => {
  const isKn = lang === 'kn';

  const title = article.title[lang] || article.title.en;
  const description = article.description[lang] || article.description.en;
  const steps = article.steps[lang] || article.steps.en;
  const tips = article.tips[lang] || article.tips.en;

  const relatedArticles = HELP_ARTICLES.filter(a => article.relatedArticleIds.includes(a.id));

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8 animate-fade-in text-left text-slate-900 font-sans">
      
      {/* Back Button & Category */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} className="text-blue-700" />
          <span>{isKn ? 'ಎಲ್ಲಾ ಲೇಖನಗಳಿಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Help Articles'}</span>
        </button>

        <span className="px-3 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider">
          {article.category}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-base sm:text-lg font-medium text-slate-700 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Step-by-Step Instructions */}
      <div className="space-y-4 pt-2">
        <h3 className="text-lg font-black text-blue-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
          <BookOpen size={20} className="text-blue-700" />
          <span>{isKn ? 'ಹಂತ-ಹಂತದ ತನಿಖಾ ಮಾರ್ಗದರ್ಶಿ' : 'Step-by-Step Instructions'}</span>
        </h3>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                {idx + 1}
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed pt-0.5">
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Officer Tips */}
      {tips.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 space-y-3">
          <h4 className="text-sm font-black text-amber-900 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-600" />
            <span>{isKn ? 'ಅಧಿಕಾರಿಗಳಿಗೆ ಸಲಹೆಗಳು' : 'Pro Tips for Officers'}</span>
          </h4>
          <ul className="space-y-2 text-xs font-bold text-amber-950">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-600 font-black">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="pt-6 border-t border-slate-200 space-y-3">
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <Link2 size={16} className="text-blue-700" />
            <span>{isKn ? 'ಸಂಬಂಧಿತ ಸಹಾಯ ಲೇಖನಗಳು' : 'Related Articles'}</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedArticles.map(rel => (
              <button
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 text-left transition-all cursor-pointer flex items-center justify-between group"
              >
                <span className="text-xs font-black text-slate-800 group-hover:text-blue-900 line-clamp-1">
                  {rel.title[lang] || rel.title.en}
                </span>
                <span className="text-xs text-blue-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
