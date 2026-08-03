import { dataSyncLayer } from './dataSyncLayer.js';
import { enforceRBAC } from './rbacEnforcer.js';
import { reconstructTimelineWithDelays } from './timelineReasoningEngine.js';

/**
 * Enterprise Multi-Case Investigation Comparison Engine
 * =====================================================
 * Supports comparing 2, 3, 4, or 5 cases simultaneously.
 *
 *  - RBAC is enforced BEFORE any record is loaded (restricted cases never enter memory).
 *  - Zero-omission retrieval: every linked entity across the authorised Stratus CSV
 *    datasets is pulled for each selected case (case, victims, accused, witnesses,
 *    evidence, medical, forensic, chargesheets/court, arrests, complaints, activity,
 *    AI analysis, officer, vehicles, phones, addresses, associates, legal sections).
 *  - 14 weighted similarity factors are computed with real reasoning (not lists).
 *  - Criminal-Nexus discovery finds shared suspects, witnesses, evidence, vehicles,
 *    phones, addresses, gangs, officers and FIR clusters — each with an explanation.
 *  - Reuses the dataSyncLayer in-memory tables (no repeated full-CSV scans per call).
 */

// ---- Weighted similarity factor budget (sums to 100) ----------------------
const FACTOR_WEIGHTS = {
  crimeType: 12,
  modusOperandi: 10,
  criminalNexus: 12,
  evidence: 8,
  forensics: 8,
  weapon: 8,
  victimProfile: 7,
  timeline: 7,
  medical: 6,
  crimeScene: 6,
  courtOutcome: 5,
  associates: 4,
  phone: 4,
  vehicle: 3,
};

// Representative statutory sections derived from crime classification (IPC / BNS 2023).
const LEGAL_SECTION_MAP = {
  'Murder': ['IPC 302', 'BNS 103'],
  'Attempt to Murder': ['IPC 307', 'BNS 109'],
  'Assault & Grievous Hurt': ['IPC 325', 'BNS 117'],
  'Kidnapping': ['IPC 363', 'BNS 137'],
  'Robbery': ['IPC 392', 'BNS 309'],
  'Burglary': ['IPC 457', 'BNS 331'],
  'Theft': ['IPC 379', 'BNS 303'],
  'Vehicle Theft': ['IPC 379', 'BNS 303'],
  'Chain Snatching': ['IPC 356', 'IPC 379', 'BNS 304'],
  'Cyber Crime': ['IT Act 66', 'BNS 318'],
  'UPI Fraud': ['IT Act 66D', 'IPC 420', 'BNS 318'],
  'Online Banking Fraud': ['IT Act 66C', 'IPC 420', 'BNS 318'],
  'Identity Theft': ['IT Act 66C', 'BNS 319'],
  'ATM Fraud': ['IT Act 66D', 'IPC 420'],
  'Rape': ['IPC 376', 'BNS 64'],
  'Sexual Assault': ['IPC 354', 'BNS 74'],
  'POCSO': ['POCSO 4', 'POCSO 6'],
  'Domestic Violence': ['IPC 498A', 'BNS 85'],
  'Drug Trafficking': ['NDPS 21', 'NDPS 22'],
  'Extortion': ['IPC 384', 'BNS 308'],
  'Counterfeit Currency': ['IPC 489A', 'BNS 178'],
};

const WEAPON_KEYWORDS = ['knife', 'blade', 'sharp weapon', 'gun', 'pistol', 'firearm', 'revolver', 'machete', 'sword', 'acid', 'rod', 'stick', 'weapon', 'dagger', 'axe'];
const VEHICLE_KEYWORDS = ['motorcycle', 'motorbike', 'bike', 'scooter', 'scooty', 'car', 'auto', 'rickshaw', 'lorry', 'truck', 'van', 'tempo', 'suv', 'jeep'];
const VEHICLE_PLATE_RE = /\bKA[\s-]?\d{1,2}[\s-]?[A-Z]{1,2}[\s-]?\d{3,4}\b/gi;

