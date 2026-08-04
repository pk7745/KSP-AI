import express from 'express';
import { processOfficerQuery } from '../services/queryPlannerService.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, language = 'en', officerId = 'OFF001', sessionId = 'default-session', caseIds = [] } = req.body;
    const rawMessage = query || req.body.message || '';
    const lang = language || req.body.lang || 'en';

    if (!rawMessage && (!caseIds || caseIds.length === 0)) {
      return res.status(400).json({ error: 'Message or caseIds array is required' });
    }

    console.log(`[ChatRoute] Dispatching Query to Enterprise RAG Pipeline (Officer: ${officerId})`);
    
    // Execute Intent Planner & Deterministic Database Retrieval Pipeline
    const result = processOfficerQuery({
      query: rawMessage,
      officerId,
      sessionId,
      language: lang,
      caseIds
    });

    return res.json(result);

  } catch (err) {
    console.error('[ENTERPRISE AI PIPELINE ERROR]', err);
    res.status(500).json({ error: 'Failed to process AI investigation query', details: err.message });
  }
});

export default router;
