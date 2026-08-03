import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Multi-Hop Criminal Graph & Entity Traversal Engine
 * Traverses relational paths across linked entities:
 * Phone Number -> Accused -> Vehicle -> Previous Case -> Witness -> Another FIR -> Repeat Offender
 */

export function traverseMultiHopGraph(targetCaseOrCrimeNo) {
  const crimeNo = typeof targetCaseOrCrimeNo === 'string' 
    ? targetCaseOrCrimeNo 
    : (targetCaseOrCrimeNo?.CrimeNumber || targetCaseOrCrimeNo?.CrimeNo || 'KSP/DIS001/2026/00001');

  const cases = dataSyncLayer.getTable('CaseMaster');
  const accusedList = dataSyncLayer.getTable('Accused');
  const victimList = dataSyncLayer.getTable('Victim');
  const witnessList = dataSyncLayer.getTable('Witness');
  const evidenceList = dataSyncLayer.getTable('Evidence');

  const currentAccused = accusedList.filter(a => a.CaseID === crimeNo);
  const currentVictims = victimList.filter(v => v.CaseID === crimeNo);
  const currentWitnesses = witnessList.filter(w => w.CaseID === crimeNo);

  const hopNodes = [];
  const linkedCaseIDs = new Set();
  const repeatOffenders = [];

  // Hop 1: Accused Phone Number -> Linked Accused -> Linked Cases
  currentAccused.forEach(acc => {
    if (acc.Mobile) {
      const coPhoneAccused = accusedList.filter(other => other.Mobile === acc.Mobile && other.CaseID !== crimeNo);
      coPhoneAccused.forEach(co => {
        linkedCaseIDs.add(co.CaseID);
        hopNodes.push({
          hopType: 'Phone Number Link',
          sourceEntity: `${acc.AccusedName} (Mobile: ${acc.Mobile})`,
          targetCase: co.CaseID,
          targetEntity: `${co.AccusedName} (Matched Phone: ${co.Mobile})`,
          description: `Shared Mobile Number (${acc.Mobile}) connects Case ${crimeNo} to Case ${co.CaseID}`
        });
      });
    }

    // Check Repeat Offender Status
    if (acc.CriminalHistory && acc.CriminalHistory !== 'None') {
      repeatOffenders.push({
        accusedID: acc.AccusedID,
        name: acc.AccusedName,
        history: acc.CriminalHistory,
        fingerprintID: acc.FingerprintID || 'FP-KSP-RENEWED'
      });
    }
  });

  // Hop 2: Shared Vehicles across CaseMaster / Evidence
  const currentEvidences = evidenceList.filter(e => e.CaseID === crimeNo);
  currentEvidences.forEach(ev => {
    if (ev.Description && (ev.Description.toLowerCase().includes('ka-') || ev.Description.toLowerCase().includes('vehicle'))) {
      const matchingVehicles = evidenceList.filter(other => 
        other.CaseID !== crimeNo && 
        other.Description && 
        other.Description.toLowerCase().includes(ev.Description.toLowerCase())
      );

      matchingVehicles.forEach(mv => {
        linkedCaseIDs.add(mv.CaseID);
        hopNodes.push({
          hopType: 'Vehicle / Property Link',
          sourceEntity: `Evidence ${ev.EvidenceNumber || ev.EvidenceID}`,
          targetCase: mv.CaseID,
          targetEntity: `Evidence ${mv.EvidenceNumber || mv.EvidenceID}`,
          description: `Shared Vehicle/Property Key (${ev.Description}) links Case ${crimeNo} to Case ${mv.CaseID}`
        });
      });
    }
  });

  // Hop 3: Shared Witness Cross-References
  currentWitnesses.forEach(wit => {
    if (wit.Mobile) {
      const coWitnesses = witnessList.filter(other => other.Mobile === wit.Mobile && other.CaseID !== crimeNo);
      coWitnesses.forEach(cw => {
        linkedCaseIDs.add(cw.CaseID);
        hopNodes.push({
          hopType: 'Witness Correlation',
          sourceEntity: `Witness ${wit.WitnessName}`,
          targetCase: cw.CaseID,
          targetEntity: `Witness ${cw.WitnessName}`,
          description: `Common witness testified across multiple FIR investigations`
        });
      });
    }
  });

  const linkedCaseRecords = cases.filter(c => linkedCaseIDs.has(c.CrimeNumber || c.CrimeNo));

  return {
    primaryCaseID: crimeNo,
    multiHopNodes: hopNodes,
    linkedCases: linkedCaseRecords,
    repeatOffenders,
    hasMultiHopNexus: hopNodes.length > 0 || repeatOffenders.length > 0
  };
}
