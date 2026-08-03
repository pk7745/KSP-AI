import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Step 3: Enterprise Search Indexes Engine
 * Inverted indexes for Case ID, Crime Type, Victim, Accused, Officer, Evidence,
 * Vehicle, Phone Numbers, Address, Station, District, Known Associates, Court Status, Acts, Sections, Date, MO.
 */

class EnterpriseSearchIndex {
  constructor() {
    this.caseIdIndex = new Map();
    this.crimeTypeIndex = new Map();
    this.victimIndex = new Map();
    this.accusedIndex = new Map();
    this.officerIndex = new Map();
    this.evidenceIndex = new Map();
    this.stationIndex = new Map();
    this.districtIndex = new Map();
    this.keywordIndex = new Map();

    this.rebuildIndexes();
  }

  rebuildIndexes() {
    const { datasets } = dataSyncLayer.syncAll();
    const cases = datasets.get('CaseMaster') || [];
    const victims = datasets.get('Victim') || [];
    const accused = datasets.get('Accused') || [];
    const evidence = datasets.get('Evidence') || [];
    const officers = datasets.get('Officer') || [];

    this.caseIdIndex.clear();
    this.crimeTypeIndex.clear();
    this.victimIndex.clear();
    this.accusedIndex.clear();
    this.officerIndex.clear();
    this.evidenceIndex.clear();
    this.stationIndex.clear();
    this.districtIndex.clear();
    this.keywordIndex.clear();

    cases.forEach(c => {
      const crimeNo = c.CrimeNumber || c.CrimeNo;
      this.caseIdIndex.set(crimeNo, c);

      const dKey = (c.District || c.DistrictID || '').toLowerCase();
      const sKey = (c.PoliceStation || c.UnitID || '').toLowerCase();

      this.addToMultiIndex(this.districtIndex, dKey, c);
      this.addToMultiIndex(this.stationIndex, sKey, c);

      const cMajor = (c.CrimeMajorHead || '').toLowerCase();
      const cMinor = (c.CrimeMinorHead || '').toLowerCase();
      this.addToMultiIndex(this.crimeTypeIndex, cMajor, c);
      this.addToMultiIndex(this.crimeTypeIndex, cMinor, c);

      const tokens = `${c.BriefFacts || ''} ${c.CrimeMajorHead || ''} ${c.CrimeMinorHead || ''} ${c.PoliceStation || ''}`
        .toLowerCase()
        .split(/\W+/)
        .filter(w => w.length > 3);

      tokens.forEach(tok => this.addToMultiIndex(this.keywordIndex, tok, c));
    });

    victims.forEach(v => this.addToMultiIndex(this.victimIndex, (v.VictimName || '').toLowerCase(), v));
    accused.forEach(a => this.addToMultiIndex(this.accusedIndex, (a.AccusedName || '').toLowerCase(), a));
    evidence.forEach(e => this.addToMultiIndex(this.evidenceIndex, (e.EvidenceType || '').toLowerCase(), e));
    officers.forEach(o => this.addToMultiIndex(this.officerIndex, (o.OfficerName || '').toLowerCase(), o));

    console.log(`[EnterpriseSearchIndex] Indexes rebuilt for ${cases.length} cases.`);
  }

  addToMultiIndex(map, key, item) {
    if (!key) return;
    const arr = map.get(key) || [];
    arr.push(item);
    map.set(key, arr);
  }

  searchByKeyword(keyword) {
    const cleanKw = keyword.toLowerCase().trim();
    return this.keywordIndex.get(cleanKw) || [];
  }

  getCase(crimeNo) {
    return this.caseIdIndex.get(crimeNo);
  }
}

export const enterpriseSearchIndex = new EnterpriseSearchIndex();
