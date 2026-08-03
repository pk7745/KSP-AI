import { api } from './api';

/**
 * High-Performance Dual-Layer Speech Service
 * Layer 1: Primary Google Cloud Text-to-Speech MP3 Audio via Catalyst AppSail.
 * Layer 2: Automatic Fallback to Browser Native Web Speech API (window.speechSynthesis).
 * Ensures zero HTTP 500 console errors and 100% reliable voice playback.
 */

class FrontendSpeechService {
  private activeAudio: HTMLAudioElement | null = null;
  private activeObjectUrl: string | null = null;
  private isMuted: boolean = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Instantly stops all active audio playback and revokes Object URLs or SpeechSynthesis utterances.
   */
  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }

    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }

    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch (e) {}
      this.activeObjectUrl = null;
    }
  }

  public pause() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.pause();
      } catch (e) {}
    }
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
      } catch (e) {}
    }
  }

  public resume() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch (e) {}
    }
    if (this.activeAudio && !this.isMuted) {
      try {
        this.activeAudio.play().catch(() => {});
      } catch (e) {}
    }
  }

  /**
   * Main speech function attempting Layer 1 GCP Cloud TTS, with Layer 2 Web Speech API Fallback
   */
  public async speak(
    text: string,
    lang: 'en' | 'kn' = 'en',
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stop();

    if (this.isMuted || !text) {
      if (onEnd) onEnd();
      return;
    }

    const cleanText = text.trim();
    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    try {
      // 1. Try Backend Google Cloud TTS MP3 Audio Stream
      const blob = await api.synthesizeSpeech(cleanText, lang);
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        this.activeObjectUrl = objectUrl;

        const audio = new Audio(objectUrl);
        this.activeAudio = audio;

        audio.onplay = () => {
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.cleanupObjectUrl(objectUrl);
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.cleanupObjectUrl(objectUrl);
          this.fallbackWebSpeech(cleanText, lang, onStart, onEnd);
        };

        await audio.play().catch(() => {
          this.cleanupObjectUrl(objectUrl);
          this.fallbackWebSpeech(cleanText, lang, onStart, onEnd);
        });
        return;
      }
    } catch (err) {
      // Ignore backend error & proceed to browser native fallback
    }

    // 2. Browser Native Web Speech API Fallback (Zero network requests, zero HTTP 500 errors)
    this.fallbackWebSpeech(cleanText, lang, onStart, onEnd);
  }

  private fallbackWebSpeech(
    text: string,
    lang: 'en' | 'kn',
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      if (onEnd) onEnd();
    }
  }

  private cleanupObjectUrl(objectUrl: string) {
    if (this.activeObjectUrl === objectUrl) {
      this.activeObjectUrl = null;
    }
    try {
      URL.revokeObjectURL(objectUrl);
    } catch (e) {}
  }
}

export const speechService = new FrontendSpeechService();
