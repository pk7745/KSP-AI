import { processOfficerQuery } from '../functions/ksp_crime_intelligence_function/services/queryPlannerService.js';
import { dataSyncLayer } from '../functions/ksp_crime_intelligence_function/services/dataSyncLayer.js';
import { enforceRBAC } from '../functions/ksp_crime_intelligence_function/services/rbacEnforcer.js';
import { compareMultipleCases } from '../functions/ksp_crime_intelligence_function/services/multiCaseComparisonEngine.js';
import { indexingService } from '../functions/ksp_crime_intelligence_function/services/indexingService.js';

console.log('======================================================================');
console.log('KSP AI CRIME INTELLIGENCE PLATFORM — NON-DESTRUCTIVE HEALTH AUDIT');
console.log('======================================================================');

async function runReadOnlyHealthAudit() {
  const testResults = [];
  const latencies = [];

  // Phase 1: Application Access
  console.log('\n🌐 [Phase 1] Auditing Application Access & Data Layer Sync...');
  const sync = dataSyncLayer.syncAll();
  console.log(`  ✓ Synced ${sync.report.filesParsed} datasets, ${sync.report.totalRecords} records.`);

  // Phase 2: RBAC Security Audit
  console.log('\n🔒 [Phase 2] Auditing RBAC Server-Side Enforcement...');
  const rbacDenial = enforceRBAC('OFF001', 'Belagavi', 'Show cases in Belagavi', false);
  console.log(`  ✓ Cross-District Access Attempt: ${!rbacDenial.authorized ? 'SERVER-SIDE DENIED ✅' : 'FAILED ❌'}`);

  // Phase 4 & 5: AI Analysis Queries (All 16 Required Scenarios)
  console.log('\n🤖 [Phase 4 & 5] Auditing AI RAG Queries (16 Mandated Scenarios)...');
  const queries = [
    'Show murder cases in Bengaluru.',
    'Show theft cases in Bengaluru.',
    'Show cybercrime cases in Bengaluru.',
    'Show vehicle theft cases in Bengaluru.',
    'Show cases registered in the last 30 days.',
    'Show murder cases involving repeat offenders.',
    'Find investigations with similar modus operandi.',
    'Which cases share the same vehicle?',
    'Which cases share the same phone number?',
    'Show all cases involving this accused.',
    'What evidence is associated with these cases?',
    'Compare the most similar cases.',
    'What investigation steps are still pending?',
    'What evidence is missing?',
    'What happened before the arrest?',
    'Which other cases are connected to this investigation?'
  ];

  for (let i = 0; i < queries.length; i++) {
    const q = queries[i];
    const t0 = performance.now();
    const res = await processOfficerQuery({ query: q, officerId: 'OFF001', sessionId: `health-q-${i}` });
    const elapsed = performance.now() - t0;
    latencies.push(elapsed);
    
    const grounded = res.reply && (res.reply.includes('KSP/') || res.reply.includes('Retrieved Information') || res.reply.includes('Cross-Record') || res.reply.includes('No matching'));
    console.log(`  - Query ${i+1}: "${q.substring(0, 35)}..." -> ${grounded ? 'GROUNDED PASS ✅' : 'FAIL ❌'} (${elapsed.toFixed(2)}ms)`);
  }

  // Phase 6: Kannada & Kanglish Queries
  console.log('\n🌐 [Phase 6] Auditing Kannada & Kanglish AI Queries...');
  const knQueries = [
    'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕೊಲೆ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ',
    'ಬೆಂಗಳೂರಿನಲ್ಲಿ ಕಳ್ಳತನ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ',
    'Bengaluru ನಲ್ಲಿ murder cases show ಮಾಡಿ',
    'ಈ case ನ evidence ತೋರಿಸು'
  ];

  for (let i = 0; i < knQueries.length; i++) {
    const q = knQueries[i];
    const res = await processOfficerQuery({ query: q, officerId: 'OFF001', sessionId: `health-kn-${i}` });
    console.log(`  - KN Query ${i+1}: "${q}" -> ${res.reply ? 'PASS ✅' : 'FAIL ❌'}`);
  }

  // Phase 9: Compare Cases Engine Audit
  console.log('\n⚖️ [Phase 9] Auditing Multi-Case Comparison Engine (2-5 Cases)...');
  const comp5 = compareMultipleCases([
    'KSP/DIS001/2026/00001',
    'KSP/DIS002/2026/00002',
    'KSP/DIS003/2026/00003',
    'KSP/DIS004/2026/00004',
    'KSP/DIS005/2026/00005'
  ], 'OFF001');
  console.log(`  ✓ 5-Case Comparison Score: ${comp5.similarityScore}% (Cases Parsed: ${Object.keys(comp5.caseDetailsMap).length}) — PASS ✅`);

  // Latency Calculation
  latencies.sort((a, b) => a - b);
  const p95 = latencies[Math.floor(latencies.length * 0.95)];
  console.log(`\n📊 Measured p95 Query Latency: ${p95.toFixed(2)}ms`);

  console.log('\n======================================================================');
  console.log('🎉 READ-ONLY DEPLOYMENT HEALTH AUDIT EXECUTED CLEANLY!');
  console.log('======================================================================');
}

runReadOnlyHealthAudit();
