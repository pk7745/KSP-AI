import { indexingService } from './indexingService.js';
import { embeddingService } from './embeddingService.js';
import { conversationMemoryService } from './conversationMemoryService.js';
import { traverseRelationshipGraph } from './relationshipTraversalService.js';
import { executeInvestigativeReasoning } from './reasoningService.js';
import { enforceRBAC } from './rbacEnforcer.js';
import { compareMultipleCases } from './multiCaseComparisonEngine.js';

/**
 * Enterprise Query Planner & Deterministic RAG Retrieval Engine
 * 
 * Strict 4-Step Pipeline:
 * 1. Intent Detection & Query Planning (LIST_CASES, OPEN_CASE, COMPARE_CASES, SIMILARITY_SEARCH, ENTITY_LOOKUP, CLARIFY)
 * 2. Deterministic Database Retrieval (Structured CSV + Vector Search + Graph Traversal)
 * 3. RBAC Jurisdiction Enforcement
 * 4. Gemini Reasoning over retrieved database facts
 */

export function processOfficerQuery({ query, officerId = 'OFF001', sessionId = 'default-session', language = 'en', caseIds = [] }) {
  const rawQ = (query || '').trim();
  const isKn = language === 'kn' || /[\u0C80-\u0CFF]/.test(rawQ);
  const session = conversationMemoryService.getSession(sessionId);

  console.log(`[QueryPlanner] Processing query: "${rawQ}" for Officer ${officerId} (Session: ${sessionId})`);

  // Step 1: Detect explicit Case IDs in request or parameters
  const detectedCaseIds = Array.from(new Set([
    ...(rawQ.match(/KSP\/[A-Z0-9]+\/\d{4}\/\d+/gi) || []),
    ...(caseIds || [])
  ]));

  // Step 2: Intent Classification
  const intentPlan = classifyIntent(rawQ, detectedCaseIds, session);
  console.log(`[QueryPlanner] Classified Intent: ${intentPlan.intent}`, intentPlan.filters);

  // Handle INTENT: CLARIFY (Ambiguous query like "Find similar investigations" without target ID)
  if (intentPlan.intent === 'CLARIFY') {
    const promptMessage = isKn
      ? 'ದಯವಿಟ್ಟು ಹೋಲಿಸಲು ಅಥವಾ ಪರಿಶೀಲಿಸಲು ಅಪೇಕ್ಷಿತ ಪ್ರಕರಣದ ಸಂಖ್ಯೆಯನ್ನು (Case ID) ನಮೂದಿಸಿ.'
      : 'Please specify the Case ID or investigation you would like to compare or analyze.';
    return {
      intent: 'CLARIFY',
      authorized: true,
      reply: promptMessage,
      answer: promptMessage,
      sessionId
    };
  }

  // Handle INTENT: COMPARE_CASES (2 to 5 cases)
  if (intentPlan.intent === 'COMPARE_CASES') {
    const targetCaseIds = intentPlan.caseIds.slice(0, 5);
    const comparisonResult = compareMultipleCases(targetCaseIds, officerId);
    
    // Synthesize comparison response strictly over database records
    let replyText = `### ⚖️ Multi-Case Investigation Comparison Dossier\n\n`;
    replyText += `**Compared Cases:** ${targetCaseIds.join(', ')}\n`;
    replyText += `**Overall Similarity Score:** \`${comparisonResult.similarityScore}%\`\n\n`;

    const caseSummaries = Object.values(comparisonResult.caseDetailsMap || {}).map(c => {
      const cd = c.caseDetails || {};
      return {
        caseId: cd.CrimeNumber || cd.CrimeNo,
        crimeHead: cd.CrimeMajorHead || 'Offense',
        district: cd.DistrictName || 'District',
        status: cd.CaseStatus || 'Under Investigation',
        accusedCount: c.accused?.length || 0,
        victimCount: c.victims?.length || 0,
        evidenceCount: c.evidence?.length || 0
      };
    });

    caseSummaries.forEach(c => {
      replyText += `#### 📁 Case ${c.caseId}\n`;
      replyText += `• **Crime Head:** ${c.crimeHead} | **District:** ${c.district} | **Status:** ${c.status}\n`;
      replyText += `• **Accused Count:** ${c.accusedCount} | **Victim Count:** ${c.victimCount} | **Evidence Count:** ${c.evidenceCount}\n\n`;
    });

    replyText += `#### 🔍 Shared Entities & Patterns:\n`;
    (comparisonResult.sharedEntities?.accusedNames || []).forEach(a => replyText += `• **Shared Accused:** ${a}\n`);
    (comparisonResult.sharedEntities?.vehicles || []).forEach(v => replyText += `• **Shared Vehicle:** ${v}\n`);
    (comparisonResult.sharedEntities?.phones || []).forEach(p => replyText += `• **Shared Mobile:** ${p}\n`);

    return {
      intent: 'COMPARE_CASES',
      authorized: true,
      reply: replyText,
      answer: replyText,
      sessionId,
      comparisonResult
    };
  }

  // Handle INTENT: OPEN_CASE (Retrieve THAT EXACT CASE. Never pick another case or random result)
  if (intentPlan.intent === 'OPEN_CASE') {
    const exactCaseId = intentPlan.caseId;
    const kwMatch = indexingService.searchKeyword(exactCaseId);
    const exactRecord = kwMatch.length > 0 ? kwMatch[0].record : null;

    if (!exactRecord) {
      const msg = isKn
        ? `ಪ್ರಕರಣ \`${exactCaseId}\` ದತ್ತಾಂಶಸಂಚಯದಲ್ಲಿ (Database) ಪತ್ತೆಯಾಗಿಲ್ಲ.`
        : `Case \`${exactCaseId}\` was not found in the authorized database.`;
      return { intent: 'OPEN_CASE', authorized: true, reply: msg, answer: msg, sessionId };
    }

    // RBAC Check on exact case
    const rbac = enforceRBAC(officerId, exactRecord.District, rawQ, isKn);
    if (!rbac.authorized) {
      return { intent: 'OPEN_CASE', authorized: false, reply: rbac.restrictionReason, answer: rbac.restrictionReason, accessRestricted: true };
    }

    // Graph traversal for exact case
    const graphHops = traverseRelationshipGraph(exactCaseId);
    conversationMemoryService.updateSession(sessionId, { activeCaseID: exactCaseId });

    const cNo = exactRecord.CrimeNumber || exactRecord.CrimeNo;
    let brief = `### 📁 Investigation Dossier — Case \`${cNo}\`\n\n`;
    brief += `**FIR Number:** \`${cNo}\`\n`;
    brief += `**District & Police Station:** ${exactRecord.District || 'Bengaluru Urban'} — ${exactRecord.PoliceStation || 'Cubbon Park PS'}\n`;
    brief += `**Crime Major Head:** ${exactRecord.CrimeMajorHead || 'Offense'}\n`;
    brief += `**Current Investigation Status:** *${exactRecord.CaseStatus || 'Under Investigation'}*\n\n`;

    brief += `#### 📌 Brief Facts:\n${exactRecord.BriefFacts || 'Brief facts registered in CCTNS.'}\n\n`;

    brief += `#### 👥 Linked Entities:\n`;
    brief += `• **Victims (${graphHops.hops.victims.length}):** ${graphHops.hops.victims.map(v => v.VictimName).join(', ') || 'None recorded'}\n`;
    brief += `• **Accused (${graphHops.hops.accused.length}):** ${graphHops.hops.accused.map(a => `${a.AccusedName} (${a.ArrestStatus || 'Active'})`).join(', ') || 'None recorded'}\n`;
    brief += `• **Evidence Items (${graphHops.hops.evidence.length}):** ${graphHops.hops.evidence.map(e => e.EvidenceType).join(', ') || 'Cataloged in Stratus'}\n\n`;

    brief += `#### 💡 Recommended IO Next Steps:\n`;
    brief += `• Secure CCTV footage from commercial establishments within 500m radius.\n`;
    brief += `• Issue notice under Sec 91 CrPC for tower dump CDR analysis.\n`;

    return {
      intent: 'OPEN_CASE',
      authorized: true,
      reply: brief,
      answer: brief,
      sessionId,
      exactCase: exactRecord,
      graphHops
    };
  }

  // Handle INTENT: ENTITY_LOOKUP for active case
  if (intentPlan.intent === 'ENTITY_LOOKUP') {
    const activeId = session.activeCaseID || 'KSP/DIS001/2026/00001';
    const graphHops = traverseRelationshipGraph(activeId);

    let reply = `### 🔍 Entity Breakdown for Active Case \`${activeId}\`\n\n`;
    if (intentPlan.entityType === 'ACCUSED') {
      reply += `#### 🚨 Accused Entities (${graphHops.hops.accused.length}):\n`;
      graphHops.hops.accused.forEach(a => {
        reply += `• **Name:** ${a.AccusedName} | **Age:** ${a.Age || 'N/A'} | **Status:** ${a.ArrestStatus || 'Under Investigation'} | **Contact:** ${a.Mobile || 'N/A'}\n`;
      });
    } else if (intentPlan.entityType === 'VICTIM') {
      reply += `#### 👤 Victim Entities (${graphHops.hops.victims.length}):\n`;
      graphHops.hops.victims.forEach(v => {
        reply += `• **Name:** ${v.VictimName} | **Status:** ${v.VictimStatus || 'Victim'} | **Injury:** ${v.InjuryType || 'N/A'}\n`;
      });
    } else {
      reply += `#### 📄 Cataloged Evidence (${graphHops.hops.evidence.length}):\n`;
      graphHops.hops.evidence.forEach(e => {
        reply += `• **ID:** ${e.EvidenceID || 'EV-001'} | **Type:** ${e.EvidenceType} | **Desc:** ${e.Description || 'Logged'}\n`;
      });
    }

    return {
      intent: 'ENTITY_LOOKUP',
      authorized: true,
      reply,
      answer: reply,
      sessionId
    };
  }

  // Handle INTENT: LIST_CASES & SIMILARITY_SEARCH
  const rbac = enforceRBAC(officerId, intentPlan.filters.district, rawQ, isKn);
  if (!rbac.authorized) {
    return { intent: intentPlan.intent, authorized: false, reply: rbac.restrictionReason, answer: rbac.restrictionReason, accessRestricted: true };
  }

  const kwMatches = indexingService.searchKeyword(intentPlan.filters.crimeType || intentPlan.filters.keyword || 'crime');
  const vectorMatches = embeddingService.searchSemanticVector(rawQ, 10);

  const matchedCases = Array.from(new Set([
    ...kwMatches.map(k => k.record),
    ...vectorMatches.map(v => v.caseRecord),
    ...rbac.allowedCases
  ])).filter(Boolean).slice(0, 15);

  conversationMemoryService.updateSession(sessionId, {
    lastSearchResults: matchedCases,
    activeCaseID: matchedCases.length > 0 ? (matchedCases[0].CrimeNumber || matchedCases[0].CrimeNo) : session.activeCaseID
  });

  let replyText = `### 📋 Investigation Database Search Results\n\n`;
  replyText += `**Query Filters:** Crime = \`${intentPlan.filters.crimeType || 'All'}\` | District = \`${intentPlan.filters.district || rbac.authorizedDistrict}\` | Status = \`${intentPlan.filters.status || 'All'}\` \n`;
  replyText += `**Total Matching Investigations Found:** \`${matchedCases.length} records\`\n\n`;

  matchedCases.slice(0, 5).forEach((c, idx) => {
    const cNo = c.CrimeNumber || c.CrimeNo;
    replyText += `**${idx + 1}. Case ${cNo}** (${c.CrimeMajorHead || 'Offense'})\n`;
    replyText += `• **Station & District:** ${c.PoliceStation || 'Station'} — ${c.District || 'District'}\n`;
    replyText += `• **Status:** *${c.CaseStatus || 'Under Investigation'}* | **Registered:** ${c.CrimeRegisteredDate || 'Recent'}\n`;
    replyText += `• **Brief Facts:** ${c.BriefFacts || 'Brief facts filed in CaseMaster.'}\n\n`;
  });

  const reasoning = executeInvestigativeReasoning({
    query: rawQ,
    retrievedCases: matchedCases,
    isKn,
    officerContext: { officerId, authorizedDistrict: rbac.authorizedDistrict }
  });

  replyText += `\n${reasoning.briefText}`;

  return {
    intent: intentPlan.intent,
    authorized: true,
    reply: replyText,
    answer: replyText,
    sessionId,
    totalCount: matchedCases.length,
    retrievedCases: matchedCases
  };
}

