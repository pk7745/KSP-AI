import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { LoginView } from './features/Login/LoginView';
import { PublicLandingView } from './features/Landing/PublicLandingView';
import { CitizenPortal } from './pages/CitizenPortal';
import { EmergencyServices } from './pages/EmergencyServices';
import { AboutPlatform } from './pages/AboutPlatform';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { VirtualPoliceGuide } from './components/VirtualPoliceGuide';
import './App.css';

// Code-split all feature views for fast initial load times
const HomeView = lazy(() => import('./features/Home/HomeView').then(m => ({ default: m.HomeView })));
const DashboardView = lazy(() => import('./features/Dashboard/DashboardView').then(m => ({ default: m.DashboardView })));
const AIChatView = lazy(() => import('./features/AIChat/AIChatView').then(m => ({ default: m.AIChatView })));
const CasesView = lazy(() => import('./features/Cases/CasesView').then(m => ({ default: m.CasesView })));
const NetworkView = lazy(() => import('./features/Network/NetworkView').then(m => ({ default: m.NetworkView })));
const ReportsView = lazy(() => import('./features/Reports/ReportsView').then(m => ({ default: m.ReportsView })));
const PredictiveView = lazy(() => import('./features/Predictive/PredictiveView').then(m => ({ default: m.PredictiveView })));
const CommandCenterView = lazy(() => import('./features/CommandCenter/CommandCenterView').then(m => ({ default: m.CommandCenterView })));
const OfficerPortalView = lazy(() => import('./features/OfficerPortal/OfficerPortalView').then(m => ({ default: m.OfficerPortalView })));
const SettingsView = lazy(() => import('./features/Settings/SettingsView').then(m => ({ default: m.SettingsView })));
const AIAnalysisView = lazy(() => import('./features/AIAnalysis/AIAnalysisView').then(m => ({ default: m.AIAnalysisView })));
const PeopleView = lazy(() => import('./features/People/PeopleView').then(m => ({ default: m.PeopleView })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(m => ({ default: m.HelpCenter })));

// Ultra-fast page skeleton loader
const ViewFallback = () => (
  <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3 p-8 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-300">
    <Loader2 size={32} className="animate-spin text-cyan-400" />
    <span className="text-xs font-extrabold font-mono tracking-wider text-cyan-300">Loading Module...</span>
  </div>
);

function MainApp() {
  const { user } = useAuth();
  const { currentView, setCurrentView } = useNavigation();
  const [showLogin, setShowLogin] = useState(false);

  // Background Preloader: Immediately preload all sidebar view chunks in parallel upon login mount
  useEffect(() => {
    const timer = setTimeout(() => {
      import('./features/Home/HomeView');
      import('./features/Dashboard/DashboardView');
      import('./features/Cases/CasesView');
      import('./features/AIAnalysis/AIAnalysisView');
      import('./features/AIChat/AIChatView');
      import('./features/OfficerPortal/OfficerPortalView');
      import('./features/CommandCenter/CommandCenterView');
      import('./features/Reports/ReportsView');
      import('./features/People/PeopleView');
      import('./features/Network/NetworkView');
      import('./features/Predictive/PredictiveView');
      import('./features/Settings/SettingsView');
      import('./pages/HelpCenter');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    if (showLogin) {
      return <LoginView />;
    }
    return <PublicLandingView onLoginClick={() => setShowLogin(true)} />;
  }

  // Define RBAC requirements for views
  const viewRoles: Record<string, string[]> = {
    home: ['IO', 'SHO', 'DSP', 'ADMIN'],
    dashboard: ['IO', 'SHO', 'DSP', 'ADMIN'],
    cases: ['IO', 'SHO', 'DSP', 'ADMIN'],
    analysis: ['IO', 'SHO', 'DSP', 'ADMIN'],
    chat: ['IO', 'SHO', 'DSP', 'ADMIN'],
    officer: ['IO', 'SHO', 'DSP', 'ADMIN'],
    help: ['IO', 'SHO', 'DSP', 'ADMIN'],
    'help-center': ['IO', 'SHO', 'DSP', 'ADMIN'],
    command: ['SHO', 'DSP', 'ADMIN'],
    reports: ['SHO', 'DSP', 'ADMIN'],
    people: ['DSP', 'ADMIN'],
    network: ['DSP', 'ADMIN'],
    predictive: ['DSP', 'ADMIN'],
    settings: ['DSP', 'ADMIN']
  };

  const hasAccess = (view: string) => {
    const allowed = viewRoles[view];
    if (!allowed) return true;
    return allowed.includes(user.role);
  };

  const renderView = () => {
    if (!hasAccess(currentView)) {
      return (
        <div className="wireframe-box flex-col align-center justify-center p-xl mt-xl">
          <Shield size={48} className="text-crimson mb-md" />
          <h2 className="text-crimson">Unauthorized Access</h2>
          <p className="text-muted mt-sm">Your rank ({user.rank}) does not grant clearance for the {currentView} module.</p>
          <button className="btn btn-outline mt-md" onClick={() => setCurrentView('dashboard')}>
            Return to Dashboard
          </button>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'dashboard':
        return <DashboardView />;
      case 'chat':
        return <AIChatView />;
      case 'cases':
        return <CasesView />;
      case 'network':
        return <NetworkView />;
      case 'people':
        return <PeopleView />;
      case 'predictive':
        return <PredictiveView />;
      case 'reports':
        return <ReportsView />;
      case 'command':
        return <CommandCenterView />;
      case 'officer':
        return <OfficerPortalView />;
      case 'settings':
        return <SettingsView />;
      case 'analysis':
        return <AIAnalysisView />;
      case 'help':
      case 'help-center':
        return <HelpCenter />;
      default:
        return (
          <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>
            <h2 style={{ color: 'var(--accent-cyan)' }}>Module Under Construction</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              The {currentView} module is currently being integrated with Zoho Catalyst.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="main-content">
        <Header />
        <div className="page-container">
          <Suspense fallback={<ViewFallback />}>
            {renderView()}
          </Suspense>
        </div>
      </main>
      
      {/* Virtual Police Guide Digital Assistant */}
      <VirtualPoliceGuide />
    </div>
  );
}

function DefaultLandingWrapper() {
  const [showLogin, setShowLogin] = useState(false);

  if (showLogin) {
    return <LoginView />;
  }

  return <PublicLandingView onLoginClick={() => setShowLogin(true)} />;
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <NavigationProvider>
          <Routes>
            <Route path="/" element={<DefaultLandingWrapper />} />
            <Route path="/about-platform" element={<AboutPlatform />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/citizen-portal" element={<CitizenPortal />} />
            <Route path="/emergency-services" element={<EmergencyServices />} />
            <Route path="/login" element={<LoginView />} />
            <Route path="/dashboard/*" element={<MainApp />} />
            <Route path="/*" element={<DefaultLandingWrapper />} />
          </Routes>
        </NavigationProvider>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
