import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [victims, witnesses, accused, complainants, casesData, officers] = await Promise.all([
      getTableData('Victim'),
      getTableData('Witness'),
      getTableData('Accused'),
      getTableData('ComplaintDetails'),
      getTableData('CaseMaster'),
      getTableData('Officer')
    ]);

    // Apply Jurisdiction Filter to cases first
    let accessibleCases = casesData;
    if (req.jurisdictionFilter) {
      if (req.jurisdictionFilter.UnitID) {
        accessibleCases = casesData.filter(c => c.UnitID === req.jurisdictionFilter.UnitID || req.emergencyAccess?.includes(c.CrimeNumber));
      } else if (req.jurisdictionFilter.DistrictID) {
        accessibleCases = casesData.filter(c => c.DistrictID === req.jurisdictionFilter.DistrictID || req.emergencyAccess?.includes(c.CrimeNumber));
      }
    }
    const accessibleCaseIDs = new Set(accessibleCases.map(c => c.CrimeNumber));

    const people = [];

    // Helper to calculate AI Risk
    const getRiskScore = (person, type) => {
      if (type !== 'Accused') return null;
      let score = 30; // Base score
      if (person.CriminalHistory && person.CriminalHistory.toLowerCase() === 'yes') score += 40;
      if (person.ArrestStatus && person.ArrestStatus.includes('Absconding')) score += 30;
      return Math.min(score, 100);
    };

    const getRiskLabel = (score) => {
      if (score === null) return null;
      if (score >= 80) return 'VERY HIGH';
      if (score >= 60) return 'HIGH';
      if (score >= 40) return 'MEDIUM';
      return 'LOW';
    };

    accused.filter(a => accessibleCaseIDs.has(a.CaseID)).slice(0, 100).forEach(a => {
      const score = getRiskScore(a, 'Accused');
      const relatedCase = casesData.find(c => c.CrimeNumber === a.CaseID) || {};
      const officer = officers.find(o => o.OfficerID === relatedCase.InvestigatingOfficerID || o.OfficerID === relatedCase.OfficerID) || {};
      
      people.push({
        id: `A_${a.AccusedID}`,
        name: a.AccusedName,
        role: 'Accused',
        gender: a.Gender,
        age: a.Age,
        occupation: a.Occupation,
        phone: a.Mobile,
        linkedCase: a.CaseID,
        caseStatus: relatedCase.CaseStatus,
        station: relatedCase.PoliceStation,
        officer: officer.OfficerName || 'Unknown',
        riskScore: score,
        riskLabel: getRiskLabel(score),
        status: a.ArrestStatus || 'Unknown',
        caseId: relatedCase.CrimeNumber
      });
    });

    victims.filter(v => accessibleCaseIDs.has(v.CaseID)).slice(0, 100).forEach(v => {
      const relatedCase = casesData.find(c => c.CrimeNumber === v.CaseID) || {};
      const officer = officers.find(o => o.OfficerID === relatedCase.InvestigatingOfficerID || o.OfficerID === relatedCase.OfficerID) || {};
      people.push({
        id: `V_${v.VictimID}`,
        name: v.VictimName,
        role: 'Victim',
        gender: v.Gender,
        age: v.Age,
        occupation: v.Occupation,
        phone: v.Mobile,
        linkedCase: v.CaseID,
        caseStatus: relatedCase.CaseStatus,
        station: relatedCase.PoliceStation,
        officer: officer.OfficerName || 'Unknown',
        status: v.VictimStatus || 'Unknown',
        caseId: relatedCase.CrimeNumber
      });
    });

    witnesses.filter(w => accessibleCaseIDs.has(w.CaseID)).slice(0, 50).forEach(w => {
      people.push({
        id: `W_${w.WitnessID}`,
        name: w.WitnessName,
        role: 'Witness',
        gender: w.Gender,
        age: w.Age,
        occupation: w.Occupation,
        phone: w.Mobile,
        linkedCase: w.CaseID,
        status: w.AvailabilityStatus || 'Unknown',
        caseId: casesData.find(c => c.CrimeNumber === w.CaseID)?.CrimeNumber
      });
    });

    complainants.filter(c => accessibleCaseIDs.has(c.CaseID)).slice(0, 50).forEach(c => {
      people.push({
        id: `C_${c.ComplainantID}`,
        name: c.ComplainantName,
        role: 'Complainant',
        gender: c.Gender,
        age: c.Age,
        occupation: c.Occupation,
        phone: c.Mobile,
        linkedCase: c.CaseID,
        status: 'Active',
        caseId: casesData.find(caseItem => caseItem.CrimeNumber === c.CaseID)?.CrimeNumber
      });
    });

    res.json({ people });
  } catch (err) {
    console.error("[People CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch people' });
  }
});

export default router;
