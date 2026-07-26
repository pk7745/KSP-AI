import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

async function handleCaseDetailFetch(rawId, req, res) {
  try {
    const caseId = decodeURIComponent(String(rawId || '')).trim();
    if (!caseId) {
      return res.status(400).json({ error: 'Case ID parameter is required' });
    }

    // Fetch all related tables
    const casesData = await getTableData('CaseMaster');
    const districtData = await getTableData('District');
    const unitData = await getTableData('Unit');
    const crimeHeadData = await getTableData('CrimeHead');
    const statusData = await getTableData('CaseStatusMaster');
    const gravityData = await getTableData('GravityOffence');
    
    // Find specific case (Case-insensitive & slashes resilient)
    const targetLower = caseId.toLowerCase();
    const c = casesData.find(record => {
      const cn = String(record.CrimeNumber || record.CaseID || '').trim().toLowerCase();
      return cn === targetLower || (cn && targetLower && (cn.endsWith(targetLower) || targetLower.endsWith(cn)));
    });
    
    if (!c) {
      return res.status(404).json({ error: 'Case not found in Stratus CSV' });
    }

    const district = districtData.find(d => d.DistrictID === c.DistrictID) || {};
    const unit = unitData.find(u => u.UnitID === c.UnitID) || {};
    const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID) || {};
    const status = statusData.find(s => s.CaseStatusID === c.CaseStatusID) || {};
    const gravity = gravityData.find(g => g.GravityID === c.GravityID) || {};

    // Rank & District Jurisdiction Enforcement
    if (req.jurisdictionFilter && req.user?.role !== 'ADMIN' && req.user?.role !== 'DSP') {
      const isDistrictMatch = !req.jurisdictionFilter.DistrictID || c.DistrictID === req.jurisdictionFilter.DistrictID;
      const isUnitMatch = !req.jurisdictionFilter.UnitID || c.UnitID === req.jurisdictionFilter.UnitID;
      const hasEmergency = req.emergencyAccess?.includes(c.CrimeNumber);

      if (!isDistrictMatch && !isUnitMatch && !hasEmergency) {
        return res.json({
          isRestricted: true,
          caseNumber: c.CrimeNumber,
          districtName: district.DistrictName || 'Outside District',
          message: 'This case cannot be viewed as it is outside your jurisdiction or officer rank.',
          reason: `Officer ${req.user?.name || ''} (${req.user?.rank || 'IO'}) is assigned to district ${req.user?.districtName || 'primary station'}, whereas FIR ${c.CrimeNumber} is registered under ${district.DistrictName || 'another district'}.`
        });
      }
    }

    const actualCaseId = c.CrimeNumber;

    const caseDetails = {
      ...c,
      CaseMasterID: c.CrimeNumber,
      CrimeNo: c.CrimeNumber,
      DistrictName: district.DistrictName || 'Unknown',
      PoliceStationName: unit.UnitName || 'Unknown',
      CrimeMajorHead: head.CrimeHeadName || 'Unknown',
      CaseStatus: status.StatusName || 'Unknown',
      GravityOffence: gravity.GravityName || 'Unknown'
    };

    // Fetch dependent tables concurrently
    const [
      allVictims, allWitnesses, allAccused, allEvidence, allAiAnalysis, 
      allComplainants, allChargesheets, allArrests, allActs, allActivityLogs
    ] = await Promise.all([
      getTableData('Victim'),
      getTableData('Witness'),
      getTableData('Accused'),
      getTableData('Evidence'),
      getTableData('AIAnalysis'),
      getTableData('ComplaintDetails'),
      getTableData('ChargesheetDetails'),
      getTableData('ArrestSurrender'),
      getTableData('ActSectionAssociation'),
      getTableData('ActivityLog')
    ]);

    // Filter dependent records for this specific case
    return res.json({
      caseDetails,
      victims: allVictims.filter(v => v.CaseID === actualCaseId),
      witnesses: allWitnesses.filter(w => w.CaseID === actualCaseId),
      accused: allAccused.filter(a => a.CaseID === actualCaseId),
      evidence: allEvidence.filter(e => e.CaseID === actualCaseId),
      aiAnalysis: allAiAnalysis.find(ai => ai.CaseID === actualCaseId) || null,
      complainants: allComplainants.filter(c => c.CaseID === actualCaseId),
      chargesheets: allChargesheets.filter(c => c.CaseID === actualCaseId),
      arrests: allArrests.filter(a => a.CaseID === actualCaseId),
      acts: allActs.filter(a => a.CaseID === actualCaseId),
      activityLogs: allActivityLogs.filter(al => al.CaseID === actualCaseId)
    });

  } catch (err) {
    console.error("[Cases Detail CSV] Error:", err.message);
    return res.status(500).json({ error: 'Failed to fetch case details: ' + (err.message || String(err)) });
  }
}

router.get('/', async (req, res) => {
  try {
    const casesData = await getTableData('CaseMaster');
    const districtData = await getTableData('District');
    const unitData = await getTableData('Unit');
    const crimeHeadData = await getTableData('CrimeHead');
    const statusData = await getTableData('CaseStatusMaster');
    const gravityData = await getTableData('GravityOffence');

    const cases = casesData.slice(0, 100).map(c => {
      const district = districtData.find(d => d.DistrictID === c.DistrictID) || {};
      const unit = unitData.find(u => u.UnitID === c.UnitID) || {};
      const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID) || {};
      const status = statusData.find(s => s.CaseStatusID === c.CaseStatusID) || {};
      const gravity = gravityData.find(g => g.GravityID === c.GravityID) || {};

      return {
        ...c,
        CaseMasterID: c.CrimeNumber,
        CrimeNo: c.CrimeNumber,
        DistrictName: district.DistrictName || 'Unknown',
        PoliceStationName: unit.UnitName || 'Unknown',
        CrimeMajorHead: head.CrimeHeadName || 'Unknown',
        CaseStatus: status.StatusName || 'Unknown',
        GravityOffence: gravity.GravityName || 'Unknown'
      };
    });

    res.json({ cases });
  } catch (err) {
    console.error("[Cases CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch cases from Stratus CSV: ' + (err.message || String(err)) });
  }
});

// Endpoint for Query Parameter (Avoids Tomcat %2F path blocking)
router.get('/detail', async (req, res) => {
  return handleCaseDetailFetch(req.query.id, req, res);
});

// Wildcard Endpoint for Path Parameters
router.get('/:id(*)', async (req, res) => {
  const rawId = req.params.id || req.params[0] || '';
  return handleCaseDetailFetch(rawId, req, res);
});

router.post('/', async (req, res) => {
  try {
    const { CrimeHeadID, BriefFacts, DistrictID, UnitID } = req.body;
    
    const randomSeq = Math.floor(Math.random() * 900) + 100;
    const newCrimeNo = `KSP/BLR/2026/0${randomSeq}`;
    
    res.json({ 
      success: true, 
      message: 'FIR Registered successfully (Simulated for CSV Engine)', 
      data: { CrimeNo: newCrimeNo } 
    });
  } catch (err) {
    console.error("[Cases POST CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to insert new case: ' + (err.message || String(err)) });
  }
});

export default router;
