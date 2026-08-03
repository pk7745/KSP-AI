import express from 'express';
import { dataSyncLayer } from '../services/dataSyncLayer.js';
import { detectExactIdentifier, performExactIdentifierLookup } from '../services/identifierRecognizer.js';
import { compareTwoCases } from '../services/caseComparisonEngine.js';
import { conversationalMemoryEngine } from '../services/conversationalMemoryEngine.js';
import { enterpriseSearchIndex } from '../services/enterpriseSearchIndex.js';
import { semanticVectorEngine } from '../services/semanticVectorEngine.js';
import { searchSimilarCases } from '../services/similarityEngine.js';
import { enforceRBAC } from '../services/rbacEnforcer.js';
import { generateExplainableReport } from '../services/explainableAi.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, language = 'en', history = [], officerId = 'OFF001', sessionId = 'default-session' } = req.body;
    const rawMessage = query || req.body.message;
    const lang = language || req.body.lang || 'en';
    const isKn = lang === 'kn' || /[\u0C80-\u0CFF]/.test(rawMessage || '');

    if (!rawMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // STEP 12: Resolve Implicit Conversational Context
    const { resolvedQuery, caseIdA, caseIdB } = conversationalMemoryEngine.resolveImplicitContext(rawMessage, sessionId);
    const message = resolvedQuery;

    console.log(`\n===============================================================`);
    console.log(`[ENTERPRISE INVESTIGATION INTELLIGENCE SYSTEM PIPELINE]`);
    console.log(`  • Raw Query      : "${rawMessage}"`);
    console.log(`  • Resolved Query : "${message}"`);
    console.log(`  • Language       : ${isKn ? 'Kannada (kn)' : 'English (en)'}`);
    console.log(`  • Session ID     : ${sessionId}`);
    console.log(`===============================================================`);

    // STEP 1 & 2: Sync Datastore
    dataSyncLayer.syncAll();

    // STEP 7: Side-by-Side Case Comparison Query ("Compare Case A with Case B")
    if (lowerIncludes(message, 'compare') && (caseIdA || message.match(/KSP\/[A-Z0-9]+\/\d{4}\/\d+/gi)?.length >= 2)) {
      const ids = message.match(/KSP\/[A-Z0-9]+\/\d{4}\/\d+/gi) || [caseIdA, caseIdB];
      const compResult = compareTwoCases(ids[0], ids[1] || ids[0]);
      
      const reportText = generateExplainableReport({
        query: message,
        comparisonResult: compResult,
        isKn,
        officerContext: { officerId, authorizedDistrict: 'Bengaluru Urban' }
      });

      return res.json({
        reply: reportText,
        answer: reportText,
        sessionId,
        lang,
        confidence: 0.98,
        comparison: compResult
      });
    }

    // STEP 1: Exact Identifier Auto-Recognition (Case ID, FIR, Evidence ID, Officer ID, Phone, Vehicle)
    const exactId = detectExactIdentifier(message);

    if (exactId) {
      console.log(`  ✓ Exact Identifier Recognized: [${exactId.type}] = ${exactId.value}`);
      const exactLookup = performExactIdentifierLookup(exactId);

      if (exactLookup && exactLookup.caseRecord) {
        const cNo = exactLookup.caseRecord.CrimeNumber || exactLookup.caseRecord.CrimeNo;
        conversationalMemoryEngine.updateSession(sessionId, { activeCaseID: cNo });

        // Enforce RBAC
        const rbacResult = enforceRBAC(officerId, exactLookup.caseRecord.District, message, isKn);
        if (!rbacResult.authorized) {
          return res.json({ reply: rbacResult.restrictionReason, answer: rbacResult.restrictionReason, sessionId, accessRestricted: true });
        }

        const reportText = generateExplainableReport({
          query: message,
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

    // STEP 3-11: Multi-Table Semantic Vector & Similar Case Retrieval
    const intent = extractEntitiesAndIntent(message);
    const rbacResult = enforceRBAC(officerId, intent.detectedDistrict, message, isKn);

    if (!rbacResult.authorized) {
      return res.json({ reply: rbacResult.restrictionReason, answer: rbacResult.restrictionReason, sessionId, accessRestricted: true });
    }

    const candidateCases = rbacResult.allowedCases;
    const vectorMatches = semanticVectorEngine.searchVector(message, 5);
    const keywordMatches = enterpriseSearchIndex.searchByKeyword(intent.detectedCrimeType || 'murder');
    
    const combinedMatches = Array.from(new Set([...vectorMatches.map(v => v.caseRecord), ...keywordMatches, ...candidateCases])).slice(0, 8);
    const similarCases = searchSimilarCases({ query: message, ...intent }, 10);

    // Save search results in session memory for follow-up turns
    conversationalMemoryEngine.updateSession(sessionId, { 
      lastSearchResults: combinedMatches,
      activeCaseID: combinedMatches.length > 0 ? (combinedMatches[0].CrimeNumber || combinedMatches[0].CrimeNo) : null
    });

    const reportText = generateExplainableReport({
      query: message,
      facts: combinedMatches,
      similarCases,
      isKn,
      officerContext: { officerId, authorizedDistrict: rbacResult.authorizedDistrict }
    });

    res.json({
      reply: reportText,
      answer: reportText,
      sessionId,
      lang,
      confidence: 0.98,
      similarCases: similarCases.slice(0, 5).map(s => ({
        crimeNo: s.caseRecord.CrimeNumber || s.caseRecord.CrimeNo,
        similarityScore: `${s.similarityScore}%`,
        matchingFactors: s.matchingFactors
      })),
      retrievedCases: combinedMatches.slice(0, 5)
    });
  } catch (err) {
    console.error('[INVESTIGATION INTELLIGENCE SYSTEM ERROR]', err);
    res.status(500).json({ error: 'Failed to process Investigation Intelligence query', details: err.message });
  }
});

function lowerIncludes(text, kw) {
  return (text || '').toLowerCase().includes(kw);
}

function extractEntitiesAndIntent(msg) {
  const lower = msg.toLowerCase();
  
  let detectedDistrict = null;
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('whitefield') || lower.includes('koramangala')) detectedDistrict = 'Bengaluru Urban';
  else if (lower.includes('mysuru') || lower.includes('mysore')) detectedDistrict = 'Mysuru';
  else if (lower.includes('mangaluru') || lower.includes('mangalore')) detectedDistrict = 'Dakshina Kannada (Mangaluru)';

  let detectedCrimeType = null;
  if (lower.includes('murder') || lower.includes('homicide') || lower.includes('302') || lower.includes('ಕೊಲೆ')) detectedCrimeType = 'Murder';
  else if (lower.includes('cyber') || lower.includes('phishing') || lower.includes('upi') || lower.includes('fraud') || lower.includes('ಸೈಬರ್')) detectedCrimeType = 'Cyber Crime';
  else if (lower.includes('theft') || lower.includes('stolen') || lower.includes('burglary') || lower.includes('ಕಳ್ಳತನ')) detectedCrimeType = 'Theft';

  return { detectedDistrict, detectedCrimeType, query: msg };
}

export default router;
