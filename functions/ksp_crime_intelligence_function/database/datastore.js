import catalyst from 'zcatalyst-sdk-node';
import { 
  MOCK_CASE_MASTER, 
  MOCK_ACCUSED, 
  MOCK_VICTIM, 
  MOCK_WITNESS, 
  MOCK_EVIDENCE, 
  MOCK_DISTRICT_MASTER, 
  MOCK_POLICE_STATION_MASTER,
  MOCK_ACTIVITY_LOG
} from '../services/mockData.js';

export async function executeZCQL(req, queryStr) {
  try {
    if (req && process.env.CATALYST_PROJECT_ID) {
      const catalystApp = catalyst.initialize(req);
      const zcql = catalystApp.zcql();
      const result = await zcql.executeZCQLQuery(queryStr);
      return result;
    }
  } catch (err) {
    console.warn(`[ZCQL WARNING] Query '${queryStr}' fallback triggered:`, err.message);
  }

  return fallbackQueryEngine(queryStr);
}

function fallbackQueryEngine(queryStr) {
  const upper = queryStr.toUpperCase();
  
  if (upper.includes("COUNT(")) {
    let filtered = [...MOCK_CASE_MASTER];
    if (upper.includes("WHERE")) {
      if (upper.includes("HEINOUS")) filtered = filtered.filter(c => c.GravityOffenceName === 'Heinous');
      if (upper.includes("UNDER INVESTIGATION")) filtered = filtered.filter(c => c.CaseStatusName === 'Under Investigation');
    }
    return [{ CaseMaster: { "COUNT(CaseID)": filtered.length } }];
  }

  if (upper.includes("FROM ACCUSED")) {
    return MOCK_ACCUSED.map(a => ({ Accused: a }));
  }

  if (upper.includes("FROM DISTRICTMASTER") || upper.includes("FROM DISTRICT")) {
    return MOCK_DISTRICT_MASTER.map(d => ({ DistrictMaster: d }));
  }

  if (upper.includes("FROM POLICESTATIONMASTER") || upper.includes("FROM POLICESTATION")) {
    return MOCK_POLICE_STATION_MASTER.map(s => ({ PoliceStationMaster: s }));
  }

  return MOCK_CASE_MASTER.map(c => ({ CaseMaster: c }));
}

export function getMockDataStore() {
  return {
    cases: MOCK_CASE_MASTER,
    accused: MOCK_ACCUSED,
    victims: MOCK_VICTIM,
    witnesses: MOCK_WITNESS,
    evidence: MOCK_EVIDENCE,
    districts: MOCK_DISTRICT_MASTER,
    stations: MOCK_POLICE_STATION_MASTER,
    activityLogs: MOCK_ACTIVITY_LOG
  };
}
