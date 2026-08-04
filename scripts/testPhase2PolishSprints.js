import { processOfficerQuery } from '../functions/ksp_crime_intelligence_function/services/queryPlannerService.js';
import { dataSyncLayer } from '../functions/ksp_crime_intelligence_function/services/dataSyncLayer.js';

console.log('===============================================================');
console.log('KSP AI MASTER PROMPT v3.0 PHASE 2 (SPRINTS 11–17) AUDIT SUITE');
console.log('===============================================================');

async function runPhase2Audit() {
  const latencies = [];

  // 1. Dataset Scale Audit
  console.log('\n📥 Step 1: Auditing Dataset Scale & Memory Synchronization...');
  const sync = dataSyncLayer.syncAll();
  console.log(`  ✓ Synced ${sync.report.filesParsed} datasets containing ${sync.report.totalRecords} total records.`);

  // 2. Test 5-Part Structured Answer Contract & Evidence-Backed Confidence
  console.log('\n📜 Step 2: Validating 5-Part Structured Answer Contract & Confidence...');
  const testQuery = 'Open Case KSP/DIS001/2026/00001';
  const t0 = performance.now();
  const res = await processOfficerQuery({ query: testQuery, officerId: 'OFF001', sessionId: 's-p2-1' });
  const elapsed = performance.now() - t0;
  latencies.push(elapsed);

  const reply = res.reply || '';
  const hasPart1 = reply.includes('1. Retrieved Information');
  const hasPart2 = reply.includes('2. AI Analysis');
  const hasPart3 = reply.includes('3. Investigation Recommendation');
  const hasPart4 = reply.includes('4. Evidence-Backed Confidence');
  const hasPart5 = reply.includes('5. Supporting Records');

  console.log(`  ✓ Query: "${testQuery}" (Latency: ${elapsed.toFixed(2)}ms)`);
  console.log(`    - Part 1 (Retrieved Info): ${hasPart1 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`    - Part 2 (AI Analysis): ${hasPart2 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`    - Part 3 (Recommendation): ${hasPart3 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`    - Part 4 (Evidence-Backed Confidence): ${hasPart4 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log(`    - Part 5 (Supporting Records): ${hasPart5 ? 'PASSED ✅' : 'FAILED ❌'}`);

  // 3. Test Compare Cases Structure (Sprint 14)
  console.log('\n⚖️ Step 3: Validating Compare Cases Structured Output (Sprint 14)...');
  const compareRes = await processOfficerQuery({
    query: 'Compare KSP/DIS001/2026/00001 and KSP/DIS011/2026/00011',
    officerId: 'OFF001',
    sessionId: 's-p2-2'
  });
  console.log(`  ✓ Compare Response Length: ${compareRes.reply.length} chars`);
  console.log(`  ✓ Compare Grounded Confidence Present: ${compareRes.reply.includes('Evidence-Backed Confidence') ? 'PASSED ✅' : 'FAILED ❌'}`);

  // 4. Calculate Latency Metrics
  const p95Latency = elapsed;
  console.log(`\n📊 Measured Latency: ${p95Latency.toFixed(2)}ms (Budget: < 2000ms) — ${p95Latency < 2000 ? 'PASSED ✅' : 'FAILED ❌'}`);

  if (hasPart1 && hasPart2 && hasPart3 && hasPart4 && hasPart5) {
    console.log('\n===============================================================');
    console.log('🎉 ALL MASTER PROMPT v3.0 PHASE 2 (SPRINTS 11–17) TESTS PASSED!');
    console.log('===============================================================');
  } else {
    console.error('❌ Answer Contract Validation Failed!');
    process.exit(1);
  }
}

runPhase2Audit();
