import { processOfficerQuery } from '../functions/ksp_crime_intelligence_function/services/queryPlannerService.js';
import { dataSyncLayer } from '../functions/ksp_crime_intelligence_function/services/dataSyncLayer.js';

console.log('======================================================================');
console.log('KSP AI DUAL-MODE CHATBOT ENGINE — AUTOMATED VERIFICATION SUITE');
console.log('======================================================================');

async function runDualModeVerification() {
  const sync = dataSyncLayer.syncAll();
  console.log(`\n📥 Data Layer Sync: ${sync.report.filesParsed} datasets, ${sync.report.totalRecords} records.`);

  // Test 1: Casual Greetings
  console.log('\n💬 [Test 1] Casual Greeting ("hello")...');
  const res1 = await processOfficerQuery({ query: 'hello', officerId: 'OFF001', sessionId: 'dual-1' });
  const pass1 = res1.intent === 'CASUAL_GREETING' && res1.reply.includes('Hello Officer');
  console.log(`  - Greeting Result: ${pass1 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 2: Casual How Are You
  console.log('\n💬 [Test 2] Casual Status ("how r u")...');
  const res2 = await processOfficerQuery({ query: 'how r u', officerId: 'OFF001', sessionId: 'dual-2' });
  const pass2 = res2.intent === 'CASUAL_HOW_ARE_YOU' && res2.reply.includes('doing great');
  console.log(`  - How Are You Result: ${pass2 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 3: Casual Name Query
  console.log('\n💬 [Test 3] Casual Name Query ("what is your name")...');
  const res3 = await processOfficerQuery({ query: 'what is your name', officerId: 'OFF001', sessionId: 'dual-3' });
  const pass3 = res3.intent === 'CASUAL_NAME' && res3.reply.includes('KSP AI Investigator');
  console.log(`  - Name Query Result: ${pass3 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 4: Police Victim Cross-Case Lookup
  console.log('\n👤 [Test 4] Police Case Question (Victim Cross-Case Lookup)...');
  const res4 = await processOfficerQuery({
    query: 'What is victim name in case KSP/DIS001/2026/00001? Is victim present in any other case?',
    officerId: 'OFF001',
    sessionId: 'dual-4'
  });
  const pass4 = res4.intent === 'VICTIM_LOOKUP' && res4.reply.includes('Victim Details');
  console.log(`  - Victim Lookup Result: ${pass4 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 5: Police Accused Pattern & Location
  console.log('\n🕵️ [Test 5] Police Case Question (Accused Crime Pattern & Location)...');
  const res5 = await processOfficerQuery({
    query: 'What is the accused pattern of crime? Which location is that accused from?',
    officerId: 'OFF001',
    sessionId: 'dual-5'
  });
  const pass5 = res5.intent === 'ACCUSED_PATTERN' && res5.reply.includes('Dominant Crime Pattern');
  console.log(`  - Accused Pattern Result: ${pass5 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 6: Kannada Small-Talk
  console.log('\n🇮🇳 [Test 6] Kannada Small-Talk ("ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ")...');
  const res6 = await processOfficerQuery({
    query: 'ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ',
    officerId: 'OFF001',
    sessionId: 'dual-6',
    language: 'kn'
  });
  const pass6 = res6.reply.includes('ನಮಸ್ಕಾರ') || res6.reply.includes('ಚೆನ್ನಾಗಿದ್ದೇನೆ');
  console.log(`  - Kannada Small-Talk Result: ${pass6 ? 'PASSED ✅' : 'FAILED ❌'}`);

  if (pass1 && pass2 && pass3 && pass4 && pass5 && pass6) {
    console.log('\n======================================================================');
    console.log('🎉 DUAL-MODE NATURAL CHATBOT VERIFICATION PASSED 100%!');
    console.log('======================================================================');
  } else {
    console.error('❌ Dual-Mode Chatbot test suite failed!');
    process.exit(1);
  }
}

runDualModeVerification();
