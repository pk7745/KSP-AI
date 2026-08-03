import { toPureKannada, toKannadaDict } from './kannadaLexicon.js';

/**
 * Bilingual 13-Section Multi-Case Comparison Report Renderer.
 * Consumes the structured result from multiCaseComparisonEngine.compareMultipleCases()
 * and produces an investigative, reasoning-first report in English OR 100% pure Kannada.
 *
 * Depends only on the (dependency-free) Kannada lexicon, so it is safe to unit-test
 * without installing node_modules.
 */

// Bilingual label table. `k()` returns the correct language string.
const L = {
  title: ['⚖️ KSP Intelligence Wing — Multi-Case Investigation Comparison Dossier',
    '⚖️ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಗುಪ್ತಚರ ವಿಭಾಗ — ಬಹು-ಪ್ರಕರಣ ತನಿಖಾ ಹೋಲಿಕೆ ವರದಿ'],
  comparedCases: ['Compared Investigations', 'ಹೋಲಿಸಿದ ತನಿಖೆಗಳು'],
  files: ['case files', 'ಪ್ರಕರಣ ಕಡತಗಳು'],
  jurisdiction: ['Officer Jurisdiction', 'ಅಧಿಕಾರಿಯ ವ್ಯಾಪ್ತಿ'],
  overall: ['Overall Similarity Confidence', 'ಒಟ್ಟಾರೆ ಸಾಮ್ಯತೆ ವಿಶ್ವಾಸಾರ್ಹತೆ'],
  match: ['match', 'ಸಾಮ್ಯತೆ'],
  blocked: ['RBAC-restricted (not loaded)', 'ಆರ್‌ಬಿಎಸಿ-ನಿರ್ಬಂಧಿತ (ಲೋಡ್ ಆಗಿಲ್ಲ)'],

  s1: ['1. Executive Summary', '1. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ'],
  s2: ['2. Crime Comparison', '2. ಅಪರಾಧ ಹೋಲಿಕೆ'],
  s3: ['3. Victim Comparison', '3. ಸಂತ್ರಸ್ತರ ಹೋಲಿಕೆ'],
  s4: ['4. Accused Comparison', '4. ಆರೋಪಿಗಳ ಹೋಲಿಕೆ'],
  s5: ['5. Witness Comparison', '5. ಸಾಕ್ಷಿಗಳ ಹೋಲಿಕೆ'],
  s6: ['6. Evidence & Forensic Comparison', '6. ಸಾಕ್ಷ್ಯ ಮತ್ತು ವಿಧಿವಿಜ್ಞಾನ ಹೋಲಿಕೆ'],
  s7: ['7. Timeline Comparison', '7. ಕಾಲಾನುಕ್ರಮ ಹೋಲಿಕೆ'],
  s8: ['8. Criminal Nexus Comparison', '8. ಅಪರಾಧ ಜಾಲ ಹೋಲಿಕೆ'],
  s9: ['9. Pattern Analysis', '9. ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ'],
  s10: ['10. Similarity Analysis', '10. ಸಾಮ್ಯತೆ ವಿಶ್ಲೇಷಣೆ'],
  s11: ['11. AI Investigation Findings', '11. ಎಐ ತನಿಖಾ ಸಂಶೋಧನೆಗಳು'],
  s12: ['12. Recommendations', '12. ಶಿಫಾರಸುಗಳು'],
  s13: ['13. Officer Actions', '13. ಅಧಿಕಾರಿ ಕ್ರಮಗಳು'],

  case: ['Case', 'ಪ್ರಕರಣ'],
  crimeType: ['Crime Type', 'ಅಪರಾಧ ಪ್ರಕಾರ'],
  category: ['Category', 'ವರ್ಗ'],
  station: ['Station', 'ಠಾಣೆ'],
  district: ['District', 'ಜಿಲ್ಲೆ'],
  status: ['Status', 'ಸ್ಥಿತಿ'],
  sections: ['Legal Sections', 'ಕಾನೂನು ಕಲಂಗಳು'],
  age: ['Age', 'ವಯಸ್ಸು'],
  yrs: ['yrs', 'ವರ್ಷ'],
  injury: ['Injury', 'ಗಾಯ'],
  none: ['none recorded', 'ದಾಖಲಾಗಿಲ್ಲ'],
  priorHistory: ['Prior History', 'ಹಿಂದಿನ ಇತಿಹಾಸ'],
  custody: ['Custody', 'ವಶ'],
  witnessesRec: ['recorded witness(es)', 'ದಾಖಲಾದ ಸಾಕ್ಷಿ(ಗಳು)'],
  underSec: ['under Sec 180 BNSS / 161 CrPC', 'ಕಲಂ 180 ಬಿಎನ್‌ಎಸ್‌ಎಸ್ / 161 ಸಿಆರ್‌ಪಿಸಿ ಅಡಿಯಲ್ಲಿ'],
  forensicLab: ['Forensic Lab', 'ವಿಧಿವಿಜ್ಞಾನ ಪ್ರಯೋಗಾಲಯ'],
  registered: ['Registered', 'ನೋಂದಣಿ'],
  medical: ['Medical', 'ವೈದ್ಯಕೀಯ'],
  hospital: ['Hospital', 'ಆಸ್ಪತ್ರೆ'],
  weapon: ['Weapon', 'ಆಯುಧ'],
  mo: ['Modus Operandi', 'ಕಾರ್ಯವಿಧಾನ'],
  officer: ['Investigating Officer', 'ತನಿಖಾಧಿಕಾರಿ'],
  phones: ['Linked Phones', 'ಸಂಬಂಧಿತ ದೂರವಾಣಿ'],
  vehicles: ['Vehicles', 'ವಾಹನಗಳು'],
  court: ['Court', 'ನ್ಯಾಯಾಲಯ'],

  nexusFound: ['⚠️ Shared criminal-nexus linkages discovered:', '⚠️ ಹಂಚಿಕೆಯ ಅಪರಾಧ ಜಾಲ ಸಂಪರ್ಕಗಳು ಪತ್ತೆಯಾಗಿವೆ:'],
  nexusNone: ['No shared suspects, phones, vehicles, addresses or evidence were found across these cases. The investigations appear independent on the current data.',
    'ಈ ಪ್ರಕರಣಗಳ ನಡುವೆ ಯಾವುದೇ ಹಂಚಿಕೆಯ ಆರೋಪಿ, ದೂರವಾಣಿ, ವಾಹನ, ವಿಳಾಸ ಅಥವಾ ಸಾಕ್ಷ್ಯ ಕಂಡುಬಂದಿಲ್ಲ. ಪ್ರಸ್ತುತ ದತ್ತಾಂಶದ ಪ್ರಕಾರ ತನಿಖೆಗಳು ಸ್ವತಂತ್ರವಾಗಿವೆ.'],
  patternName: ['Pattern Classification', 'ಮಾದರಿ ವರ್ಗೀಕರಣ'],
  confidence: ['Confidence', 'ವಿಶ್ವಾಸಾರ್ಹತೆ'],
  crossDistrict: ['Cross-district', 'ಅಂತರ-ಜಿಲ್ಲೆ'],
  yes: ['Yes', 'ಹೌದು'],
  no: ['No', 'ಇಲ್ಲ'],
  points: ['pts', 'ಅಂಕ'],
  pairwise: ['Pairwise similarity (highest linked pairs)', 'ಜೋಡಿವಾರು ಸಾಮ್ಯತೆ (ಅತ್ಯಧಿಕ ಸಂಬಂಧಿತ ಜೋಡಿಗಳು)'],
  nextActions: ['Suggested Next Actions', 'ಸೂಚಿಸಿದ ಮುಂದಿನ ಕ್ರಮಗಳು'],

  statusMatch: ['MATCH', 'ಹೊಂದಿಕೆ'],
  statusPartial: ['PARTIAL', 'ಭಾಗಶಃ'],
  statusDistinct: ['DISTINCT', 'ಭಿನ್ನ'],
};