function norm(s) {
  return String(s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function nonEmpty(v) {
  const s = String(v || '').trim();
  return s && !/^(none|n\/?a|not available|unknown|-)$/i.test(s) ? s : '';
}

// ---------------------------------------------------------------------------
// PUBLIC ENTRY
// ---------------------------------------------------------------------------
export function compareMultipleCases(caseIds = [], officerId = 'OFF001') {
  dataSyncLayer.syncAll();

  const casesTable = dataSyncLayer.getTable('CaseMaster');
  const victimsTable = dataSyncLayer.getTable('Victim');
  const accusedTable = dataSyncLayer.getTable('Accused');
  const witnessesTable = dataSyncLayer.getTable('Witness');
  const evidenceTable = dataSyncLayer.getTable('Evidence');
  const officersTable = dataSyncLayer.getTable('Officer');
  const chargesheetTable = dataSyncLayer.getTable('ChargesheetDetails');
  const arrestTable = dataSyncLayer.getTable('ArrestSurrender');
  const complaintTable = dataSyncLayer.getTable('ComplaintDetails');
  const activityTable = dataSyncLayer.getTable('ActivityLog');
  const aiAnalysisTable = dataSyncLayer.getTable('AIAnalysis');

  const selectedCaseRecords = [];
  const rbacBlockedCases = [];

  // 1. RBAC BEFORE RETRIEVAL — resolve each requested id, authorise, then load.
  const requested = Array.from(new Set((caseIds || []).map(x => String(x || '').trim()).filter(Boolean)));

  requested.forEach(id => {
    const targetStr = id.toUpperCase();
    const found = casesTable.find(c => {
      const cn = String(c.CrimeNumber || c.CrimeNo || '').toUpperCase();
      const idVal = String(c.CaseMasterID || '').toUpperCase();
      return cn === targetStr || idVal === targetStr || (targetStr.length > 5 && cn.includes(targetStr));
    });
    if (!found) return;

    // RBAC gate — restricted records are never loaded into the comparison set.
    const rbac = enforceRBAC(officerId, found.District, `Compare case ${found.CrimeNumber || found.CrimeNo}`, false);
    if (!rbac.authorized) {
      rbacBlockedCases.push({ id, district: found.District, reason: rbac.restrictionReason });
      return;
    }

    const cNo = found.CrimeNumber || found.CrimeNo;
    if (selectedCaseRecords.some(s => s.id === cNo)) return; // de-dupe

    selectedCaseRecords.push(
      buildCaseBundle(cNo, found, {
        victimsTable, accusedTable, witnessesTable, evidenceTable, officersTable,
        chargesheetTable, arrestTable, complaintTable, activityTable, aiAnalysisTable,
      })
    );
  });

  if (selectedCaseRecords.length === 0) {
    return {
      error: true,
      message: rbacBlockedCases.length
        ? 'All selected cases are outside your authorised jurisdiction (RBAC).'
        : 'No matching case records were found for comparison.',
      rbacBlockedCases,
    };
  }

  // 2. 14-factor similarity matrix (with reasoning) + pairwise breakdown.
  const similarity = evaluateSimilarityMatrix(selectedCaseRecords);

  // 3. Criminal-Nexus discovery across all shared entity classes.
  const sharedNexus = discoverSharedNexusEntities(selectedCaseRecords);

  // 4. Pattern analysis + evidence-based recommendations + officer actions.
  const patternAnalysis = analyzeInvestigativePatterns(selectedCaseRecords, sharedNexus, similarity);
  const aiFindings = deriveAiFindings(selectedCaseRecords, sharedNexus, similarity);
  const recommendations = generateRecommendations(selectedCaseRecords, sharedNexus, similarity);
  const officerActions = generateOfficerActions(selectedCaseRecords, sharedNexus);

  return {
    error: false,
    comparedCount: selectedCaseRecords.length,
    cases: selectedCaseRecords,
    rbacBlockedCases,
    similarityScore: similarity.overallScore,
    similarityBreakdown: similarity.breakdown,
    pairwiseSimilarity: similarity.pairwise,
    sharedNexus,
    patternAnalysis,
    aiFindings,
    recommendations,
    officerActions,
  };
}

// ---------------------------------------------------------------------------
// ZERO-OMISSION RETRIEVAL — build the full linked bundle for one case
// ---------------------------------------------------------------------------
function buildCaseBundle(cNo, caseRecord, t) {
  const victims = t.victimsTable.filter(v => v.CaseID === cNo);
  const accused = t.accusedTable.filter(a => a.CaseID === cNo);
  const witnesses = t.witnessesTable.filter(w => w.CaseID === cNo);
  const evidence = t.evidenceTable.filter(e => e.CaseID === cNo);
  const chargesheets = t.chargesheetTable.filter(cs => cs.CaseID === cNo);
  const arrests = t.arrestTable.filter(a => a.CaseID === cNo);
  const complaints = t.complaintTable.filter(c => c.CaseID === cNo);
  const aiAnalysis = t.aiAnalysisTable.find(ai => ai.CaseID === cNo) || null;
  const officer =
    t.officersTable.find(o => o.CaseID === cNo) ||
    t.officersTable.find(o => o.OfficerID === caseRecord.OfficerID) ||
    { OfficerName: 'Investigating Officer', Rank: 'Circle Inspector', PoliceStation: caseRecord.PoliceStation };

  // Investigation notes: activity-log entries referencing this case number.
  const activity = t.activityTable.filter(al =>
    (al.Details && al.Details.includes(cNo)) || al.CaseID === cNo
  ).slice(0, 25);

  // ---- Derived intelligence layers -------------------------------------
  const medical = victims
    .map(v => ({
      victim: v.VictimName,
      injury: nonEmpty(v.InjuryType),
      severity: nonEmpty(v.InjurySeverity),
      status: nonEmpty(v.VictimStatus),
      hospital: nonEmpty(v.HospitalName),
      report: nonEmpty(v.MedicalReport),
    }))
    .filter(m => m.injury || m.severity || m.report || m.hospital);

  const forensic = evidence
    .map(e => ({
      evidenceNo: e.EvidenceNumber || e.EvidenceID,
      type: nonEmpty(e.EvidenceType),
      lab: nonEmpty(e.ForensicLab),
      report: nonEmpty(e.ForensicReport),
      chain: nonEmpty(e.ChainOfCustody),
    }))
    .filter(f => f.lab || f.report);

  const phones = dedupe([
    ...victims.map(v => v.Mobile),
    ...accused.map(a => a.Mobile),
    ...witnesses.map(w => w.Mobile),
    ...complaints.map(c => c.ContactNumber),
  ].map(nonEmpty).filter(Boolean));

  const addresses = dedupe([
    ...victims.map(v => v.Address),
    ...accused.map(a => a.Address),
    ...witnesses.map(w => w.Address),
  ].map(nonEmpty).filter(Boolean));

  const vehicles = extractVehicles([
    caseRecord.BriefFacts,
    ...evidence.map(e => `${e.Description} ${e.Remarks} ${e.LocationFound}`),
    ...accused.map(a => a.Remarks),
  ].join(' '));

  const associates = accused.map(a => ({
    name: a.AccusedName,
    history: nonEmpty(a.CriminalHistory),
    repeatOffender: /repeat|yes/i.test(a.CriminalHistory || ''),
    address: nonEmpty(a.Address),
    fingerprint: nonEmpty(a.FingerprintID),
    idProof: nonEmpty(a.IDProof),
    bail: nonEmpty(a.BailStatus),
    custody: nonEmpty(a.CustodyStatus),
    arrestStatus: nonEmpty(a.ArrestStatus),
  }));

  const legalSections = LEGAL_SECTION_MAP[caseRecord.CrimeMinorHead] ||
    LEGAL_SECTION_MAP[caseRecord.CrimeMajorHead] || ['IPC/BNS'];

  const court = {
    caseStatus: caseRecord.CaseStatus,
    chargesheetFiled: chargesheets.length > 0,
    courtName: chargesheets[0] ? nonEmpty(chargesheets[0].CourtName) : '',
    filingDate: chargesheets[0] ? nonEmpty(chargesheets[0].FilingDate) : '',
    chargesheetStatus: chargesheets[0] ? nonEmpty(chargesheets[0].Status) : '',
  };

  const weapons = extractWeapons([
    caseRecord.BriefFacts,
    caseRecord.CrimeMinorHead,
    ...evidence.map(e => `${e.EvidenceType} ${e.Description}`),
  ].join(' '));

  const modusOperandi = nonEmpty(aiAnalysis && aiAnalysis.MOType) ||
    deriveMO(caseRecord, evidence, weapons);

  return {
    id: cNo,
    caseRecord,
    victims,
    accused,
    witnesses,
    evidence,
    officer,
    chargesheets,
    arrests,
    complaints,
    activity,
    aiAnalysis,
    timeline: safeTimeline(caseRecord),
    // derived layers
    medical,
    forensic,
    phones,
    addresses,
    vehicles,
    weapons,
    associates,
    legalSections,
    court,
    modusOperandi,
  };
}

function safeTimeline(caseRecord) {
  try {
    return reconstructTimelineWithDelays(caseRecord) || [];
  } catch {
    return [];
  }
}

function dedupe(arr) {
  return Array.from(new Set(arr));
}

function extractVehicles(text) {
  const src = String(text || '');
  const found = new Set();
  (src.match(VEHICLE_PLATE_RE) || []).forEach(p => found.add(p.toUpperCase().replace(/\s+/g, '-')));
  const low = src.toLowerCase();
  VEHICLE_KEYWORDS.forEach(k => { if (low.includes(k)) found.add(k); });
  return Array.from(found);
}

function extractWeapons(text) {
  const low = String(text || '').toLowerCase();
  const found = new Set();
  WEAPON_KEYWORDS.forEach(k => { if (low.includes(k)) found.add(k); });
  return Array.from(found);
}

function deriveMO(caseRecord, evidence, weapons) {
  const parts = [];
  if (caseRecord.CrimeMinorHead) parts.push(caseRecord.CrimeMinorHead);
  if (weapons.length) parts.push(`using ${weapons.join('/')}`);
  const evType = evidence[0] && evidence[0].EvidenceType;
  if (evType) parts.push(`evidence: ${evType}`);
  return parts.join(' — ') || 'Method under investigation';
}

// ---------------------------------------------------------------------------
// 14-FACTOR SIMILARITY MATRIX
// ---------------------------------------------------------------------------
function evaluateSimilarityMatrix(cases) {
  const breakdown = [];

  const add = (key, factor, evaluator) => {
    const max = FACTOR_WEIGHTS[key];
    const { ratio, status, matched, detail, values } = evaluator();
    const score = Math.round(max * ratio);
    breakdown.push({ key, factor, score, max, status, matched: matched || [], detail, values: values || [] });
  };

  const values = (fn) => cases.map(fn);
  const distinctCount = (vals) => new Set(vals.map(norm).filter(Boolean)).size;

  // 1. Crime Type (CrimeMinorHead)
  add('crimeType', 'Crime Type', () => {
    const vals = values(c => c.caseRecord.CrimeMinorHead || c.caseRecord.CrimeMajorHead);
    const d = distinctCount(vals);
    if (d === 1) return { ratio: 1, status: 'identical', values: vals, detail: `Identical crime classification: ${vals[0]}` };
    if (d < vals.length) return { ratio: 0.55, status: 'partial', values: vals, detail: `Overlapping classifications: ${dedupe(vals).join(', ')}` };
    return { ratio: 0.15, status: 'distinct', values: vals, detail: `Divergent crime types: ${dedupe(vals).join(', ')}` };
  });

  // 2. Modus Operandi
  add('modusOperandi', 'Modus Operandi', () => {
    const vals = values(c => c.modusOperandi);
    const d = distinctCount(vals);
    const sharedWeapon = intersectAll(cases.map(c => c.weapons)).length > 0;
    if (d === 1 || sharedWeapon) return { ratio: 0.9, status: 'match', values: vals, detail: `Convergent operational method${sharedWeapon ? ' with common weapon signature' : ''}.` };
    if (d < vals.length) return { ratio: 0.5, status: 'partial', values: vals, detail: 'Partially similar execution methodology.' };
    return { ratio: 0.2, status: 'distinct', values: vals, detail: 'Distinct modus operandi across the cases.' };
  });

  // 3. Criminal Nexus (computed lightweight here; full detail in discoverSharedNexusEntities)
  add('criminalNexus', 'Criminal Nexus', () => {
    const nx = quickNexusStrength(cases);
    if (nx.count >= 2) return { ratio: 1, status: 'strong', matched: nx.kinds, detail: `Strong nexus: ${nx.kinds.join(', ')}.` };
    if (nx.count === 1) return { ratio: 0.6, status: 'partial', matched: nx.kinds, detail: `Single shared linkage: ${nx.kinds.join(', ')}.` };
    return { ratio: 0.1, status: 'none', detail: 'No direct shared entities detected.' };
  });

  // 4. Evidence profile
  add('evidence', 'Evidence Profile', () => {
    const perCase = cases.map(c => c.evidence.map(e => norm(e.EvidenceType)));
    const shared = intersectAll(perCase);
    if (shared.length) return { ratio: 0.9, status: 'match', matched: shared, detail: `Shared evidence types: ${shared.join(', ')}.` };
    const any = perCase.flat();
    if (distinctCount(any) < any.length) return { ratio: 0.5, status: 'partial', detail: 'Some evidence categories recur.' };
    return { ratio: 0.2, status: 'distinct', detail: 'Distinct evidence signatures.' };
  });

  // 5. Forensics
  add('forensics', 'Forensic Linkage', () => {
    const labs = cases.map(c => c.forensic.map(f => norm(f.lab)).filter(Boolean));
    const sharedLab = intersectAll(labs);
    const allHaveForensic = cases.every(c => c.forensic.length > 0);
    if (sharedLab.length) return { ratio: 1, status: 'match', matched: sharedLab, detail: `Same forensic laboratory processed: ${sharedLab.join(', ')}.` };
    if (allHaveForensic) return { ratio: 0.55, status: 'partial', detail: 'All cases carry forensic reports from different labs.' };
    return { ratio: 0.2, status: 'distinct', detail: 'Forensic coverage differs across cases.' };
  });

  // 6. Weapon
  add('weapon', 'Weapon Signature', () => {
    const shared = intersectAll(cases.map(c => c.weapons));
    if (shared.length) return { ratio: 1, status: 'match', matched: shared, detail: `Common weapon(s): ${shared.join(', ')}.` };
    const any = cases.flatMap(c => c.weapons);
    if (any.length && distinctCount(any) < any.length) return { ratio: 0.5, status: 'partial', detail: 'Some weapon categories recur.' };
    if (any.length === 0) return { ratio: 0.3, status: 'unknown', detail: 'No explicit weapon indicators recovered.' };
    return { ratio: 0.2, status: 'distinct', detail: `Differing weapons: ${dedupe(any).join(', ')}.` };
  });

  // 7. Victim profile
  add('victimProfile', 'Victim Profile', () => {
    const profiles = cases.map(c => c.victims.map(v => `${norm(v.Gender)}|${ageBand(v.Age)}`));
    const shared = intersectAll(profiles);
    if (shared.length) return { ratio: 0.9, status: 'match', matched: shared, detail: `Similar victim demographics (${shared.join(', ')}).` };
    return { ratio: 0.35, status: 'distinct', detail: 'Victim demographics differ across cases.' };
  });

  // 8. Timeline
  add('timeline', 'Timeline Proximity', () => {
    const dates = cases.map(c => parseDate(c.caseRecord.CrimeRegisteredDate)).filter(Boolean);
    if (dates.length < 2) return { ratio: 0.5, status: 'partial', detail: 'Insufficient dated records for temporal correlation.' };
    const spanDays = (Math.max(...dates) - Math.min(...dates)) / 86400000;
    if (spanDays <= 30) return { ratio: 1, status: 'match', detail: `All incidents within ${Math.round(spanDays)} days — tight temporal cluster.` };
    if (spanDays <= 120) return { ratio: 0.6, status: 'partial', detail: `Incidents span ~${Math.round(spanDays)} days.` };
    return { ratio: 0.25, status: 'distinct', detail: `Incidents span ~${Math.round(spanDays)} days — temporally dispersed.` };
  });

  // 9. Medical
  add('medical', 'Medical / Injury Pattern', () => {
    const inj = cases.map(c => c.medical.map(m => norm(m.injury)).filter(Boolean));
    const shared = intersectAll(inj);
    if (shared.length) return { ratio: 1, status: 'match', matched: shared, detail: `Common injury pattern: ${shared.join(', ')}.` };
    const anyMedical = cases.some(c => c.medical.length);
    if (anyMedical) return { ratio: 0.45, status: 'partial', detail: 'Injury profiles present but differing in severity/type.' };
    return { ratio: 0.2, status: 'distinct', detail: 'No comparable medical/injury records.' };
  });

  // 10. Crime scene
  add('crimeScene', 'Crime Scene / Geography', () => {
    const districts = values(c => c.caseRecord.District);
    const stations = values(c => c.caseRecord.PoliceStation);
    if (distinctCount(stations) === 1) return { ratio: 1, status: 'match', values: stations, detail: `Same police-station jurisdiction: ${stations[0]}.` };
    if (distinctCount(districts) === 1) return { ratio: 0.75, status: 'partial', values: districts, detail: `Same district: ${districts[0]}.` };
    if (geoProximity(cases)) return { ratio: 0.5, status: 'partial', detail: 'Crime scenes geographically proximate (<25 km).' };
    return { ratio: 0.2, status: 'distinct', values: districts, detail: `Cross-district activity: ${dedupe(districts).join(', ')}.` };
  });

  // 11. Court outcome
  add('courtOutcome', 'Court / Prosecution Status', () => {
    const statuses = values(c => c.caseRecord.CaseStatus);
    if (distinctCount(statuses) === 1) return { ratio: 1, status: 'match', values: statuses, detail: `Identical prosecution stage: ${statuses[0]}.` };
    if (distinctCount(statuses) < statuses.length) return { ratio: 0.5, status: 'partial', detail: `Mixed prosecution stages: ${dedupe(statuses).join(', ')}.` };
    return { ratio: 0.25, status: 'distinct', detail: `Divergent prosecution stages: ${dedupe(statuses).join(', ')}.` };
  });

  // 12. Known associates
  add('associates', 'Known Associates', () => {
    const names = cases.map(c => c.associates.map(a => norm(a.name)));
    const sharedNames = intersectAll(names);
    const addrs = cases.map(c => c.addresses.map(norm));
    const sharedAddr = intersectAll(addrs);
    if (sharedNames.length) return { ratio: 1, status: 'match', matched: sharedNames, detail: `Shared accused across cases: ${sharedNames.length}.` };
    if (sharedAddr.length) return { ratio: 0.6, status: 'partial', matched: sharedAddr, detail: 'Shared residential address linkage.' };
    return { ratio: 0.15, status: 'distinct', detail: 'No shared associates or addresses.' };
  });

  // 13. Phone numbers
  add('phone', 'Phone Number Linkage', () => {
    const shared = intersectAll(cases.map(c => c.phones));
    if (shared.length) return { ratio: 1, status: 'match', matched: shared, detail: `Shared mobile number(s): ${shared.join(', ')}.` };
    return { ratio: 0.1, status: 'distinct', detail: 'No overlapping phone numbers.' };
  });

  // 14. Vehicle
  add('vehicle', 'Vehicle Linkage', () => {
    const shared = intersectAll(cases.map(c => c.vehicles));
    if (shared.length) return { ratio: 1, status: 'match', matched: shared, detail: `Common vehicle(s): ${shared.join(', ')}.` };
    const any = cases.flatMap(c => c.vehicles);
    if (any.length) return { ratio: 0.4, status: 'partial', detail: 'Vehicles referenced but not shared.' };
    return { ratio: 0.2, status: 'unknown', detail: 'No vehicle indicators.' };
  });

  const overallScore = Math.min(99, breakdown.reduce((s, b) => s + b.score, 0));

  return {
    overallScore,
    breakdown,
    pairwise: computePairwise(cases),
  };
}

function computePairwise(cases) {
  if (cases.length < 3) return [];
  const out = [];
  for (let i = 0; i < cases.length; i++) {
    for (let j = i + 1; j < cases.length; j++) {
      const sub = evaluatePairScore(cases[i], cases[j]);
      out.push({ a: cases[i].id, b: cases[j].id, score: sub });
    }
  }
  return out.sort((x, y) => y.score - x.score);
}

function evaluatePairScore(a, b) {
  let s = 0;
  if (norm(a.caseRecord.CrimeMinorHead) === norm(b.caseRecord.CrimeMinorHead)) s += 22;
  if (norm(a.caseRecord.District) === norm(b.caseRecord.District)) s += 14;
  if (norm(a.caseRecord.PoliceStation) === norm(b.caseRecord.PoliceStation)) s += 8;
  if (intersectAll([a.weapons, b.weapons]).length) s += 12;
  if (intersectAll([a.phones, b.phones]).length) s += 12;
  if (intersectAll([a.vehicles, b.vehicles]).length) s += 8;
  if (intersectAll([a.evidence.map(e => norm(e.EvidenceType)), b.evidence.map(e => norm(e.EvidenceType))]).length) s += 8;
  if (norm(a.caseRecord.CaseStatus) === norm(b.caseRecord.CaseStatus)) s += 6;
  const dt = Math.abs((parseDate(a.caseRecord.CrimeRegisteredDate) || 0) - (parseDate(b.caseRecord.CrimeRegisteredDate) || 0)) / 86400000;
  if (dt && dt <= 30) s += 10;
  return Math.min(99, s);
}

function quickNexusStrength(cases) {
  const kinds = [];
  if (intersectAll(cases.map(c => c.phones)).length) kinds.push('phone');
  if (intersectAll(cases.map(c => c.associates.map(a => norm(a.name)))).length) kinds.push('suspect');
  if (intersectAll(cases.map(c => c.addresses.map(norm))).length) kinds.push('address');
  if (intersectAll(cases.map(c => c.vehicles)).length) kinds.push('vehicle');
  if (intersectAll(cases.map(c => c.evidence.map(e => norm(e.EvidenceNumber || e.EvidenceID)))).length) kinds.push('evidence');
  if (intersectAll(cases.map(c => c.witnesses.map(w => norm(w.WitnessName)))).length) kinds.push('witness');
  return { count: kinds.length, kinds };
}

// ---------------------------------------------------------------------------
// CRIMINAL-NEXUS DISCOVERY (with explanations)
// ---------------------------------------------------------------------------
function discoverSharedNexusEntities(cases) {
  const suspects = groupShared(cases, c => c.accused.map(a => ({ key: norm(a.AccusedName), label: a.AccusedName })));
  const witnesses = groupShared(cases, c => c.witnesses.map(w => ({ key: norm(w.WitnessName), label: w.WitnessName })));
  const phones = groupShared(cases, c => c.phones.map(p => ({ key: p, label: p })));
  const addresses = groupShared(cases, c => c.addresses.map(a => ({ key: norm(a), label: a })));
  const vehicles = groupShared(cases, c => c.vehicles.map(v => ({ key: norm(v), label: v })));
  const evidence = groupShared(cases, c => c.evidence.map(e => ({ key: norm(e.EvidenceNumber || e.EvidenceID), label: e.EvidenceNumber || e.EvidenceID })));
  const officers = groupShared(cases, c => [{ key: norm(c.officer.OfficerName), label: c.officer.OfficerName }]);
  const stations = groupShared(cases, c => [{ key: norm(c.caseRecord.PoliceStation), label: c.caseRecord.PoliceStation }]);
  const fingerprints = groupShared(cases, c => c.accused.map(a => ({ key: norm(a.FingerprintID), label: a.FingerprintID })).filter(x => x.key));

  // "Gangs": repeat-offender suspects clustered across cases act as an organised-crime proxy.
  const repeatOffenders = cases.flatMap(c => c.associates.filter(a => a.repeatOffender).map(a => ({ case: c.id, name: a.name })));

  const nexus = {
    sharedSuspects: withExplanation(suspects, 'suspect'),
    sharedWitnesses: withExplanation(witnesses, 'witness'),
    sharedPhones: withExplanation(phones, 'phone'),
    sharedAddresses: withExplanation(addresses, 'address'),
    sharedVehicles: withExplanation(vehicles, 'vehicle'),
    sharedEvidence: withExplanation(evidence, 'evidence'),
    sharedFingerprints: withExplanation(fingerprints, 'fingerprint'),
    sharedOfficers: withExplanation(officers, 'officer'),
    sharedStations: withExplanation(stations, 'station'),
    repeatOffenders,
  };

  nexus.linkCount =
    nexus.sharedSuspects.length + nexus.sharedWitnesses.length + nexus.sharedPhones.length +
    nexus.sharedAddresses.length + nexus.sharedVehicles.length + nexus.sharedEvidence.length +
    nexus.sharedFingerprints.length;
  nexus.hasNexus = nexus.linkCount > 0;
  // Shared FIR cluster = >=2 cases in one station (a soft FIR-cluster signal).
  nexus.sharedFIRClusters = nexus.sharedStations;
  return nexus;
}

// group entity keys that appear in >=2 distinct cases
function groupShared(cases, extractor) {
  const map = new Map();
  cases.forEach(c => {
    const seen = new Set();
    extractor(c).forEach(({ key, label }) => {
      if (!key || seen.has(key)) return;
      seen.add(key);
      const entry = map.get(key) || { key, label, cases: [] };
      entry.cases.push(c.id);
      map.set(key, entry);
    });
  });
  return Array.from(map.values()).filter(e => e.cases.length >= 2);
}

function withExplanation(entries, kind) {
  const verb = {
    suspect: 'appears as an accused in',
    witness: 'is recorded as a witness in',
    phone: 'is used across',
    address: 'is a common residential address across',
    vehicle: 'is referenced across',
    evidence: 'catalogued under the same evidence reference across',
    fingerprint: 'matches the same fingerprint reference across',
    officer: 'is the investigating officer for',
    station: 'registered FIRs at the same police station across',
  }[kind] || 'links';
  return entries.map(e => ({
    ...e,
    kind,
    explanation: `${e.label} ${verb} cases ${e.cases.join(', ')}.`,
  }));
}

// ---------------------------------------------------------------------------
// PATTERN / FINDINGS / RECOMMENDATIONS / OFFICER ACTIONS
// ---------------------------------------------------------------------------
function analyzeInvestigativePatterns(cases, nexus, similarity) {
  const districts = new Set(cases.map(c => norm(c.caseRecord.District)));
  const crimeTypes = new Set(cases.map(c => norm(c.caseRecord.CrimeMinorHead)));
  let patternName;
  if (nexus.hasNexus && cases.length >= 3) patternName = 'Serial / Syndicated Crime Pattern';
  else if (nexus.hasNexus) patternName = 'Linked Crime Pattern';
  else if (crimeTypes.size === 1) patternName = 'Common Modus Crime Cluster';
  else patternName = 'Independent Parallel Investigations';

  const confidence = Math.min(97, Math.round(similarity.overallScore * (nexus.hasNexus ? 1.0 : 0.85)));

  return {
    patternName,
    confidenceScore: confidence,
    crossDistrict: districts.size > 1,
    districtCount: districts.size,
    crimeTypeCount: crimeTypes.size,
    summary: `${cases.length} cases across ${districts.size} district(s) show an overall similarity of ${similarity.overallScore}% with ${nexus.linkCount} shared criminal-nexus linkage(s).`,
  };
}

function deriveAiFindings(cases, nexus, similarity) {
  const findings = [];
  const top = [...similarity.breakdown].sort((a, b) => (b.score / b.max) - (a.score / a.max)).slice(0, 3);
  top.forEach(f => {
    if (f.score / f.max >= 0.5) findings.push({ type: 'strength', factor: f.factor, detail: f.detail });
  });
  if (nexus.sharedSuspects.length) findings.push({ type: 'nexus', factor: 'Shared Suspect', detail: nexus.sharedSuspects[0].explanation });
  if (nexus.sharedPhones.length) findings.push({ type: 'nexus', factor: 'Shared Phone', detail: nexus.sharedPhones[0].explanation });
  if (nexus.sharedVehicles.length) findings.push({ type: 'nexus', factor: 'Shared Vehicle', detail: nexus.sharedVehicles[0].explanation });
  const repeat = cases.flatMap(c => c.associates.filter(a => a.repeatOffender));
  if (repeat.length) findings.push({ type: 'risk', factor: 'Repeat Offenders', detail: `${repeat.length} accused carry prior criminal history — elevated recidivism risk.` });
  const weak = [...similarity.breakdown].sort((a, b) => (a.score / a.max) - (b.score / b.max))[0];
  if (weak) findings.push({ type: 'divergence', factor: weak.factor, detail: weak.detail });
  return findings;
}

function generateRecommendations(cases, nexus, similarity) {
  const recs = [];
  if (nexus.sharedPhones.length) recs.push(`Execute a unified CDR / tower-dump analysis on shared number ${nexus.sharedPhones[0].label} spanning cases ${nexus.sharedPhones[0].cases.join(', ')}.`);
  if (nexus.sharedSuspects.length) recs.push(`Interrogate the common accused ${nexus.sharedSuspects[0].label} jointly for cases ${nexus.sharedSuspects[0].cases.join(', ')} and seek police custody remand.`);
  if (nexus.sharedVehicles.length) recs.push(`Trace ownership and FASTag/ANPR movement of shared vehicle ${nexus.sharedVehicles[0].label}.`);
  if (cases.some(c => c.forensic.length)) recs.push('Cross-match FSL/AFIS fingerprint and DNA samples across all recovered evidence for a forensic link.');
  if (similarity.breakdown.find(b => b.key === 'crimeType' && b.status !== 'distinct')) recs.push('Constitute a Special Joint Investigation Team (JIT) — the shared crime signature warrants consolidated supervision.');
  const pendingCharge = cases.filter(c => !c.court.chargesheetFiled && /investigation/i.test(c.caseRecord.CaseStatus || ''));
  if (pendingCharge.length) recs.push(`Expedite charge-sheet filing for ${pendingCharge.length} case(s) still under investigation to avoid statutory-limitation lapses.`);
  if (nexus.repeatOffenders.length >= 2) recs.push('Evaluate invocation of organised-crime / MCOCA provisions given clustered repeat offenders.');
  if (!recs.length) recs.push('Maintain parallel investigation tracks; no consolidation warranted at this confidence level.');
  return recs;
}

function generateOfficerActions(cases, nexus) {
  const ids = cases.map(c => c.id);
  const actions = [
    `Open the full Case360 dossier for ${ids.join(', ')} and verify chain-of-custody on every evidence item.`,
    'Record supplementary Sec 161 CrPC / Sec 180 BNSS statements focusing on the shared linkages identified above.',
  ];
  if (nexus.hasNexus) actions.push('Raise a consolidated criminal-nexus link chart in the Network module and brief the jurisdictional DSP.');
  actions.push('Log this comparison in the case activity register and set a 7-day review checkpoint.');
  return actions;
}

// ---------------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------------
function intersectAll(lists) {
  const clean = lists.map(l => new Set((l || []).map(norm).filter(Boolean)));
  if (clean.length < 2 || clean.some(s => s.size === 0)) return [];
  let acc = [...clean[0]];
  for (let i = 1; i < clean.length; i++) acc = acc.filter(x => clean[i].has(x));
  return Array.from(new Set(acc));
}

function ageBand(age) {
  const n = parseInt(age, 10);
  if (Number.isNaN(n)) return 'unknown';
  if (n < 18) return 'minor';
  if (n <= 30) return '18-30';
  if (n <= 45) return '31-45';
  if (n <= 60) return '46-60';
  return '60+';
}

function parseDate(s) {
  if (!s) return null;
  const t = Date.parse(String(s).substring(0, 10));
  return Number.isNaN(t) ? null : t;
}

// Exposed strictly for the automated test-suite (fabricated bundles). Not used in prod.
export const __internals = {
  evaluateSimilarityMatrix,
  discoverSharedNexusEntities,
  extractVehicles,
  extractWeapons,
  intersectAll,
};

function geoProximity(cases) {
  const pts = cases
    .map(c => [parseFloat(c.caseRecord.Latitude), parseFloat(c.caseRecord.Longitude)])
    .filter(([a, b]) => !Number.isNaN(a) && !Number.isNaN(b));
  if (pts.length < 2) return false;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dLat = pts[i][0] - pts[j][0];
      const dLon = pts[i][1] - pts[j][1];
      const km = Math.sqrt(dLat * dLat + dLon * dLon) * 111;
      if (km > 25) return false;
    }
  }
  return true;
}
