import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ChevronRight, Lock, Globe, ArrowLeft, LayoutDashboard, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../../components/Footer/Footer';
import { useAuth } from '../../context/AuthContext';
import { IntroductionPlayer } from '../../components/IntroductionPlayer/IntroductionPlayer';
import kspLogo from '../../assets/ksp-logo.svg';
import './PublicLandingView.css';

interface PublicLandingViewProps {
  onLoginClick: () => void;
}

export function PublicLandingView({ onLoginClick }: PublicLandingViewProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isKn = i18n.language === 'kn';

  const toggleLanguage = () => {
    i18n.changeLanguage(isKn ? 'en' : 'kn');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/citizen-portal');
    }
  };

  return (
    <div className="landing-container animate-fade-in min-h-screen flex flex-col justify-between">
      <div>
        {/* Header Enhancement */}
        <div className="landing-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Back Navigation Button */}
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={15} className="text-cyan-400" />
              <span>{isKn ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
            </button>

            {/* Official Karnataka State Police Logo */}
            <div className="landing-logo flex items-center gap-3">
              <img 
                src={kspLogo} 
                alt="Official Karnataka State Police Logo" 
                className="h-10 sm:h-12 w-auto object-contain max-h-[44px]"
                decoding="sync"
              />
              <Shield size={28} className="icon-cyan hidden sm:block" />
              <div className="logo-text">
                <span className="logo-title">{t('landing.kspTitle', 'Karnataka State Police')}</span>
                <span className="logo-subtitle">{t('landing.kspSubtitle', 'Crime Intelligence Platform')}</span>
              </div>
            </div>
          </div>

          <div className="landing-nav flex items-center gap-3">
            <button className="btn btn-ghost" onClick={toggleLanguage} title={t('header.toggleKannada', 'Toggle Language')}>
              <Globe size={18} className="icon-cyan" />
              <span className="ml-xs font-heading font-bold">{isKn ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <Link to="/citizen-portal" className="nav-link">
              {t('landing.citizenPortal', 'Citizen Portal')}
            </Link>

            <Link to="/emergency-services" className="nav-link">
              {t('landing.emergencyServices', 'Emergency Services')}
            </Link>

            {user ? (
              <button 
                className="btn btn-primary bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <LayoutDashboard size={16} />
                <span>{t('landing.officerDashboard', 'Officer Dashboard')}</span>
              </button>
            ) : (
              <button className="btn btn-outline" onClick={onLoginClick}>
                <Lock size={14} /> {t('landing.officerLogin', 'Officer Login')}
              </button>
            )}
          </div>
        </div>

        {/* Hero Section */}
        <div className="landing-hero">
          <div className="hero-content">
            <span className="badge-outline">{t('landing.authorizedOnly', 'Authorized Personnel Only')}</span>
            <h1 className="hero-title">{t('landing.heroTitle', 'Statewide Crime Intelligence & Dossier Repository')}</h1>
            <p className="hero-description">
              {t('landing.heroDesc', 'Unified CCTNS ledger integration, AI case analysis, predictive hotspot intelligence and suspect network mapping.')}
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn btn-primary bg-blue-700 hover:bg-blue-600 text-white font-black flex items-center gap-2.5 shadow-xl border border-blue-500" 
                onClick={() => navigate('/about-platform')}
              >
                <Play size={18} className="fill-current" />
                <span>{isKn ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪ್ರದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ' : 'Start Platform Tour'}</span>
              </button>

              {user ? (
                <button className="btn btn-outline border-emerald-500 text-emerald-400 hover:bg-emerald-950/40" onClick={() => navigate('/dashboard')}>
                  <LayoutDashboard size={18} /> {t('landing.enterDashboard', 'Enter Officer Dashboard')} <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-outline" onClick={onLoginClick}>
                  {t('landing.secureLogin', 'Secure Officer Login')} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Automatic Bilingual Introduction Video Player (avatar-intro.mp4 for EN, ksp-kannada.mp4 for KN) */}
          <div className="hero-visual">
            <IntroductionPlayer onSkip={() => navigate('/about-platform')} />

            <div className="visual-stats">
              <div className="stat-row">
                <span className="stat-label">{t('landing.systemStatus', 'System Status')}</span>
                <span className="stat-value text-emerald">{t('landing.secure', 'OPERATIONAL')}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">{t('landing.activeNodes', 'Active Station Nodes')}</span>
                <span className="stat-value">1,024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
