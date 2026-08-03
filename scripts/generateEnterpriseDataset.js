import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('C:/Users/pky45/.gemini/antigravity/scratch/ksp-ai/data');
const BACKEND_DATA_DIR = path.resolve('C:/Users/pky45/.gemini/antigravity/scratch/ksp-ai/functions/ksp_crime_intelligence_function/data');

console.log('===============================================================');
console.log('KSP AI PHASE 1: ENTERPRISE DATASET GENERATION (5,500+ CASES)');
console.log('===============================================================');

// Ensure data directories exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(BACKEND_DATA_DIR)) fs.mkdirSync(BACKEND_DATA_DIR, { recursive: true });

// Helper to format CSV row safely
function toCsvRow(arr) {
  return arr.map(val => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',');
}

// Helper to write CSV to both data locations
function writeCsv(filename, headers, rows) {
  const content = [headers.join(','), ...rows.map(r => toCsvRow(r))].join('\n');
  fs.writeFileSync(path.join(DATA_DIR, filename), content);
  fs.writeFileSync(path.join(BACKEND_DATA_DIR, filename), content);
  console.log(`  ✓ Generated ${filename}: ${rows.length} records`);
}

// 1. States (1)
const states = [
  ['ST001', 'Karnataka', 'true']
];

// 2. Districts (31 Districts covering all of Karnataka)
const districtData = [
  { id: 'DIS001', name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946 },
  { id: 'DIS002', name: 'Bengaluru Rural', lat: 13.2257, lng: 77.5750 },
  { id: 'DIS003', name: 'Ramanagara', lat: 12.7159, lng: 77.2812 },
  { id: 'DIS004', name: 'Chikkaballapura', lat: 13.4355, lng: 77.7315 },
  { id: 'DIS005', name: 'Kolar', lat: 13.1367, lng: 78.1291 },
  { id: 'DIS006', name: 'Tumakuru', lat: 13.3392, lng: 77.1015 },
  { id: 'DIS007', name: 'Shivamogga', lat: 13.9299, lng: 75.5681 },
  { id: 'DIS008', name: 'Chitradurga', lat: 14.2251, lng: 76.3980 },
  { id: 'DIS009', name: 'Davanagere', lat: 14.4644, lng: 75.9218 },
  { id: 'DIS010', name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
  { id: 'DIS011', name: 'Mandya', lat: 12.5218, lng: 76.8951 },
  { id: 'DIS012', name: 'Hassan', lat: 13.0033, lng: 76.1004 },
  { id: 'DIS013', name: 'Chamarajanagara', lat: 11.9261, lng: 76.9437 },
  { id: 'DIS014', name: 'Kodagu', lat: 12.4244, lng: 75.7382 },
  { id: 'DIS015', name: 'Dakshina Kannada (Mangaluru)', lat: 12.9141, lng: 74.8560 },
  { id: 'DIS016', name: 'Udupi', lat: 13.3409, lng: 74.7421 },
  { id: 'DIS017', name: 'Uttara Kannada (Karwar)', lat: 14.8185, lng: 74.1303 },
  { id: 'DIS018', name: 'Belagavi', lat: 15.8497, lng: 74.4977 },
  { id: 'DIS019', name: 'Dharwad', lat: 15.4589, lng: 75.0078 },
  { id: 'DIS020', name: 'Hubballi City', lat: 15.3647, lng: 75.1240 },
  { id: 'DIS021', name: 'Gadag', lat: 15.4319, lng: 75.6318 },
  { id: 'DIS022', name: 'Haveri', lat: 14.7946, lng: 75.3997 },
  { id: 'DIS023', name: 'Vijayapura', lat: 16.8302, lng: 75.7100 },
  { id: 'DIS024', name: 'Bagalkote', lat: 16.1853, lng: 75.6963 },
  { id: 'DIS025', name: 'Kalaburagi', lat: 17.3297, lng: 76.8343 },
  { id: 'DIS026', name: 'Bidar', lat: 17.9104, lng: 77.5199 },
  { id: 'DIS027', name: 'Raichur', lat: 16.2076, lng: 77.3463 },
  { id: 'DIS028', name: 'Koppal', lat: 15.3505, lng: 76.1558 },
  { id: 'DIS029', name: 'Yadgir', lat: 16.7678, lng: 77.1352 },
  { id: 'DIS030', name: 'Ballari', lat: 15.1394, lng: 76.9214 },
  { id: 'DIS031', name: 'Vijayanagara (Hospete)', lat: 15.2689, lng: 76.3909 }
];

const districtRows = districtData.map(d => [d.id, 'ST001', d.name, 'true']);
writeCsv('District.csv', ['DistrictID', 'StateID', 'DistrictName', 'IsActive'], districtRows);

// 3. Ranks (10 Police Ranks)
const ranks = [
  ['R001', 'Director General of Police', 'DGP', '1', 'true'],
  ['R002', 'Inspector General of Police', 'IGP', '2', 'true'],
  ['R003', 'Commissioner of Police', 'CP', '2', 'true'],
  ['R004', 'Deputy Inspector General', 'DIG', '3', 'true'],
  ['R005', 'Superintendent of Police', 'SP / DCP', '4', 'true'],
  ['R006', 'Deputy Superintendent of Police', 'DySP / ACP', '5', 'true'],
  ['R007', 'Circle Inspector of Police', 'CI / Inspector', '6', 'true'],
  ['R008', 'Police Sub-Inspector', 'PSI', '7', 'true'],
  ['R009', 'Assistant Sub-Inspector', 'ASI', '8', 'true'],
  ['R010', 'Head Constable / Constable', 'HC / PC', '9', 'true']
];
writeCsv('Rank.csv', ['RankID', 'RankName', 'RankCode', 'HierarchyLevel', 'IsActive'], ranks);

// 4. Designations (10 Designations)
const designations = [
  ['DES001', 'Station House Officer', 'SHO', 'Head of Police Station', 'true'],
  ['DES002', 'Investigating Officer', 'IO', 'Primary Case Investigator', 'true'],
  ['DES003', 'Law & Order In-charge', 'L&O', 'Maintains public order', 'true'],
  ['DES004', 'Crime Branch Specialist', 'CB', 'Handles serious crime investigations', 'true'],
  ['DES005', 'Sub-Divisional Officer', 'SDPO', 'Supervises circle stations', 'true'],
  ['DES006', 'District Intelligence Officer', 'DIO', 'District crime analysis', 'true'],
  ['DES007', 'Cybercrime Specialist', 'CCPS', 'Digital forensics & cyber fraud', 'true'],
  ['DES008', 'Traffic & Highway Patrol', 'THP', 'Traffic control & accident investigation', 'true'],
  ['DES009', 'Beat Officer', 'Beat', 'Local neighborhood patrol officer', 'true'],
  ['DES010', 'Special Task Force Officer', 'STF', 'Organized crime & terror unit', 'true']
];
writeCsv('Designation.csv', ['DesignationID', 'DesignationName', 'DesignationCode', 'Description', 'IsActive'], designations);

// 5. Unit Types (4 Types)
const unitTypes = [
  ['UT001', 'Police Station', 'PS', 'Primary local policing unit'],
  ['UT002', 'Sub-Division Office', 'SDO', 'Supervisory circle unit'],
  ['UT003', 'District Headquarters', 'SP Office', 'District administrative office'],
  ['UT004', 'Special Cell / Crime Branch', 'CCB / CID', 'Specialized state investigation wing']
];
writeCsv('UnitType.csv', ['UnitTypeID', 'TypeName', 'TypeCode', 'Description'], unitTypes);

// 6. Units / Police Stations (100 Stations across 31 Districts)
const units = [];
let unitIdCounter = 1;

districtData.forEach((dist) => {
  const stationNames = [
    `${dist.name} Town PS`,
    `${dist.name} Central PS`,
    `${dist.name} Cyber Crime PS`,
    `${dist.name} Traffic PS`
  ];
  if (dist.id === 'DIS001') {
    stationNames.push('Cubbon Park Police Station', 'Whitefield Police Station', 'Indiranagar Police Station', 'Electronic City Police Station', 'Jayanagar Police Station');
  }

  stationNames.forEach((name, sIdx) => {
    const uId = `U${String(unitIdCounter++).padStart(3, '0')}`;
    units.push({
      id: uId,
      name,
      districtId: dist.id,
      districtName: dist.name,
      lat: dist.lat + (sIdx * 0.012),
      lng: dist.lng + (sIdx * 0.012),
      address: `${name}, ${dist.name}, Karnataka`
    });
  });
});

const unitRows = units.map(u => [
  u.id, u.name, 'UT001', 'ST001', u.districtId, '', u.address, '08022943000', `${u.id.toLowerCase()}@ksp.gov.in`, 'true'
]);
writeCsv('Unit.csv', ['UnitID', 'UnitName', 'UnitTypeID', 'StateID', 'DistrictID', 'ParentUnitID', 'Address', 'ContactNumber', 'Email', 'IsActive'], unitRows);

// 7. Officers Expansion (520 Officers across all ranks & districts + preserves demo accounts)
const officers = [
  // Demo Accounts with fixed IDs
  { id: 'OFF001', name: 'Rajesh Kumar', rankId: 'R007', desigId: 'DES001', unitId: 'U001', distId: 'DIS001', email: 'rajesh.kumar@ksp.gov.in', rank: 'Circle Inspector', station: 'Cubbon Park Police Station' },
  { id: 'OFF002', name: 'Priya Sharma', rankId: 'R008', desigId: 'DES002', unitId: 'U002', distId: 'DIS001', email: 'priya.sharma@ksp.gov.in', rank: 'Police Sub-Inspector', station: 'Whitefield Police Station' },
  { id: 'OFF003', name: 'Manjunath Hegde', rankId: 'R007', desigId: 'DES001', unitId: 'U003', distId: 'DIS001', email: 'manjunath.hegde@ksp.gov.in', rank: 'Circle Inspector', station: 'Indiranagar Police Station' },
  { id: 'OFF004', name: 'Anita Rao', rankId: 'R006', desigId: 'DES005', unitId: 'U004', distId: 'DIS001', email: 'anita.rao@ksp.gov.in', rank: 'Deputy Superintendent of Police', station: 'Electronic City Police Station' },
  { id: 'OFF005', name: 'Suresh Patil', rankId: 'R007', desigId: 'DES001', unitId: 'U005', distId: 'DIS001', email: 'suresh.patil@ksp.gov.in', rank: 'Circle Inspector', station: 'Jayanagar Police Station' },
  { id: 'OFF008', name: 'Ramesh Kulkarni', rankId: 'R002', desigId: 'DES005', unitId: 'U001', distId: 'DIS001', email: 'ramesh.kulkarni@ksp.gov.in', rank: 'Inspector General of Police', station: 'Cubbon Park Police Station' }
];

const officerRanksPool = [
  { rankId: 'R005', desigId: 'DES005', rank: 'Superintendent of Police' },
  { rankId: 'R006', desigId: 'DES005', rank: 'Deputy Superintendent of Police' },
  { rankId: 'R007', desigId: 'DES001', rank: 'Circle Inspector' },
  { rankId: 'R008', desigId: 'DES002', rank: 'Police Sub-Inspector' },
  { rankId: 'R009', desigId: 'DES003', rank: 'Assistant Sub-Inspector' },
  { rankId: 'R010', desigId: 'DES009', rank: 'Head Constable' },
  { rankId: 'R010', desigId: 'DES009', rank: 'Police Constable' },
  { rankId: 'R004', desigId: 'DES004', rank: 'CID Officer' },
  { rankId: 'R006', desigId: 'DES007', rank: 'Crime Branch Specialist' }
];

let officerCounter = 11;
districtData.forEach((dist) => {
  const distUnits = units.filter(u => u.districtId === dist.id);
  const primaryUnit = distUnits[0] || units[0];

  // Generate 15 officers per district spanning all ranks
  for (let i = 0; i < 15; i++) {
    const oId = `OFF${String(officerCounter++).padStart(3, '0')}`;
    const rInfo = officerRanksPool[i % officerRanksPool.length];
    const unit = distUnits[i % distUnits.length] || primaryUnit;
    officers.push({
      id: oId,
      name: `${dist.name} Officer ${i + 1}`,
      rankId: rInfo.rankId,
      desigId: rInfo.desigId,
      unitId: unit.id,
      distId: dist.id,
      email: `officer.${oId.toLowerCase()}@ksp.gov.in`,
      rank: rInfo.rank,
      station: unit.name
    });
  }
});

const officerRows = officers.map((o, idx) => [
  o.id,
  `CASE${String((idx % 100) + 1).padStart(5, '0')}`,
  o.name,
  o.rank,
  o.station,
  `94808${String(10000 + idx).slice(1)}`,
  o.rankId,
  o.desigId,
  o.unitId,
  o.distId,
  'ST001',
  o.email,
  'Active',
  '2018-06-15'
]);
writeCsv('Officer.csv', ['OfficerID', 'CaseID', 'OfficerName', 'Rank', 'PoliceStation', 'Contact', 'RankID', 'DesignationID', 'UnitID', 'DistrictID', 'StateID', 'Email', 'Status', 'JoiningDate'], officerRows);

// 8. Crime Major Heads (12 Major Categories)
const crimeMajorHeads = [
  ['CH001', 'Violent Crime', 'Homicide, Murder, Attempted Murder, Grievous Assault'],
  ['CH002', 'Property Crime', 'Burglary, Dacoity, Robbery, Housebreak, Chain Snatching'],
  ['CH003', 'Vehicle Theft', 'Two-Wheeler, Four-Wheeler, Commercial Transport Theft'],
  ['CH004', 'Cyber Crime & Online Fraud', 'UPI Phishing, Banking Fraud, Identity Theft, ATM Frauds'],
  ['CH005', 'Crime Against Women & Children', 'Rape, Sexual Assault, POCSO, Domestic Violence, Harassment'],
  ['CH006', 'Narcotics & Contraband', 'NDPS, Drug Trafficking, Synthetic Drugs, Ganja Seizure'],
  ['CH007', 'Organized Crime & Extortion', 'Syndicate Extortion, Blackmail, Illegal Weapons, Human Trafficking'],
  ['CH008', 'Economic & White Collar Offence', 'Forgery, Fake Currency, Counterfeit Documents, Corruption, Frauds'],
  ['CH009', 'Environmental & Forest Crime', 'Wildlife Poaching, Teak Smuggling, Illegal Mining'],
  ['CH010', 'Terror & National Security', 'Subversive Activity, Radicalization, Explosives Seizure'],
  ['CH011', 'Traffic & Road Incident', 'Fatal Road Accident, Hit & Run, Drunk Driving Incident'],
  ['CH012', 'Public Disturbance & Miscellaneous', 'Riot, Unknown Dead Body, Suicide Investigation, Property Dispute']
];
writeCsv('CrimeHead.csv', ['CrimeHeadID', 'CrimeHeadName', 'Description'], crimeMajorHeads);

// 9. Crime Minor / Sub Heads (42 Specific Crime Sub-types matching user prompt requirements)
const crimeSubHeads = [
  ['CSH001', 'CH001', 'Murder', 'Premeditated homicide investigation'],
  ['CSH002', 'CH001', 'Attempt to Murder', 'Violent assault with deadly weapon'],
  ['CSH003', 'CH001', 'Assault & Grievous Hurt', 'Physical injury caused during gang/group clash'],
  ['CSH004', 'CH001', 'Kidnapping', 'Abduction for ransom or coercion'],
  ['CSH005', 'CH001', 'Missing Person', 'Trace & locate missing citizen petition'],
  ['CSH006', 'CH002', 'Theft', 'Larceny of personal or commercial goods'],
  ['CSH007', 'CH003', 'Vehicle Theft', 'Stolen motor vehicle or two-wheeler'],
  ['CSH008', 'CH002', 'Burglary', 'Overnight trespass and property theft'],
  ['CSH009', 'CH002', 'Robbery', 'Armed robbery using force or coercion'],
  ['CSH010', 'CH002', 'Chain Snatching', 'Snatching jewelry from pedestrians on public road'],
  ['CSH011', 'CH004', 'Cyber Crime', 'Hacking, malware infection, IT Act violation'],
  ['CSH012', 'CH004', 'UPI Fraud', 'Fake QR code or deceptive payment request'],
  ['CSH013', 'CH004', 'Online Banking Fraud', 'Phishing link leading to net banking unauthorized debit'],
  ['CSH014', 'CH004', 'Identity Theft', 'SIM swap or stolen credential impersonation'],
  ['CSH015', 'CH004', 'ATM Fraud', 'ATM skimming device or card cloning'],
  ['CSH016', 'CH005', 'Rape', 'Penal Code Section 376 prosecution'],
  ['CSH017', 'CH005', 'Sexual Assault', 'Outraging modesty and sexual harassment'],
  ['CSH018', 'CH005', 'POCSO', 'Protection of Children from Sexual Offences Act case'],
  ['CSH019', 'CH005', 'Domestic Violence', 'Spousal abuse and dowry harassment IPC 498A'],
  ['CSH020', 'CH007', 'Illegal Weapons', 'Arms Act violation involving unlicensed firearms'],
  ['CSH021', 'CH006', 'Drug Trafficking', 'NDPS Act commercial quantity drug seizure'],
  ['CSH022', 'CH007', 'Human Trafficking', 'Forced labor or trafficking rescue operation'],
  ['CSH023', 'CH012', 'Gambling', 'Illegal betting & Matka operation bust'],
  ['CSH024', 'CH009', 'Wildlife Crime', 'Poaching of protected species or ivory seizure'],
  ['CSH025', 'CH009', 'Forest Crime', 'Illegal sandalwood or timber smuggling'],
  ['CSH026', 'CH010', 'Terror Related Activity', 'Unlawful Activities Prevention Act (UAPA) investigation'],
  ['CSH027', 'CH008', 'Corruption', 'Prevention of Corruption Act bribe trap'],
  ['CSH028', 'CH008', 'Economic Offence', 'Multi-crore Ponzi scheme or financial fraud'],
  ['CSH029', 'CH008', 'White Collar Crime', 'Corporate embezzlement or insider fraud'],
  ['CSH030', 'CH007', 'Smuggling', 'Contraband gold or red sanders interception'],
  ['CSH031', 'CH007', 'Extortion', 'Demanding protection money under threat'],
  ['CSH032', 'CH007', 'Blackmail', 'Chantaje or extortion via compromised media'],
  ['CSH033', 'CH008', 'Counterfeit Currency', 'FICN high-quality fake currency notes circulating'],
  ['CSH034', 'CH008', 'Fake Documents', 'Forgery of land title deeds or government IDs'],
  ['CSH035', 'CH011', 'Hit and Run', 'Fatal vehicular collision where driver fled scene'],
  ['CSH036', 'CH011', 'Road Accident', 'Negligent driving causing injury IPC 279/338'],
  ['CSH037', 'CH012', 'Fire Incident', 'Industrial or residential fire accident inquiry'],
  ['CSH038', 'CH012', 'Unknown Dead Body', 'Unidentified corpse inquest Section 174 CrPC'],
  ['CSH039', 'CH012', 'Suicide Investigation', 'Unnatural death and suicide note inquiry'],
  ['CSH040', 'CH012', 'Property Disputes', 'Civil boundary dispute causing law and order friction'],
  ['CSH041', 'CH012', 'Public Disturbance', 'Unlawful assembly, rioting, or public brawl'],
  ['CSH042', 'CH006', 'Synthetic Drugs (MDMA)', 'Commercial seizure of MDMA / Methamphetamine']
];
writeCsv('CrimeSubHead.csv', ['CrimeSubHeadID', 'CrimeHeadID', 'CrimeSubHeadName', 'Description'], crimeSubHeads);

// 10. Case Categories (4 Categories)
const caseCategories = [
  ['CAT001', 'Cognizable Offence', 'Police can arrest without warrant'],
  ['CAT002', 'Non-Cognizable Offence', 'Requires judicial Magistrate order'],
  ['CAT003', 'Special & Local Laws (SLL)', 'Regulated under specific state statutes'],
  ['CAT004', 'Petition / Inquiry', 'Preliminary investigation inquiry']
];
writeCsv('CaseCategory.csv', ['CategoryID', 'CategoryName', 'Description'], caseCategories);

// 11. Case Status Master (6 Statuses)
const caseStatuses = [
  ['CS001', 'Under Investigation', 'Active investigation led by assigned IO'],
  ['CS002', 'Charge Sheeted', 'Final prosecution report filed in court'],
  ['CS003', 'Pending Trial', 'Trial ongoing before judicial Magistrate'],
  ['CS004', 'Convicted', 'Court judgment passed finding accused guilty'],
  ['CS005', 'Acquitted', 'Court acquitted accused due to benefit of doubt'],
  ['CS006', 'Closed / Undetected', 'Case closed after exhausting investigative leads']
];
writeCsv('CaseStatusMaster.csv', ['CaseStatusID', 'CaseStatusName', 'Description'], caseStatuses);

// 12. Gravity Offence (5 Levels)
const gravityOffences = [
  ['GR001', 'Rarest of Rare', 'Heinously brutal crime deserving maximum statutory penalty'],
  ['GR002', 'Grave', 'Serious violent or high-value economic offence'],
  ['GR003', 'Moderate', 'Standard cognizable property or assault offence'],
  ['GR004', 'Organized Crime', 'Syndicate activity involving gang members'],
  ['GR005', 'Terror Related', 'Threatening state security or public order']
];
writeCsv('GravityOffence.csv', ['GravityID', 'GravityName', 'Description'], gravityOffences);

// 13. Courts (10 Courts across Karnataka)
const courts = [
  ['CRT001', '1st Additional Chief Metropolitan Magistrate', 'Bengaluru', 'Magistrate Court'],
  ['CRT002', 'City Civil & Sessions Court', 'Bengaluru', 'Sessions Court'],
  ['CRT003', 'Principal District & Sessions Court', 'Mysuru', 'Sessions Court'],
  ['CRT004', 'Principal District & Sessions Court', 'Mangaluru', 'Sessions Court'],
  ['CRT005', 'Principal District & Sessions Court', 'Belagavi', 'Sessions Court'],
  ['CRT006', 'Principal District & Sessions Court', 'Hubballi-Dharwad', 'Sessions Court'],
  ['CRT007', 'Principal District & Sessions Court', 'Kalaburagi', 'Sessions Court'],
  ['CRT008', 'Principal District & Sessions Court', 'Shivamogga', 'Sessions Court'],
  ['CRT009', 'Principal District & Sessions Court', 'Ballari', 'Sessions Court'],
  ['CRT010', 'High Court of Karnataka', 'Bengaluru', 'High Court']
];
writeCsv('Court.csv', ['CourtID', 'CourtName', 'Location', 'CourtType'], courts);

// 14. Acts (6 Major Acts)
const acts = [
  ['ACT001', 'Indian Penal Code / Bharatiya Nyaya Sanhita', 'IPC / BNS', 'Primary criminal code of India'],
  ['ACT002', 'Information Technology Act', 'IT Act 2000', 'Digital & cyber crime offences'],
  ['ACT003', 'Narcotic Drugs & Psychotropic Substances Act', 'NDPS Act 1985', 'Drug possession & trafficking'],
  ['ACT004', 'Arms Act', 'Arms Act 1959', 'Illegal possession & manufacturing of weapons'],
  ['ACT005', 'Protection of Children from Sexual Offences Act', 'POCSO Act 2012', 'Child protection laws'],
  ['ACT006', 'Unlawful Activities Prevention Act', 'UAPA 1967', 'Counter-terrorism and national security']
];
writeCsv('Act.csv', ['ActID', 'ActName', 'ActCode', 'Description'], acts);

// 15. Sections (15 Key Sections)
const sections = [
  ['SEC001', 'ACT001', 'IPC 302 / BNS 101', 'Punishment for murder'],
  ['SEC002', 'ACT001', 'IPC 307 / BNS 109', 'Attempt to murder'],
  ['SEC003', 'ACT001', 'IPC 379 / BNS 303', 'Punishment for theft'],
  ['SEC004', 'ACT001', 'IPC 392 / BNS 309', 'Punishment for robbery'],
  ['SEC005', 'ACT001', 'IPC 457 / BNS 331', 'Lurking house-trespass or house-breaking by night'],
  ['SEC006', 'ACT001', 'IPC 420 / BNS 318', 'Cheating and dishonestly inducing delivery of property'],
  ['SEC007', 'ACT002', 'IT Act Sec 66D', 'Punishment for cheating by personation by using computer resource'],
  ['SEC008', 'ACT002', 'IT Act Sec 66C', 'Punishment for identity theft'],
  ['SEC009', 'ACT003', 'NDPS Sec 20(b)', 'Possession or trafficking of commercial quantity cannabis/drugs'],
  ['SEC010', 'ACT004', 'Arms Act Sec 25', 'Punishment for possession of unlicensed firearm'],
  ['SEC011', 'ACT005', 'POCSO Sec 4', 'Punishment for penetrative sexual assault on minor'],
  ['SEC012', 'ACT001', 'IPC 498A / BNS 85', 'Husband or relative of husband subjecting woman to cruelty'],
  ['SEC013', 'ACT001', 'IPC 363 / BNS 137', 'Punishment for kidnapping'],
  ['SEC014', 'ACT001', 'IPC 279 / BNS 281', 'Rash driving or riding on a public way'],
  ['SEC015', 'ACT006', 'UAPA Sec 18', 'Punishment for conspiring or preparing terror act']
];
writeCsv('Section.csv', ['SectionID', 'ActID', 'SectionCode', 'Description'], sections);

// 16. ActSectionAssociation
const actSectionAssoc = sections.map((sec, i) => [
  `ASA${String(i + 1).padStart(3, '0')}`, sec[1], sec[0]
]);
writeCsv('ActSectionAssociation.csv', ['AssociationID', 'ActID', 'SectionID'], actSectionAssoc);

// ================================================================
// GENERATE 5,500 COMPLETE CASES WITH FULL REFERENTIAL INTEGRITY
// ================================================================
console.log('\n  ⚡ Generating 5,500 enterprise cases with complete referential links...');

const TOTAL_CASES = 5500;

const caseMasterRows = [];
const victimRows = [];
const accusedRows = [];
const witnessRows = [];
const evidenceRows = [];
const aiAnalysisRows = [];
const activityLogRows = [];
const chargesheetRows = [];
const arrestRows = [];

// Pre-defined names pools for realistic data generation
const maleFirstNames = ['Ramesh', 'Suresh', 'Vijay', 'Manjunath', 'Karthik', 'Anil', 'Sunil', 'Praveen', 'Ganesh', 'Nitin', 'Niranjan', 'Vikas', 'Rahul', 'Imran', 'Ajay', 'Rohan', 'Deepak', 'Sanjay', 'Mahesh', 'Santosh'];
const femaleFirstNames = ['Ananya', 'Priya', 'Kavya', 'Pooja', 'Neha', 'Lakshmi', 'Sunita', 'Divya', 'Deepa', 'Meena', 'Rupa', 'Aswini', 'Bhavya', 'Rekha', 'Archana'];
const lastNames = ['Gowda', 'Patil', 'Kumar', 'Rao', 'Sharma', 'Nair', 'Verma', 'Reddy', 'Khan', 'Mehta', 'Kulkarni', 'Hegde', 'Shetty', 'Bhat', 'Deshmukh', 'Joshi', 'Naik', 'Iyengar'];

const vehicleTypes = ['Honda Activa Scooter (KA-01-EQ-4412)', 'Royal Enfield Bullet (KA-05-JL-8819)', 'Hyundai Creta SUV (KA-53-MA-2019)', 'Maruti Swift Dzire (KA-04-MB-9021)', 'TVS Jupiter (KA-03-EX-1102)'];
const phoneBrands = ['iPhone 15 Pro', 'Samsung Galaxy S24', 'OnePlus 12', 'Redmi Note 13', 'Vivo V30'];
const weaponsList = ['Kitchen Knife (10-inch blade)', 'Iron Rod / Crowbar', 'Unlicensed 7.65mm Pistol', 'Countrymade Revolver (Katta)', 'Wooden Lathi / Club'];

// Generate 5,500 cases deterministically & realistically
for (let cIdx = 1; cIdx <= TOTAL_CASES; cIdx++) {
  const caseId = `CASE${String(cIdx).padStart(5, '0')}`;
  const dist = districtData[(cIdx - 1) % districtData.length];
  const distUnits = units.filter(u => u.districtId === dist.id);
  const unit = distUnits[(cIdx - 1) % distUnits.length] || units[0];
  const distOfficers = officers.filter(o => o.distId === dist.id);
  const officer = distOfficers[(cIdx - 1) % distOfficers.length] || officers[0];
  
  const crimeSub = crimeSubHeads[(cIdx - 1) % crimeSubHeads.length];
  const crimeMajorHeadID = crimeSub[1];
  const crimeMajor = crimeMajorHeads.find(h => h[0] === crimeMajorHeadID) || crimeMajorHeads[0];

  const caseStatusObj = caseStatuses[(cIdx - 1) % caseStatuses.length];
  const gravityObj = gravityOffences[(cIdx - 1) % gravityOffences.length];
  const caseCatObj = caseCategories[(cIdx - 1) % caseCategories.length];
  const courtObj = courts[(cIdx - 1) % courts.length];

  const month = String(((cIdx % 12) + 1)).padStart(2, '0');
  const day = String(((cIdx % 28) + 1)).padStart(2, '0');
  const regDate = `2026-${month}-${day}`;
  const crimeNo = `KSP/${dist.id}/2026/${String(cIdx).padStart(5, '0')}`;

  const lat = (unit.lat + ((cIdx % 100) - 50) * 0.001).toFixed(4);
  const lng = (unit.lng + ((cIdx % 100) - 50) * 0.001).toFixed(4);

  const briefFact = `${crimeSub[2]} reported at ${unit.name}, ${dist.name}. Brief: ${crimeSub[3]}. Incident occurred near ${unit.address}.`;

  // 1. CaseMaster Record
  caseMasterRows.push([
    crimeNo,
    regDate,
    briefFact,
    caseStatusObj[1],
    crimeMajor[1],
    crimeSub[2],
    unit.name,
    dist.name,
    lat,
    lng,
    caseStatusObj[0],
    caseCatObj[0],
    gravityObj[0],
    crimeMajor[0],
    crimeSub[0],
    unit.id,
    dist.id,
    officer.id
  ]);

  // 2. Victim Record (1 per case)
  const vGender = cIdx % 3 === 0 ? 'Female' : 'Male';
  const vFName = vGender === 'Female' ? femaleFirstNames[cIdx % femaleFirstNames.length] : maleFirstNames[cIdx % maleFirstNames.length];
  const vLName = lastNames[cIdx % lastNames.length];
  const vName = `${vFName} ${vLName}`;
  const vicId = `VIC${String(cIdx).padStart(5, '0')}`;

  victimRows.push([
    vicId,
    crimeNo,
    vName,
    vGender,
    20 + (cIdx % 45),
    `98761${String(10000 + (cIdx % 90000))}`,
    `${unit.name} Sector ${cIdx % 5 + 1}, ${dist.name}`,
    cIdx % 2 === 0 ? 'IT Software Engineer' : 'Business Owner',
    crimeSub[2].includes('Murder') ? 'Fatal Injury' : 'Minor Contusion',
    `Statement of ${vName} recorded regarding ${crimeSub[2]}.`,
    `victim.${cIdx}@ksp-citizen.in`,
    crimeSub[2].includes('Murder') ? 'Critical' : 'Mild',
    `MR${cIdx}`,
    `${dist.name} District General Hospital`,
    crimeSub[2].includes('Murder') ? 'Deceased' : 'Safe & Recovered',
    `98762${String(10000 + (cIdx % 90000))}`,
    `Aadhaar-${String(4000 + (cIdx % 5000))}-${String(1000 + (cIdx % 8000))}`
  ]);

  // 3. Accused Record (1 per case)
  const aFName = maleFirstNames[(cIdx + 3) % maleFirstNames.length];
  const aLName = lastNames[(cIdx + 2) % lastNames.length];
  const aName = `${aFName} ${aLName}`;
  const accId = `ACC${String(cIdx).padStart(5, '0')}`;
  const isRepeat = cIdx % 4 === 0;

  accusedRows.push([
    accId,
    crimeNo,
    aName,
    'Male',
    21 + (cIdx % 35),
    `Resident of ${dist.name} Outer Ring Road`,
    'Unemployed / Daily Wager',
    cIdx % 2 === 0 ? 'Arrested' : 'Under Investigation',
    isRepeat ? 'Yes (Repeat Offender)' : 'None',
    `98764${String(10000 + (cIdx % 90000))}`,
    `accused.${cIdx}@email.com`,
    'Indian',
    `Aadhaar-${String(5000 + (cIdx % 4000))}-${String(2000 + (cIdx % 7000))}`,
    regDate,
    cIdx % 2 === 0 ? 'Bail Rejected' : 'Under Judicial Review',
    cIdx % 2 === 0 ? 'Judicial Custody' : 'Not in Custody',
    `FP-2026-${cIdx}`,
    `accused_${cIdx}.jpg`,
    `Accused in ${crimeSub[2]} at ${unit.name}`
  ]);

  // 4. Witness Record (1 per case)
  const wFName = femaleFirstNames[(cIdx + 5) % femaleFirstNames.length];
  const wLName = lastNames[(cIdx + 4) % lastNames.length];
  const wName = `${wFName} ${wLName}`;
  const witId = `WIT${String(cIdx).padStart(5, '0')}`;

  witnessRows.push([
    witId,
    crimeNo,
    wName,
    'Female',
    28 + (cIdx % 30),
    `98763${String(10000 + (cIdx % 90000))}`,
    `Near ${unit.name}, ${dist.name}`,
    `Eyewitness statement recorded confirming suspect movements near scene of crime at ${regDate}.`,
    `witness.${cIdx}@email.com`,
    'Local Shop Owner',
    'Eyewitness',
    'Independent Witness',
    `Aadhaar-${String(6000 + (cIdx % 3000))}-${String(3000 + (cIdx % 6000))}`,
    'Available for Court Proceedings'
  ]);

  // 5. Evidence Record (1 to 2 per case)
  const evdId = `EVD${String(cIdx).padStart(5, '0')}`;
  const evType = cIdx % 3 === 0 ? 'Video Footage' : (cIdx % 3 === 1 ? 'Digital Document' : 'Physical Weapon');
  evidenceRows.push([
    evdId,
    crimeNo,
    evType,
    `Key forensic evidence collected for ${crimeSub[2]} by ${officer.name}.`,
    officer.name,
    regDate,
    'Verified & Cataloged',
    `EV-2026-${cIdx}`,
    `${unit.name} Crime Scene`,
    'Central Station Locker',
    officer.id,
    `FSL ${dist.name}`,
    `FSL-REPORT-${cIdx}`,
    'Intact Chain of Custody',
    `evidence_${cIdx}.jpg`,
    'Indexed via AI OCR'
  ]);

  // 6. AI Analysis Record (1 per case)
  const aiId = `AI${String(cIdx).padStart(5, '0')}`;
  aiAnalysisRows.push([
    aiId,
    crimeNo,
    `${crimeMajor[1]} Pattern Cluster #${(cIdx % 20) + 1}`,
    isRepeat ? `High match with repeat offender ${aName}` : 'No prior criminal record detected',
    45 + (cIdx % 50),
    crimeSub[2],
    `${dist.name} Sector ${(cIdx % 8) + 1}`,
    regDate,
    `Deploy Hoysala patrol unit to ${unit.name} and monitor CCTV feeds.`
  ]);

  // 7. Activity Log (1 per case)
  activityLogRows.push([
    `ACT${String(cIdx).padStart(5, '0')}`,
    officer.id,
    officer.name,
    'FIR Registered & Case Opened',
    'CaseMaster',
    `${new Date().toISOString()}`,
    `FIR ${crimeNo} initialized in system.`
  ]);

  // 8. Chargesheet Details (for cases that are Charge Sheeted)
  if (caseStatusObj[1] === 'Charge Sheeted' || caseStatusObj[1] === 'Pending Trial') {
    chargesheetRows.push([
      `CSH${String(cIdx).padStart(5, '0')}`,
      crimeNo,
      `CS-2026-${cIdx}`,
      regDate,
      courtObj[1],
      officer.name,
      'Submitted & Approved',
      `Complete final report filed under ${crimeSub[2]}.`
    ]);

    arrestRows.push([
      `ARR${String(cIdx).padStart(5, '0')}`,
      crimeNo,
      accId,
      aName,
      regDate,
      `${unit.name} Premises`,
      officer.name,
      'Judicial Custody'
    ]);
  }
}

// Write CaseMaster.csv
writeCsv('CaseMaster.csv', ['CrimeNumber', 'CrimeRegisteredDate', 'BriefFacts', 'CaseStatus', 'CrimeMajorHead', 'CrimeMinorHead', 'PoliceStation', 'District', 'Latitude', 'Longitude', 'CaseStatusID', 'CategoryID', 'GravityID', 'CrimeHeadID', 'CrimeSubHeadID', 'UnitID', 'DistrictID', 'OfficerID'], caseMasterRows);

// Write Victim.csv
writeCsv('Victim.csv', ['VictimID','CaseID','VictimName','Gender','Age','Mobile','Address','Occupation','InjuryType','Statement','Email','InjurySeverity','MedicalReport','HospitalName','VictimStatus','EmergencyContact','IDProof'], victimRows);

// Write Accused.csv
writeCsv('Accused.csv', ['AccusedID','CaseID','AccusedName','Gender','Age','Address','Occupation','ArrestStatus','CriminalHistory','Mobile','Email','Nationality','IDProof','ArrestDate','BailStatus','CustodyStatus','FingerprintID','Photograph','Remarks'], accusedRows);

// Write Witness.csv
writeCsv('Witness.csv', ['WitnessID','CaseID','WitnessName','Gender','Age','Mobile','Address','Statement','Email','Occupation','RelationshipToCase','WitnessType','IDProof','AvailabilityStatus'], witnessRows);

// Write Evidence.csv
writeCsv('Evidence.csv', ['EvidenceID','CaseID','EvidenceType','Description','CollectedBy','CollectionDate','Status','EvidenceNumber','LocationFound','StorageLocation','CollectedOfficerID','ForensicLab','ForensicReport','ChainOfCustody','Photograph','Remarks'], evidenceRows);

// Write AIAnalysis.csv
writeCsv('AIAnalysis.csv', ['AIAnalysisID','CaseID','CrimePattern','SuspectPrediction','RiskScore','MOType','HotspotLocation','AnalysisDate','Recommendation'], aiAnalysisRows);

// Write ActivityLog.csv
writeCsv('ActivityLog.csv', ['ActivityID','UserID','UserName','Action','Module','Timestamp','Details'], activityLogRows);

// Write ChargesheetDetails.csv
writeCsv('ChargesheetDetails.csv', ['ChargesheetID','CaseID','ChargesheetNumber','FilingDate','CourtName','SubmittedBy','Status','Remarks'], chargesheetRows);

// Write ArrestSurrender.csv
writeCsv('ArrestSurrender.csv', ['ArrestID','CaseID','AccusedID','AccusedName','ArrestDate','ArrestLocation','ArrestingOfficer','CustodyType'], arrestRows);

// Write EmergencyAccess.csv (Demo Emergency Access Log)
const emergencyAccessRows = [
  ['EA001', 'OFF004', 'Anita Rao', 'DSP', 'DIS001', 'Critical Heinous Crime Dossier Unlocking', '2026-07-25 10:14:00', 'Approved'],
  ['EA002', 'OFF008', 'Ramesh Kulkarni', 'IGP', 'DIS004', 'Statewide Syndicate Nexus Audit', '2026-07-26 14:30:00', 'Approved']
];
writeCsv('EmergencyAccess.csv', ['AccessID', 'OfficerID', 'OfficerName', 'Rank', 'DistrictID', 'Reason', 'Timestamp', 'Status'], emergencyAccessRows);

// Write ComplaintDetails.csv
const complaintRows = caseMasterRows.slice(0, 500).map((c, i) => [
  `CMP${String(i + 1).padStart(5, '0')}`,
  c[0], // CrimeNumber
  c[1], // CrimeRegisteredDate
  victimRows[i][2], // VictimName
  victimRows[i][5], // Mobile
  c[2], // BriefFacts
  c[6], // PoliceStation
  'Assigned to IO'
]);
writeCsv('ComplaintDetails.csv', ['ComplaintID', 'CaseID', 'ComplaintDate', 'ComplainantName', 'ContactNumber', 'ComplaintText', 'PoliceStation', 'Status'], complaintRows);

// Write Notification.csv
const notificationRows = [
  ['NOT001', 'OFF001', 'New FIR Assigned', 'FIR KSP/DIS001/2026/00001 assigned to your IO queue.', '2026-07-10 14:35:00', 'Unread'],
  ['NOT002', 'OFF002', 'Cybercrime Spike Alert', 'Predictive engine detected 98% fraud spike in IT corridor.', '2026-07-14 09:20:00', 'Unread'],
  ['NOT003', 'OFF004', 'Chargesheet Approved', 'Chargesheet CS-2026-00002 approved by court.', '2026-07-20 16:00:00', 'Read']
];
writeCsv('Notification.csv', ['NotificationID', 'UserID', 'Title', 'Message', 'Timestamp', 'Status'], notificationRows);

console.log('===============================================================');
console.log(`🎉 ENTERPRISE DATASET GENERATION COMPLETE!`);
console.log(`   • Total Cases Generated     : ${TOTAL_CASES}`);
console.log(`   • Total Officers Generated  : ${officers.length}`);
console.log(`   • Total Evidence Generated  : ${evidenceRows.length}`);
console.log(`   • Total Victims Generated   : ${victimRows.length}`);
console.log(`   • Total Accused Generated   : ${accusedRows.length}`);
console.log(`   • Total Witnesses Generated : ${witnessRows.length}`);
console.log(`   • Total Districts Covered   : ${districtData.length}`);
console.log(`   • Total Stations Covered    : ${units.length}`);
console.log('===============================================================');
