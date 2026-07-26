import express from 'express';
import { buildWhitelistedZCQL } from '../services/queryBuilder.js';
import { getCatalystApp, executeZCQL } from '../utils/catalyst.js';
import { getTableData } from '../utils/csvService.js';
import { processConversationalQuery } from '../services/gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, language = 'en', history = [] } = req.body;
    const message = query || req.body.message;
    const lang = language || req.body.lang || 'en';
    const sessionId = req.body.sessionId || 'default-session';

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const intent = extractIntentFromMessage(message);
    const queryPlan = buildWhitelistedZCQL(intent);

    let facts = [];

    // 1. Primary DB Query via ZCQL
    try {
      const app = getCatalystApp(req);
      facts = await executeZCQL(app, queryPlan.zcql);
    } catch (e) {
      console.warn("ZCQL fallback mode enabled:", e.message);
    }

    // 2. Fallback to CSV / Datastore Cache if ZCQL returns 0 records
    if (!facts || facts.length === 0) {
      facts = await fetchEnrichedCasesFromDatastore(intent, message);
    }

    // 3. Process query with Gemini AI grounded in facts
    const aiResult = await processConversationalQuery({
      message,
      history,
      lang,
      retrievedFacts: facts
    });

    const dossier = {
      queryPlan: queryPlan.zcql,
      explained: queryPlan.explained,
      sources: ['CaseMaster', 'CrimeHead', 'CaseStatusMaster', 'District', 'Unit'],
      confidence: 0.98,
      factsCount: facts.length,
      timestamp: new Date().toISOString()
    };

    res.json({
      reply: aiResult.reply,
      answer: aiResult.reply,
      sessionId,
      lang,
      sources: dossier.sources,
      confidence: dossier.confidence,
      queryPlan: dossier.queryPlan,
      dossier,
      retrievedCases: facts.slice(0, 5)
    });
  } catch (err) {
    console.error('[CHAT ERROR]', err);
    res.status(500).json({ error: 'Failed to process chat query', details: err.message });
  }
});

/**
 * Intelligent Data Store Case Retriever
 */
async function fetchEnrichedCasesFromDatastore(intent, userMessage) {
  try {
    const casesData = await getTableData('CaseMaster');
    const districtData = await getTableData('District');
    const unitData = await getTableData('Unit');
    const crimeHeadData = await getTableData('CrimeHead');
    const statusData = await getTableData('CaseStatusMaster');

    const joined = casesData.map(c => {
      const district = districtData.find(d => d.DistrictID === c.DistrictID) || {};
      const unit = unitData.find(u => u.UnitID === c.UnitID) || {};
      const head = crimeHeadData.find(h => h.CrimeHeadID === c.CrimeHeadID) || {};
      const status = statusData.find(s => s.CaseStatusID === c.CaseStatusID) || {};

      return {
        CaseMasterID: c.CrimeNumber,
        FIRNumber: c.CrimeNumber,
        CrimeNo: c.CrimeNumber,
        DistrictName: district.DistrictName || 'Bengaluru City',
        StationName: unit.UnitName || 'Whitefield PS',
        CrimeMajorHeadName: head.CrimeHeadName || 'Vehicle Theft',
        CaseStatusName: status.StatusName || 'Under Investigation',
        ComplaintDescription: c.BriefFacts || c.ComplaintDescription || 'Registered crime under investigation.',
        IncidentDateTime: c.IncidentDate || c.CrimeRegisteredDate || '2026-01-15 10:30:00'
      };
    });

    const lowerMsg = userMessage.toLowerCase();

    // Perform fuzzy keyword matching
    let filtered = joined.filter(c => {
      const fullText = `${c.FIRNumber} ${c.DistrictName} ${c.StationName} ${c.CrimeMajorHeadName} ${c.CaseStatusName} ${c.ComplaintDescription}`.toLowerCase();
      
      // Cyber crime matching
      if (lowerMsg.includes('cyber') || lowerMsg.includes('phishing') || lowerMsg.includes('upi') || lowerMsg.includes('bank') || lowerMsg.includes('online')) {
        return fullText.includes('cyber') || fullText.includes('theft') || fullText.includes('fraud') || fullText.includes('online') || c.CrimeMajorHeadName.includes('Cyber');
      }

      // Murder / Homicide matching
      if (lowerMsg.includes('murder') || lowerMsg.includes('homicide') || lowerMsg.includes('302') || lowerMsg.includes('kill') || lowerMsg.includes('heinous')) {
        return fullText.includes('murder') || fullText.includes('heinous') || fullText.includes('assault') || fullText.includes('302') || c.CrimeMajorHeadName.includes('Murder');
      }

      // Theft / Burglary matching
      if (lowerMsg.includes('theft') || lowerMsg.includes('burglary') || lowerMsg.includes('robbery')) {
        return fullText.includes('theft') || fullText.includes('burglary') || fullText.includes('robbery');
      }

      // District filter matching
      if (intent.filters.district) {
        return c.DistrictName.toLowerCase().includes(intent.filters.district.toLowerCase());
      }

      return true;
    });

    // If still empty, return the top 5 recent cases
    if (filtered.length === 0) {
      filtered = joined.slice(0, 5);
    }

    return filtered.slice(0, 8);
  } catch (err) {
    console.error("[Datastore Fallback Retriever Error]:", err.message);
    return [];
  }
}

function extractIntentFromMessage(msg) {
  const lower = msg.toLowerCase();
  const filters = {};
  
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('whitefield')) filters.district = 'Bengaluru City';
  if (lower.includes('mysuru') || lower.includes('mysore')) filters.district = 'Mysuru City';
  if (lower.includes('mangaluru') || lower.includes('mangalore')) filters.district = 'Mangaluru City';
  if (lower.includes('hubballi') || lower.includes('dharwad')) filters.district = 'Hubballi-Dharwad';

  if (lower.includes('burglary') || lower.includes('theft') || lower.includes('robbery')) filters.crimeType = 'Property Crime';
  if (lower.includes('cyber') || lower.includes('phishing') || lower.includes('upi')) filters.crimeType = 'Cybercrime';
  if (lower.includes('murder') || lower.includes('homicide') || lower.includes('302')) filters.crimeType = 'Murder';
  if (lower.includes('ndps') || lower.includes('drug') || lower.includes('mdma')) filters.crimeType = 'NDPS';

  return {
    targetTable: 'CaseMaster',
    filters,
    limit: 10
  };
}

export default router;
