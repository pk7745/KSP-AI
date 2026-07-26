import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const cases = await getTableData('CaseMaster');
    const caseStatusData = await getTableData('CaseStatusMaster');
    const gravityData = await getTableData('GravityOffence');
    const officers = await getTableData('Officer');
    const districtData = await getTableData('District');
    const unitData = await getTableData('Unit');
    const crimeHeadData = await getTableData('CrimeHead');

    // Filter Cases by Jurisdiction
    let filteredCases = cases;
    if (req.jurisdictionFilter) {
      if (req.jurisdictionFilter.UnitID) {
        filteredCases = cases.filter(c => c.UnitID === req.jurisdictionFilter.UnitID || req.emergencyAccess?.includes(c.CrimeNumber));
      } else if (req.jurisdictionFilter.DistrictID) {
        filteredCases = cases.filter(c => c.DistrictID === req.jurisdictionFilter.DistrictID || req.emergencyAccess?.includes(c.CrimeNumber));
      }
    }

    // 1. Total Cases
    const totalCases = filteredCases.length;

    // 2. Active Investigations
    const activeInvestigations = filteredCases.filter(c => {
      const status = caseStatusData.find(s => s.CaseStatusID === c.CaseStatusID);
      return status && status.StatusName === 'Under Investigation';
    }).length;

    // 3. Heinous Crimes
    const heinousCrimes = filteredCases.filter(c => {
      const gravity = gravityData.find(g => g.GravityID === c.GravityID);
      return gravity && gravity.GravityName === 'Heinous';
    }).length;

    // 4. Charge Sheeted
    const chargeSheeted = filteredCases.filter(c => {
      const status = caseStatusData.find(s => s.CaseStatusID === c.CaseStatusID);
      return status && status.StatusName === 'Charge Sheeted';
    }).length;

    // 5. Total Officers
    const totalOfficers = officers.length;

    // 6. Recent FIRs
    const recentCases = [...filteredCases]
      .filter(c => c.Latitude && c.Longitude)
      .sort((a, b) => new Date(b.CrimeRegisteredDate) - new Date(a.CrimeRegisteredDate))
      .slice(0, 10)
      .map(c => {
        const district = districtData.find(d => d.DistrictID === c.DistrictID) || {};
        const unit = unitData.find(u => u.UnitID === c.UnitID) || {};
        const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID) || {};
        const status = caseStatusData.find(s => s.CaseStatusID === c.CaseStatusID) || {};
        const gravity = gravityData.find(g => g.GravityID === c.GravityID) || {};

        return {
          CaseMasterID: c.CrimeNumber,
          CrimeNo: c.CrimeNumber,
          CrimeRegisteredDate: c.CrimeRegisteredDate,
          latitude: parseFloat(c.Latitude) || 0,
          longitude: parseFloat(c.Longitude) || 0,
          BriefFacts: c.BriefFacts,
          ActSections: c.ActSections || '',
          DistrictName: district.DistrictName || 'Unknown',
          PoliceStationName: unit.UnitName || 'Unknown',
          CrimeMajorHead: head.CrimeHeadName || 'Unknown',
          CaseStatus: status.StatusName || 'Unknown',
          GravityOffence: gravity.GravityName || 'Unknown'
        };
      });

    res.json({
      summary: {
        totalCases,
        activeInvestigations,
        heinousCrimes,
        chargeSheeted,
        totalOfficers
      },
      recentCases: recentCases
    });
  } catch (err) {
    console.error("[Dashboard CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics from CSVs: ' + (err.message || String(err)) });
  }
});

export default router;