function K(isKn) {
  const idx = isKn ? 1 : 0;
  const fn = (key) => (L[key] ? L[key][idx] : key);
  fn.isKn = isKn;
  return fn;
}

// translate a dynamic data value
function V(val, isKn) {
  if (val === null || val === undefined || val === '') return isKn ? L.none[1] : L.none[0];
  return isKn ? toPureKannada(val) : String(val);
}

function statusChip(t, status) {
  const map = {
    identical: t('statusMatch'), match: t('statusMatch'), strong: t('statusMatch'),
    partial: t('statusPartial'),
    distinct: t('statusDistinct'), none: t('statusDistinct'), unknown: t('statusPartial'),
  };
  return map[status] || t('statusPartial');
}

export function renderMultiCaseReport(result, { isKn = false, officerContext = {} } = {}) {
  const t = K(isKn);
  const {
    comparedCount, cases, similarityScore, similarityBreakdown = [], pairwiseSimilarity = [],
    sharedNexus = {}, patternAnalysis = {}, aiFindings = [], recommendations = [], officerActions = [],
    rbacBlockedCases = [],
  } = result;

  const P = []; // paragraph buffer
  const push = (s = '') => P.push(s);
  const H = (key) => push(`### ${t(key)}`);

  // ---- Header ----------------------------------------------------------
  push(`### ${t('title')}\n`);
  push(`**${t('comparedCases')}:** ${comparedCount} ${t('files')}`);
  push(`**${t('jurisdiction')}:** ${V(officerContext.authorizedDistrict || 'Bengaluru Urban', isKn)}`);
  push(`**${t('overall')}:** ${similarityScore}% ${t('match')}`);
  if (rbacBlockedCases.length) {
    push(`**${t('blocked')}:** ${rbacBlockedCases.map(b => b.id).join(', ')}`);
  }
  push('');

  // ---- 1. Executive Summary -------------------------------------------
  H('s1');
  push(execSummary(t, isKn, { comparedCount, similarityScore, patternAnalysis, sharedNexus, cases }));
  push('');

  // ---- 2. Crime Comparison --------------------------------------------
  H('s2');
  cases.forEach((c, i) => {
    const sects = isKn ? toKannadaDict(c.legalSections.join(', ')) : c.legalSections.join(', ');
    push(`• **${t('case')} ${i + 1} \`${c.id}\`:** ${V(c.caseRecord.CrimeMinorHead, isKn)} — ${t('category')}: ${V(c.caseRecord.CrimeMajorHead, isKn)}, ${t('station')}: ${V(c.caseRecord.PoliceStation, isKn)} (${V(c.caseRecord.District, isKn)}). ${t('sections')}: ${sects}`);
  });
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'crimeType')));
  push('');

  // ---- 3. Victim Comparison -------------------------------------------
  H('s3');
  cases.forEach(c => {
    if (!c.victims.length) { push(`• \`${c.id}\`: ${t('none')}`); return; }
    c.victims.forEach(v => {
      push(`• \`${c.id}\`: ${V(v.VictimName, isKn)} — ${t('age')} ${v.Age} ${t('yrs')}, ${V(v.Gender, isKn)}; ${t('injury')}: ${V(v.InjuryType, isKn)} (${V(v.InjurySeverity, isKn)}); ${V(v.VictimStatus, isKn)}`);
    });
  });
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'victimProfile')));
  push('');

  // ---- 4. Accused Comparison ------------------------------------------
  H('s4');
  cases.forEach(c => {
    if (!c.accused.length) { push(`• \`${c.id}\`: ${t('none')}`); return; }
    c.accused.forEach(a => {
      push(`• \`${c.id}\`: ${V(a.AccusedName, isKn)} (${t('age')} ${a.Age}) — ${t('priorHistory')}: ${V(a.CriminalHistory, isKn)}; ${t('custody')}: ${V(a.CustodyStatus, isKn)} / ${V(a.BailStatus, isKn)}`);
    });
  });
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'associates')));
  push('');

  // ---- 5. Witness Comparison ------------------------------------------
  H('s5');
  cases.forEach(c => {
    push(`• \`${c.id}\`: ${c.witnesses.length} ${t('witnessesRec')} ${t('underSec')}.`);
  });
  const wn = sharedNexus.sharedWitnesses || [];
  if (wn.length) push(`▸ ${isKn ? toPureKannada(wn[0].explanation) : wn[0].explanation}`);
  push('');

  // ---- 6. Evidence & Forensic -----------------------------------------
  H('s6');
  cases.forEach(c => {
    if (!c.evidence.length) { push(`• \`${c.id}\`: ${t('none')}`); return; }
    c.evidence.forEach(e => {
      const lab = e.ForensicLab ? `, ${t('forensicLab')}: ${V(e.ForensicLab, isKn)}` : '';
      push(`• \`${c.id}\`: ${e.EvidenceNumber || e.EvidenceID} — ${V(e.EvidenceType, isKn)}${lab}`);
    });
  });
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'evidence')));
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'forensics')));
  push('');

  // ---- 7. Timeline -----------------------------------------------------
  H('s7');
  cases.forEach(c => {
    const d = (c.caseRecord.CrimeRegisteredDate || '').substring(0, 10) || t('none');
    push(`• \`${c.id}\`: ${t('registered')} ${d} — ${V(c.caseRecord.CaseStatus, isKn)}`);
  });
  push(analysisLine(t, isKn, factorByKey(similarityBreakdown, 'timeline')));
  push('');

  // ---- 8. Criminal Nexus ----------------------------------------------
  H('s8');
  if (sharedNexus.hasNexus) {
    push(t('nexusFound'));
    collectNexusLines(sharedNexus).forEach(line => push(`• ${isKn ? toPureKannada(line) : line}`));
  } else {
    push(t('nexusNone'));
  }
  push('');

  // ---- 9. Pattern Analysis --------------------------------------------
  H('s9');
  push(`• **${t('patternName')}:** ${V(patternAnalysis.patternName, isKn)}`);
  push(`• **${t('confidence')}:** ${patternAnalysis.confidenceScore}%`);
  push(`• **${t('crossDistrict')}:** ${patternAnalysis.crossDistrict ? t('yes') : t('no')} (${patternAnalysis.districtCount})`);
  push(`• ${isKn ? toPureKannada(patternAnalysis.summary) : patternAnalysis.summary}`);
  push('');

  // ---- 10. Similarity Analysis ----------------------------------------
  H('s10');
  similarityBreakdown.forEach(b => {
    push(`• **${labelFactor(t, isKn, b)}:** ${b.score}/${b.max} ${t('points')} [${statusChip(t, b.status)}] — ${isKn ? toPureKannada(b.detail) : b.detail}`);
  });
  if (pairwiseSimilarity.length) {
    push(`\n▸ ${t('pairwise')}:`);
    pairwiseSimilarity.slice(0, 5).forEach(p => push(`   \`${p.a}\` ↔ \`${p.b}\`: ${p.score}%`));
  }
  push('');

  // ---- 11. AI Findings -------------------------------------------------
  H('s11');
  if (aiFindings.length) {
    aiFindings.forEach((f, i) => push(`${i + 1}. ${isKn ? toPureKannada(f.detail) : f.detail}`));
  } else {
    push(`1. ${t('none')}`);
  }
  push('');

  // ---- 12. Recommendations --------------------------------------------
  H('s12');
  recommendations.forEach(r => push(`• ${isKn ? toPureKannada(r) : r}`));
  push('');

  // ---- 13. Officer Actions --------------------------------------------
  H('s13');
  officerActions.forEach((a, i) => push(`${i + 1}. ${isKn ? toPureKannada(a) : a}`));

  // ---- Follow-up ------------------------------------------------------
  push(`\n---\n### 📍 ${t('nextActions')}`);
  const first = cases[0].id;
  if (isKn) {
    push(`1. \`ಕೇಸ್360 ${first}\` — ${toPureKannada('Open the complete case file')}`);
    push(`2. \`${toPureKannada('Criminal Nexus')} ${first}\``);
  } else {
    push(`1. \`Open Case360 ${first}\` — inspect the complete case file`);
    push(`2. \`Show Criminal Nexus ${first}\``);
  }

  return P.join('\n');
}

