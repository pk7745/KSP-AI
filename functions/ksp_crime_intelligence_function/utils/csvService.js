import axios from 'axios';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://ksp-data-development.zohostratus.com';
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

// Embedded officer dataset fallback for cloud deployment resilience
const EMBEDDED_OFFICERS = [
  { "OfficerID": "OFF001", "CaseID": "CASE001", "OfficerName": "Rajesh Kumar", "Rank": "Inspector", "PoliceStation": "Cubbon Park Police Station", "Contact": "9876510000", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U001", "DistrictID": "DIS001", "StateID": "ST001", "Email": "rajesh.kumar@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF002", "CaseID": "CASE002", "OfficerName": "Priya Sharma", "Rank": "Sub Inspector", "PoliceStation": "Whitefield Police Station", "Contact": "9876510001", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U002", "DistrictID": "DIS001", "StateID": "ST001", "Email": "priya.sharma@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF003", "CaseID": "CASE003", "OfficerName": "Manjunath Hegde", "Rank": "Inspector", "PoliceStation": "Indiranagar Police Station", "Contact": "9876510002", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U003", "DistrictID": "DIS001", "StateID": "ST001", "Email": "manjunath.hegde@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF004", "CaseID": "CASE004", "OfficerName": "Anita Rao", "Rank": "Deputy Superintendent of Police", "PoliceStation": "Electronic City Police Station", "Contact": "9876510003", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U004", "DistrictID": "DIS001", "StateID": "ST001", "Email": "anita.rao@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF005", "CaseID": "CASE005", "OfficerName": "Suresh Patil", "Rank": "Inspector", "PoliceStation": "Jayanagar Police Station", "Contact": "9876510004", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U005", "DistrictID": "DIS001", "StateID": "ST001", "Email": "suresh.patil@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF008", "CaseID": "CASE006", "OfficerName": "Ramesh Kulkarni", "Rank": "IGP", "PoliceStation": "Belagavi Police Station", "Contact": "9876510005", "RankID": "R-01", "DesignationID": "DES005", "UnitID": "U008", "DistrictID": "DIS004", "StateID": "ST001", "Email": "ramesh.kulkarni@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF011", "CaseID": "CASE007", "OfficerName": "Bengaluru Urban SP", "Rank": "SP", "PoliceStation": "Cubbon Park Police Station", "Contact": "9876510006", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U001", "DistrictID": "DIS001", "StateID": "ST001", "Email": "sp.bengaluruurban@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF012", "CaseID": "CASE008", "OfficerName": "Bengaluru Urban Inspector", "Rank": "Inspector", "PoliceStation": "Cubbon Park Police Station", "Contact": "9876510007", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U001", "DistrictID": "DIS001", "StateID": "ST001", "Email": "inspector.bengaluruurban@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF013", "CaseID": "CASE009", "OfficerName": "Bengaluru Urban Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Cubbon Park Police Station", "Contact": "9876510008", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U001", "DistrictID": "DIS001", "StateID": "ST001", "Email": "si.bengaluruurban@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF014", "CaseID": "CASE0010", "OfficerName": "Mysuru SP", "Rank": "SP", "PoliceStation": "Mysuru South Police Station", "Contact": "9876510009", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U006", "DistrictID": "DIS002", "StateID": "ST001", "Email": "sp.mysuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF015", "CaseID": "CASE001", "OfficerName": "Mysuru Inspector", "Rank": "Inspector", "PoliceStation": "Mysuru South Police Station", "Contact": "9876510010", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U006", "DistrictID": "DIS002", "StateID": "ST001", "Email": "inspector.mysuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF016", "CaseID": "CASE002", "OfficerName": "Mysuru Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Mysuru South Police Station", "Contact": "9876510011", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U006", "DistrictID": "DIS002", "StateID": "ST001", "Email": "si.mysuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF017", "CaseID": "CASE003", "OfficerName": "Mangaluru SP", "Rank": "SP", "PoliceStation": "Mangaluru North Police Station", "Contact": "9876510012", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U007", "DistrictID": "DIS003", "StateID": "ST001", "Email": "sp.mangaluru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF018", "CaseID": "CASE004", "OfficerName": "Mangaluru Inspector", "Rank": "Inspector", "PoliceStation": "Mangaluru North Police Station", "Contact": "9876510013", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U007", "DistrictID": "DIS003", "StateID": "ST001", "Email": "inspector.mangaluru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF019", "CaseID": "CASE005", "OfficerName": "Mangaluru Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Mangaluru North Police Station", "Contact": "9876510014", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U007", "DistrictID": "DIS003", "StateID": "ST001", "Email": "si.mangaluru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF020", "CaseID": "CASE006", "OfficerName": "Belagavi SP", "Rank": "SP", "PoliceStation": "Belagavi Police Station", "Contact": "9876510015", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U008", "DistrictID": "DIS004", "StateID": "ST001", "Email": "sp.belagavi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF021", "CaseID": "CASE007", "OfficerName": "Belagavi Inspector", "Rank": "Inspector", "PoliceStation": "Belagavi Police Station", "Contact": "9876510016", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U008", "DistrictID": "DIS004", "StateID": "ST001", "Email": "inspector.belagavi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF022", "CaseID": "CASE008", "OfficerName": "Belagavi Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Belagavi Police Station", "Contact": "9876510017", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U008", "DistrictID": "DIS004", "StateID": "ST001", "Email": "si.belagavi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF023", "CaseID": "CASE009", "OfficerName": "Hubballi-Dharwad SP", "Rank": "SP", "PoliceStation": "Hubballi Town Police Station", "Contact": "9876510018", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U009", "DistrictID": "DIS005", "StateID": "ST001", "Email": "sp.hubballi-dharwad@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF024", "CaseID": "CASE0010", "OfficerName": "Hubballi-Dharwad Inspector", "Rank": "Inspector", "PoliceStation": "Hubballi Town Police Station", "Contact": "9876510019", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U009", "DistrictID": "DIS005", "StateID": "ST001", "Email": "inspector.hubballi-dharwad@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF025", "CaseID": "CASE001", "OfficerName": "Hubballi-Dharwad Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Hubballi Town Police Station", "Contact": "9876510020", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U009", "DistrictID": "DIS005", "StateID": "ST001", "Email": "si.hubballi-dharwad@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF026", "CaseID": "CASE002", "OfficerName": "Shivamogga SP", "Rank": "SP", "PoliceStation": "Shivamogga Police Station", "Contact": "9876510021", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U010", "DistrictID": "DIS006", "StateID": "ST001", "Email": "sp.shivamogga@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF027", "CaseID": "CASE003", "OfficerName": "Shivamogga Inspector", "Rank": "Inspector", "PoliceStation": "Shivamogga Police Station", "Contact": "9876510022", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U010", "DistrictID": "DIS006", "StateID": "ST001", "Email": "inspector.shivamogga@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF028", "CaseID": "CASE004", "OfficerName": "Shivamogga Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Shivamogga Police Station", "Contact": "9876510023", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U010", "DistrictID": "DIS006", "StateID": "ST001", "Email": "si.shivamogga@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF029", "CaseID": "CASE005", "OfficerName": "Davanagere SP", "Rank": "SP", "PoliceStation": "Davanagere Town Police Station", "Contact": "9876510024", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U011", "DistrictID": "DIS007", "StateID": "ST001", "Email": "sp.davanagere@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF030", "CaseID": "CASE006", "OfficerName": "Davanagere Inspector", "Rank": "Inspector", "PoliceStation": "Davanagere Town Police Station", "Contact": "9876510025", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U011", "DistrictID": "DIS007", "StateID": "ST001", "Email": "inspector.davanagere@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF031", "CaseID": "CASE007", "OfficerName": "Davanagere Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Davanagere Town Police Station", "Contact": "9876510026", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U011", "DistrictID": "DIS007", "StateID": "ST001", "Email": "si.davanagere@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF032", "CaseID": "CASE008", "OfficerName": "Ballari SP", "Rank": "SP", "PoliceStation": "Ballari Central Police Station", "Contact": "9876510027", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U012", "DistrictID": "DIS008", "StateID": "ST001", "Email": "sp.ballari@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF033", "CaseID": "CASE009", "OfficerName": "Ballari Inspector", "Rank": "Inspector", "PoliceStation": "Ballari Central Police Station", "Contact": "9876510028", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U012", "DistrictID": "DIS008", "StateID": "ST001", "Email": "inspector.ballari@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF034", "CaseID": "CASE0010", "OfficerName": "Ballari Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Ballari Central Police Station", "Contact": "9876510029", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U012", "DistrictID": "DIS008", "StateID": "ST001", "Email": "si.ballari@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF035", "CaseID": "CASE001", "OfficerName": "Tumakuru SP", "Rank": "SP", "PoliceStation": "Tumakuru Town Police Station", "Contact": "9876510030", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U013", "DistrictID": "DIS009", "StateID": "ST001", "Email": "sp.tumakuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF036", "CaseID": "CASE002", "OfficerName": "Tumakuru Inspector", "Rank": "Inspector", "PoliceStation": "Tumakuru Town Police Station", "Contact": "9876510031", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U013", "DistrictID": "DIS009", "StateID": "ST001", "Email": "inspector.tumakuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF037", "CaseID": "CASE003", "OfficerName": "Tumakuru Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Tumakuru Town Police Station", "Contact": "9876510032", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U013", "DistrictID": "DIS009", "StateID": "ST001", "Email": "si.tumakuru@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF038", "CaseID": "CASE004", "OfficerName": "Udupi SP", "Rank": "SP", "PoliceStation": "Udupi Town Police Station", "Contact": "9876510033", "RankID": "R006", "DesignationID": "DES005", "UnitID": "U014", "DistrictID": "DIS010", "StateID": "ST001", "Email": "sp.udupi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF039", "CaseID": "CASE005", "OfficerName": "Udupi Inspector", "Rank": "Inspector", "PoliceStation": "Udupi Town Police Station", "Contact": "9876510034", "RankID": "R008", "DesignationID": "DES001", "UnitID": "U014", "DistrictID": "DIS010", "StateID": "ST001", "Email": "inspector.udupi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" },
  { "OfficerID": "OFF040", "CaseID": "CASE006", "OfficerName": "Udupi Sub Inspector", "Rank": "Sub Inspector", "PoliceStation": "Udupi Town Police Station", "Contact": "9876510035", "RankID": "R009", "DesignationID": "DES003", "UnitID": "U014", "DistrictID": "DIS010", "StateID": "ST001", "Email": "si.udupi@ksp.gov.in", "Status": "Active", "JoiningDate": "2018-06-15" }
];

