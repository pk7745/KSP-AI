import { processOfficerQuery } from '../functions/ksp_crime_intelligence_function/services/queryPlannerService.js';
import { dataSyncLayer } from '../functions/ksp_crime_intelligence_function/services/dataSyncLayer.js';

console.log('======================================================================');
console.log('KSP AI NATIVE KANNADA RAG CHATBOT — AUTOMATED VERIFICATION SUITE');
console.log('======================================================================');

async function runKannadaNativeVerification() {
  const sync = dataSyncLayer.syncAll();
  console.log(`\n📥 Data Layer Sync: ${sync.report.filesParsed} datasets, ${sync.report.totalRecords} records.`);

  // Test 1: Kannada Victim Lookup
  console.log('\n🇮🇳 [Test 1] Kannada Victim Lookup ("ಪ್ರಕರಣ KSP/DIS001/2026/00001 ನ ಸಂತ್ರಸ್ತ ಯಾರು?")...');
  const res1 = await processOfficerQuery({
    query: 'ಪ್ರಕರಣ KSP/DIS001/2026/00001 ನ ಸಂತ್ರಸ್ತ ಯಾರು? ಇತರ ಪ್ರಕರಣಗಳಲ್ಲಿ ಇದ್ದಾರಾ?',
    officerId: 'OFF001',
    sessionId: 'kn-1',
    language: 'kn'
  });
  const pass1 = res1.reply.includes('ಸಂತ್ರಸ್ತರ ವಿವರಗಳು') && res1.reply.includes('ಪಡೆದ ಮಾಹಿತಿ');
  console.log(`  - Kannada Victim Lookup Result: ${pass1 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 2: Kannada Accused Crime Pattern & Location
  console.log('\n🇮🇳 [Test 2] Kannada Accused Crime Pattern & Location ("ಆರೋಪಿಯ ಅಪರಾಧ ಶೈಲಿ ಮತ್ತು ಸ್ಥಳ")...');
  const res2 = await processOfficerQuery({
    query: 'ಆರೋಪಿ ರಮೇಶ್ ಅವರ ಅಪರಾಧ ಶೈಲಿ ಮತ್ತು ಮೂಲ ಸ್ಥಳ ಯಾವುದು?',
    officerId: 'OFF001',
    sessionId: 'kn-2',
    language: 'kn'
  });
  const pass2 = res2.reply.includes('ಆಪಾದಿತರ ಅಪರಾಧ ಶೈಲಿ') && res2.reply.includes('ಮೂಲ ಸ್ಥಳ');
  console.log(`  - Kannada Accused Pattern Result: ${pass2 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 3: Kannada New Case Possibilities
  console.log('\n🇮🇳 [Test 3] Kannada New Case Crime Possibilities ("ಹೊಸ ಪ್ರಕರಣದ ಅಪರಾಧ ಸಾಧ್ಯತೆಗಳು")...');
  const res3 = await processOfficerQuery({
    query: 'ಹೊಸ ಪ್ರಕರಣ: ರಾತ್ರಿ ಬೀಗ ಮುರಿದು ಚಿನ್ನ ಕಳವಾಗಿದೆ. ಅಪರಾಧ ಸಾಧ್ಯತೆಗಳನ್ನು ತಿಳಿಸಿ.',
    officerId: 'OFF001',
    sessionId: 'kn-3',
    language: 'kn'
  });
  const pass3 = res3.reply.includes('ನೂತನ ಪ್ರಕರಣದ ಅಪರಾಧ ಸಾಧ್ಯತೆಗಳು') && res3.reply.includes('ತನಿಖಾಧಿಕಾರಿಯ');
  console.log(`  - Kannada New Case Possibility Result: ${pass3 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 4: Kannada Small-Talk
  console.log('\n💬 [Test 4] Kannada Small-Talk ("ನಮಸ್ಕಾರ, ನಿನ್ನ ಹೆಸರೇನು?")...');
  const res4 = await processOfficerQuery({
    query: 'ನಮಸ್ಕಾರ, ನಿನ್ನ ಹೆಸರೇನು?',
    officerId: 'OFF001',
    sessionId: 'kn-4',
    language: 'kn'
  });
  const pass4 = res4.reply.includes('ಕೆ.ಎಸ್.ಪಿ ಎಐ ತನಿಖಾಧಿಕಾರಿ');
  console.log(`  - Kannada Small-Talk Result: ${pass4 ? 'PASSED ✅' : 'FAILED ❌'}`);

  if (pass1 && pass2 && pass3 && pass4) {
    console.log('\n======================================================================');
    console.log('🎉 NATIVE KANNADA RAG CHATBOT VERIFICATION PASSED 100%!');
    console.log('======================================================================');
  } else {
    console.error('❌ Native Kannada RAG Chatbot test suite failed!');
    process.exit(1);
  }
}

runKannadaNativeVerification();
