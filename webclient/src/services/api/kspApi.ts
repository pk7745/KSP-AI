import { fetchApi } from './apiBase';

export interface ChatRequest {
  message: string;
  sessionId?: string;
  lang?: 'en' | 'kn';
  history?: Array<{ sender: 'user' | 'ai'; text: string }>;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
  lang: string;
  sources: string[];
  confidence: number;
  queryPlan: string;
  dossier: {
    queryPlan: string;
    explained: string;
    sources: string[];
    confidence: number;
    factsCount: number;
    timestamp: string;
  };
  retrievedCases: any[];
}

export interface DashboardData {
  summary: {
    totalCases: number;
    activeInvestigations: number;
    heinousCrimes: number;
    chargeSheeted: number;
    repeatOffenders: number;
    activeDistricts: number;
  };
  liveGreeting: string;
  crimeDistribution: Record<string, number>;
  districtDistribution: Record<string, number>;
  recentCases: any[];
  alerts: Array<{ id: string; severity: 'HIGH' | 'MEDIUM' | 'LOW'; title: string; details: string; time: string }>;
}

export const kspApi = {
  getDashboard: () => fetchApi<DashboardData>('/dashboard'),
  sendChatMessage: (req: ChatRequest) => fetchApi<ChatResponse>('/chat', { method: 'POST', body: JSON.stringify(req) }),
  getCases: () => fetchApi<{ cases: any[] }>('/cases'),
  getCaseDetails: (id: string | number) => fetchApi<any>(`/cases/${id}`),
  getAnalytics: () => fetchApi<any>('/analytics'),
  getNetwork: () => fetchApi<any>('/network'),
  getPredictiveWarnings: () => fetchApi<any>('/predict'),
  getAuditTrail: () => fetchApi<any>('/audit'),
  exportPdf: (payload: any) => fetchApi<any>('/export/pdf', { method: 'POST', body: JSON.stringify(payload) })
};
