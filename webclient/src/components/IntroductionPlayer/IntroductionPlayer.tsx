import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './IntroductionPlayer.css';

interface IntroductionPlayerProps {
  onEnded?: () => void;
  onSkip?: () => void;
  className?: string;
}

export const IntroductionPlayer: React.FC<IntroductionPlayerProps> = ({
  onEnded,
  onSkip,
  className = ''
}) => {
  const { i18n } = useTranslation();
  const enVideoRef = useRef<HTMLVideoElement | null>(null);
  const knVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const lang = i18n.language === 'kn' ? 'kn' : 'en';
  const isKn = lang === 'kn';

  // Base path resolver for Catalyst subfolder deployment (/app/avatar-intro.mp4)
  const getSubfolderUrl = useCallback((filename: string) => {
    const origin = window.location.origin;
    let path = window.location.pathname;
    if (path.endsWith('.html')) {
      path = path.substring(0, path.lastIndexOf('/') + 1);
    } else if (!path.endsWith('/')) {
      path += '/';
    }
    return `${origin}${path}${filename}`;
  }, []);

  const englishVideoUrl = useMemo(() => getSubfolderUrl('avatar-intro.mp4'), [getSubfolderUrl]);
  const kannadaVideoUrl = useMemo(() => getSubfolderUrl('ksp-kannada.mp4'), [getSubfolderUrl]);

  // Strict Single-Audio Control: Only active language video can ever unmute; secondary video is ALWAYS muted & silent!
  useEffect(() => {
    if (isKn) {
      // Kannada is active -> Unmute Kannada video if user unmuted, STRICTLY mute English video
      if (knVideoRef.current) knVideoRef.current.muted = isMuted;
      if (enVideoRef.current) enVideoRef.current.muted = true;
    } else {
      // English is active -> Unmute English video if user unmuted, STRICTLY mute Kannada video
      if (enVideoRef.current) enVideoRef.current.muted = isMuted;
      if (knVideoRef.current) knVideoRef.current.muted = true;
    }
  }, [isKn, isMuted]);

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleReplay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const activeRef = isKn ? knVideoRef.current : enVideoRef.current;
    if (activeRef) {
      activeRef.currentTime = 0;
      activeRef.play().catch(() => {});
    }
  };

  return (
    <div 
      className={`intro-player-container wireframe-box registration-mark relative overflow-hidden bg-slate-950 rounded-3xl border-2 border-cyan-500/40 shadow-2xl group cursor-pointer ${className}`}
      onClick={() => toggleMute()}
    >
      <div className="w-full h-full relative flex items-center justify-center min-h-[240px]">
        {/* English Video Instance (Muted strictly when Kannada is active) */}
        <video
          ref={enVideoRef}
          src={englishVideoUrl}
          autoPlay
          loop
          muted={isKn || isMuted}
          playsInline
          preload="auto"
          controlsList="nodownload no-remote-playback"
          disablePictureInPicture
          className={`w-full h-full object-cover rounded-2xl absolute inset-0 transition-opacity duration-150 ${
            !isKn ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
          onEnded={!isKn ? onEnded : undefined}
        />

        {/* Kannada Video Instance (Muted strictly when English is active) */}
        <video
          ref={knVideoRef}
          src={kannadaVideoUrl}
          autoPlay
          loop
          muted={!isKn || isMuted}
          playsInline
          preload="auto"
          controlsList="nodownload no-remote-playback"
          disablePictureInPicture
          className={`w-full h-full object-cover rounded-2xl absolute inset-0 transition-opacity duration-150 ${
            isKn ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
          onEnded={isKn ? onEnded : undefined}
        />
      </div>

      {/* Caption Overlay */}
      <div className="avatar-caption-overlay pointer-events-none">
        <span className="typewriter-text">
          {isKn ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಎಐ ಪರಿಚಯ ವಿಡಿಯೋ ಪ್ರದರ್ಶನ' : 'Karnataka State Police AI Virtual Guide Active'}
        </span>
      </div>

      {/* Control Overlay Buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
        <button
          onClick={handleReplay}
          className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-slate-700 backdrop-blur-md transition-all shadow-md"
          title={isKn ? 'ಮತ್ತೊಮ್ಮೆ ವೀಕ್ಷಿಸಿ' : 'Replay Video'}
        >
          <RotateCcw size={16} />
        </button>

        {onSkip && (
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(); }}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-slate-700 backdrop-blur-md transition-all shadow-md flex items-center gap-1 text-xs font-bold"
            title="Skip Intro"
          >
            <FastForward size={14} />
            <span>{isKn ? 'ಬಿಟ್ಟುಬಿಡಿ' : 'Skip'}</span>
          </button>
        )}
      </div>

      {/* Bottom Mute Badge */}
      <div className="mute-toggle-btn">
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        <span className="mute-text">
          {isMuted ? (isKn ? "ಧ್ವನಿಗಾಗಿ ಕ್ಲಿಕ್ ಮಾಡಿ" : "Click to Unmute") : (isKn ? "ಧ್ವನಿ ಆನ್" : "Sound On")}
        </span>
      </div>
    </div>
  );
};
