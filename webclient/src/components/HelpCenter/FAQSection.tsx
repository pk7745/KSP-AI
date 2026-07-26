import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FAQ_DATA, type FAQItem } from '../../data/faqData';

interface FAQSectionProps {
  lang?: 'en' | 'kn';
}

export const FAQSection: React.FC<FAQSectionProps> = ({ lang = 'en' }) => {
  const isKn = lang === 'kn';
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggle = (id: string) => {
    setOpenId(prev => (prev === id ? null : id));
  };

  return (
    <div className="w-full space-y-4 text-left">
      <div className="flex items-center gap-2 border-b-2 border-slate-200 pb-3">
        <HelpCircle size={22} className="text-blue-700" />
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading tracking-tight">
          {isKn ? 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'Frequently Asked Questions'}
        </h2>
      </div>

      <div className="space-y-3">
        {FAQ_DATA.slice(0, 8).map(item => {
          const isOpen = openId === item.id;
          const question = item.question[lang] || item.question.en;
          const answer = item.answer[lang] || item.answer.en;

          return (
            <div
              key={item.id}
              className="bg-white border-2 border-slate-200 hover:border-blue-300 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-slate-900 cursor-pointer bg-white hover:bg-blue-50/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="pr-4">{question}</span>
                <span className="p-1 rounded-lg bg-blue-100 text-blue-800 shrink-0">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
