import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load GCP credentials securely on backend
let ttsClient = null;

try {
  const credPath = path.join(__dirname, '../gcp-credentials.json');
  if (fs.existsSync(credPath)) {
    const credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    ttsClient = new textToSpeech.TextToSpeechClient({ credentials });
    console.log('[GoogleTTS] Initialized with Service Account JSON.');
  } else if (process.env.GCP_CREDENTIALS_JSON) {
    const credentials = JSON.parse(process.env.GCP_CREDENTIALS_JSON);
    ttsClient = new textToSpeech.TextToSpeechClient({ credentials });
    console.log('[GoogleTTS] Initialized with process.env.GCP_CREDENTIALS_JSON.');
  } else {
    ttsClient = new textToSpeech.TextToSpeechClient();
    console.log('[GoogleTTS] Initialized with default ADC credentials.');
  }
} catch (err) {
  console.error('[GoogleTTS] Failed to initialize TextToSpeechClient:', err.message);
}

/**
 * Generates MP3 binary speech audio using Google Cloud Text-to-Speech
 * Fallback to Google Translate TTS MP3 Audio Stream for zero-downtime Kannada & English playback.
 * @param {string} text - Text to speak
 * @param {string} language - Language code ('en' or 'kn')
 * @returns {Promise<Buffer>} - MP3 Audio Buffer
 */
export async function generateSpeech(text, language = 'en') {
  const cleanText = String(text || '').trim();
  const isKannada = language === 'kn' || /[\u0C80-\u0CFF]/.test(cleanText);
  const targetLang = isKannada ? 'kn' : 'en';

  // 1. Try Google Cloud Text-to-Speech API
  if (ttsClient) {
    try {
      const request = {
        input: { text: cleanText },
        voice: isKannada
          ? { languageCode: 'kn-IN', name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' }
          : { languageCode: 'en-IN', name: 'en-IN-Wavenet-D', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3', speakingRate: 1.0, pitch: 0 }
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      if (response && response.audioContent) {
        return response.audioContent;
      }
    } catch (err) {
      console.warn('[GoogleTTS] Cloud API call failed, failing over to Google TTS Stream:', err.message);
    }
  }

  // 2. High-Reliability Google TTS Audio Stream Fallback
  try {
    const encodeText = encodeURIComponent(cleanText.slice(0, 300));
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeText}&tl=${targetLang}&client=tw-ob`;
    
    const resp = await fetch(googleTtsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (resp.ok) {
      const arrayBuffer = await resp.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
  } catch (streamErr) {
    console.error('[GoogleTTS] Stream fallback error:', streamErr.message);
  }

  throw new Error('Failed to generate speech audio stream for language: ' + targetLang);
}
