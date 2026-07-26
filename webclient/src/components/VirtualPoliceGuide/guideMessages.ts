export interface GuideMessage {
  id: string;
  title: string;
  message: string;
}

export const GUIDE_MESSAGES: Record<string, GuideMessage> = {
  welcome: {
    id: 'welcome',
    title: 'KSP AI Assistant',
    message: 'Welcome to KSP AI Crime Intelligence Platform.'
  },
  dashboard: {
    id: 'dashboard',
    title: 'Dashboard Overview',
    message: 'Welcome to the State Intelligence Dashboard. Monitor active FIRs and crime trends.'
  },
  cases: {
    id: 'cases',
    title: 'Cases Workspace',
    message: 'Welcome to Case 360 Workspace. Search and inspect detailed FIR records.'
  },
  reports: {
    id: 'reports',
    title: 'Automated Reports',
    message: 'Welcome to Automated Reports. Generate institutional FIR ledgers.'
  },
  maps: {
    id: 'maps',
    title: 'Spatial Intelligence',
    message: 'Welcome to Spatial Intelligence Map. Inspect district crime pins.'
  },
  people: {
    id: 'people',
    title: 'People Intelligence',
    message: 'Welcome to People Intelligence CRM. Access unified citizen profiles.'
  },
  settings: {
    id: 'settings',
    title: 'System Settings',
    message: 'Welcome to System Settings. Manage application parameters.'
  }
};
