import { generateSpeech } from '../functions/ksp_crime_intelligence_function/services/speechService.js';

console.log('===============================================================');
console.log('KSP AI GOOGLE CLOUD TTS & KANNADA AUDIO VERIFICATION SUITE');
console.log('===============================================================');

async function testSpeech() {
  try {
    // 1. Test English Speech Generation
    console.log('\n🔊 Step 1: Testing English Speech Synthesis...');
    const enText = 'Welcome to Karnataka State Police AI Crime Intelligence Platform.';
    const enBuffer = await generateSpeech(enText, 'en');
    console.log(`  ✓ Generated English MP3 Speech Buffer: ${enBuffer.length} bytes`);

    // 2. Test Kannada Speech Generation
    console.log('\n🔊 Step 2: Testing Kannada Speech Synthesis (ಕನ್ನಡ ಧ್ವನಿ)...');
    const knText = 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ಪೋರ್ಟಲ್‌ಗೆ ಸ್ವಾಗತ.';
    const knBuffer = await generateSpeech(knText, 'kn');
    console.log(`  ✓ Generated Kannada MP3 Speech Buffer: ${knBuffer.length} bytes`);

    if (enBuffer.length > 0 && knBuffer.length > 0) {
      console.log('\n===============================================================');
      console.log('🎉 ALL GOOGLE TTS & KANNADA AUDIO TESTS PASSED 100%!');
      console.log('===============================================================');
    } else {
      console.error('❌ Speech buffer is empty!');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Speech synthesis test error:', err.message);
    process.exit(1);
  }
}

testSpeech();
