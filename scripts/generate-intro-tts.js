import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const GCP_CREDENTIALS_PATH = path.join(PROJECT_ROOT, 'functions', 'ksp_crime_intelligence_function', 'gcp-credentials.json');

// Import text-to-speech from functions node_modules
const ttsModulePath = path.join(PROJECT_ROOT, 'functions', 'ksp_crime_intelligence_function', 'node_modules', '@google-cloud', 'text-to-speech', 'build', 'src', 'index.js');
const textToSpeech = await import(`file:///${ttsModulePath.replace(/\\/g, '/')}`);

// Output target directories
const TARGET_EN_DIRS = [
  path.join(PROJECT_ROOT, 'public', 'intro', 'audio', 'en'),
  path.join(PROJECT_ROOT, 'webclient', 'public', 'intro', 'audio', 'en')
];

const TARGET_KN_DIRS = [
  path.join(PROJECT_ROOT, 'public', 'intro', 'audio', 'kn'),
  path.join(PROJECT_ROOT, 'webclient', 'public', 'intro', 'audio', 'kn')
];

// Ensure directories exist
TARGET_EN_DIRS.forEach(dir => fs.mkdirSync(dir, { recursive: true }));
TARGET_KN_DIRS.forEach(dir => fs.mkdirSync(dir, { recursive: true }));

// Load Google Cloud Text-to-Speech client
let ttsClient;
if (fs.existsSync(GCP_CREDENTIALS_PATH)) {
  console.log(`🔒 Loading GCP Credentials from: ${GCP_CREDENTIALS_PATH}`);
  ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: GCP_CREDENTIALS_PATH });
} else {
  console.error(`❌ GCP Credentials not found at: ${GCP_CREDENTIALS_PATH}`);
  process.exit(1);
}

// SSML Intro Audio Scripts matching exact timeline cues:
// 0.0s - 0.8s: Silent opening (800ms)
// 0.8s - 2.3s: "Welcome." / "ಸ್ವಾಗತ." (700ms pause)
// 2.3s - 4.2s: "This is KSP AI." / "ಇದು KSP AI." (1200ms pause)
// 4.2s - 7.2s: "Come in..." / "ಬನ್ನಿ..." (800ms pause)
// 7.2s - 9.4s: "Let's have a tour." / "ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರದರ್ಶನ ವೀಕ್ಷಿಸೋಣ." (600ms pause)
// 9.4s - 10.0s: Silent finish
const ENGLISH_SSML = `
<speak>
  <break time="800ms"/>
  Welcome.
  <break time="700ms"/>
  This is KSP AI.
  <break time="1200ms"/>
  Come in...
  <break time="800ms"/>
  Let's have a tour.
  <break time="600ms"/>
</speak>
`;

const KANNADA_SSML = `
<speak>
  <break time="800ms"/>
  ಸ್ವಾಗತ.
  <break time="700ms"/>
  ಇದು KSP AI.
  <break time="1200ms"/>
  ಬನ್ನಿ...
  <break time="800ms"/>
  ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರದರ್ಶನ ವೀಕ್ಷಿಸೋಣ.
  <break time="600ms"/>
</speak>
`;

async function generateIntroAudio() {
  console.log(`\n🎬 Generating Synchronized 10-Second Introduction Narration Audio (MALE VOICES)...`);
  console.log(`-----------------------------------------------------------------------`);

  // 1. Synthesize English Audio (en-IN-Neural2-B: Professional Male Indian English)
  console.log(`🎙️ Synthesizing English Intro Audio (MALE Voice: en-IN-Neural2-B)...`);
  const [enResponse] = await ttsClient.synthesizeSpeech({
    input: { ssml: ENGLISH_SSML },
    voice: { languageCode: 'en-IN', name: 'en-IN-Neural2-B', ssmlGender: 'MALE' },
    audioConfig: { 
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      volumeGainDb: 2.0
    }
  });

  TARGET_EN_DIRS.forEach(dir => {
    const filePath = path.join(dir, 'intro.mp3');
    fs.writeFileSync(filePath, enResponse.audioContent, 'binary');
    console.log(`   ✓ Saved MALE EN MP3: ${filePath}`);
  });

  // 2. Synthesize Kannada Audio (kn-IN-Standard-B: Professional Male Kannada Voice for KSP)
  console.log(`\n🎙️ Synthesizing Kannada Intro Audio (MALE Voice: kn-IN-Standard-B)...`);
  const [knResponse] = await ttsClient.synthesizeSpeech({
    input: { ssml: KANNADA_SSML },
    voice: { languageCode: 'kn-IN', name: 'kn-IN-Standard-B', ssmlGender: 'MALE' },
    audioConfig: { 
      audioEncoding: 'MP3',
      speakingRate: 0.95,
      volumeGainDb: 2.0
    }
  });

  TARGET_KN_DIRS.forEach(dir => {
    const filePath = path.join(dir, 'intro.mp3');
    fs.writeFileSync(filePath, knResponse.audioContent, 'binary');
    console.log(`   ✓ Saved MALE KN MP3: ${filePath}`);
  });

  console.log(`-----------------------------------------------------------------------`);
  console.log(`✅ SUCCESS: Professional MALE English & Kannada introduction MP3s generated!`);
}

generateIntroAudio().catch(err => {
  console.error(`❌ Error generating intro audio:`, err);
  process.exit(1);
});
