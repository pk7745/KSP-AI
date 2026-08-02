import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Shield, ShieldCheck, Database, Search } from 'lucide-react';
import './HomeView.css';

export function HomeView() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="home-view animate-in fade-in">
      <div className="home-hero glass-panel">
        <div className="home-hero-content">
          <Shield size={48} className="icon-indigo" />
          <h1>{t('home.title', 'KSP AI Crime Intelligence Platform')}</h1>
          <p>{t('home.welcome', 'Welcome,')} <strong>{user?.name}</strong> ({user?.designation})</p>
          <div className="user-context-badge">
            {t('home.jurisdiction', 'Current Jurisdiction:')} <strong>{user?.unitName}</strong> | {t('home.district', 'District:')} <strong>{user?.districtName}</strong>
          </div>
        </div>
      </div>

      <div className="home-features-grid">
        <div className="feature-card glass-panel-interactive">
          <Database size={24} className="icon-cyan" />
          <h3>{t('home.firTitle', 'Centralized FIR Database')}</h3>
          <p>{t('home.firDesc', 'Access structured case master records, suspect details, and incident chronologies securely.')}</p>
        </div>
        <div className="feature-card glass-panel-interactive">
          <Search size={24} className="icon-emerald" />
          <h3>{t('home.searchTitle', 'Smart Global Search')}</h3>
          <p>{t('home.searchDesc', 'Press Ctrl+K anywhere to instantly locate cases, suspects, and officers across your jurisdiction.')}</p>
        </div>
        <div className="feature-card glass-panel-interactive">
          <ShieldCheck size={24} className="icon-amber" />
          <h3>{t('home.rbacTitle', 'Role-Based Access')}</h3>
          <p>{t('home.rbacDesc', 'Your data access is strictly filtered based on the Karnataka Police DB hierarchy constraints.')}</p>
        </div>
      </div>
    </div>
  );
}
