import express from 'express';
import { getTableData } from '../utils/csvService.js';
import { enrichCaseEcosystem } from '../services/syntheticDataGenerator.js';

const router = express.Router();

// In-memory atomic version store for Optimistic Locking & Concurrency Safety (Master Prompt v2.0 §1.5)
const caseVersions = new Map();

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

    // Rank & District Jurisdiction Enforcement (Master Prompt v2.0 §3.4)
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
    const currentVersion = caseVersions.get(actualCaseId) || 1;

    const caseDetails = {
      ...c,
      CaseMasterID: c.CrimeNumber,
      CrimeNo: c.CrimeNumber,
      DistrictName: district.DistrictName || 'Unknown',
      PoliceStationName: unit.UnitName || 'Unknown',
      CrimeMajorHead: head.CrimeHeadName || 'Unknown',
      CaseStatus: status.StatusName || 'Unknown',
      GravityOffence: gravity.GravityName || 'Unknown',
      version: currentVersion
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

    const rawVictims = allVictims.filter(v => v.CaseID === actualCaseId);
    const rawWitnesses = allWitnesses.filter(w => w.CaseID === actualCaseId);
    const rawAccused = allAccused.filter(a => a.CaseID === actualCaseId);
    const rawEvidence = allEvidence.filter(e => e.CaseID === actualCaseId);

    // Enrich with synthetic portraits, CCTV clips, audio logs & forensic reports
    const enriched = enrichCaseEcosystem(caseDetails, rawVictims, rawAccused, rawWitnesses, rawEvidence);

    return res.json({
      caseDetails,
      victims: enriched.victims,
      witnesses: enriched.witnesses,
      accused: enriched.accused,
      evidence: enriched.evidence,
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
      const currentVersion = caseVersions.get(c.CrimeNumber) || 1;

      return {
        ...c,
        CaseMasterID: c.CrimeNumber,
        CrimeNo: c.CrimeNumber,
        DistrictName: district.DistrictName || 'Unknown',
        PoliceStationName: unit.UnitName || 'Unknown',
        CrimeMajorHead: head.CrimeHeadName || 'Unknown',
        CaseStatus: status.StatusName || 'Unknown',
        GravityOffence: gravity.GravityName || 'Unknown',
        version: currentVersion
      };
    });

    res.json({ cases });
  } catch (err) {
    console.error("[Cases CSV] Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch cases from Stratus CSV: ' + (err.message || String(err)) });
  }
});

// Case Resolution Endpoint with Optimistic Locking & Audit Trail (Master Prompt v2.0 §1.5)
router.post('/resolve', async (req, res) => {
  try {
    const { caseId, outcome = 'Solved', expectedVersion = 1, officerId = 'OFF001' } = req.body;
    if (!caseId) return res.status(400).json({ error: 'Case ID is required for resolution.' });

    const currentVersion = caseVersions.get(caseId) || 1;
    if (expectedVersion && expectedVersion !== currentVersion) {
      return res.status(409).json({
        error: 'Optimistic Lock Conflict: Case was updated by another officer. Please refresh data.',
        currentVersion
      });
    }

    const nextVersion = currentVersion + 1;
    caseVersions.set(caseId, nextVersion);

    const auditEntry = {
      action: 'CASE_RESOLUTION',
      caseId,
      outcome,
      officerId,
      version: nextVersion,
      timestamp: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: `Case ${caseId} resolved as '${outcome}' under version ${nextVersion}.`,
      newVersion: nextVersion,
      auditEntry
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resolve case: ' + err.message });
  }
});

// Case Reopen Endpoint with Mandatory Audit Trail (Master Prompt v2.0 §1.5)
router.post('/reopen', async (req, res) => {
  try {
    const { caseId, reason, expectedVersion = 1, officerId = 'OFF001' } = req.body;
    if (!caseId || !reason) {
      return res.status(400).json({ error: 'Case ID and mandatory reopening reason are required.' });
    }

    const currentVersion = caseVersions.get(caseId) || 1;
    if (expectedVersion && expectedVersion !== currentVersion) {
      return res.status(409).json({
        error: 'Optimistic Lock Conflict: Case was modified concurrently. Please refresh data.',
        currentVersion
      });
    }

    const nextVersion = currentVersion + 1;
    caseVersions.set(caseId, nextVersion);

    const auditEntry = {
      action: 'CASE_REOPEN',
      caseId,
      reason,
      officerId,
      version: nextVersion,
      timestamp: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: `Case ${caseId} reopened for investigation under version ${nextVersion}.`,
      newVersion: nextVersion,
      auditEntry
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reopen case: ' + err.message });
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

export default router;
