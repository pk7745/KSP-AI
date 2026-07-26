import React from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw, X, LogIn, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TourControlsProps {
  currentSceneIndex: number;
  totalScenes: number;
  isPlaying: boolean;
  isMuted?: boolean;
  onNext: () => void;
  onPrev: () => void;
  onTogglePlay: () => void;
  onToggleMute?: () => void;
  onReplay: () => void;
  onExit: () => void;
  onEnterPlatform?: () => void;
  lang?: 'en' | 'kn';
}

export const TourControls: React.FC<TourControlsProps> = React.memo(({
  currentSceneIndex,
  totalScenes,
  isPlaying,
  isMuted = false,
  onNext,
  onPrev,
  onTogglePlay,
  onToggleMute,
  onReplay,
  onExit,
  onEnterPlatform,
  lang = 'en'
}) => {
  const { i18n } = useTranslation();
  const isKn = lang === 'kn' || i18n.language === 'kn';
  const isLastScene = currentSceneIndex === totalScenes - 1;

  return (
    <div 
      className="flex flex-wrap items-center justify-between gap-3 w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-slate-200 rounded-2xl shadow-lg"
      role="toolbar"
      aria-label="Tour Playback Controls"
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentSceneIndex === 0}
          aria-label={isKn ? 'ಹಿಂದಿನ ದೃಶ್ಯ' : 'Previous Scene'}
          className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <ChevronLeft size={16} />
          <span>{isKn ? 'ಹಿಂದಿನದು' : 'Previous'}</span>
        </button>

        <button
          onClick={onTogglePlay}
          aria-label={isPlaying ? (isKn ? 'ಪ್ರದರ್ಶನ ವಿರಾಮ' : 'Pause Tour') : (isKn ? 'ಪ್ರದರ್ಶನ ಪ್ಲೇ ಮಾಡಿ' : 'Play Tour')}
          className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 text-slate-900 font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          {isPlaying ? <Pause size={15} className="text-amber-600" /> : <Play size={15} className="text-emerald-600" />}
          <span>{isPlaying ? (isKn ? 'ವಿರಾಮ' : 'Pause') : (isKn ? 'ಪ್ಲೇ ಮಾಡಿ' : 'Play')}</span>
        </button>

        {onToggleMute && (
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? (isKn ? 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ' : 'Unmute Audio') : (isKn ? 'ಮ್ಯೂಟ್ ಮಾಡಿ' : 'Mute Audio')}
            className="px-3 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
            title={isMuted ? (isKn ? 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ' : 'Unmute Audio') : (isKn ? 'ಮ್ಯೂಟ್ ಮಾಡಿ' : 'Mute Audio')}
          >
            {isMuted ? <VolumeX size={15} className="text-red-500" /> : <Volume2 size={15} className="text-blue-600" />}
          </button>
        )}

        <button
          onClick={onReplay}
          aria-label={isKn ? 'ಪುನರಾವರ್ತಿಸಿ' : 'Replay Tour'}
          className="px-3 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-blue-400"
          title={isKn ? 'ಪುನರಾವರ್ತಿಸಿ' : 'Replay Tour'}
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {isLastScene ? (
          <button
            onClick={onEnterPlatform || onExit}
            aria-label={isKn ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಪ್ರವೇಶಿಸಿ' : 'Enter Platform'}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 border-2 border-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer focus:ring-2 focus:ring-emerald-400"
          >
            <LogIn size={16} />
            <span>{isKn ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಪ್ರವೇಶಿಸಿ' : 'Enter Platform'}</span>
          </button>
        ) : (
          <button
            onClick={onNext}
            aria-label={isKn ? 'ಮುಂದಿನ ದೃಶ್ಯ' : 'Next Scene'}
            className="px-4 sm:px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 border-2 border-blue-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer focus:ring-2 focus:ring-blue-400"
          >
            <span>{isKn ? 'ಮುಂದಿನ ದೃಶ್ಯ' : 'Next Scene'}</span>
            <ChevronRight size={16} />
          </button>
        )}

        <button
          onClick={onExit}
          aria-label={isKn ? 'ಪ್ರದರ್ಶನದಿಂದ ನಿರ್ಗಮಿಸಿ' : 'Exit Tour'}
          className="px-3 sm:px-3.5 py-2 rounded-xl bg-slate-100 border-2 border-slate-200 hover:bg-red-50 hover:border-red-300 text-slate-700 hover:text-red-700 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shadow-sm focus:ring-2 focus:ring-red-400"
        >
          <X size={15} />
          <span>{isKn ? 'ನಿರ್ಗಮಿಸಿ' : 'Exit Tour'}</span>
        </button>
      </div>
    </div>
  );
});
