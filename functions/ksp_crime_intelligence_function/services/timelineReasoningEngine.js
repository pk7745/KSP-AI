import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Timeline Reconstruction & Procedural Delay Analysis Engine
 * Reconstructs the complete lifecycle of a case:
 * Complaint -> Evidence Collection -> Witness Statements -> Arrest -> Charge Sheet -> Court Trial
 * Automatically calculates elapsed days and flags procedural delays.
 */

export function reconstructTimelineWithDelays(caseRecord) {
  const crimeNo = caseRecord?.CrimeNumber || caseRecord?.CrimeNo || 'KSP/DIS001/2026/00001';

  const cases = dataSyncLayer.getTable('CaseMaster');
  const evidence = dataSyncLayer.getTable('Evidence').filter(e => e.CaseID === crimeNo);
  const witnesses = dataSyncLayer.getTable('Witness').filter(w => w.CaseID === crimeNo);
  const accused = dataSyncLayer.getTable('Accused').filter(a => a.CaseID === crimeNo);

  const firDateStr = caseRecord?.IncidentDate || caseRecord?.CrimeRegisteredDate || '2026-01-10';
  const firDate = new Date(firDateStr);

  const timelineMilestones = [];
  const proceduralDelays = [];

  // Milestone 1: FIR Registration
  timelineMilestones.push({
    stage: 'FIR Complaint Registration',
    date: firDateStr,
    actor: caseRecord?.PoliceStation || 'Station House Officer',
    status: 'Completed',
    details: `FIR Registered under ${caseRecord?.CrimeMajorHead || 'IPC Offense'}`
  });

  // Milestone 2: Evidence Collection
  if (evidence.length > 0) {
    const evDateStr = evidence[0].CollectionDate || firDateStr;
    const evDate = new Date(evDateStr);
    const evDiffDays = Math.max(0, Math.round((evDate.getTime() - firDate.getTime()) / (1000 * 3600 * 24)));

    timelineMilestones.push({
      stage: 'Forensic Evidence Collection',
      date: evDateStr,
      actor: evidence[0].CollectedBy || 'FSL Team / IO',
      status: 'Completed',
      details: `${evidence.length} evidence item(s) secured and cataloged`
    });

    if (evDiffDays > 7) {
      proceduralDelays.push({
        milestone: 'Evidence Collection',
        delayDays: evDiffDays,
        severity: 'Medium',
        flagMessage: `⚠️ Evidence collection delayed by ${evDiffDays} days after FIR registration.`
      });
    }
  }

  // Milestone 3: Witness Statements Recorded
  if (witnesses.length > 0) {
    timelineMilestones.push({
      stage: 'Witness Statements (Sec 161 CrPC)',
      date: firDateStr,
      actor: 'Investigating Officer',
      status: 'Completed',
      details: `${witnesses.length} witness statement(s) recorded`
    });
  }

  // Milestone 4: Accused Arrest / Custody
  if (accused.length > 0) {
    const arrestDateStr = accused[0].ArrestDate || firDateStr;
    timelineMilestones.push({
      stage: 'Accused Apprehension / Arrest',
      date: arrestDateStr,
      actor: 'Police Arrest Party',
      status: accused[0].Status || 'Under Custody',
      details: `Accused ${accused[0].AccusedName} taken into judicial custody`
    });
  }

  // Milestone 5: Charge Sheet & Court Status
  const isChargeSheeted = (caseRecord?.CaseStatus || '').toLowerCase().includes('charge') || caseRecord?.CaseStatusID === 'STAT002';
  const csDateStr = '2026-03-01';
  const csDate = new Date(csDateStr);
  const csDiffDays = Math.max(0, Math.round((csDate.getTime() - firDate.getTime()) / (1000 * 3600 * 24)));

  timelineMilestones.push({
    stage: 'Charge Sheet Filing (Sec 173 CrPC)',
    date: isChargeSheeted ? csDateStr : 'Pending',
    actor: 'Public Prosecutor / IO',
    status: isChargeSheeted ? 'Filed in Court' : 'In Progress',
    details: isChargeSheeted ? `Final Charge Sheet submitted to Magistrate Court.` : `Drafting charge sheet under supervision of CI.`
  });

  if (!isChargeSheeted && csDiffDays > 60) {
    proceduralDelays.push({
      milestone: 'Charge Sheet Submission',
      delayDays: csDiffDays,
      severity: 'High',
      flagMessage: `⚠️ Statutory Charge Sheet filing exceeds statutory 60-day limit (${csDiffDays} days elapsed).`
    });
  }

  return {
    caseID: crimeNo,
    firDate: firDateStr,
    timelineMilestones,
    proceduralDelays,
    hasDelays: proceduralDelays.length > 0
  };
}
