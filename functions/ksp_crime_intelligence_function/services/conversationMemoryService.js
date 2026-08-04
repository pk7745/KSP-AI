/**
 * Enterprise Conversation Memory Service
 * Tracks multi-turn investigation session context, active suspects, active case references,
 * and search history across language switches (English ↔ Kannada).
 */

class ConversationMemoryService {
  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId = 'default-session') {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        activeCaseID: null,
        activeDistrict: null,
        activeCrimeType: null,
        lastSearchResults: [],
        turnHistory: [],
        lastUpdated: new Date().toISOString()
      });
    }
    return this.sessions.get(sessionId);
  }

  updateSession(sessionId = 'default-session', updates) {
    const session = this.getSession(sessionId);
    Object.assign(session, updates, { lastUpdated: new Date().toISOString() });
    this.sessions.set(sessionId, session);
    return session;
  }

  resolveContextualQuery(query, sessionId = 'default-session') {
    const session = this.getSession(sessionId);
    const q = (query || '').trim();
    const lower = q.toLowerCase();

    // 1. Reference "Only pending" or "only solved"
    if (lower.includes('only pending') || lower.includes('pending cases')) {
      const dist = session.activeDistrict ? ` in ${session.activeDistrict}` : '';
      const crime = session.activeCrimeType ? `${session.activeCrimeType} ` : '';
      return { resolvedQuery: `Show pending ${crime}cases${dist}`, session };
    }

    // 2. Reference "Show the latest" / "show latest"
    if (lower.includes('show the latest') || lower.includes('show latest') || lower.includes('latest case')) {
      if (session.lastSearchResults && session.lastSearchResults.length > 0) {
        const topCase = session.lastSearchResults[0];
        const cNo = topCase.CrimeNumber || topCase.CrimeNo;
        session.activeCaseID = cNo;
        return { resolvedQuery: `Show details of Case ${cNo}`, session, activeCaseID: cNo };
      }
    }

    // 3. Reference "Open Case X" / "Open Case 205"
    const openMatch = q.match(/open (case|fir)?\s*([a-z0-9\/-]+)/i);
    if (openMatch) {
      const targetId = openMatch[2];
      session.activeCaseID = targetId;
      return { resolvedQuery: `Show details of Case ${targetId}`, session, activeCaseID: targetId };
    }

    // 4. Reference "Who is the accused?" for active case
    if (lower.includes('who is the accused') || lower.includes('show accused') || lower.includes('accused details')) {
      if (session.activeCaseID) {
        return { resolvedQuery: `Show accused for Case ${session.activeCaseID}`, session, activeCaseID: session.activeCaseID };
      }
    }

    // 5. Reference "Show previous FIRs"
    if (lower.includes('previous firs') || lower.includes('prior firs')) {
      if (session.activeCaseID) {
        return { resolvedQuery: `Show prior FIRs and criminal history for Case ${session.activeCaseID}`, session, activeCaseID: session.activeCaseID };
      }
    }

    // 6. Reference "Show evidence"
    if (lower.includes('show evidence') || lower.includes('view evidence')) {
      if (session.activeCaseID) {
        return { resolvedQuery: `Show evidence for Case ${session.activeCaseID}`, session, activeCaseID: session.activeCaseID };
      }
    }

    // 7. Reference "Explain in Kannada"
    if (lower.includes('explain in kannada') || lower.includes('kannada version') || /[\u0C80-\u0CFF]/.test(q)) {
      if (session.activeCaseID) {
        return { resolvedQuery: `Explain Case ${session.activeCaseID} in Kannada`, session, activeCaseID: session.activeCaseID, forceKannada: true };
      }
    }

    return { resolvedQuery: q, session, activeCaseID: session.activeCaseID };
  }
}

export const conversationMemoryService = new ConversationMemoryService();
