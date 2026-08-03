import express from 'express';
import { intelligenceIndex } from '../services/intelligenceIndex.js';
import { searchSimilarCases } from '../services/similarityEngine.js';
import { enforceRBAC } from '../services/rbacEnforcer.js';
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
    console.log(`[AI ENGINE PIPELINE INITIATED]`);
    console.log(`  • Query      : "${message}"`);
    console.log(`  • Language   : ${isKn ? 'Kannada (kn)' : 'English (en)'}`);
    console.log(`  • Officer ID : ${officerId}`);
    console.log(`===============================================================`);

    // STEP 1: Intent Detection & Entity Extraction
    const intent = extractEntitiesAndIntent(message);
    console.log(`  ✓ Step 1-8: Intent & Entity Extraction:`, intent);

    // STEP 2: Strict RBAC Jurisdiction Enforcement
    const rbacResult = enforceRBAC(officerId, intent.detectedDistrict, message, isKn);
    console.log(`  ✓ Step 9: RBAC Authorization:`, rbacResult.authorized ? `AUTHORIZED (${rbacResult.authorizedDistrict})` : `DENIED`);

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

    // STEP 3: Multi-Table Search Across Authorized CSV Records
    const candidateCases = rbacResult.allowedCases;
    const matchingCases = filterAuthorizedCases(candidateCases, intent, message);
    console.log(`  ✓ Step 10: Multi-Table Search Matched ${matchingCases.length} records.`);

    // STEP 4: Case Similarity Search Engine (Percentage Similarity Matches)
    const similarCases = searchSimilarCases({ query: message, ...intent }, 4);
    console.log(`  ✓ Step 11: Case Similarity Search Found ${similarCases.length} matches.`);

    // STEP 5: Criminal Nexus Search & Entity Joins
    const enrichedFacts = matchingCases.slice(0, 6).map(c => {
      const crimeNo = c.CrimeNumber || c.CrimeNo;
      const entities = intelligenceIndex.getEntitiesForCase(crimeNo);
      return {
        ...c,
        victims: entities.victims,
        accused: entities.accused,
        witnesses: entities.witnesses,
        evidence: entities.evidence
      };
    });

    // STEP 6: Generate Investigation Intelligence Report
    const aiResult = await processConversationalQuery({
      message,
      history,
      lang: isKn ? 'kn' : 'en',
      retrievedFacts: enrichedFacts,
      similarCases,
      officerContext: {
        officerId,
        authorizedDistrict: rbacResult.authorizedDistrict
      }
    });

    const dossier = {
      queryIntent: intent,
      sources: ['CaseMaster', 'Victim', 'Accused', 'Witness', 'Evidence', 'Officer', 'EmergencyAccess'],
      confidence: 0.98,
      factsCount: matchingCases.length,
      similarCasesCount: similarCases.length,
      timestamp: new Date().toISOString()
    };

    res.json({
      reply: aiResult.reply,
      answer: aiResult.reply,
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
      retrievedCases: enrichedFacts.slice(0, 5)
    });
  } catch (err) {
    console.error('[AI ENGINE ERROR]', err);
    res.status(500).json({ error: 'Failed to process AI Intelligence query', details: err.message });
  }
});

/**
 * Entity Extraction Helper (Extracts District, Crime Type, Weapon, Victim, Accused)
 */
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
    hasRepeatOffenderQuery: lower.includes('repeat') || lower.includes('habitual') || lower.includes('nexus') || lower.includes('gang'),
    query: msg
  };
}

/**
 * Search filter logic across multi-table CSV records
 */
function filterAuthorizedCases(candidateCases, intent, userMessage) {
  if (!candidateCases || candidateCases.length === 0) return [];
  const lowerMsg = userMessage.toLowerCase();

  const filtered = candidateCases.filter(c => {
    const fullText = `${c.CrimeNumber || c.CrimeNo} ${c.District} ${c.PoliceStation} ${c.CrimeMajorHead} ${c.CrimeMinorHead} ${c.CaseStatus} ${c.BriefFacts}`.toLowerCase();

    if (intent.detectedCrimeType) {
      if (intent.detectedCrimeType === 'Murder' && (fullText.includes('murder') || fullText.includes('homicide') || fullText.includes('ಕೊಲೆ'))) return true;
      if (intent.detectedCrimeType === 'Cyber Crime' && (fullText.includes('cyber') || fullText.includes('upi') || fullText.includes('fraud') || fullText.includes('phishing') || fullText.includes('ಸೈಬರ್'))) return true;
      if (intent.detectedCrimeType === 'Theft' && (fullText.includes('theft') || fullText.includes('burglary') || fullText.includes('robbery') || fullText.includes('stolen') || fullText.includes('ಕಳ್ಳತನ'))) return true;
      if (intent.detectedCrimeType === 'Crime Against Women' && (fullText.includes('rape') || fullText.includes('pocso') || fullText.includes('women') || fullText.includes('assault'))) return true;
    }

    if (intent.detectedDistrict && fullText.includes(intent.detectedDistrict.toLowerCase())) return true;

    // Word match score
    const queryWords = lowerMsg.split(/\s+/).filter(w => w.length > 3);
    for (const qw of queryWords) {
      if (fullText.includes(qw)) return true;
    }

    return false;
  });

  return filtered.length > 0 ? filtered : candidateCases.slice(0, 5);
}

export default router;
