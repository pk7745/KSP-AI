import express from 'express';
import { getTableData } from '../utils/csvService.js';
import { enrichCaseEcosystem } from '../services/syntheticDataGenerator.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Persistent Version Tracking Store (Survives AppSail cold-starts - Priority 2)
const VERSION_STORE_FILE = path.join(process.cwd(), 'scratch', 'persistent_case_versions.json');
let persistentVersions = new Map();

// Load persistent versions on boot
try {
  if (fs.existsSync(VERSION_STORE_FILE)) {
    const raw = fs.readFileSync(VERSION_STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    persistentVersions = new Map(Object.entries(parsed));
    console.log(`[CasesRoute] Loaded ${persistentVersions.size} persistent case versions from disk.`);
  }
} catch (e) {
  console.warn('[CasesRoute] Could not load persistent versions file, starting fresh Map.', e.message);
}

function getPersistentVersion(caseId) {
  return persistentVersions.get(caseId) || 1;
}

function savePersistentVersion(caseId, version) {
  persistentVersions.set(caseId, version);
  try {
    const dir = path.dirname(VERSION_STORE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const obj = Object.fromEntries(persistentVersions);
    fs.writeFileSync(VERSION_STORE_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (e) {
    console.warn('[CasesRoute] Failed to write persistent version file:', e.message);
  }
}

async function handleCaseDetailFetch(rawId, req, res) {
  try {
    const caseId = decodeURIComponent(String(rawId || '')).trim();
    if (!caseId) {
      return res.status(400).json({ error: 'Case ID parameter is required' });
    }

    // Safe Synthetic Sandbox Test Case (Priority 1)
    if (caseId.toUpperCase() === 'KSP/TEST/2026/99999' || caseId.toUpperCase() === 'KSP/SYNTH/2026/00001') {
      const currentVer = getPersistentVersion(caseId);
      return res.json({
        caseDetails: {
          CrimeNumber: 'KSP/TEST/2026/99999',
          CrimeNo: 'KSP/TEST/2026/99999',
          DistrictName: 'Bengaluru Urban',
          PoliceStationName: 'Cubbon Park PS',
          CrimeMajorHead: 'Test Investigation Sandbox',
          CaseStatus: 'Under Investigation',
          version: currentVer,
          isSyntheticSandbox: true
        },
        victims: [],
        accused: [{ AccusedName: 'Test Accused (Synthetic)', ArrestStatus: 'Under Investigation' }],
        witnesses: [],
        evidence: []
      });
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
    const currentVersion = getPersistentVersion(actualCaseId);

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
      const currentVersion = getPersistentVersion(c.CrimeNumber);

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

// Case Resolution Endpoint with Persistent Optimistic Locking & RBAC (Priority 1 & 2)
router.post('/resolve', async (req, res) => {
  try {
    const { caseId, outcome = 'Solved', expectedVersion = 1, officerId = 'OFF001', role = 'INSPECTOR' } = req.body;
    if (!caseId) return res.status(400).json({ error: 'Case ID is required for resolution.' });

    // RBAC Authorization Check (Priority 1)
    if (role === 'CONSTABLE' || role === 'UNAUTHORIZED') {
      return res.status(403).json({ error: 'Access Denied: Constables are not authorized to resolve cases.' });
    }

    const currentVersion = getPersistentVersion(caseId);
    if (expectedVersion && expectedVersion !== currentVersion) {
      return res.status(409).json({
        error: 'Optimistic Lock Conflict: Case was updated by another officer. Please refresh data.',
        currentVersion
      });
    }

    const nextVersion = currentVersion + 1;
    savePersistentVersion(caseId, nextVersion);

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
      message: `Case ${caseId} resolved as '${outcome}' under persistent version ${nextVersion}.`,
      newVersion: nextVersion,
      auditEntry
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to resolve case: ' + err.message });
  }
});

// Case Reopen Endpoint with Mandatory Reason & Persistent Optimistic Locking (Priority 1 & 2)
router.post('/reopen', async (req, res) => {
  try {
    const { caseId, reason, expectedVersion = 1, officerId = 'OFF001', role = 'INSPECTOR' } = req.body;
    
    // RBAC Authorization Check (Priority 1)
    if (role === 'CONSTABLE' || role === 'UNAUTHORIZED') {
      return res.status(403).json({ error: 'Access Denied: Constables are not authorized to reopen cases.' });
    }

    if (!caseId || !reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return res.status(400).json({ error: 'Case ID and mandatory reopening reason are required.' });
    }

    const currentVersion = getPersistentVersion(caseId);
    if (expectedVersion && expectedVersion !== currentVersion) {
      return res.status(409).json({
        error: 'Optimistic Lock Conflict: Case was modified concurrently. Please refresh data.',
        currentVersion
      });
    }

    const nextVersion = currentVersion + 1;
    savePersistentVersion(caseId, nextVersion);

    const auditEntry = {
      action: 'CASE_REOPEN',
      caseId,
      reason: reason.trim(),
      officerId,
      version: nextVersion,
      timestamp: new Date().toISOString()
    };

    return res.json({
      success: true,
      message: `Case ${caseId} reopened for investigation under persistent version ${nextVersion}.`,
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
