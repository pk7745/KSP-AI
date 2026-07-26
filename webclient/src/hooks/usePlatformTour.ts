import { useState, useEffect, useCallback, useRef } from 'react';
import { TOUR_SCENES, type TourScene } from '../data/tourScenes';

export function usePlatformTour(lang: 'en' | 'kn' = 'en') {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isTransitioningRef = useRef(false);

  const currentScene: TourScene = TOUR_SCENES[currentSceneIndex];
  const totalScenes = TOUR_SCENES.length;

  // Resolve absolute URL for Catalyst subfolder deployment (/app/audio/en/scene_X.mp3)
  const getResolvedAudioUrl = useCallback((sceneId: number, language: 'en' | 'kn') => {
    const origin = window.location.origin;
    let path = window.location.pathname;
    if (path.endsWith('.html')) {
      path = path.substring(0, path.lastIndexOf('/') + 1);
    } else if (!path.endsWith('/')) {
      path += '/';
    }
    return `${origin}${path}audio/${language}/scene_${sceneId}.mp3`;
  }, []);

  const audioPath = getResolvedAudioUrl(currentScene.id, lang);

  const nextScene = useCallback(() => {
    isTransitioningRef.current = true;
    setProgress(0);
    setCurrentSceneIndex(prev => {
      if (prev < totalScenes - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  }, [totalScenes]);

  const prevScene = useCallback(() => {
    isTransitioningRef.current = true;
    setProgress(0);
    setCurrentSceneIndex(prev => (prev > 0 ? prev - 1 : 0));
    setTimeout(() => {
      isTransitioningRef.current = false;
    }, 300);
  }, []);

  const goToScene = useCallback((index: number) => {
    if (index >= 0 && index < totalScenes) {
      isTransitioningRef.current = true;
      setProgress(0);
      setCurrentSceneIndex(index);
      setTimeout(() => {
        isTransitioningRef.current = false;
      }, 300);
    }
  }, [totalScenes]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const nextState = !prev;
      if (audioRef.current) {
        if (nextState) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }
      return nextState;
    });
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const nextState = !prev;
      if (audioRef.current) {
        audioRef.current.muted = nextState;
      }
      return nextState;
    });
  }, []);

  const replay = useCallback(() => {
    setProgress(0);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Synchronize Audio Playback & Progress Loop
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.muted = isMuted;

    let timer: any = null;
    let hasEnded = false;

    const handleEnded = () => {
      if (hasEnded || isTransitioningRef.current) return;
      hasEnded = true;
      if (currentSceneIndex < totalScenes - 1) {
        nextScene();
      } else {
        setIsPlaying(false);
        setProgress(100);
      }
    };

    const handleError = (e: Event) => {
      console.warn(`Audio playback unavailable for ${audioPath}, continuing timer mode:`, e);
    };

    // Load audio stream for current scene & language
    audio.pause();
    audio.src = audioPath;
    audio.load();
    audio.currentTime = 0;

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    if (isPlaying) {
      audio.play().catch(() => {
        // Silent fallback when autoplay is restricted by browser policy
      });
    }

    // Progress bar animation timer (runs every 100ms)
    const intervalTime = 100;
    const totalTimeMs = (currentScene.duration || 6) * 1000;
    const stepPercent = (intervalTime / totalTimeMs) * 100;

    timer = setInterval(() => {
      if (!isPlaying || isTransitioningRef.current || hasEnded) return;

      // When audio is actively playing and has valid duration, sync with actual audio currentTime
      if (audio && !audio.paused && audio.duration && !isNaN(audio.duration) && audio.duration > 0) {
        const audioPercent = (audio.currentTime / audio.duration) * 100;
        setProgress(audioPercent);
        if (audio.currentTime >= audio.duration - 0.1) {
          handleEnded();
        }
      } else {
        // Fallback smooth timer progression if audio is buffering/silent
        setProgress(prev => {
          if (prev >= 100) {
            handleEnded();
            return 100;
          }
          return prev + stepPercent;
        });
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      audio.pause();
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentSceneIndex, audioPath, isPlaying, isMuted, currentScene.duration, totalScenes, nextScene, lang]);

  return {
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
    replay,
    audioPath
  };
}