const LOCAL_DATA_PATHS = [
  path.resolve(__dirname, '../data'),
  path.resolve(__dirname, '../../../data'),
  path.resolve(process.cwd(), 'data'),
  path.resolve(process.cwd(), '../data')
];

function readLocalCsv(tableName) {
  for (const dirPath of LOCAL_DATA_PATHS) {
    try {
      const filePath = path.join(dirPath, `${tableName}.csv`);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const records = parse(content, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        });
        if (records && records.length > 0) {
          return records;
        }
      }
    } catch (err) {
      // Continue trying next path
    }
  }
  return [];
}

/**
 * Fetches a CSV file from Stratus, merges with local dataset & embedded backup, and caches it.
 * @param {string} tableName - The exact name of the table (e.g. 'CaseMaster')
 */
export async function getTableData(tableName) {
  const cached = cache.get(tableName);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  const localRecords = readLocalCsv(tableName);
  if (tableName === 'Officer') {
    localRecords.push(...EMBEDDED_OFFICERS);
  }

  let remoteRecords = [];

  try {
    const url = `${BASE_URL}/${tableName}.csv`;
    const response = await axios.get(url, { timeout: 3000 });
    remoteRecords = parse(response.data, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
  } catch (error) {
    console.warn(`[CSV Service] Remote fetch for ${tableName}.csv unavailable, using local fallback.`);
  }

  // Merge remote and local records using primary key to avoid duplicates
  const primaryKeys = {
    Officer: 'OfficerID',
    CaseMaster: 'CrimeNumber',
    District: 'DistrictID',
    Unit: 'UnitID',
    Accused: 'AccusedID',
    Victim: 'VictimID',
    Witness: 'WitnessID',
    Evidence: 'EvidenceID',
    AIAnalysis: 'AIAnalysisID'
  };

  const keyField = primaryKeys[tableName];
  let mergedRecords = [];

  if (keyField && (remoteRecords.length > 0 || localRecords.length > 0)) {
    const seen = new Set();
    // Add remote first
    remoteRecords.forEach(r => {
      if (r[keyField]) {
        seen.add(r[keyField]);
        mergedRecords.push(r);
      }
    });
    // Add local items if not present in remote
    localRecords.forEach(l => {
      if (l[keyField] && !seen.has(l[keyField])) {
        seen.add(l[keyField]);
        mergedRecords.push(l);
      }
    });
  } else {
    mergedRecords = remoteRecords.length > 0 ? remoteRecords : localRecords;
  }

  cache.set(tableName, {
    timestamp: Date.now(),
    data: mergedRecords
  });

  return mergedRecords;
}

/**
 * Performs a LEFT JOIN in memory
 */
export function leftJoin(leftTable, rightTable, leftKey, rightKey) {
  return leftTable.map(leftRow => {
    const matchedRow = rightTable.find(rightRow => rightRow[rightKey] === leftRow[leftKey]);
    return { ...leftRow, ...matchedRow };
  });
}