function classifyIntent(q, detectedCaseIds, session) {
  const lower = (q || '').toLowerCase();

  // 1. Check COMPARE_CASES
  if (detectedCaseIds.length >= 2 || (lower.includes('compare') && detectedCaseIds.length >= 1)) {
    return { intent: 'COMPARE_CASES', caseIds: detectedCaseIds };
  }

  // 2. Check OPEN_CASE (Explicit case number provided)
  if (detectedCaseIds.length === 1 && (lower.includes('open') || lower.includes('show case') || lower.includes('view case') || /^ksp\//i.test(q))) {
    return { intent: 'OPEN_CASE', caseId: detectedCaseIds[0] };
  }

  // 3. Check Ambiguous SIMILARITY_SEARCH or COMPARE without ID -> CLARIFY
  if ((lower.includes('find similar') || lower.includes('compare investigations') || lower.includes('show similar')) && detectedCaseIds.length === 0 && !session.activeCaseID) {
    return { intent: 'CLARIFY' };
  }

  // 4. Check ENTITY_LOOKUP
  if (lower.includes('who is the accused') || lower.includes('show accused')) {
    return { intent: 'ENTITY_LOOKUP', entityType: 'ACCUSED' };
  }
  if (lower.includes('show victims') || lower.includes('who is the victim')) {
    return { intent: 'ENTITY_LOOKUP', entityType: 'VICTIM' };
  }
  if (lower.includes('show evidence') || lower.includes('forensic report')) {
    return { intent: 'ENTITY_LOOKUP', entityType: 'EVIDENCE' };
  }

  // 5. Default LIST_CASES / SEARCH
  let district = null;
  if (lower.includes('bengaluru') || lower.includes('bangalore') || lower.includes('whitefield')) district = 'Bengaluru Urban';
  else if (lower.includes('mysuru') || lower.includes('mysore')) district = 'Mysuru';
  else if (lower.includes('mangaluru') || lower.includes('mangalore')) district = 'Dakshina Kannada (Mangaluru)';

  let crimeType = null;
  if (lower.includes('theft') || lower.includes('burglary') || lower.includes('stolen')) crimeType = 'Theft';
  else if (lower.includes('murder') || lower.includes('homicide') || lower.includes('302')) crimeType = 'Murder';
  else if (lower.includes('cyber') || lower.includes('phishing') || lower.includes('fraud')) crimeType = 'Cyber Crime';

  let status = null;
  if (lower.includes('pending')) status = 'Under Investigation';
  else if (lower.includes('solved') || lower.includes('chargesheeted')) status = 'Charge Sheeted';

  return {
    intent: lower.includes('similar') ? 'SIMILARITY_SEARCH' : 'LIST_CASES',
    filters: { district, crimeType, status, keyword: q }
  };
}
