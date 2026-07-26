import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import textToSpeech from '@google-cloud/text-to-speech';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root & asset output directories
const PROJECT_ROOT = path.resolve(__dirname, '..');
const GCP_CREDENTIALS_PATH = path.join(PROJECT_ROOT, 'functions', 'ksp_crime_intelligence_function', 'gcp-credentials.json');

const PUBLIC_AUDIO_EN_DIR = path.join(PROJECT_ROOT, 'webclient', 'public', 'audio', 'en');
const PUBLIC_AUDIO_KN_DIR = path.join(PROJECT_ROOT, 'webclient', 'public', 'audio', 'kn');

// Ensure output directories exist
fs.mkdirSync(PUBLIC_AUDIO_EN_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_AUDIO_KN_DIR, { recursive: true });

// Check Google Cloud Credentials
let ttsClient;
if (fs.existsSync(GCP_CREDENTIALS_PATH)) {
  console.log(`🔒 Loading Google Cloud credentials from: ${GCP_CREDENTIALS_PATH}`);
  ttsClient = new textToSpeech.TextToSpeechClient({ keyFilename: GCP_CREDENTIALS_PATH });
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log(`🔒 Loading Google Cloud credentials from env GOOGLE_APPLICATION_CREDENTIALS`);
  ttsClient = new textToSpeech.TextToSpeechClient();
} else {
  console.error(`❌ ERROR: Google Cloud credentials not found at ${GCP_CREDENTIALS_PATH} or process.env.GOOGLE_APPLICATION_CREDENTIALS`);
  console.error(`Please place your gcp-credentials.json file in functions/ksp_crime_intelligence_function/gcp-credentials.json`);
  process.exit(1);
}

// 10 Scene Narrations Script
const SCENE_NARRATIONS = [
  {
    sceneId: 1,
    textEn: "Welcome to the Karnataka State Police AI Crime Intelligence Platform — an advanced AI-powered investigation system engineered for modern law enforcement across Karnataka.",
    textKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಸುಸ್ವಾಗತ — ಇದು ಆಧುನಿಕ ಕಾನೂನು ಜಾರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಅತ್ಯಾಧುನಿಕ ಎಐ ತನಿಖಾ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ."
  },
  {
    sceneId: 2,
    textEn: "The Real-Time Intelligence Dashboard aggregates CCTNS FIR velocity, live 112 emergency dispatch alerts, and crime surge analytics from 31 district command centers.",
    textKn: "ನೈಜ-ಸಮಯದ ಇಂಟೆಲಿಜೆನ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ 31 ಜಿಲ್ಲಾ ಕಂಟ್ರೋಲ್ ರೂಮ್‌ಗಳಿಂದ ಎಫ್‌ಐಆರ್ ವೇಗ, 112 ತುರ್ತು ಅಲರ್ಟ್‌ಗಳು ಮತ್ತು ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ."
  },
  {
    sceneId: 3,
    textEn: "The Statewide Case Repository enables officers to instantly query over 1,000 CCTNS crime records, track investigation workflows, and manage evidence logs.",
    textKn: "ರಾಜ್ಯಾದ್ಯಂತ ಪ್ರಕರಣಗಳ ಸಂಗ್ರಹಾಗಾರವು 1,000 ಕ್ಕೂ ಹೆಚ್ಚು CCTNS ಅಪರಾಧ ದಾಖಲೆಗಳು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ತಕ್ಷಣ ವೀಕ್ಷಿಸಲು ನೆರವಾಗುತ್ತದೆ."
  },
  {
    sceneId: 4,
    textEn: "AI Evidence Analysis uses advanced Optical Character Recognition to automatically extract suspect names, bank account numbers, and IP addresses from scanned physical documents.",
    textKn: "ಎಐ ಸಾಕ್ಷ್ಯಾಧಾರ ವಿಶ್ಲೇಷಣೆಯು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಫೊರೆನ್ಸಿಕ್ ದಾಖಲೆಗಳಿಂದ ಶಂಕಿತರ ಹೆಸರುಗಳು, ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಐಪಿ ವಿಳಾಸಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ."
  },
  {
    sceneId: 5,
    textEn: "Powered by Google Gemini, the AI Investigator assists officers with natural language legal queries, IPC and BNS section lookups, and Kannada search warrant generation.",
    textKn: "ಗೂಗಲ್ ಜೆಮಿನಿ ಬೆಂಬಲಿತ ಎಐ ತನಿಖಾ ಸಹಾಯಕವು ನೈಸರ್ಗಿಕ ಭಾಷೆಯ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳು, ಐಪಿಸಿ-ಬಿಎನ್‌ಎಸ್ ಕಾಯ್ದೆಗಳು ಮತ್ತು ಕನ್ನಡ ಸರ್ಚ್ ವಾರಂಟ್‌ಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ."
  },
  {
    sceneId: 6,
    textEn: "GIS Crime Hotspot Mapping visualizes crime density heatmaps across major Karnataka cities including Bengaluru, Mysuru, Mangaluru, Belagavi, and Hubballi.",
    textKn: "ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆಯು ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಗಳೂರು, ಬೆಳಗಾವಿ ಮತ್ತು ಹುಬ್ಬಳ್ಳಿಯ ಅಪರಾಧ ಸಾಂದ್ರತೆ ಮತ್ತು ಗಸ್ತು ಮಾರ್ಗಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ."
  },
  {
    sceneId: 7,
    textEn: "Criminal Nexus Graph analytics automatically uncover hidden networks, repeat offender linkages, and cross-district criminal syndicate operations.",
    textKn: "ಅಪರಾಧಿಗಳ ಜಾಲ ನಕ್ಷೆಯು ಶಂಕಿತರು ಮತ್ತು ಅಪರಾಧ ಗುಂಪುಗಳ ನಡುವಿನ ಗುಪ್ತ ಸಂಪರ್ಕಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆಹಚ್ಚುತ್ತದೆ."
  },
  {
    sceneId: 8,
    textEn: "Automated Reports and Analytics generate court-ready PDF briefs and master Excel datasets for senior police commanders and judicial submissions in seconds.",
    textKn: "ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು ನ್ಯಾಯಾಲಯದ ಸಲ್ಲಿಕೆಗೆ ಮತ್ತು ಹಿರಿಯ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ಅಗತ್ಯವಾದ ಪಿಡಿಎಫ್ ಮತ್ತು ಎಕ್ಸೆಲ್ ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳನ್ನು ತಕ್ಷಣವೇ ರಫ್ತು ಮಾಡುತ್ತವೆ."
  },
  {
    sceneId: 9,
    textEn: "Bank-Grade Role-Based Access Control enforces strict clearance levels for IOs, SHOs, and DSPs, protecting sensitive case intelligence across jurisdiction boundaries.",
    textKn: "ಬ್ಯಾಂಕ್ ಮಟ್ಟದ ಆರ್‌ಬಿಎಸಿ ಭದ್ರತೆಯು ತನಿಖಾಧಿಕಾರಿಗಳು ಮತ್ತು ಹಿರಿಯ ಅಧಿಕಾರಿಗಳಿಗೆ ಕಟ್ಟುನಿಟ್ಟಾದ ಹುದ್ದೆ ಆಧಾರಿತ ಪ್ರವೇಶ ನಿಯಂತ್ರಣವನ್ನು ಒದಗಿಸುತ್ತದೆ."
  },
  {
    sceneId: 10,
    textEn: "Together, Artificial Intelligence and the Karnataka State Police are building a safer Karnataka through proactive crime prevention and swift intelligence.",
    textKn: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಒಟ್ಟಾಗಿ ಅಪರಾಧ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಜಾಗರೂಕತೆಯ ಮೂಲಕ ಸುರಕ್ಷಿತ ಕರ್ನಾಟಕವನ್ನು ನಿರ್ಮಿಸುತ್ತಿವೆ."
  }
];

