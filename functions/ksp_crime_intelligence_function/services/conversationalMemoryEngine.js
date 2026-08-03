/**
 * Step 12: Conversational Investigation Memory Engine
 * Tracks active case context, active suspects, active victims, and search history across chat turns.
 * Resolves references like "Open second case", "Compare with previous", "Show accused", "Show evidence".
 */

class ConversationalMemoryEngine {
  constructor() {
    this.sessions = new Map();
  }

  getSession(sessionId = 'default-session') {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        activeCaseID: null,
        lastSearchResults: [],
        historyTurns: [],
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

  resolveImplicitContext(query, sessionId = 'default-session') {
    const session = this.getSession(sessionId);
    const lower = query.toLowerCase();

    // 1. Reference "Open second case" or "show 2nd case"
    if (lower.includes('second case') || lower.includes('2nd case') || lower.includes('next case')) {
      if (session.lastSearchResults && session.lastSearchResults.length >= 2) {
        const targetCase = session.lastSearchResults[1];
        const targetId = targetCase.CrimeNumber || targetCase.CrimeNo;
        session.activeCaseID = targetId;
        return { resolvedQuery: `Show details of Case ${targetId}`, targetCaseID: targetId };
      }
    }

    // 2. Reference "Compare with previous"
    if (lower.includes('compare with previous') || lower.includes('compare previous')) {
      if (session.lastSearchResults && session.lastSearchResults.length >= 2) {
        const caseA = session.lastSearchResults[0].CrimeNumber || session.lastSearchResults[0].CrimeNo;
        const caseB = session.lastSearchResults[1].CrimeNumber || session.lastSearchResults[1].CrimeNo;
        return { resolvedQuery: `Compare Case ${caseA} with Case ${caseB}`, caseIdA: caseA, caseIdB: caseB };
      }
    }

    // 3. Reference "Show accused" / "Show evidence" for active case
    if ((lower.includes('show accused') || lower.includes('show evidence') || lower.includes('show timeline')) && session.activeCaseID) {
      return { resolvedQuery: `${query} for Case ${session.activeCaseID}`, targetCaseID: session.activeCaseID };
    }

    return { resolvedQuery: query, targetCaseID: session.activeCaseID };
  }
}

export const conversationalMemoryEngine = new ConversationalMemoryEngine();
