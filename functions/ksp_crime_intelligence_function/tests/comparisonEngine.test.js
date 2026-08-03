/**
 * Automated validation for the Enterprise Multi-Case Comparison Engine.
 * Zero external dependencies — run with:  node tests/comparisonEngine.test.js
 *
 * Covered acceptance scenarios:
 *   2 / 3 / 5-case comparison · Murder · Cyber Crime · Fraud · Vehicle Theft ·
 *   English · Kannada (100% pure) · Cross-district · RBAC · Large dataset (perf) ·
 *   Criminal-Nexus detection · 13-section completeness.
 */
import { compareMultipleCases, __internals } from '../services/multiCaseComparisonEngine.js';
import { renderMultiCaseReport } from '../services/multiCaseReport.js';
import { toPureKannada, hasLatinWord } from '../services/kannadaLexicon.js';
import { dataSyncLayer } from '../services/dataSyncLayer.js';

let passed = 0, failed = 0;
const fails = [];
function ok(name, cond, extra = '') {
  if (cond) { passed++; process.stdout.write('.'); }
  else { failed++; fails.push(`${name} ${extra}`); process.stdout.write('X'); }
}
function section(t) { process.stdout.write(`\n[${t}] `); }

// Build a pool of real case IDs grouped by crime type from the authorised CSVs.
dataSyncLayer.syncAll();
const CM = dataSyncLayer.getTable('CaseMaster');
const byMinor = (needle, n) =>
  CM.filter(c => (c.CrimeMinorHead || '').toLowerCase().includes(needle)).slice(0, n).map(c => c.CrimeNumber);
// Pick cases sharing one exact crime subtype (so "same crime type" is guaranteed).
const byExactMinor = (needle, n) => {
  const match = CM.find(c => (c.CrimeMinorHead || '').toLowerCase().includes(needle));
  if (!match) return [];
  return CM.filter(c => c.CrimeMinorHead === match.CrimeMinorHead).slice(0, n).map(c => c.CrimeNumber);
};
const firstIds = (n) => CM.slice(0, n).map(c => c.CrimeNumber);

const ADMIN = 'ADMIN001'; // statewide clearance

