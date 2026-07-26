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
 * @param {string} text - Text to speak
 * @param {string} language - Language code ('en' or 'kn')
 * @returns {Promise<Buffer>} - MP3 Audio Buffer
 */
export async function generateSpeech(text, language = 'en') {
  if (!ttsClient) {
    throw new Error('Google Cloud Text-to-Speech Client is not initialized.');
  }

  const isKannada = language === 'kn' || (text && /[\u0C80-\u0CFF]/.test(text));

  const request = {
    input: { text },
    voice: isKannada
      ? { languageCode: 'kn-IN', ssmlGender: 'FEMALE' }
      : { languageCode: 'en-IN', ssmlGender: 'MALE' },
    audioConfig: { audioEncoding: 'MP3' }
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  return response.audioContent;
}