// ---------------------------------------------------------------------------
function execSummary(t, isKn, { comparedCount, similarityScore, patternAnalysis, sharedNexus, cases }) {
  if (isKn) {
    const dist = patternAnalysis.districtCount || 1;
    let s = `ಆಯ್ದ ${comparedCount} ಪ್ರಕರಣಗಳ ಸಮಗ್ರ ಹೋಲಿಕೆಯಲ್ಲಿ ಒಟ್ಟಾರೆ ಸಾಮ್ಯತೆ **${similarityScore}%** ಆಗಿದೆ. `;
    s += `ಇವು **${toPureKannada(patternAnalysis.patternName)}** ವರ್ಗಕ್ಕೆ ಸೇರಿದ್ದು, ${dist} ಜಿಲ್ಲೆ(ಗಳಲ್ಲಿ) ವ್ಯಾಪಿಸಿವೆ. `;
    s += sharedNexus.hasNexus
      ? `ಒಟ್ಟು ${sharedNexus.linkCount} ಹಂಚಿಕೆಯ ಅಪರಾಧ-ಜಾಲ ಸಂಪರ್ಕಗಳು ಪತ್ತೆಯಾಗಿದ್ದು, ಸಂಘಟಿತ ಸಂಬಂಧವನ್ನು ಸೂಚಿಸುತ್ತವೆ.`
      : `ಪ್ರಸ್ತುತ ದತ್ತಾಂಶದಲ್ಲಿ ನೇರ ಹಂಚಿಕೆಯ ಘಟಕಗಳು ಕಂಡುಬಂದಿಲ್ಲ; ಸಾಮ್ಯತೆ ಮುಖ್ಯವಾಗಿ ಅಪರಾಧ ಶೈಲಿ ಆಧಾರಿತವಾಗಿದೆ.`;
    return s;
  }
  const dist = patternAnalysis.districtCount || 1;
  let s = `A deep comparison of the ${comparedCount} selected cases yields an overall similarity of **${similarityScore}%**. `;
  s += `They classify as a **${patternAnalysis.patternName}** spanning ${dist} district(s). `;
  s += sharedNexus.hasNexus
    ? `${sharedNexus.linkCount} shared criminal-nexus linkage(s) were discovered, indicating a coordinated relationship that warrants joint investigation.`
    : `No direct shared entities were found on the current data; the similarity is driven primarily by crime-signature and methodology rather than hard links.`;
  return s;
}

