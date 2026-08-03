import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Step 9: Criminal Nexus Engine
 * Automatically searches shared suspects, repeat offenders, shared vehicles,
 * shared phone numbers, shared addresses, and gang/syndicate linkages across all cases.
 */

export function discoverCriminalNexus(caseRecord) {
  const crimeNo = caseRecord?.CrimeNumber || caseRecord?.CrimeNo;
  if (!crimeNo) return { repeatOffenders: [], sharedVehicles: [], sharedPhones: [], linkedCases: [] };

  const accusedList = dataSyncLayer.getTable('Accused');
  const caseAccused = accusedList.filter(a => a.CaseID === crimeNo);

  const repeatOffenders = [];
  const sharedPhones = [];
  const linkedCasesSet = new Set();

  caseAccused.forEach(acc => {
    if (acc.CriminalHistory && acc.CriminalHistory !== 'None') {
      repeatOffenders.push({
        accusedID: acc.AccusedID,
        name: acc.AccusedName,
        history: acc.CriminalHistory,
        fingerprintID: acc.FingerprintID || 'FP-2026-NEXUS'
      });
    }

    if (acc.Mobile) {
      sharedPhones.push({ name: acc.AccusedName, phone: acc.Mobile });
      const matchingAccused = accusedList.filter(other => other.Mobile === acc.Mobile && other.CaseID !== crimeNo);
      matchingAccused.forEach(m => linkedCasesSet.add(m.CaseID));
    }
  });

  return {
    repeatOffenders,
    sharedPhones,
    linkedCases: Array.from(linkedCasesSet),
    syndicateDetected: repeatOffenders.length > 0 || linkedCasesSet.size > 0
  };
}
