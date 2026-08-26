import { processOfficerQuery } from '../functions/ksp_crime_intelligence_function/services/queryPlannerService.js';
import { dataSyncLayer } from '../functions/ksp_crime_intelligence_function/services/dataSyncLayer.js';

console.log('======================================================================');
console.log('KSP AI RAG CHATBOT ENGINE — AUTOMATED INVESTIGATIVE TEST SUITE');
console.log('======================================================================');

async function runRAGChatbotVerification() {
  const sync = dataSyncLayer.syncAll();
  console.log(`\n📥 Data Layer Sync: ${sync.report.filesParsed} datasets, ${sync.report.totalRecords} records.`);

  // Test 1: Victim Cross-Case Lookup
  console.log('\n👤 [Test 1] Victim Cross-Case Occurrence Lookup...');
  const res1 = await processOfficerQuery({
    query: 'What is victim name in case KSP/DIS001/2026/00001? Is victim present in any other case?',
    officerId: 'OFF001',
    sessionId: 'test-rag-1'
  });
  const pass1 = res1.reply && res1.reply.includes('Victim Details') && res1.reply.includes('KSP/DIS001/2026/00001');
  console.log(`  - Victim Lookup Result: ${pass1 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 2: Accused Crime Pattern & Dominant Offense Analysis
  console.log('\n🕵️ [Test 2] Accused Crime Pattern & Most Frequent Crime...');
  const res2 = await processOfficerQuery({
    query: 'What is the accused pattern of crime? What kind of crime has that accused done more?',
    officerId: 'OFF001',
    sessionId: 'test-rag-2'
  });
  const pass2 = res2.reply && res2.reply.includes('Dominant Crime Pattern') && res2.reply.includes('Accused Name');
  console.log(`  - Accused Pattern Result: ${pass2 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 3: Accused Location & Address Lookup
  console.log('\n📌 [Test 3] Accused Native Location & Address Lookup...');
  const res3 = await processOfficerQuery({
    query: 'Which location is that accused from?',
    officerId: 'OFF001',
    sessionId: 'test-rag-3'
  });
  const pass3 = res3.reply && res3.reply.includes('Native Location & Address');
  console.log(`  - Location Lookup Result: ${pass3 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 4: New Case Possibility & MO Matching Analysis
  console.log('\n🔮 [Test 4] New Case Possibility & Modus Operandi Matching...');
  const res4 = await processOfficerQuery({
    query: 'Analyze crime possibilities for a new case: A house lock was broken at night and gold stolen from cupboard...',
    officerId: 'OFF001',
    sessionId: 'test-rag-4'
  });
  const pass4 = res4.reply && res4.reply.includes('New Case Crime Possibility Analysis') && res4.reply.includes('IPC / BNS Sections');
  console.log(`  - New Case Possibility Result: ${pass4 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // Test 5: Kannada Language Native Querying
  console.log('\n🇮🇳 [Test 5] Kannada Native Language RAG Querying...');
  const res5 = await processOfficerQuery({
    query: 'ಆರೋಪಿಯ ಅಪರಾಧ ಶೈಲಿ ಮತ್ತು ಮುಖ್ಯ ಅಪರಾಧ ಯಾವುದು?',
    officerId: 'OFF001',
    sessionId: 'test-rag-5',
    language: 'kn'
  });
  const pass5 = res5.reply && res5.reply.includes('ಆಪಾದಿತರ ಅಪರಾಧ ಶೈಲಿ');
  console.log(`  - Kannada RAG Result: ${pass5 ? 'PASSED ✅' : 'FAILED ❌'}`);

  if (pass1 && pass2 && pass3 && pass4 && pass5) {
    console.log('\n======================================================================');
    console.log('🎉 ALL RAG CHATBOT ENGINE INVESTIGATIVE TESTS PASSED 100%!');
    console.log('======================================================================');
  } else {
    console.error('❌ RAG Chatbot test suite failed!');
    process.exit(1);
  }
}

runRAGChatbotVerification();
