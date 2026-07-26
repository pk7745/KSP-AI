import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  lang?: 'en' | 'kn';
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, lang = 'en' }) => {
  const isKn = lang === 'kn';

  return (
    <div className="w-full max-w-3xl mx-auto relative shadow-sm rounded-2xl overflow-hidden border-2 border-blue-200 bg-white transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
      <div className="flex items-center px-4 py-3.5 gap-3">
        <Search size={20} className="text-blue-700 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          placeholder={isKn ? 'ಸಹಾಯ ಲೇಖನಗಳನ್ನು ಹುಡುಕಿ...' : 'Search help articles...'}
          className="w-full text-sm sm:text-base font-medium text-slate-900 bg-transparent border-none outline-none placeholder-slate-400"
          aria-label={isKn ? 'ಸಹಾಯ ಲೇಖನಗಳನ್ನು ಹುಡುಕಿ' : 'Search help articles'}
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Clear Search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
