import jwt from 'jsonwebtoken';
import catalyst from 'zcatalyst-sdk-node';

const JWT_SECRET = process.env.JWT_SECRET || 'ksp-super-secret-key';

// Define hierarchical ranks for role checking
export const RANK_HIERARCHY = {
  'DGP': 1,
  'ADGP': 2,
  'IGP': 3,
  'DIG': 4,
  'SP': 5,
  'Commissioner': 5,
  'Additional SP': 6,
  'DSP': 7,
  'Deputy Superintendent of Police': 7,
  'ACP': 7,
  'Circle Inspector': 8,
  'Police Inspector': 9,
  'SHO': 9,
  'Inspector': 9,
  'Sub Inspector': 10,
  'ASI': 11,
  'Head Constable': 12,
  'Constable': 13
};

// 1. Authenticate Middleware
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
};

// 2. Authorize Role Middleware (Check if user rank is at least `requiredRank`)
export const authorizeRole = (requiredRank) => {
  return (req, res, next) => {
    const userRankLevel = RANK_HIERARCHY[req.user.Rank] || 99;
    const requiredRankLevel = RANK_HIERARCHY[requiredRank] || 99;
    
    if (userRankLevel <= requiredRankLevel) {
      next();
    } else {
      return res.status(403).json({ error: `Insufficient rank. Minimum ${requiredRank} required.` });
    }
  };
};

// 3. Authorize Jurisdiction Middleware
export const authorizeJurisdiction = async (req, res, next) => {
  const user = req.user;
  let filters = {};

  const rank = user.Rank;
  if (['DGP', 'ADGP', 'IGP'].includes(rank)) {
    filters = {}; // State level - sees everything
  } else if (['DIG', 'SP', 'Commissioner'].includes(rank)) {
    filters = { DistrictID: user.DistrictID };
  } else if (['DSP', 'Deputy Superintendent of Police', 'ACP'].includes(rank)) {
    filters = { DistrictID: user.DistrictID }; // Ideally subdivision, mapping to District for now
  } else {
    filters = { UnitID: user.UnitID }; // Station level
  }

  req.emergencyAccess = [];

  // Check Emergency Access Table in Catalyst Data Store
  if (!process.env.SKIP_CATALYST_CHECKS) {
    try {
      const app = catalyst.initialize(req); 
      const zcql = app.zcql();
      
      const query = `SELECT * FROM EmergencyAccess WHERE GrantedToOfficerID='${user.OfficerID}' AND Status='Active'`;
      
      const emergencyRecords = await zcql.executeZCQLQuery(query);
      
      if (emergencyRecords && emergencyRecords.length > 0) {
        req.emergencyAccess = emergencyRecords.map(r => r.EmergencyAccess);
      }
    } catch (err) {
      console.log('[Middleware] Emergency access check skipped/failed:', err.message);
    }
  }

  req.jurisdictionFilter = filters;
  next();
};

export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
