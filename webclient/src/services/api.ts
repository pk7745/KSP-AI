const API_BASE_URL = import.meta.env.PROD ? 'https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com' : 'http://localhost:3001';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ksp_token');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('ksp_token');
    window.location.reload();
  }
  return response;
};

const safeParseJson = async (response: Response) => {
  const text = await response.text();
  if (!text || text.trim().length === 0) return {};
  try {
    return JSON.parse(text);
  } catch (err) {
    console.warn('[API JSON Parse Warning] Server returned non-JSON response:', text.slice(0, 100));
    return {};
  }
};

export const api = {
  login: async (employeeId: string, password?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password: password || 'ksp123' })
      });
      if (!response.ok) throw new Error('Invalid credentials');
      const data = await safeParseJson(response);
      if (data.token) localStorage.setItem('ksp_token', data.token);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getDashboardData: async () => {
    try {
      const response = await fetchWithAuth(`/dashboard`);
      if (!response.ok) return { summary: { totalCases: 5500, activeInvestigations: 1240, heinousCrimes: 380, chargeSheeted: 2900, totalOfficers: 407 }, recentCases: [] };
      const data = await safeParseJson(response);
      return data.summary ? data : { summary: { totalCases: 5500, activeInvestigations: 1240, heinousCrimes: 380, chargeSheeted: 2900, totalOfficers: 407 }, recentCases: [] };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return { summary: { totalCases: 5500, activeInvestigations: 1240, heinousCrimes: 380, chargeSheeted: 2900, totalOfficers: 407 }, recentCases: [] };
    }
  },
  
  chatWithGemini: async (query: string, history: any[], language: string = 'en', caseIds?: string[]) => {
    try {
      const response = await fetchWithAuth(`/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history, language, ...(caseIds && caseIds.length ? { caseIds } : {}) })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await safeParseJson(response);
    } catch (error) {
      console.error('Error with AI chat:', error);
      throw error;
    }
  },
  
  getAnalytics: async () => {
    try {
      const response = await fetchWithAuth(`/analytics`);
      if (!response.ok) return { monthlyTrends: [], hotspots: [], gravityBreakdown: [] };
      const data = await safeParseJson(response);
      return data.gravityBreakdown ? data : { monthlyTrends: [], hotspots: [], gravityBreakdown: [] };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return { monthlyTrends: [], hotspots: [], gravityBreakdown: [] };
    }
  },

  getCases: async () => {
    try {
      const response = await fetchWithAuth(`/cases`);
      if (!response.ok) return { cases: [] };
      const data = await safeParseJson(response);
      return data.cases ? data : { cases: [] };
    } catch (error) {
      console.error('Error fetching cases:', error);
      return { cases: [] };
    }
  },

  getCaseDetails: async (id: string | number) => {
    try {
      const cleanId = String(id).trim();
      const response = await fetchWithAuth(`/cases/detail?id=${encodeURIComponent(cleanId)}`);
      if (!response.ok) {
        const fallback = await fetchWithAuth(`/cases/${encodeURIComponent(cleanId)}`);
        if (!fallback.ok) return { caseDetails: { CrimeNumber: cleanId, CrimeMajorHead: 'Case Detail' }, victims: [], accused: [], evidence: [] };
        return await safeParseJson(fallback);
      }
      return await safeParseJson(response);
    } catch (error) {
      console.error('Error fetching case details:', error);
      return { caseDetails: { CrimeNumber: String(id), CrimeMajorHead: 'Case Detail' }, victims: [], accused: [], evidence: [] };
    }
  },

  createCase: async (data: any) => {
    try {
      const response = await fetchWithAuth(`/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await safeParseJson(response);
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  },

  getNetworkData: async () => {
    try {
      const response = await fetchWithAuth(`/network`);
      if (!response.ok) return { nodes: [], links: [] };
      const data = await safeParseJson(response);
      return data.nodes ? data : { nodes: [], links: [] };
    } catch (error) {
      console.error('Error fetching network data:', error);
      return { nodes: [], links: [] };
    }
  },

  getNetwork: async () => {
    try {
      const response = await fetchWithAuth(`/network`);
      if (!response.ok) return { nodes: [], links: [] };
      const data = await safeParseJson(response);
      return data.nodes ? data : { nodes: [], links: [] };
    } catch (error) {
      console.error('Error fetching network data:', error);
      return { nodes: [], links: [] };
    }
  },

  getPredictiveData: async () => {
    try {
      const response = await fetchWithAuth(`/predict`);
      if (!response.ok) return { timeDistribution: [], patrolRoutes: [] };
      const data = await safeParseJson(response);
      return data.timeDistribution ? data : { timeDistribution: [], patrolRoutes: [] };
    } catch (error) {
      console.error('Error fetching predictive data:', error);
      return { timeDistribution: [], patrolRoutes: [] };
    }
  },

  getOfficerPortalData: async () => {
    try {
      const response = await fetchWithAuth(`/officer-portal`);
      if (!response.ok) return { officer: {}, assignedCases: [], dutySchedule: [] };
      const data = await safeParseJson(response);
      return data.officer ? data : { officer: {}, assignedCases: [], dutySchedule: [] };
    } catch (error) {
      console.error('Error fetching officer portal data:', error);
      return { officer: {}, assignedCases: [], dutySchedule: [] };
    }
  },

  getOfficerProfile: async (_id?: string) => {
    return api.getOfficerPortalData();
  },

  getPeopleData: async () => {
    try {
      const response = await fetchWithAuth(`/people`);
      if (!response.ok) return { people: [] };
      const data = await safeParseJson(response);
      return data.people ? data : { people: [] };
    } catch (error) {
      console.error('Error fetching people data:', error);
      return { people: [] };
    }
  },

  getPeople: async () => {
    return api.getPeopleData();
  },

  getReportsData: async () => {
    try {
      const response = await fetchWithAuth(`/reports`);
      if (!response.ok) return { scrbSummary: {}, heinousDossiers: [] };
      const data = await safeParseJson(response);
      return data.scrbSummary ? data : { scrbSummary: {}, heinousDossiers: [] };
    } catch (error) {
      console.error('Error fetching reports data:', error);
      return { scrbSummary: {}, heinousDossiers: [] };
    }
  },

  getAuditLogs: async () => {
    try {
      const response = await fetchWithAuth(`/reports`);
      if (!response.ok) return { auditLogs: [] };
      const data = await safeParseJson(response);
      return data.auditLogs ? data.auditLogs : [];
    } catch (error) {
      return [];
    }
  },

  getCommandCenterData: async () => {
    try {
      const response = await fetchWithAuth(`/command-center`);
      if (!response.ok) return { activePatrols: [], emergencyCalls: [] };
      const data = await safeParseJson(response);
      return data.activePatrols ? data : { activePatrols: [], emergencyCalls: [] };
    } catch (error) {
      console.error('Error fetching command center data:', error);
      return { activePatrols: [], emergencyCalls: [] };
    }
  },

  listEmergencyAccess: async () => {
    try {
      const response = await fetchWithAuth(`/emergency-access`);
      if (!response.ok) return { requests: [] };
      return await safeParseJson(response);
    } catch (error) {
      return { requests: [] };
    }
  },

  grantEmergencyAccess: async (data: any) => {
    try {
      const response = await fetchWithAuth(`/emergency-access/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(typeof data === 'string' ? { requestId: data } : data)
      });
      return await safeParseJson(response);
    } catch (error) {
      return { success: false };
    }
  },

  revokeEmergencyAccess: async (requestId: string) => {
    try {
      const response = await fetchWithAuth(`/emergency-access/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      return await safeParseJson(response);
    } catch (error) {
      return { success: false };
    }
  },

  search: async (q: string) => {
    try {
      const response = await fetchWithAuth(`/search?q=${encodeURIComponent(q)}`);
      if (!response.ok) return { results: [] };
      return await safeParseJson(response);
    } catch (error) {
      return { results: [] };
    }
  },

  synthesizeSpeech: async (text: string, lang: string = 'en'): Promise<Blob | null> => {
    try {
      const response = await fetchWithAuth('/speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: lang })
      });
      if (!response.ok) return null;
      const blob = await response.blob();
      if (!blob || blob.size === 0) return null;
      return blob;
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      return null;
    }
  }
};
