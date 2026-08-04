import express from 'express';
import { executeHybridRetrievalPipeline } from '../services/hybridRetrievalService.js';
import { detectExactIdentifier, performExactIdentifierLookup } from '../services/identifierRecognizer.js';
import { compareMultipleCases } from '../services/multiCaseComparisonEngine.js';
import { conversationMemoryService } from '../services/conversationMemoryService.js';
import { enforceRBAC } from '../services/rbacEnforcer.js';
import { generateExplainableReport } from '../services/explainableAi.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, language = 'en', officerId = 'OFF001', sessionId = 'default-session', caseIds: reqCaseIds } = req.body;
    const rawMessage = query || req.body.message;
    const lang = language || req.body.lang || 'en';
    const isKn = lang === 'kn' || /[\u0C80-\u0CFF]/.test(rawMessage || '');

    if (!rawMessage && (!reqCaseIds || reqCaseIds.length === 0)) {
      return res.status(400).json({ error: 'Message or caseIds array is required' });
    }

    // Step 1: Check multi-case comparison request (2 to 5 cases)
    const detectedCaseIds = (rawMessage || '').match(/KSP\/[A-Z0-9]+\/\d{4}\/\d+/gi) || reqCaseIds || [];

    if (detectedCaseIds.length >= 2 || (reqCaseIds && reqCaseIds.length >= 2)) {
      const finalCaseIds = Array.from(new Set(detectedCaseIds)).slice(0, 5);
      console.log(`[ChatRoute] Executing Multi-Case Comparison across ${finalCaseIds.length} Cases: [${finalCaseIds.join(', ')}]`);

      const multiCaseResult = compareMultipleCases(finalCaseIds, officerId);
      const reportText = generateExplainableReport({
        query: rawMessage,
        multiCaseResult,
        isKn,
        officerContext: { officerId, authorizedDistrict: 'Bengaluru Urban' }
      });

      return res.json({
        reply: reportText,
        answer: reportText,
        sessionId,
        lang,
        confidence: 0.98,
        multiCaseResult
      });
    }

    // Step 2: Check exact identifier auto-recognition (Case ID, FIR, Evidence, Officer, Phone, Vehicle)
    const exactId = detectExactIdentifier(rawMessage || '');
    if (exactId) {
      console.log(`[ChatRoute] Exact Identifier Recognized: [${exactId.type}] = ${exactId.value}`);
      const exactLookup = performExactIdentifierLookup(exactId);

      if (exactLookup && exactLookup.caseRecord) {
        const cNo = exactLookup.caseRecord.CrimeNumber || exactLookup.caseRecord.CrimeNo;
        conversationMemoryService.updateSession(sessionId, { activeCaseID: cNo });

        const rbacResult = enforceRBAC(officerId, exactLookup.caseRecord.District, rawMessage, isKn);
        if (!rbacResult.authorized) {
          return res.json({ reply: rbacResult.restrictionReason, answer: rbacResult.restrictionReason, sessionId, accessRestricted: true });
        }

        const reportText = generateExplainableReport({
          query: rawMessage,
          exactLookup,
          facts: [exactLookup.caseRecord],
          isKn,
          officerContext: { officerId, authorizedDistrict: rbacResult.authorizedDistrict }
        });

        return res.json({
          reply: reportText,
          answer: reportText,
          sessionId,
          lang,
          confidence: 1.0,
          exactMatch: exactLookup
        });
      }
    }

    // Step 3: Execute Hybrid RAG Retrieval Pipeline for natural language & multi-turn follow-ups
    const ragResult = executeHybridRetrievalPipeline({ query: rawMessage, officerId, sessionId, language: lang });
    return res.json(ragResult);

  } catch (err) {
    console.error('[HYBRID AI ARCHITECTURE ERROR]', err);
    res.status(500).json({ error: 'Failed to process AI investigation query', details: err.message });
  }
});

export default router;
