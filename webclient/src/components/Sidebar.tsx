import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Shield, LayoutDashboard, FileText, 
  Network, Settings, Brain, Users,
  Home, Microscope, MessageSquare, BarChart2, LifeBuoy
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import kspLogo from '../assets/ksp-logo.svg';
import './Sidebar.css';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

// Module preloader map for 0ms instant hover loading
const preloaderMap: Record<string, () => Promise<any>> = {
  home: () => import('../features/Home/HomeView'),
  dashboard: () => import('../features/Dashboard/DashboardView'),
  cases: () => import('../features/Cases/CasesView'),
  analysis: () => import('../features/AIAnalysis/AIAnalysisView'),
  chat: () => import('../features/AIChat/AIChatView'),
  officer: () => import('../features/OfficerPortal/OfficerPortalView'),
  command: () => import('../features/CommandCenter/CommandCenterView'),
  reports: () => import('../features/Reports/ReportsView'),
  people: () => import('../features/People/PeopleView'),
  network: () => import('../features/Network/NetworkView'),
  predictive: () => import('../features/Predictive/PredictiveView'),
  help: () => import('../pages/HelpCenter'),
  settings: () => import('../features/Settings/SettingsView')
};

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleHover = (id: string) => {
    if (preloaderMap[id]) {
      preloaderMap[id]().catch(() => {});
    }
  };

  const allNavItems = [
    { id: 'home', icon: Home, label: t('nav.home', 'Home'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    { id: 'dashboard', icon: LayoutDashboard, label: t('nav.dashboard', 'Dashboard'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    { id: 'cases', icon: FileText, label: t('nav.cases', 'Cases 360'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    { id: 'analysis', icon: Microscope, label: t('nav.analysis', 'AI Analysis'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    { id: 'chat', icon: MessageSquare, label: t('nav.chat', 'AI Investigator'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    { id: 'officer', icon: Users, label: t('nav.officer', 'Officer Portal'), roles: ['IO', 'SHO', 'DSP', 'ADMIN'] },
    
    // SHO and above
    { id: 'command', icon: Shield, label: t('nav.command', 'Command Center'), roles: ['SHO', 'DSP', 'ADMIN'] },
    { id: 'reports', icon: BarChart2, label: t('nav.reports', 'Automated Reports'), roles: ['SHO', 'DSP', 'ADMIN'] },
    
    // DSP and Admin only
    { id: 'people', icon: Users, label: t('nav.people', 'People CRM'), roles: ['DSP', 'ADMIN'] },
    { id: 'network', icon: Network, label: t('nav.network', 'Criminal Nexus'), roles: ['DSP', 'ADMIN'] },
    { id: 'predictive', icon: Brain, label: t('nav.predictive', 'Predictive Analytics'), roles: ['DSP', 'ADMIN'] }
  ];

  const visibleNavItems = allNavItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="sidebar glass-panel">
      <div 
        className="sidebar-brand flex items-center gap-3 select-none cursor-pointer hover:opacity-90 transition-opacity" 
        onClick={() => navigate('/about-platform')}
        title="Explore KSP AI Platform Tour"
      >
        <img 
          src={kspLogo} 
          alt="Official Karnataka State Police Logo" 
          className="w-[30px] h-[30px] sm:w-[34px] sm:h-[34px] lg:w-[38px] lg:h-[38px] object-contain shrink-0 select-none"
          decoding="sync"
        />
        <div className="brand-text">
          <h1 className="font-bold">KSP AI</h1>
          <p className="tracking-wide text-xs">Crime Intelligence</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {visibleNavItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            onMouseEnter={() => handleHover(item.id)}
            onFocus={() => handleHover(item.id)}
          >
            <item.icon className="nav-icon" size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {/* Help Center Item near bottom above Logout */}
        <button
          className={`nav-item ${currentView === 'help' ? 'active' : ''}`}
          onClick={() => onNavigate('help')}
          onMouseEnter={() => handleHover('help')}
          onFocus={() => handleHover('help')}
        >
          <LifeBuoy className="nav-icon text-amber-400" size={20} />
          <span>🛟 {t('nav.help', 'Help Center')}</span>
        </button>

        {(user?.role === 'ADMIN' || user?.role === 'DSP') && (
          <button 
            className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
            onClick={() => onNavigate('settings')}
            onMouseEnter={() => handleHover('settings')}
            onFocus={() => handleHover('settings')}
          >
            <Settings className="nav-icon" size={20} />
            <span>{t('nav.settings', 'Settings')}</span>
          </button>
        )}

        <button className="nav-item" onClick={logout} style={{ color: 'var(--accent-crimson)' }}>
          <LogOut className="nav-icon" size={20} />
          <span>{t('nav.logout', 'Logout')}</span>
        </button>
      </div>
    </aside>
  );
}
