import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('C:/Users/pky45/.gemini/antigravity/scratch/ksp-ai/data');

console.log('[Dataset Expansion] Starting dataset enrichment for all Karnataka districts...');

// 1. Expanded Districts (10 Districts)
const districts = [
  { id: 'DIS001', name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946 },
  { id: 'DIS002', name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { id: 'DIS003', name: 'Mangaluru', lat: 12.9141, lng: 74.8560 },
  { id: 'DIS004', name: 'Belagavi', lat: 15.8497, lng: 74.4977 },
  { id: 'DIS005', name: 'Hubballi-Dharwad', lat: 15.3647, lng: 75.1240 },
  { id: 'DIS006', name: 'Shivamogga', lat: 13.9299, lng: 75.5681 },
  { id: 'DIS007', name: 'Davanagere', lat: 14.4644, lng: 75.9218 },
  { id: 'DIS008', name: 'Ballari', lat: 15.1394, lng: 76.9214 },
  { id: 'DIS009', name: 'Tumakuru', lat: 13.3392, lng: 77.1015 },
  { id: 'DIS010', name: 'Udupi', lat: 13.3409, lng: 74.7421 }
];

// 2. Expanded Units / Police Stations
const units = [
  { id: 'U001', name: 'Cubbon Park Police Station', districtId: 'DIS001', address: 'Kasturba Road Bengaluru' },
  { id: 'U002', name: 'Whitefield Police Station', districtId: 'DIS001', address: 'Whitefield Main Road Bengaluru' },
  { id: 'U003', name: 'Indiranagar Police Station', districtId: 'DIS001', address: '100 Feet Road Indiranagar Bengaluru' },
  { id: 'U004', name: 'Electronic City Police Station', districtId: 'DIS001', address: 'Electronic City Phase 1 Bengaluru' },
  { id: 'U005', name: 'Jayanagar Police Station', districtId: 'DIS001', address: '4th Block Jayanagar Bengaluru' },
  { id: 'U006', name: 'Mysuru South Police Station', districtId: 'DIS002', address: 'Nazarbad Mysuru' },
  { id: 'U007', name: 'Mangaluru North Police Station', districtId: 'DIS003', address: 'Lalbagh Mangaluru' },
  { id: 'U008', name: 'Belagavi Police Station', districtId: 'DIS004', address: 'Tilakwadi Belagavi' },
  { id: 'U009', name: 'Hubballi Town Police Station', districtId: 'DIS005', address: 'Old Hubballi Hubballi' },
  { id: 'U010', name: 'Shivamogga Police Station', districtId: 'DIS006', address: 'Vinoba Nagar Shivamogga' },
  { id: 'U011', name: 'Davanagere Town Police Station', districtId: 'DIS007', address: 'PB Road Davanagere' },
  { id: 'U012', name: 'Ballari Central Police Station', districtId: 'DIS008', address: 'Station Road Ballari' },
  { id: 'U013', name: 'Tumakuru Town Police Station', districtId: 'DIS009', address: 'BH Road Tumakuru' },
  { id: 'U014', name: 'Udupi Town Police Station', districtId: 'DIS010', address: 'Court Road Udupi' }
];

// Helper to format CSV row
function toCsvRow(arr) {
  return arr.map(val => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

// Write District.csv
const districtHeader = ['DistrictID', 'StateID', 'DistrictName', 'IsActive'];
const districtRows = districts.map(d => toCsvRow([d.id, 'ST001', d.name, 'true']));
fs.writeFileSync(path.join(DATA_DIR, 'District.csv'), [districtHeader.join(','), ...districtRows].join('\n'));

// Write Unit.csv
const unitHeader = ['UnitID', 'UnitName', 'UnitTypeID', 'StateID', 'DistrictID', 'ParentUnitID', 'Address', 'ContactNumber', 'Email', 'IsActive'];
const unitRows = units.map(u => toCsvRow([u.id, u.name, 'UT001', 'ST001', u.districtId, '', u.address, '08022943000', `${u.id.toLowerCase()}@ksp.gov.in`, 'true']));
fs.writeFileSync(path.join(DATA_DIR, 'Unit.csv'), [unitHeader.join(','), ...unitRows].join('\n'));

// 3. Generate Officers (At least 3 for every district + Demo Accounts)
const officerHeader = ['OfficerID', 'CaseID', 'OfficerName', 'Rank', 'PoliceStation', 'Contact', 'RankID', 'DesignationID', 'UnitID', 'DistrictID', 'StateID', 'Email', 'Status', 'JoiningDate'];
const officerList = [
  // Preserving mandatory Demo Accounts with exact IDs
  { id: 'OFF001', name: 'Rajesh Kumar', rank: 'Inspector', station: 'Cubbon Park Police Station', rankId: 'R008', desigId: 'DES001', unitId: 'U001', distId: 'DIS001', email: 'rajesh.kumar@ksp.gov.in' },
  { id: 'OFF002', name: 'Priya Sharma', rank: 'Sub Inspector', station: 'Whitefield Police Station', rankId: 'R009', desigId: 'DES003', unitId: 'U002', distId: 'DIS001', email: 'priya.sharma@ksp.gov.in' },
  { id: 'OFF003', name: 'Manjunath Hegde', rank: 'Inspector', station: 'Indiranagar Police Station', rankId: 'R008', desigId: 'DES001', unitId: 'U003', distId: 'DIS001', email: 'manjunath.hegde@ksp.gov.in' },
  { id: 'OFF004', name: 'Anita Rao', rank: 'Deputy Superintendent of Police', station: 'Electronic City Police Station', rankId: 'R006', desigId: 'DES005', unitId: 'U004', distId: 'DIS001', email: 'anita.rao@ksp.gov.in' },
  { id: 'OFF005', name: 'Suresh Patil', rank: 'Inspector', station: 'Jayanagar Police Station', rankId: 'R008', desigId: 'DES001', unitId: 'U005', distId: 'DIS001', email: 'suresh.patil@ksp.gov.in' },
  { id: 'OFF008', name: 'Ramesh Kulkarni', rank: 'IGP', station: 'Belagavi Police Station', rankId: 'R-01', desigId: 'DES005', unitId: 'U008', distId: 'DIS004', email: 'ramesh.kulkarni@ksp.gov.in' }
];

let officerIdCounter = 11;
districts.forEach((dist, idx) => {
  const distUnits = units.filter(u => u.districtId === dist.id);
  const primaryUnit = distUnits[0] || units[0];

  // SP for district
  officerList.push({
    id: `OFF${String(officerIdCounter++).padStart(3, '0')}`,
    name: `${dist.name} SP`,
    rank: 'SP',
    station: primaryUnit.name,
    rankId: 'R006',
    desigId: 'DES005',
    unitId: primaryUnit.id,
    distId: dist.id,
    email: `sp.${dist.name.toLowerCase().replace(/\s+/g, '')}@ksp.gov.in`
  });

  // Inspector / SHO for district
  officerList.push({
    id: `OFF${String(officerIdCounter++).padStart(3, '0')}`,
    name: `${dist.name} Inspector`,
    rank: 'Inspector',
    station: primaryUnit.name,
    rankId: 'R008',
    desigId: 'DES001',
    unitId: primaryUnit.id,
    distId: dist.id,
    email: `inspector.${dist.name.toLowerCase().replace(/\s+/g, '')}@ksp.gov.in`
  });

  // Sub Inspector for district
  officerList.push({
    id: `OFF${String(officerIdCounter++).padStart(3, '0')}`,
    name: `${dist.name} Sub Inspector`,
    rank: 'Sub Inspector',
    station: primaryUnit.name,
    rankId: 'R009',
    desigId: 'DES003',
    unitId: primaryUnit.id,
    distId: dist.id,
    email: `si.${dist.name.toLowerCase().replace(/\s+/g, '')}@ksp.gov.in`
  });
});

const officerRows = officerList.map((o, idx) => toCsvRow([
  o.id,
  `CASE00${(idx % 10) + 1}`,
  o.name,
  o.rank,
  o.station,
  `98765${String(idx + 10000).padStart(5, '0')}`,
  o.rankId,
  o.desigId,
  o.unitId,
  o.distId,
  'ST001',
  o.email,
  'Active',
  '2018-06-15'
]));

fs.writeFileSync(path.join(DATA_DIR, 'Officer.csv'), [officerHeader.join(','), ...officerRows].join('\n'));

// 4. Cases Generation (3-4 cases per district with varied crime types & risk)
const caseHeader = ['CrimeNumber', 'CrimeRegisteredDate', 'BriefFacts', 'CaseStatus', 'CrimeMajorHead', 'CrimeMinorHead', 'PoliceStation', 'District', 'Latitude', 'Longitude', 'CaseStatusID', 'CategoryID', 'GravityID', 'CrimeHeadID', 'CrimeSubHeadID', 'UnitID', 'DistrictID', 'OfficerID'];

const crimeCategories = [
  { head: 'Murder', minor: 'Homicide', catId: 'CAT001', gravId: 'GR010', headId: 'CH001', subHeadId: 'CSH001', fact: 'Victim found dead under suspicious circumstances in residential quarters.' },
  { head: 'Attempt to Murder', minor: 'Attempted Homicide', catId: 'CAT001', gravId: 'GR008', headId: 'CH001', subHeadId: 'CSH002', fact: 'Violent physical altercation involving sharp weapons reported at main market.' },
  { head: 'Cyber Crime', minor: 'Financial Phishing Fraud', catId: 'CAT004', gravId: 'GR007', headId: 'CH006', subHeadId: 'CSH011', fact: 'Unauthorized online bank transfer via phishing link.' },
  { head: 'Theft', minor: 'Vehicle Theft', catId: 'CAT002', gravId: 'GR003', headId: 'CH003', subHeadId: 'CSH005', fact: 'Two-wheeler stolen from public parking area outside commercial complex.' },
  { head: 'Burglary', minor: 'Commercial Burglary', catId: 'CAT002', gravId: 'GR006', headId: 'CH004', subHeadId: 'CSH008', fact: 'Lock broken and cash seized from electronic shop overnight.' },
  { head: 'Narcotics Offence', minor: 'Drug Trafficking', catId: 'CAT006', gravId: 'GR009', headId: 'CH008', subHeadId: 'CSH015', fact: 'Commercial quantity of contraband seized during highway vehicular check.' },
  { head: 'Domestic Violence', minor: 'Domestic Assault', catId: 'CAT005', gravId: 'GR005', headId: 'CH007', subHeadId: 'CSH013', fact: 'Physical assault and spousal harassment complaint lodged.' },
  { head: 'Kidnapping', minor: 'Ransom Kidnapping', catId: 'CAT001', gravId: 'GR010', headId: 'CH002', subHeadId: 'CSH004', fact: 'Abduction reported with demand for financial ransom.' }
];

const caseList = [];
const victimList = [];
const accusedList = [];
const witnessList = [];
const evidenceList = [];
const aiAnalysisList = [];
const activityList = [];
const chargesheetList = [];
const arrestList = [];
const complainantList = [];

let caseCounter = 1;
let victimCounter = 1;
let accusedCounter = 1;
let witnessCounter = 1;
let evidenceCounter = 1;
let aiCounter = 1;

districts.forEach(dist => {
  const distUnits = units.filter(u => u.districtId === dist.id);
  const distOfficers = officerList.filter(o => o.distId === dist.id);

  for (let i = 0; i < 4; i++) {
    const caseId = `CASE${String(caseCounter).padStart(3, '0')}`;
    const crimeNum = `KSP/${dist.id}/2026/${String(caseCounter).padStart(4, '0')}`;
    const unit = distUnits[i % distUnits.length] || units[0];
    const officer = distOfficers[i % distOfficers.length] || officerList[0];
    const crime = crimeCategories[(caseCounter - 1) % crimeCategories.length];
    const dateStr = `2026-0${(caseCounter % 6) + 1}-15`;

    caseList.push({
      CrimeNumber: crimeNum,
      CrimeRegisteredDate: dateStr,
      BriefFacts: `${crime.fact} Location: ${unit.name}, ${dist.name}.`,
      CaseStatus: i % 2 === 0 ? 'Under Investigation' : 'Charge Sheeted',
      CrimeMajorHead: crime.head,
      CrimeMinorHead: crime.minor,
      PoliceStation: unit.name,
      District: dist.name,
      Latitude: (dist.lat + (Math.random() - 0.5) * 0.05).toFixed(4),
      Longitude: (dist.lng + (Math.random() - 0.5) * 0.05).toFixed(4),
      CaseStatusID: i % 2 === 0 ? 'CS001' : 'CS002',
      CategoryID: crime.catId,
      GravityID: crime.gravId,
      CrimeHeadID: crime.headId,
      CrimeSubHeadID: crime.subHeadId,
      UnitID: unit.id,
      DistrictID: dist.id,
      OfficerID: officer.id
    });

    // Victim
    const vicId = `VIC${String(victimCounter++).padStart(3, '0')}`;
    victimList.push({
      VictimID: vicId,
      CaseID: crimeNum,
      VictimName: `Victim ${victimCounter} (${dist.name})`,
      Gender: i % 2 === 0 ? 'Male' : 'Female',
      Age: 25 + (i * 7),
      Mobile: `98761${String(victimCounter + 1000).padStart(5, '0')}`,
      Address: `${dist.name} Main Road`,
      Occupation: 'Resident',
      InjuryType: crime.head === 'Murder' ? 'Fatal' : 'Minor',
      Statement: `Victim statement recorded regarding ${crime.head}`,
      Email: `victim.${victimCounter}@email.com`,
      InjurySeverity: crime.head === 'Murder' ? 'Critical' : 'Mild',
      MedicalReport: `MR${victimCounter}`,
      HospitalName: `${dist.name} District Hospital`,
      VictimStatus: crime.head === 'Murder' ? 'Deceased' : 'Safe',
      EmergencyContact: `98762${String(victimCounter + 1000).padStart(5, '0')}`,
      IDProof: 'Aadhaar'
    });

    // Accused
    const accId = `ACC${String(accusedCounter++).padStart(3, '0')}`;
    accusedList.push({
      AccusedID: accId,
      CaseID: crimeNum,
      AccusedName: `Suspect ${accusedCounter} (${dist.name})`,
      Gender: 'Male',
      Age: 22 + (i * 5),
      Address: `${dist.name} Area`,
      Occupation: 'Unemployed',
      ArrestStatus: i % 2 === 0 ? 'Arrested' : 'Under Investigation',
      CriminalHistory: i % 3 === 0 ? 'Yes' : 'None',
      Mobile: `98764${String(accusedCounter + 1000).padStart(5, '0')}`,
      Email: `accused.${accusedCounter}@email.com`,
      Nationality: 'Indian',
      IDProof: 'Aadhaar',
      ArrestDate: dateStr,
      BailStatus: i % 2 === 0 ? 'Bail Rejected' : 'Not Applied',
      CustodyStatus: i % 2 === 0 ? 'Judicial Custody' : 'Not in Custody',
      FingerprintID: `FP${accusedCounter}`,
      Photograph: `acc${accusedCounter}.jpg`,
      Remarks: `Linked to ${crime.head} in ${dist.name}`
    });

    // Witness
    const witId = `WIT${String(witnessCounter++).padStart(3, '0')}`;
    witnessList.push({
      WitnessID: witId,
      CaseID: crimeNum,
      WitnessName: `Witness ${witnessCounter} (${dist.name})`,
      Gender: i % 2 === 0 ? 'Female' : 'Male',
      Age: 30 + (i * 4),
      Mobile: `98763${String(witnessCounter + 1000).padStart(5, '0')}`,
      Address: `${dist.name} Market Area`,
      Statement: `Eyewitness confirmed presence of suspect near scene of crime.`,
      Email: `witness.${witnessCounter}@email.com`,
      Occupation: 'Shop Owner',
      RelationshipToCase: 'Eyewitness',
      WitnessType: 'Eyewitness',
      IDProof: 'Aadhaar',
      AvailabilityStatus: 'Available'
    });

    // Evidence
    const evdId = `EVD${String(evidenceCounter++).padStart(3, '0')}`;
    evidenceList.push({
      EvidenceID: evdId,
      CaseID: crimeNum,
      EvidenceType: i % 3 === 0 ? 'Video' : i % 3 === 1 ? 'Image' : 'Document',
      Description: `Key evidence gathered for ${crime.head}`,
      CollectedBy: officer.name,
      CollectionDate: dateStr,
      Status: 'Verified',
      EvidenceNumber: `EV2026${evidenceCounter}`,
      LocationFound: `${unit.name} jurisdiction`,
      StorageLocation: 'Central Evidence Room',
      CollectedOfficerID: officer.id,
      ForensicLab: `FSL ${dist.name}`,
      ForensicReport: `FR${evidenceCounter}`,
      ChainOfCustody: 'Recorded',
      Photograph: `evidence${evidenceCounter}.jpg`,
      Remarks: 'AI OCR Scanned & indexed'
    });

    // AI Analysis
    const aiId = `AI${String(aiCounter++).padStart(3, '0')}`;
    aiAnalysisList.push({
      AIAnalysisID: aiId,
      CaseID: crimeNum,
      CrimePattern: `${crime.head} cluster detected`,
      SuspectPrediction: `High probability match with habitual offender DB`,
      RiskScore: (60 + (i * 10)),
      MOType: crime.minor,
      HotspotLocation: `${dist.name} Sector ${i + 1}`,
      AnalysisDate: dateStr,
      Recommendation: `Deploy CCTV verification and check ANPR logs.`
    });

    caseCounter++;
  }
});

// Write CaseMaster.csv
const caseRows = caseList.map(c => toCsvRow([
  c.CrimeNumber, c.CrimeRegisteredDate, c.BriefFacts, c.CaseStatus,
  c.CrimeMajorHead, c.CrimeMinorHead, c.PoliceStation, c.District,
  c.Latitude, c.Longitude, c.CaseStatusID, c.CategoryID, c.GravityID,
  c.CrimeHeadID, c.CrimeSubHeadID, c.UnitID, c.DistrictID, c.OfficerID
]));
fs.writeFileSync(path.join(DATA_DIR, 'CaseMaster.csv'), [caseHeader.join(','), ...caseRows].join('\n'));

// Write Victim.csv
const victimHeader = ['VictimID','CaseID','VictimName','Gender','Age','Mobile','Address','Occupation','InjuryType','Statement','Email','InjurySeverity','MedicalReport','HospitalName','VictimStatus','EmergencyContact','IDProof'];
const victimRows = victimList.map(v => toCsvRow(Object.values(v)));
fs.writeFileSync(path.join(DATA_DIR, 'Victim.csv'), [victimHeader.join(','), ...victimRows].join('\n'));

// Write Accused.csv
const accusedHeader = ['AccusedID','CaseID','AccusedName','Gender','Age','Address','Occupation','ArrestStatus','CriminalHistory','Mobile','Email','Nationality','IDProof','ArrestDate','BailStatus','CustodyStatus','FingerprintID','Photograph','Remarks'];
const accusedRows = accusedList.map(a => toCsvRow(Object.values(a)));
fs.writeFileSync(path.join(DATA_DIR, 'Accused.csv'), [accusedHeader.join(','), ...accusedRows].join('\n'));

// Write Witness.csv
const witnessHeader = ['WitnessID','CaseID','WitnessName','Gender','Age','Mobile','Address','Statement','Email','Occupation','RelationshipToCase','WitnessType','IDProof','AvailabilityStatus'];
const witnessRows = witnessList.map(w => toCsvRow(Object.values(w)));
fs.writeFileSync(path.join(DATA_DIR, 'Witness.csv'), [witnessHeader.join(','), ...witnessRows].join('\n'));

// Write Evidence.csv
const evidenceHeader = ['EvidenceID','CaseID','EvidenceType','Description','CollectedBy','CollectionDate','Status','EvidenceNumber','LocationFound','StorageLocation','CollectedOfficerID','ForensicLab','ForensicReport','ChainOfCustody','Photograph','Remarks'];
const evidenceRows = evidenceList.map(e => toCsvRow(Object.values(e)));
fs.writeFileSync(path.join(DATA_DIR, 'Evidence.csv'), [evidenceHeader.join(','), ...evidenceRows].join('\n'));

// Write AIAnalysis.csv
const aiHeader = ['AIAnalysisID','CaseID','CrimePattern','SuspectPrediction','RiskScore','MOType','HotspotLocation','AnalysisDate','Recommendation'];
const aiRows = aiAnalysisList.map(ai => toCsvRow(Object.values(ai)));
fs.writeFileSync(path.join(DATA_DIR, 'AIAnalysis.csv'), [aiHeader.join(','), ...aiRows].join('\n'));

console.log(`[Dataset Expansion Complete] Generated ${districts.length} districts, ${units.length} units, ${officerList.length} officers, and ${caseList.length} cases.`);
