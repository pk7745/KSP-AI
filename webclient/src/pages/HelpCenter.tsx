import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LifeBuoy, Sparkles, BookOpen, Clock, Star, HelpCircle, Shield
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HELP_ARTICLES, type HelpArticle } from '../data/helpArticles';
import { ContactCard } from '../components/HelpCenter/ContactCard';
import { SearchBar } from '../components/HelpCenter/SearchBar';
import { HelpCard } from '../components/HelpCenter/HelpCard';
import { ArticleViewer } from '../components/HelpCenter/ArticleViewer';
import { FAQSection } from '../components/HelpCenter/FAQSection';
import { Chatbot } from '../components/HelpCenter/Chatbot';

export function HelpCenter() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kn' ? 'kn' : 'en';
  const isKn = lang === 'kn';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>([]);

  const handleSelectArticle = (article: HelpArticle) => {
    setSelectedArticle(article);
    setRecentlyViewedIds(prev => Array.from(new Set([article.id, ...prev])).slice(0, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter articles by search query
  const filteredArticles = HELP_ARTICLES.filter(a => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const titleEn = a.title.en.toLowerCase();
    const titleKn = a.title.kn.toLowerCase();
    const descEn = a.description.en.toLowerCase();
    const descKn = a.description.kn.toLowerCase();
    const category = a.category.toLowerCase();

    return titleEn.includes(q) || titleKn.includes(q) || descEn.includes(q) || descKn.includes(q) || category.includes(q);
  });

  const popularArticles = HELP_ARTICLES.filter(a => a.popular);
  const recentlyViewedArticles = HELP_ARTICLES.filter(a => recentlyViewedIds.includes(a.id));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 sm:p-8 space-y-8 animate-fade-in relative pb-24 text-left">
      
      {/* 1. Header Section */}
      <div className="w-full max-w-6xl mx-auto space-y-2 border-b-2 border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-xs font-black uppercase tracking-wider">
          <LifeBuoy size={14} className="text-blue-700 animate-spin" style={{ animationDuration: '12s' }} />
          <span>{isKn ? '24×7 ಸರ್ಕಾರಿ ಅಧಿಕಾರಿ ಸಹಾಯ ಕೇಂದ್ರ' : '24×7 Police Support Help Center'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight uppercase">
          {isKn ? '24×7 ಸಹಾಯ ಕೇಂದ್ರ' : '24×7 Help Center'}
        </h1>

        <p className="text-sm sm:text-lg font-bold text-slate-600 max-w-3xl leading-relaxed">
          {isKn 
            ? 'ಕೆಎಸ್‌ಪಿ ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಬಳಕೆಯ ಕುರಿತು ನೆರವು ಬೇಕೇ? ನಮ್ಮ ವರ್ಚುವಲ್ ಬೆಂಬಲ ಸಹಾಯಕ 24 ಗಂಟೆಯೂ ಲಭ್ಯವಿದೆ.' 
            : 'Need assistance using the KSP AI Crime Intelligence Platform? Our virtual support assistant is available 24 hours a day.'
          }
        </p>
      </div>

      {/* 2. Contact Information Card */}
      <div className="w-full max-w-6xl mx-auto">
        <ContactCard lang={lang} />
      </div>

      {/* Article Viewer OR Articles Grid */}
      {selectedArticle ? (
        <ArticleViewer
          article={selectedArticle}
          onBack={() => setSelectedArticle(null)}
          onSelectArticle={handleSelectArticle}
          lang={lang}
        />
      ) : (
        <div className="w-full max-w-6xl mx-auto space-y-8">
          
          {/* 3. Search Bar */}
          <SearchBar query={searchQuery} onQueryChange={setSearchQuery} lang={lang} />

          {/* Quick Help Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight flex items-center gap-2">
                <BookOpen size={22} className="text-blue-700" />
                <span>{isKn ? 'ತ್ವರಿತ ಸಹಾಯ ಲೇಖನಗಳು' : 'Quick Help Articles'}</span>
              </h2>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {filteredArticles.length} {isKn ? 'ಲೇಖನಗಳು ಲಭ್ಯವಿದೆ' : 'articles available'}
              </span>
            </div>

            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-white border-2 border-slate-200 rounded-2xl text-slate-600 font-bold">
                {isKn ? 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಹೊಂದಾಣಿಕೆಯಾಗುವ ಯಾವುದೇ ಸಹಾಯ ಲೇಖನಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' : 'No help articles found matching your search query.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredArticles.map(article => (
                  <HelpCard
                    key={article.id}
                    article={article}
                    onSelectArticle={handleSelectArticle}
                    lang={lang}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Popular & Recently Viewed Articles Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Popular Articles */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                <span>{isKn ? 'ಜನಪ್ರಿಯ ಲೇಖನಗಳು' : 'Popular Articles'}</span>
              </h3>
              <div className="space-y-2">
                {popularArticles.map(article => (
                  <div
                    key={article.id}
                    onClick={() => handleSelectArticle(article)}
                    className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span className="text-xs font-bold text-slate-800">{isKn ? article.title.kn : article.title.en}</span>
                    <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">{article.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-700" />
                <span>{isKn ? 'ಇತ್ತೀಚೆಗೆ ವೀಕ್ಷಿಸಿದ ಲೇಖನಗಳು' : 'Recently Viewed'}</span>
              </h3>
              {recentlyViewedArticles.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center">{isKn ? 'ಇನ್ನೂ ಯಾವುದೇ ಲೇಖನಗಳನ್ನು ವೀಕ್ಷಿಸಿಲ್ಲ.' : 'No articles viewed yet in this session.'}</p>
              ) : (
                <div className="space-y-2">
                  {recentlyViewedArticles.map(article => (
                    <div
                      key={article.id}
                      onClick={() => handleSelectArticle(article)}
                      className="p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-800">{isKn ? article.title.kn : article.title.en}</span>
                      <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">VIEWED</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* FAQ Accordion Section */}
          <FAQSection lang={lang} />

        </div>
      )}

      {/* Floating Support Chatbot Container */}
      <Chatbot lang={lang} />
    </div>
  );
}