// A residual-latin auditor that ignores code spans, case numbers and statutory acronyms.
function kannadaLatinLeak(text) {
  const stripped = text
    .replace(/`[^`]*`/g, '')
    .replace(/KSP\/[A-Z0-9/]+/g, '')
    .replace(/\b(IPC|BNS|NDPS|POCSO|IT|Act|CDR|FSL|AFIS|ANPR|JIT|MCOCA|FASTag|BNSS|CrPC)\b/g, '');
  return stripped.split('\n').filter(l => hasLatinWord(l));
}

// ── 1. Structural completeness: 2/3/5 cases, English ──────────────────────
section('multi-count');
for (const n of [2, 3, 4, 5]) {
  const r = compareMultipleCases(firstIds(n), ADMIN);
  ok(`count-${n}-noerror`, r.error === false, JSON.stringify(r.message));
  ok(`count-${n}-compared`, r.comparedCount === n, `got ${r.comparedCount}`);
  ok(`count-${n}-14factors`, r.similarityBreakdown.length === 14, `got ${r.similarityBreakdown.length}`);
  ok(`count-${n}-score`, r.similarityScore >= 0 && r.similarityScore <= 99);
  // every case bundle must carry the full linked entity set (zero-omission)
  r.cases.forEach(c => {
    const keys = ['victims', 'accused', 'witnesses', 'evidence', 'medical', 'forensic',
      'phones', 'addresses', 'vehicles', 'weapons', 'associates', 'legalSections',
      'court', 'modusOperandi', 'officer', 'timeline', 'aiAnalysis', 'chargesheets',
      'arrests', 'complaints', 'activity'];
    ok(`count-${n}-bundle-${c.id}`, keys.every(k => k in c), `missing ${keys.filter(k => !(k in c))}`);
  });
  const txt = renderMultiCaseReport(r, { isKn: false });
  const headers = (txt.match(/^### /gm) || []).length;
  ok(`count-${n}-13sections`, headers >= 14, `headers=${headers}`); // title + 13 + follow-up
  for (let s = 1; s <= 13; s++) ok(`count-${n}-hasS${s}`, txt.includes(`${s}. `), '');
}

// ── 2. Crime-type scenarios ───────────────────────────────────────────────
section('crime-types');
for (const [label, needle] of [['murder', 'murder'], ['cyber', 'cyber'], ['fraud', 'fraud'], ['vehicle-theft', 'vehicle']]) {
  const ids = byExactMinor(needle, 3);
  ok(`${label}-have-ids`, ids.length >= 2, `found ${ids.length}`);
  if (ids.length >= 2) {
    const r = compareMultipleCases(ids, ADMIN);
    ok(`${label}-runs`, r.error === false);
    ok(`${label}-crimeType-identical`,
      r.similarityBreakdown.find(b => b.key === 'crimeType').status !== 'distinct',
      'same crime type should not be distinct');
  }
}

// ── 3. Kannada purity (English + Kannada equivalence) ─────────────────────
section('kannada');
{
  const ids = firstIds(5);
  const en = renderMultiCaseReport(compareMultipleCases(ids, ADMIN), { isKn: false });
  const kn = renderMultiCaseReport(compareMultipleCases(ids, ADMIN), { isKn: true });
  ok('kn-nonempty', kn.length > 500);
  ok('kn-has-kannada-script', /[ಀ-೿]/.test(kn));
  const leaks = kannadaLatinLeak(kn);
  ok('kn-no-latin-words', leaks.length === 0, `leaks: ${leaks.slice(0, 3).join(' | ')}`);
  // identical section count across languages (reasoning parity)
  ok('kn-section-parity',
    (en.match(/^### /gm) || []).length === (kn.match(/^### /gm) || []).length);
  ok('kn-lexicon-basic', toPureKannada('Murder') === 'ಕೊಲೆ');
}

// ── 4. Cross-district detection ───────────────────────────────────────────
section('cross-district');
{
  // pick cases from clearly different districts
  const d1 = CM.find(c => (c.District || '').includes('Bengaluru Urban'));
  const d2 = CM.find(c => (c.District || '').includes('Mysuru'));
  const d3 = CM.find(c => (c.District || '').includes('Belagavi'));
  const ids = [d1, d2, d3].filter(Boolean).map(c => c.CrimeNumber);
  const r = compareMultipleCases(ids, ADMIN);
  ok('xdist-runs', r.error === false, JSON.stringify(r.message));
  ok('xdist-flagged', r.patternAnalysis.crossDistrict === true, `districts=${r.patternAnalysis.districtCount}`);
}

// ── 5. RBAC before retrieval ──────────────────────────────────────────────
section('rbac');
{
  // A jurisdiction-limited officer (OFF001 => Bengaluru Urban) comparing an out-of-district case.
  const local = CM.find(c => (c.District || '').includes('Bengaluru Urban')).CrimeNumber;
  const remote = CM.find(c => (c.District || '') && !(c.District || '').includes('Bengaluru')).CrimeNumber;
  const r = compareMultipleCases([local, remote], 'OFF001');
  ok('rbac-blocks-remote',
    (r.rbacBlockedCases || []).length >= 1 || r.comparedCount < 2,
    `blocked=${(r.rbacBlockedCases || []).length} compared=${r.comparedCount}`);
  // statewide admin must NOT be blocked
  const r2 = compareMultipleCases([local, remote], ADMIN);
  ok('rbac-admin-allows', (r2.rbacBlockedCases || []).length === 0 && r2.comparedCount === 2);
}

// ── 6. Criminal-Nexus detection (fabricated bundles w/ shared entities) ────
section('nexus');
{
  const mk = (id, phone, name, plate) => ({
    id, caseRecord: { District: 'X', PoliceStation: 'P', CrimeMinorHead: 'Theft', CaseStatus: 'Under Investigation' },
    victims: [], witnesses: [{ WitnessName: name }],
    accused: [{ AccusedName: name, FingerprintID: 'FP-9', CriminalHistory: 'Yes (Repeat Offender)' }],
    evidence: [{ EvidenceType: 'Physical Weapon', EvidenceNumber: 'EV-SHARED', ForensicLab: 'FSL Bengaluru' }],
    forensic: [{ lab: 'FSL Bengaluru', report: 'FSL-1' }],
    medical: [{ injury: 'Fatal Injury' }],
    phones: [phone], addresses: ['12 MG Road'], vehicles: [plate],
    weapons: ['knife'], associates: [{ name, repeatOffender: true }], officer: { OfficerName: 'IO Rao' },
  });
  const a = mk('C1', '9998887777', 'raju gowda', 'KA-01-AB-1234');
  const b = mk('C2', '9998887777', 'raju gowda', 'KA-01-AB-1234');
  const nx = __internals.discoverSharedNexusEntities([a, b]);
  ok('nexus-phone', nx.sharedPhones.length === 1);
  ok('nexus-suspect', nx.sharedSuspects.length === 1);
  ok('nexus-vehicle', nx.sharedVehicles.length === 1);
  ok('nexus-address', nx.sharedAddresses.length === 1);
  ok('nexus-evidence', nx.sharedEvidence.length === 1);
  ok('nexus-hasNexus', nx.hasNexus === true && nx.linkCount >= 5);
  ok('nexus-explains', /9998887777/.test(nx.sharedPhones[0].explanation));
  // similarity should be high for near-identical bundles
  const sim = __internals.evaluateSimilarityMatrix([a, b]);
  ok('nexus-high-sim', sim.overallScore >= 60, `score=${sim.overallScore}`);
}

// ── 7. Extraction helpers ─────────────────────────────────────────────────
section('extractors');
ok('vehicle-plate', __internals.extractVehicles('fled on KA 05 MG 4321 towards ORR').includes('KA-05-MG-4321'));
ok('vehicle-keyword', __internals.extractVehicles('stolen motorcycle recovered').includes('motorcycle'));
ok('weapon-kw', __internals.extractWeapons('attacked with a sharp knife').includes('knife'));
ok('intersect', __internals.intersectAll([['a', 'b'], ['b', 'c']]).join() === 'b');

// ── 8. Large-dataset performance ──────────────────────────────────────────
section('performance');
{
  const t0 = Date.now();
  const ids = firstIds(5);
  for (let i = 0; i < 20; i++) compareMultipleCases(ids, ADMIN);
  const perCall = (Date.now() - t0) / 20;
  ok('perf-under-500ms', perCall < 500, `avg ${perCall.toFixed(1)}ms/call over 5500-row dataset`);
  console.log(`\n   ⏱  avg ${perCall.toFixed(1)} ms/comparison (5-case, ${CM.length} cases in store)`);
}

// ── Summary ───────────────────────────────────────────────────────────────
console.log(`\n\n==================== RESULT ====================`);
console.log(`PASSED: ${passed}   FAILED: ${failed}`);
if (failed) { console.log('\nFailures:'); fails.forEach(f => console.log('  ✗ ' + f)); process.exit(1); }
console.log('✓ All acceptance scenarios passed.');
process.exit(0);
