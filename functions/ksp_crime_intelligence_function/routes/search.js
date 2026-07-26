import express from 'express';
import { getTableData } from '../utils/csvService.js';

const router = express.Router();

// Kannada to English dictionary for Smart Kannada Search
const KANNADA_TRANSLATIONS = {
  'ಕೊಲೆ': 'murder',
  'ಹತ್ಯೆ': 'homicide',
  'ಕಳ್ಳತನ': 'theft',
  'ಕಳವು': 'burglary',
  'ವಂಚನೆ': 'fraud',
  'ಸೈಬರ್': 'cyber',
  'ಮಾದಕ': 'narcotics',
  'ಅಪಹರಣ': 'kidnapping',
  'ಹಲ್ಲೆ': 'assault',
  'ಪ್ರಕರಣ': 'case',
  'ಬೆಂಗಳೂರು': 'bengaluru',
  'ಮೈಸೂರು': 'mysuru',
  'ಮಂಗಳೂರು': 'mangaluru',
  'ಬೆಳಗಾವಿ': 'belagavi',
  'ಹುಬ್ಬಳ್ಳಿ': 'hubballi',
  'ಶಿವಮೊಗ್ಗ': 'shivamogga',
  'ದಾವಣಗೆರೆ': 'davanagere',
  'ಬಳ್ಳಾರಿ': 'ballari',
  'ತುಮಕೂರು': 'tumakuru',
  'ಉಡುಪಿ': 'udupi'
};

function translateQuery(query) {
  let translated = query.toLowerCase().trim();
  for (const [kn, en] of Object.entries(KANNADA_TRANSLATIONS)) {
    if (translated.includes(kn)) {
      translated = translated.replace(kn, en);
    }
  }
  return translated;
}

router.get('/', async (req, res) => {
  try {
    const rawQuery = req.query.q || '';
    if (!rawQuery || rawQuery.length < 2) {
      return res.json({ results: [] });
    }
    
    const originalSearchVal = rawQuery.toLowerCase();
    const translatedSearchVal = translateQuery(rawQuery);
    
    // Fetch from CSVs
    const [casesData, accusedList] = await Promise.all([
      getTableData('CaseMaster'),
      getTableData('Accused')
    ]);

    // Jurisdiction filtering
    let accessibleCases = casesData;
    if (req.jurisdictionFilter) {
      if (req.jurisdictionFilter.UnitID) {
        accessibleCases = casesData.filter(c => c.UnitID === req.jurisdictionFilter.UnitID || req.emergencyAccess?.includes(c.CrimeNumber));
      } else if (req.jurisdictionFilter.DistrictID) {
        accessibleCases = casesData.filter(c => c.DistrictID === req.jurisdictionFilter.DistrictID || req.emergencyAccess?.includes(c.CrimeNumber));
      }
    }

    const accessibleCaseIDs = new Set(accessibleCases.map(c => c.CrimeNumber));

    // 1. Cases matching original or translated query
    const caseResults = accessibleCases.filter(c => {
      const text = `${c.CrimeNumber} ${c.BriefFacts} ${c.CrimeMajorHead} ${c.District} ${c.PoliceStation}`.toLowerCase();
      return text.includes(originalSearchVal) || text.includes(translatedSearchVal);
    }).slice(0, 10).map(c => ({
      id: c.CrimeNumber,
      type: 'case',
      title: c.CrimeNumber,
      subtitle: `${c.CrimeMajorHead} • ${c.District} (${c.PoliceStation})`,
      matchScore: 95
    }));

    // 2. Accused matching original or translated query
    const matchedAccused = accusedList
      .filter(a => accessibleCaseIDs.has(a.CaseID))
      .filter(a => {
        const text = `${a.AccusedName} ${a.CaseID} ${a.Occupation} ${a.Address}`.toLowerCase();
        return text.includes(originalSearchVal) || text.includes(translatedSearchVal);
      })
      .slice(0, 10).map(a => ({
        id: a.AccusedID,
        type: 'Accused',
        title: a.AccusedName,
        subtitle: `Linked to Case: ${a.CaseID} (${a.ArrestStatus})`,
        matchScore: 90
      }));

    // Combine and sort by score
    const results = [...caseResults, ...matchedAccused].sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);
    
    res.json({ 
      results,
      query: rawQuery,
      translatedQuery: translatedSearchVal !== originalSearchVal ? translatedSearchVal : null 
    });
  } catch (err) {
    console.error("[Search CSV] Error:", err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
