import React, { useState, useEffect, useCallback } from 'react';
import { usePlatformTour } from '../../hooks/usePlatformTour';
import { ProgressBar } from './ProgressBar';
import { SceneRenderer } from './SceneRenderer';
import { FeatureHighlight } from './FeatureHighlight';
import { SubtitleBar } from './SubtitleBar';
import { TourControls } from './TourControls';
import { useTranslation } from 'react-i18next';

interface PlatformTourProps {
  onExit: () => void;
  onEnterPlatform?: () => void;
  lang?: 'en' | 'kn';
}

export const PlatformTour: React.FC<PlatformTourProps> = React.memo(({
  onExit,
  onEnterPlatform,
  lang: initialLang = 'en'
}) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState<'en' | 'kn'>(
    initialLang || (i18n.language === 'kn' ? 'kn' : 'en')
  );

  const toggleLanguage = useCallback(() => {
    setCurrentLang(prev => {
      const next = prev === 'kn' ? 'en' : 'kn';
      i18n.changeLanguage(next);
      return next;
    });
  }, [i18n]);

  const {
    currentSceneIndex,
    currentScene,
    totalScenes,
    isPlaying,
    isMuted,
    progress,
    nextScene,
    prevScene,
    goToScene,
    togglePlay,
    toggleMute,
    replay
  } = usePlatformTour(currentLang);

  // Keyboard Shortcuts Listener for Accessibility & Power Users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not capture if typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
        case 'l':
          e.preventDefault();
          nextScene();
          break;
        case 'ArrowLeft':
        case 'j':
          e.preventDefault();
          prevScene();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'r':
          e.preventDefault();
          replay();
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextScene, prevScene, toggleMute, replay, onExit]);

  return (
    <div 
      className="w-full min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-3 sm:p-6 font-sans relative overflow-x-hidden focus:outline-none"
      tabIndex={0}
      role="region"
      aria-label="KSP AI Platform Tour Onboarding"
    >
      {/* Top Progress Bar & In-Tour Language Switcher */}
      <ProgressBar
        currentSceneIndex={currentSceneIndex}
        totalScenes={totalScenes}
        progress={progress}
        onSelectScene={goToScene}
        lang={currentLang}
        onToggleLang={toggleLanguage}
      />

      {/* Main Scene Presentation */}
      <div className="flex-1 flex flex-col justify-center my-auto">
        <SceneRenderer
          scene={currentScene}
          onEnterPlatform={onEnterPlatform || onExit}
          lang={currentLang}
        />

        {/* Feature Badges */}
        <FeatureHighlight features={currentScene.features} lang={currentLang} />
      </div>

      {/* Subtitle & Controls Section */}
      <div className="w-full space-y-3 mt-3 sm:mt-4">
        <SubtitleBar scene={currentScene} lang={currentLang} />

        <TourControls
          currentSceneIndex={currentSceneIndex}
          totalScenes={totalScenes}
          isPlaying={isPlaying}
          isMuted={isMuted}
          onNext={nextScene}
          onPrev={prevScene}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onReplay={replay}
          onExit={onExit}
          onEnterPlatform={onEnterPlatform}
          lang={currentLang}
        />
      </div>
    </div>
  );
});
