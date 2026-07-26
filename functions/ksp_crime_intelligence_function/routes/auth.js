import express from 'express';
import jwt from 'jsonwebtoken';
import catalyst from 'zcatalyst-sdk-node';
import { getTableData, leftJoin } from '../utils/csvService.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    if (!employeeId || !password) {
      return res.status(400).json({ error: 'Employee ID and Password are required' });
    }

    // 1. Fetch tables
    const officersTable = await getTableData('Officer');
    const unitsTable = await getTableData('Unit');
    const districtsTable = await getTableData('District');

    // 2. Find specific officer by ID, Email, or Phone (Case-insensitive & whitespace tolerant)
    const normalizedEmpId = String(employeeId).trim().toLowerCase();
    let officer = officersTable.find(o => {
      const oId = String(o.OfficerID || '').trim().toLowerCase();
      const oEmail = String(o.Email || '').trim().toLowerCase();
      const oContact = String(o.Contact || '').trim().toLowerCase();
      return oId === normalizedEmpId || oEmail === normalizedEmpId || oContact === normalizedEmpId;
    });
    
    if (!officer) {
      return res.status(401).json({ error: 'Invalid credentials or Officer not found' });
    }

    // 3. Password Verification (simulated with ksp123)
    const reqPassword = String(password).trim();
    if (reqPassword !== 'ksp123' && reqPassword !== String(officer.Password || '').trim()) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // 4. Manual Joins for UnitName and DistrictName
    const unit = unitsTable.find(u => u.UnitID === officer.UnitID) || {};
    const district = districtsTable.find(d => d.DistrictID === officer.DistrictID) || {};

    officer.UnitName = unit.UnitName || 'Unknown Unit';
    officer.DistrictName = district.DistrictName || 'Unknown District';

    // 5. Role mapping
    let role = 'IO';
    if (officer.RankID === 'R-03' || officer.Rank === 'Inspector' || officer.RankID === 'R008') role = 'SHO';
    if (officer.RankID === 'R-02' || officer.Rank === 'DSP' || officer.Rank === 'Deputy Superintendent of Police' || officer.Rank === 'SP' || officer.RankID === 'R006') role = 'DSP';
    if (officer.RankID === 'R-01' || officer.Rank === 'IGP' || officer.Rank === 'DGP' || officer.OfficerID === 'OFF008') role = 'ADMIN';

    // 6. Generate Session Token
    const payload = {
      OfficerID: officer.OfficerID,
      OfficerName: officer.OfficerName,
      Rank: officer.Rank,
      Designation: officer.RankID || officer.Rank,
      Role: role,
      StateID: officer.StateID,
      DistrictID: officer.DistrictID,
      UnitID: officer.UnitID,
      Station: officer.PoliceStation,
      Email: officer.Email,
    };
    
    const token = generateToken(payload);

    // Return mapped AuthContext User
    res.json({
      token,
      user: {
        employeeId: officer.OfficerID,
        name: officer.OfficerName,
        role: role,
        designation: officer.RankID || officer.Rank,
        rank: officer.Rank,
        unitId: officer.UnitID,
        unitName: officer.UnitName,
        districtId: officer.DistrictID,
        districtName: officer.DistrictName,
        stateId: officer.StateID,
        station: officer.PoliceStation,
        email: officer.Email
      }
    });

  } catch (err) {
    console.error("[Auth CSV] Error:", err.message);
    res.status(500).json({ error: 'Authentication failed: ' + (err.message || String(err)) });
  }
});

// === EMERGENCY ACCESS ENDPOINTS ===

// Grant Emergency Access
router.post('/emergency-access/grant', async (req, res) => {
  try {
    const { grantedToOfficerId, caseId, districtId, permissionType, reason, durationHours } = req.body;
    
    // Auth Check
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksp-super-secret-key');
    
    // Only Senior Officers can grant access (SP, DIG, IGP, DGP)
    const allowedRanks = ['DGP', 'ADGP', 'IGP', 'DIG', 'SP', 'Commissioner'];
    if (!allowedRanks.includes(decoded.Rank)) {
      return res.status(403).json({ error: 'Insufficient rank to grant emergency access' });
    }

    const app = catalyst.initialize(req);
    const datastore = app.datastore();
    
    const grantedAt = new Date();
    const expiresAt = new Date(grantedAt.getTime() + (durationHours * 60 * 60 * 1000));
    
    const accessId = `EA-${Date.now()}`;

    // Insert into EmergencyAccess table
    const rowData = {
      AccessID: accessId,
      GrantedByOfficerID: decoded.OfficerID,
      GrantedToOfficerID: grantedToOfficerId,
      CaseID: caseId || null,
      DistrictID: districtId || null,
      PermissionType: permissionType || 'READ',
      Reason: reason || 'Emergency Investigation Access',
      GrantedAt: grantedAt.toISOString(),
      ExpiresAt: expiresAt.toISOString(),
      Status: 'Active',
      CreatedAt: new Date().toISOString()
    };
    
    const table = datastore.table('EmergencyAccess');
    const insertedRow = await table.insertRow(rowData);
    
    // Audit Trail Log
    console.log(`[ACTIVITY LOG AUDIT TRAIL] Action: EMERGENCY_ACCESS_GRANTED | AccessID: ${accessId} | GrantedBy: ${decoded.OfficerID} | GrantedTo: ${grantedToOfficerId} | CaseID: ${caseId || 'N/A'} | DistrictID: ${districtId || 'N/A'} | Time: ${new Date().toISOString()}`);
    
    res.json({ success: true, message: 'Emergency access granted successfully', data: insertedRow });
  } catch (err) {
    console.error("[Emergency Access] Grant Error:", err.message);
    res.status(500).json({ error: 'Failed to grant emergency access: ' + err.message });
  }
});

// Revoke Emergency Access
router.post('/emergency-access/revoke', async (req, res) => {
  try {
    const { accessId } = req.body;
    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksp-super-secret-key');
    
    const app = catalyst.initialize(req);
    const datastore = app.datastore();
    const table = datastore.table('EmergencyAccess');
    
    // Update the record status to Revoked
    const updatedRow = await table.updateRow({
      ROWID: accessId,
      Status: 'Revoked'
    });
    
    // Audit Trail Log
    console.log(`[ACTIVITY LOG AUDIT TRAIL] Action: EMERGENCY_ACCESS_REVOKED | AccessID: ${accessId} | RevokedBy: ${decoded.OfficerID} | Time: ${new Date().toISOString()}`);
    
    res.json({ success: true, message: 'Emergency access revoked', data: updatedRow });
  } catch (err) {
    console.error("[Emergency Access] Revoke Error:", err.message);
    res.status(500).json({ error: 'Failed to revoke emergency access: ' + err.message });
  }
});

// List Emergency Access (For Admin / Senior Officers)
router.get('/emergency-access/list', async (req, res) => {
  try {
    const app = catalyst.initialize(req);
    const zcql = app.zcql();
    
    const query = `SELECT * FROM EmergencyAccess ORDER BY CreatedAt DESC`;
    const records = await zcql.executeZCQLQuery(query);
    
    res.json(records.map(r => r.EmergencyAccess));
  } catch (err) {
    console.warn("[Emergency Access List] Cloud SDK unavailable in local dev, returning empty list:", err.message);
    res.json([]);
  }
});

export default router;