function collectNexusLines(nx) {
  const lines = [];
  const groups = ['sharedSuspects', 'sharedPhones', 'sharedVehicles', 'sharedAddresses', 'sharedEvidence', 'sharedFingerprints', 'sharedWitnesses', 'sharedOfficers'];
  groups.forEach(g => (nx[g] || []).forEach(e => lines.push(e.explanation)));
  if (nx.repeatOffenders && nx.repeatOffenders.length >= 2) {
    lines.push(`${nx.repeatOffenders.length} accused across the cases carry prior criminal history — a possible organised-crime cluster.`);
  }
  return lines;
}

function factorByKey(breakdown, key) {
  return (breakdown || []).find(b => b.key === key);
}

function analysisLine(t, isKn, factor) {
  if (!factor) return '';
  return `▸ **${labelFactor(t, isKn, factor)}** [${statusChip(t, factor.status)}]: ${isKn ? toPureKannada(factor.detail) : factor.detail}`;
}

function labelFactor(t, isKn, factor) {
  // Prefer a curated bilingual label; fall back to lexicon translation of the English factor name.
  const map = {
    'Crime Type': 'crimeType', 'Modus Operandi': 'mo', 'Victim Profile': 'victimProfile',
    'Weapon Signature': 'weapon', 'Linked Phones': 'phones',
  };
  if (factor.key === 'crimeType') return t('crimeType');
  if (factor.key === 'modusOperandi') return t('mo');
  if (factor.key === 'weapon') return t('weapon');
  if (factor.key === 'phone') return t('phones');
  if (factor.key === 'vehicle') return t('vehicles');
  return isKn ? toPureKannada(factor.factor) : factor.factor;
}
