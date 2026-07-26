/**
 * Whitelisted ZCQL Query Builder
 * Grounded in the Master Entity Relationship Map for KSP Crime Intelligence.
 * Respects Catalyst 4-JOIN ZCQL limit while supporting deep relational queries.
 */

export const ER_RELATIONSHIP_MAP = {
  CaseMaster: {
    CrimeMajorHeadID: { table: 'CrimeMajorHeadMaster', fk: 'CrimeMajorHeadID' },
    CrimeMinorHeadID: { table: 'CrimeMinorHeadMaster', fk: 'CrimeMinorHeadID' },
    CaseStatusID: { table: 'CaseStatusMaster', fk: 'CaseStatusID' },
    DistrictID: { table: 'DistrictMaster', fk: 'DistrictID' },
    PoliceStationID: { table: 'PoliceStationMaster', fk: 'PoliceStationID' },
    InvestigationOfficerID: { table: 'Officer', fk: 'OfficerID' },
    CourtID: { table: 'CourtMaster', fk: 'CourtID' }
  },
  Accused: {
    CaseID: { table: 'CaseMaster', fk: 'CaseID' },
    GenderID: { table: 'GenderMaster', fk: 'GenderID' },
    OccupationID: { table: 'OccupationMaster', fk: 'OccupationID' }
  },
  Victim: {
    CaseID: { table: 'CaseMaster', fk: 'CaseID' },
    GenderID: { table: 'GenderMaster', fk: 'GenderID' },
    OccupationID: { table: 'OccupationMaster', fk: 'OccupationID' },
    StateID: { table: 'StateMaster', fk: 'StateID' }
  },
  Officer: {
    RankID: { table: 'RankMaster', fk: 'RankID' },
    DesignationID: { table: 'DesignationMaster', fk: 'DesignationID' },
    UnitID: { table: 'UnitMaster', fk: 'UnitID' }
  },
  PoliceStationMaster: {
    DistrictID: { table: 'DistrictMaster', fk: 'DistrictID' }
  },
  DistrictMaster: {
    StateID: { table: 'StateMaster', fk: 'StateID' }
  }
};

export function buildWhitelistedZCQL(intent) {
  const { targetTable = 'CaseMaster', filters = {}, limit = 50, joinTables = [] } = intent;

  // Pre-configured optimal 4-JOIN sets respecting Catalyst constraints
  let defaultJoins = [];

  if (targetTable === 'CaseMaster') {
    defaultJoins = [
      { table: 'CrimeMajorHeadMaster', onKey: 'CrimeMajorHeadID', foreignKey: 'CrimeMajorHeadID' },
      { table: 'CaseStatusMaster', onKey: 'CaseStatusID', foreignKey: 'CaseStatusID' },
      { table: 'DistrictMaster', onKey: 'DistrictID', foreignKey: 'DistrictID' },
      { table: 'PoliceStationMaster', onKey: 'PoliceStationID', foreignKey: 'PoliceStationID' }
    ];
  } else if (targetTable === 'Accused') {
    defaultJoins = [
      { table: 'CaseMaster', onKey: 'CaseID', foreignKey: 'CaseID' },
      { table: 'GenderMaster', onKey: 'GenderID', foreignKey: 'GenderID' }
    ];
  } else if (targetTable === 'Officer') {
    defaultJoins = [
      { table: 'RankMaster', onKey: 'RankID', foreignKey: 'RankID' },
      { table: 'DesignationMaster', onKey: 'DesignationID', foreignKey: 'DesignationID' },
      { table: 'UnitMaster', onKey: 'UnitID', foreignKey: 'UnitID' }
    ];
  }

  const safeJoins = (joinTables.length > 0 ? joinTables : defaultJoins).slice(0, 4);
  
  let zcql = `SELECT * FROM ${targetTable}`;
  
  if (safeJoins.length > 0) {
    safeJoins.forEach(join => {
      zcql += ` LEFT JOIN ${join.table} ON ${targetTable}.${join.onKey} = ${join.table}.${join.foreignKey}`;
    });
  }

  const whereClauses = [];

  if (filters.district) {
    whereClauses.push(`(DistrictMaster.DistrictName LIKE '%${sanitize(filters.district)}%' OR ${targetTable}.DistrictID = '${sanitize(filters.district)}')`);
  }
  if (filters.crimeType) {
    whereClauses.push(`(CrimeMajorHeadMaster.CrimeMajorHeadName LIKE '%${sanitize(filters.crimeType)}%' OR ${targetTable}.CrimeMajorHeadID = '${sanitize(filters.crimeType)}')`);
  }
  if (filters.status) {
    whereClauses.push(`(CaseStatusMaster.CaseStatusName LIKE '%${sanitize(filters.status)}%' OR ${targetTable}.CaseStatusID = '${sanitize(filters.status)}')`);
  }
  if (filters.firNumber) {
    whereClauses.push(`${targetTable}.FIRNumber LIKE '%${sanitize(filters.firNumber)}%'`);
  }
  if (filters.caseId) {
    whereClauses.push(`${targetTable}.CaseID = '${sanitize(filters.caseId)}'`);
  }

  if (whereClauses.length > 0) {
    zcql += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  zcql += ` LIMIT ${Math.min(limit, 100)}`;

  return {
    zcql,
    tableCount: 1 + safeJoins.length,
    explained: `Querying ${targetTable} with ${safeJoins.length} ER-mapped JOINs (${safeJoins.map(j => j.table).join(', ')}).`
  };
}

function sanitize(val) {
  if (typeof val !== 'string') return val;
  return val.replace(/['";\\]/g, '');
}
