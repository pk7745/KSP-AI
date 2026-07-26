import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const officerId = req.params.id;
    const officers = await getTableData('Officer');
    const officer = officers.find(o => o.OfficerID === officerId);

    if (!officer) {
      return res.status(404).json({ error: 'Officer not found in Stratus CSV' });
    }

    const units = await getTableData('Unit');
    const districts = await getTableData('District');
    const unit = units.find(u => u.UnitID === officer.UnitID) || {};
    const district = districts.find(d => d.DistrictID === officer.DistrictID) || {};

    const profile = {
      ...officer,
      UnitName: unit.UnitName || 'Unknown',
      DistrictName: district.DistrictName || 'Unknown'
    };

    // Fetch assigned cases
    const casesData = await getTableData('CaseMaster');
    const assignedCases = casesData
      .filter(c => c.InvestigatingOfficerID === officerId || c.OfficerID === officerId)
      .map(c => ({
        ...c,
        CaseMasterID: c.CrimeNumber,
        CrimeNo: c.CrimeNumber,
        CaseID: c.CrimeNumber
      }))
      .slice(0, 10); // Take 10 most recent

    // Fetch activity
    const activityData = await getTableData('ActivityLog');
    const recentActivity = activityData
      .filter(a => a.OfficerID === officerId)
      .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp))
      .slice(0, 5);

    res.json({
      profile,
      assignedCases,
      recentActivity
    });
  } catch (err) {
    console.error("[Officer CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch officer details from CSVs: ' + (err.message || String(err)) });
  }
});

export default router;
