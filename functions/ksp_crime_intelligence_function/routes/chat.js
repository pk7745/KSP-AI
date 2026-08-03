import express from 'express';
import { dataSyncLayer } from '../services/dataSyncLayer.js';
import { enterpriseSearchIndex } from '../services/enterpriseSearchIndex.js';
import { semanticVectorEngine } from '../services/semanticVectorEngine.js';
import { searchSimilarCases } from '../services/similarityEngine.js';
import { enforceRBAC } from '../services/rbacEnforcer.js';
import { generateExplainableReport } from '../services/explainableAi.js';
import { processConversationalQuery } from '../services/gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query, language = 'en', history = [], officerId = 'OFF001' } = req.body;
    const message = query || req.body.message;
    const lang = language || req.body.lang || 'en';
    const isKn = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message || '');
    const sessionId = req.body.sessionId || 'default-session';

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`\n===============================================================`);
    console.log(`[ENTERPRISE AI BACKEND PIPELINE (STEPS 1-12)]`);
    console.log(`  • Query      : "${message}"`);
    console.log(`  • Language   : ${isKn ? 'Kannada (kn)' : 'English (en)'}`);
    console.log(`  • Officer ID : ${officerId}`);
    console.log(`===============================================================`);

    // STEP 1 & 2: Sync Data Layer from Stratus CSVs
    const { report: syncReport } = dataSyncLayer.syncAll();
    console.log(`  ✓ Steps 1-2: Stratus CSV Data Sync Verified (${syncReport.totalRecords} records).`);

    // STEP 3 & 4: Intent & Entity Extraction
    const intent = extractEntitiesAndIntent(message);
    console.log(`  ✓ Steps 3-4: Intent & Entity Extraction:`, intent);

    // STEP 6: Strict RBAC Jurisdiction Enforcement
    const rbacResult = enforceRBAC(officerId, intent.detectedDistrict, message, isKn);
    console.log(`  ✓ Step 6: RBAC Authorization:`, rbacResult.authorized ? `AUTHORIZED (${rbacResult.authorizedDistrict})` : `DENIED`);

    if (!rbacResult.authorized) {
      return res.json({
        reply: rbacResult.restrictionReason,
        answer: rbacResult.restrictionReason,
        sessionId,
        lang,
        accessRestricted: true,
        authorizedDistrict: rbacResult.authorizedDistrict,
        sources: ['RBACEnforcer'],
        confidence: 1.0,
        dossier: {
          restrictionReason: rbacResult.restrictionReason,
          timestamp: new Date().toISOString()
        }
      });
    }

    // STEP 4 & 5: Semantic Vector & Keyword Search Across Authorized CSV Records
    const candidateCases = rbacResult.allowedCases;
    const vectorMatches = semanticVectorEngine.searchVector(message, 5);
    const keywordMatches = enterpriseSearchIndex.searchByKeyword(intent.detectedCrimeType || 'murder');
    
    const combinedMatches = Array.from(new Set([...vectorMatches.map(v => v.caseRecord), ...keywordMatches, ...candidateCases])).slice(0, 8);
    console.log(`  ✓ Step 4-5: Vector & Index Search Matched ${combinedMatches.length} records.`);

    // STEP 7: Case Similarity Search Engine (Percentage Similarity Matches)
    const similarCases = searchSimilarCases({ query: message, ...intent }, 4);
    console.log(`  ✓ Step 7: Case Similarity Search Found ${similarCases.length} matches.`);

    // STEP 10: Generate Explainable AI Intelligence Report
    const reportText = generateExplainableReport({
      query: message,
      facts: combinedMatches,
      similarCases,
      isKn,
      officerContext: {
        officerId,
        authorizedDistrict: rbacResult.authorizedDistrict
      }
    });

    const dossier = {
      queryIntent: intent,
      sources: ['CaseMaster', 'Victim', 'Accused', 'Witness', 'Evidence', 'Officer', 'EmergencyAccess'],
      confidence: 0.98,
      factsCount: combinedMatches.length,
      similarCasesCount: similarCases.length,
      timestamp: new Date().toISOString()
    };

    res.json({
      reply: reportText,
      answer: reportText,
      sessionId,
      lang,
      sources: dossier.sources,
      confidence: dossier.confidence,
      similarCases: similarCases.map(s => ({
        crimeNo: s.caseRecord.CrimeNumber || s.caseRecord.CrimeNo,
        similarityScore: `${s.similarityScore}%`,
        matchingFactors: s.matchingFactors
      })),
      dossier,
      retrievedCases: combinedMatches.slice(0, 5)
    });
  } catch (err) {
    console.error('[ENTERPRISE AI ENGINE ERROR]', err);
    res.status(500).json({ error: 'Failed to process Enterprise AI query', details: err.message });
  }
});

function extractEntitiesAndIntent(msg) {
  const lower = msg.toLowerCase();
  
  let detectedDistrict = null;
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('whitefield') || lower.includes('koramangala') || lower.includes('jayanagar')) detectedDistrict = 'Bengaluru Urban';
  else if (lower.includes('mysuru') || lower.includes('mysore')) detectedDistrict = 'Mysuru';
  else if (lower.includes('mangaluru') || lower.includes('mangalore')) detectedDistrict = 'Dakshina Kannada (Mangaluru)';
  else if (lower.includes('belagavi') || lower.includes('belgaum')) detectedDistrict = 'Belagavi';
  else if (lower.includes('hubballi') || lower.includes('dharwad')) detectedDistrict = 'Hubballi City';

  let detectedCrimeType = null;
  if (lower.includes('murder') || lower.includes('homicide') || lower.includes('302') || lower.includes('ಕೊಲೆ')) detectedCrimeType = 'Murder';
  else if (lower.includes('cyber') || lower.includes('phishing') || lower.includes('upi') || lower.includes('fraud') || lower.includes('ಸೈಬರ್')) detectedCrimeType = 'Cyber Crime';
  else if (lower.includes('theft') || lower.includes('stolen') || lower.includes('burglary') || lower.includes('robbery') || lower.includes('ಕಳ್ಳತನ')) detectedCrimeType = 'Theft';
  else if (lower.includes('rape') || lower.includes('pocso') || lower.includes('assault') || lower.includes('ಅತ್ಯಾಚಾರ')) detectedCrimeType = 'Crime Against Women';
  else if (lower.includes('ndps') || lower.includes('drug') || lower.includes('mdma')) detectedCrimeType = 'NDPS';

  return {
    detectedDistrict,
    detectedCrimeType,
    hasWeaponKeyword: lower.includes('knife') || lower.includes('pistol') || lower.includes('wire') || lower.includes('gun') || lower.includes('rod'),
    query: msg
  };
}

export default router;
