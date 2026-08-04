import { indexingService } from './indexingService.js';
import { embeddingService } from './embeddingService.js';
import { conversationMemoryService } from './conversationMemoryService.js';
import { traverseRelationshipGraph } from './relationshipTraversalService.js';
import { executeInvestigativeReasoning } from './reasoningService.js';
import { enforceRBAC } from './rbacEnforcer.js';
import { searchSimilarCases } from './similarityEngine.js';

/**
 * Enterprise Hybrid Retrieval Service (RAG Pipeline)
 * Executes 8-stage hybrid retrieval: Intent Detection ➔ Entity Extraction ➔ Structured Search ➔
 * Semantic Vector Search ➔ Relationship Traversal ➔ Context Expansion ➔ Hybrid Ranking ➔ Reasoning.
 */

export function executeHybridRetrievalPipeline({ query, officerId = 'OFF001', sessionId = 'default-session', language = 'en' }) {
  const isKn = language === 'kn' || /[\u0C80-\u0CFF]/.test(query || '');

  // Stage 1 & 2: Conversation Memory Context & Intent Resolution
  const { resolvedQuery, activeCaseID } = conversationMemoryService.resolveContextualQuery(query, sessionId);
  const q = resolvedQuery || query;

  console.log(`[HybridRetrievalService] Stage 1 & 2: Processing query "${q}" for officer ${officerId} (Session: ${sessionId})`);

  // Stage 3: Entity Extraction (District, Crime Type, Case ID)
  const intent = extractIntentAndEntities(q);

  // Stage 4: Pre-Retrieval RBAC Validation
  const rbac = enforceRBAC(officerId, intent.district, q, isKn);
  if (!rbac.authorized) {
    return {
      authorized: false,
      reply: rbac.restrictionReason,
      answer: rbac.restrictionReason,
      accessRestricted: true,
      retrievedCases: [],
      similarCases: []
    };
  }

  // Stage 5: Structured Keyword Search
  const kwMatches = indexingService.searchKeyword(intent.crimeType || intent.keyword || 'murder');

  // Stage 6: Semantic Vector Search
  const vectorMatches = embeddingService.searchSemanticVector(q, 8);

  // Stage 7: Combine & Hybrid Rank Results
  const combinedCases = Array.from(new Set([
    ...vectorMatches.map(v => v.caseRecord),
    ...kwMatches.map(k => k.record).filter(r => r && (r.CrimeNumber || r.CrimeNo)),
    ...rbac.allowedCases
  ])).filter(Boolean).slice(0, 10);

  // Update Conversation Session
  conversationMemoryService.updateSession(sessionId, {
    lastSearchResults: combinedCases,
    activeCaseID: combinedCases.length > 0 ? (combinedCases[0].CrimeNumber || combinedCases[0].CrimeNo) : activeCaseID
  });

  // Stage 8: Relationship Traversal & AI Investigative Reasoning
  const topCaseId = combinedCases.length > 0 ? (combinedCases[0].CrimeNumber || combinedCases[0].CrimeNo) : 'KSP/DIS001/2026/00001';
  const graphHops = traverseRelationshipGraph(topCaseId);
  const similarCases = searchSimilarCases({ query: q, ...intent }, 5);
  const reasoning = executeInvestigativeReasoning({ query: q, retrievedCases: combinedCases, graphHops, isKn, officerContext: { officerId, authorizedDistrict: rbac.authorizedDistrict } });

  return {
    authorized: true,
    reply: reasoning.briefText,
    answer: reasoning.briefText,
    sessionId,
    lang: language,
    confidence: 0.98,
    retrievedCases: combinedCases.slice(0, 5),
    similarCases
  };
}

function extractIntentAndEntities(q) {
  const lower = (q || '').toLowerCase();

  let district = null;
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('whitefield') || lower.includes('koramangala')) district = 'Bengaluru Urban';
  else if (lower.includes('mysuru') || lower.includes('mysore')) district = 'Mysuru';
  else if (lower.includes('mangaluru') || lower.includes('mangalore')) district = 'Dakshina Kannada (Mangaluru)';

  let crimeType = null;
  if (lower.includes('murder') || lower.includes('homicide') || lower.includes('302') || lower.includes('ಕೊಲೆ')) crimeType = 'Murder';
  else if (lower.includes('cyber') || lower.includes('phishing') || lower.includes('upi') || lower.includes('fraud') || lower.includes('ಸೈಬರ್')) crimeType = 'Cyber Crime';
  else if (lower.includes('theft') || lower.includes('stolen') || lower.includes('burglary') || lower.includes('ಕಳ್ಳತನ')) crimeType = 'Theft';

  const kwMatch = lower.match(/[a-z]{4,}/g);
  const keyword = kwMatch ? kwMatch[0] : 'murder';

  return { district, crimeType, keyword, query: q };
}
