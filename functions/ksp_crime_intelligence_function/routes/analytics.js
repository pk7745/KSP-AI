import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rawCases = await getTableData('CaseMaster');
    const gravityData = await getTableData('GravityOffence');
    const crimeHeadData = await getTableData('CrimeHead');
    const districtData = await getTableData('District');
    const unitData = await getTableData('Unit');
    const caseStatusData = await getTableData('CaseStatusMaster');

    // Filter Cases by Jurisdiction
    let cases = rawCases;
    if (req.jurisdictionFilter) {
      if (req.jurisdictionFilter.UnitID) {
        cases = rawCases.filter(c => c.UnitID === req.jurisdictionFilter.UnitID || req.emergencyAccess?.includes(c.CrimeNumber));
      } else if (req.jurisdictionFilter.DistrictID) {
        cases = rawCases.filter(c => c.DistrictID === req.jurisdictionFilter.DistrictID || req.emergencyAccess?.includes(c.CrimeNumber));
      }
    }

    // 1. Calculate gravity breakdown
    const gravityCounts = {};
    cases.forEach(c => {
      const gravity = gravityData.find(g => g.GravityID === c.GravityID);
      const gravityName = gravity ? gravity.GravityName : 'Unknown';
      gravityCounts[gravityName] = (gravityCounts[gravityName] || 0) + 1;
    });

    const gravityBreakdown = Object.keys(gravityCounts).map(key => ({
      name: key,
      count: gravityCounts[key]
    }));

    // 2. Fetch monthly trends
    const recentCases = [...cases].sort((a, b) => new Date(b.CrimeRegisteredDate) - new Date(a.CrimeRegisteredDate)).slice(0, 500);
    
    const monthMap = {};
    recentCases.forEach(c => {
      const d = new Date(c.CrimeRegisteredDate);
      if (isNaN(d.getTime())) return;
      const monthKey = d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { month: monthKey, Property: 0, Violent: 0, Cyber: 0, NDPS: 0 };
      }
      
      const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID);
      const headName = head ? head.CrimeHeadName : '';
      
      if (headName.includes('Property') || headName.includes('Theft')) monthMap[monthKey].Property++;
      else if (headName.includes('Cyber')) monthMap[monthKey].Cyber++;
      else if (headName.includes('NDPS') || headName.includes('Narcotics')) monthMap[monthKey].NDPS++;
      else monthMap[monthKey].Violent++;
    });

    const monthlyTrends = Object.values(monthMap).slice(0, 6).reverse(); // Last 6 months

    // 3. Hotspots (Map valid coordinates)
    const hotspots = cases
      .filter(c => c.Latitude && c.Longitude)
      .slice(0, 100)
      .map(c => {
        const district = districtData.find(d => d.DistrictID === c.DistrictID) || {};
        const unit = unitData.find(u => u.UnitID === c.UnitID) || {};
        const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID) || {};
        const gravity = gravityData.find(g => g.GravityID === c.GravityID) || {};
        const status = caseStatusData.find(s => s.CaseStatusID === c.CaseStatusID) || {};

        return {
          id: c.CrimeNumber,
          crimeNo: c.CrimeNumber,
          lat: parseFloat(c.Latitude) || 0,
          lng: parseFloat(c.Longitude) || 0,
          facts: c.BriefFacts,
          district: district.DistrictName || 'Unknown',
          station: unit.UnitName || 'Unknown',
          title: head.CrimeHeadName || 'Unknown',
          gravity: gravity.GravityName || 'Unknown',
          status: status.StatusName || 'Unknown'
        };
      });

    res.json({
      monthlyTrends,
      hotspots,
      gravityBreakdown
    });
  } catch (err) {
    console.error("[Analytics CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch analytics from CSVs: ' + (err.message || String(err)) });
  }
});

export default router;