// Helper to synthesize single speech MP3 file
async function synthesizeSpeech(text, voiceConfig, outputPath) {
  const request = {
    input: { text },
    voice: voiceConfig,
    audioConfig: { 
      audioEncoding: 'MP3',
      speakingRate: 0.98,
      pitch: 0.0
    }
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  fs.writeFileSync(outputPath, response.audioContent, 'binary');
  console.log(`   ✓ Saved MP3: ${outputPath}`);
}

async function runTTSGeneration() {
  console.log(`\n🎙️ Starting Offline Google Cloud Text-to-Speech MP3 Generator...`);
  console.log(`----------------------------------------------------------------`);

  for (const scene of SCENE_NARRATIONS) {
    console.log(`\n🎬 Scene ${scene.sceneId} / 10 Processing:`);

    // 1. Synthesize English Audio
    const enFile = path.join(PUBLIC_AUDIO_EN_DIR, `scene_${scene.sceneId}.mp3`);
    console.log(`   [EN] Synthesizing: "${scene.textEn.slice(0, 40)}..."`);
    await synthesizeSpeech(scene.textEn, { languageCode: 'en-IN', name: 'en-IN-Neural2-B' }, enFile);

    // 2. Synthesize Kannada Audio
    const knFile = path.join(PUBLIC_AUDIO_KN_DIR, `scene_${scene.sceneId}.mp3`);
    console.log(`   [KN] Synthesizing: "${scene.textKn.slice(0, 40)}..."`);
    await synthesizeSpeech(scene.textKn, { languageCode: 'kn-IN', name: 'kn-IN-Standard-A' }, knFile);
  }

  console.log(`\n----------------------------------------------------------------`);
  console.log(`✅ SUCCESS: Generated 20 MP3 Narration Audio Files!`);
  console.log(`   - English MP3s saved in: webclient/public/audio/en/`);
  console.log(`   - Kannada MP3s saved in: webclient/public/audio/kn/`);
}

runTTSGeneration().catch(err => {
  console.error(`❌ TTS Generation Failed:`, err);
  process.exit(1);
});
