const API_BASE_URL = import.meta.env.PROD ? 'https://ksp-crime-intelligence-function-10128235536.development.catalystappsail.com' : 'http://localhost:3001';

const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('ksp_token');
  const headers = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
  if (response.status === 401) {
    // Optionally trigger a logout here or handle unauthorized
    localStorage.removeItem('ksp_token');
    window.location.reload();
  }
  return response;
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
      const data = await response.json();
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
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },
  
  chatWithGemini: async (query: string, history: any[], language: string = 'en') => {
    try {
      const response = await fetchWithAuth(`/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, history, language })
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error with AI chat:', error);
      throw error;
    }
  },
  
  getAnalytics: async () => {
    try {
      const response = await fetchWithAuth(`/analytics`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  getCases: async () => {
    try {
      const response = await fetchWithAuth(`/cases`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  getCaseDetails: async (id: string | number) => {
    try {
      const cleanId = String(id).trim();
      // Use query param /cases/detail?id=... to bypass Tomcat %2F path blocking on Catalyst AppSail
      const response = await fetchWithAuth(`/cases/detail?id=${encodeURIComponent(cleanId)}`);
      if (!response.ok) {
        // Fallback to path parameter
        const fallback = await fetchWithAuth(`/cases/${encodeURIComponent(cleanId)}`);
        if (!fallback.ok) throw new Error('Network response was not ok');
        return await fallback.json();
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching case details:', error);
      throw error;
    }
  },

  createCase: async (caseData: any) => {
    try {
      const response = await fetchWithAuth(`/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error creating case:', error);
      throw error;
    }
  },

  getNetwork: async () => {
    try {
      const response = await fetchWithAuth(`/network`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching network:', error);
      throw error;
    }
  },

  search: async (query: string) => {
    try {
      if (!query || query.length < 2) return { results: [] };
      const response = await fetchWithAuth(`/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  getAuditLogs: async () => {
    try {
      const response = await fetchWithAuth(`/audit`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  // NEW MODULES

  getOfficerProfile: async (officerId: string) => {
    try {
      const response = await fetchWithAuth(`/officer/${officerId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching officer profile:', error);
      throw error;
    }
  },

  getPeople: async () => {
    try {
      const res = await fetchWithAuth(`/people`);
      if (!res.ok) throw new Error('Network response was not ok');
      return await res.json();
    } catch (error) {
      console.error('Error fetching people:', error);
      throw error;
    }
  },

  getEvidence: async (caseId: string) => {
    try {
      const response = await fetchWithAuth(`/evidence/case/${caseId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching evidence:', error);
      throw error;
    }
  },

  uploadEvidence: async (formData: FormData) => {
    try {
      const response = await fetchWithAuth(`/evidence`, {
        method: 'POST',
        body: formData // DO NOT set Content-Type header, browser handles multipart boundaries
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error uploading evidence:', error);
      throw error;
    }
  },

  getArrest: async (arrestId: string) => {
    try {
      const response = await fetchWithAuth(`/arrests/${arrestId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching arrest details:', error);
      throw error;
    }
  },

  getChargesheet: async (chargesheetId: string) => {
    try {
      const response = await fetchWithAuth(`/chargesheets/${chargesheetId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching chargesheet details:', error);
      throw error;
    }
  },

  getNotifications: async (officerId: string) => {
    try {
      const response = await fetchWithAuth(`/notifications/${officerId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  getActivityLogs: async (officerId: string) => {
    try {
      const response = await fetchWithAuth(`/activity/${officerId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }
  },

  // EMERGENCY ACCESS METHODS
  grantEmergencyAccess: async (data: { grantedToOfficerId: string; caseId?: string; districtId?: string; permissionType?: string; reason: string; durationHours: number }) => {
    try {
      const response = await fetchWithAuth(`/auth/emergency-access/grant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to grant emergency access');
      }
      return await response.json();
    } catch (error) {
      console.error('Error granting emergency access:', error);
      throw error;
    }
  },

  revokeEmergencyAccess: async (accessId: string) => {
    try {
      const response = await fetchWithAuth(`/auth/emergency-access/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessId })
      });
      if (!response.ok) throw new Error('Failed to revoke access');
      return await response.json();
    } catch (error) {
      console.error('Error revoking emergency access:', error);
      throw error;
    }
  },

  listEmergencyAccess: async () => {
    try {
      const response = await fetchWithAuth(`/auth/emergency-access/list`);
      if (!response.ok) return { accessLogs: [] };
      return await response.json();
    } catch (error) {
      console.error('Error listing emergency access:', error);
      return { accessLogs: [] };
    }
  },

  synthesizeSpeech: async (text: string, language: string = 'en'): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language })
      });
      if (!response.ok) throw new Error('Speech synthesis endpoint failed');
      return await response.blob();
    } catch (error) {
      console.error('Error in speech synthesis API:', error);
      throw error;
    }
  }
};
