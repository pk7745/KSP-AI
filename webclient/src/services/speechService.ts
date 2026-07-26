import { api } from './api';

/**
 * Frontend Speech Service powered by Google Cloud Text-to-Speech via Catalyst AppSail backend.
 * Fully replaces browser SpeechSynthesis.
 * Manages audio object URL lifecycles, playback, pausing, replay, muting, and instant cancellation.
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
   * Instantly stops audio playback and revokes any active Object URL.
   */
  public stop() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {
        // Ignore audio cleanup exceptions
      }
      this.activeAudio = null;
    }

    if (this.activeObjectUrl) {
      try {
        URL.revokeObjectURL(this.activeObjectUrl);
      } catch (e) {
        // Ignore URL revocation exceptions
      }
      this.activeObjectUrl = null;
    }
  }

  public pause() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
      } catch (e) {}
    }
  }

  public resume() {
    if (this.activeAudio && !this.isMuted) {
      try {
        this.activeAudio.play().catch(() => {});
      } catch (e) {}
    }
  }

  /**
   * Requests backend Google Cloud TTS MP3 audio stream and plays it.
   */
  public async speak(
    text: string,
    lang: 'en' | 'kn' = 'en',
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stop(); // Instantly cancel any active audio before starting new playback

    if (this.isMuted || !text) {
      if (onEnd) onEnd();
      return;
    }

    try {
      const cleanText = text.trim();
      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      // Fetch MP3 Blob from backend Google Cloud TTS endpoint
      const blob = await api.synthesizeSpeech(cleanText, lang);
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
        if (onEnd) onEnd();
      };

      await audio.play().catch((err) => {
        console.warn('[SpeechService] Audio playback restricted by browser or interrupted:', err);
        this.cleanupObjectUrl(objectUrl);
        if (onEnd) onEnd();
      });
    } catch (err) {
      console.warn('[SpeechService] Backend Google TTS unavailable, displaying text silently:', err);
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
