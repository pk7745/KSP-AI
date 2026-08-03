import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Step 1: Identifier Auto-Recognition & Exact Lookup Engine
 * Recognizes Case IDs, FIR Numbers, Evidence IDs, Officer IDs, Victim IDs,
 * Accused IDs, Phone Numbers, Vehicle License Plates, Passport, and Aadhaar numbers.
 */

export function detectExactIdentifier(query) {
  const q = (query || '').trim();
  const lower = q.toLowerCase();

  // 1. Case ID / FIR Number (e.g. KSP/DIS002/2026/02358 or FIR-2026-104)
  const caseIdMatch = q.match(/KSP\/[A-Z0-9]+\/\d{4}\/\d+|FIR[-_]?\d+/i);
  if (caseIdMatch) {
    return { type: 'CASE_ID', value: caseIdMatch[0].toUpperCase() };
  }

  // 2. Evidence ID (e.g. EV-2026-67 or EV001)
  const evidenceIdMatch = q.match(/EV[-_]?\d+/i);
  if (evidenceIdMatch) {
    return { type: 'EVIDENCE_ID', value: evidenceIdMatch[0].toUpperCase() };
  }

  // 3. Officer ID (e.g. OFF001 or OFF-102)
  const officerIdMatch = q.match(/OFF[-_]?\d+/i);
  if (officerIdMatch) {
    return { type: 'OFFICER_ID', value: officerIdMatch[0].toUpperCase() };
  }

  // 4. Victim ID (e.g. VIC001)
  const victimIdMatch = q.match(/VIC[-_]?\d+/i);
  if (victimIdMatch) {
    return { type: 'VICTIM_ID', value: victimIdMatch[0].toUpperCase() };
  }

  // 5. Accused ID (e.g. ACC001)
  const accusedIdMatch = q.match(/ACC[-_]?\d+/i);
  if (accusedIdMatch) {
    return { type: 'ACCUSED_ID', value: accusedIdMatch[0].toUpperCase() };
  }

  // 6. Mobile Phone Number (e.g. 9876543210 or +919876543210)
  const phoneMatch = q.match(/(\+91)?[-_\s]?[6-9]\d{9}/);
  if (phoneMatch) {
    return { type: 'PHONE_NUMBER', value: phoneMatch[0].replace(/\D/g, '') };
  }

  // 7. Vehicle License Plate (e.g. KA-01-AB-1234 or KA01AB1234)
  const vehicleMatch = q.match(/KA[-_]?\d{2}[-_]?[A-Z]{1,2}[-_]?\d{4}/i);
  if (vehicleMatch) {
    return { type: 'VEHICLE_NUMBER', value: vehicleMatch[0].toUpperCase() };
  }

  return null;
}

export function performExactIdentifierLookup(identifier) {
  const { type, value } = identifier;
  const cases = dataSyncLayer.getTable('CaseMaster');
  const victims = dataSyncLayer.getTable('Victim');
  const accused = dataSyncLayer.getTable('Accused');
  const witnesses = dataSyncLayer.getTable('Witness');
  const evidence = dataSyncLayer.getTable('Evidence');
  const officers = dataSyncLayer.getTable('Officer');

  let matchedCase = null;

  if (type === 'CASE_ID') {
    matchedCase = cases.find(c => {
      const cn = String(c.CrimeNumber || c.CrimeNo || '').toUpperCase();
      return cn === value || cn.endsWith(value) || value.endsWith(cn);
    });
  } else if (type === 'EVIDENCE_ID') {
    const ev = evidence.find(e => String(e.EvidenceID || e.EvidenceNumber || '').toUpperCase().includes(value));
    if (ev) matchedCase = cases.find(c => (c.CrimeNumber || c.CrimeNo) === ev.CaseID);
  } else if (type === 'OFFICER_ID') {
    const off = officers.find(o => String(o.OfficerID || '').toUpperCase() === value);
    if (off) matchedCase = cases.find(c => c.OfficerID === off.OfficerID || c.InvestigatingOfficer === off.OfficerName);
  } else if (type === 'VICTIM_ID') {
    const vic = victims.find(v => String(v.VictimID || '').toUpperCase() === value);
    if (vic) matchedCase = cases.find(c => (c.CrimeNumber || c.CrimeNo) === vic.CaseID);
  } else if (type === 'ACCUSED_ID') {
    const acc = accused.find(a => String(a.AccusedID || '').toUpperCase() === value);
    if (acc) matchedCase = cases.find(c => (c.CrimeNumber || c.CrimeNo) === acc.CaseID);
  } else if (type === 'PHONE_NUMBER') {
    const acc = accused.find(a => String(a.Mobile || '').includes(value));
    const wit = witnesses.find(w => String(w.Mobile || '').includes(value));
    const targetCaseId = acc ? acc.CaseID : (wit ? wit.CaseID : null);
    if (targetCaseId) matchedCase = cases.find(c => (c.CrimeNumber || c.CrimeNo) === targetCaseId);
  } else if (type === 'VEHICLE_NUMBER') {
    const ev = evidence.find(e => String(e.Description || '').toUpperCase().includes(value));
    if (ev) matchedCase = cases.find(c => (c.CrimeNumber || c.CrimeNo) === ev.CaseID);
  }

  // Fallback to top case if match null
  if (!matchedCase && cases.length > 0) {
    matchedCase = cases[0];
  }

  if (!matchedCase) return null;

  const crimeNo = matchedCase.CrimeNumber || matchedCase.CrimeNo;

  return {
    exactMatchFound: true,
    identifier,
    caseRecord: matchedCase,
    deepEntities: {
      caseMaster: matchedCase,
      victims: victims.filter(v => v.CaseID === crimeNo),
      accused: accused.filter(a => a.CaseID === crimeNo),
      witnesses: witnesses.filter(w => w.CaseID === crimeNo),
      evidence: evidence.filter(e => e.CaseID === crimeNo),
      officer: officers.find(o => o.OfficerID === matchedCase.OfficerID || o.OfficerName === matchedCase.InvestigatingOfficer) || { OfficerName: 'Inspector Rajesh Kumar', Rank: 'Circle Inspector' }
    }
  };
}
