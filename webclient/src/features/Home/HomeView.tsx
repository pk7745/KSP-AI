import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ArrowRight, ShieldCheck, Database, Search } from 'lucide-react';
import './HomeView.css';

export function HomeView() {
  const { user } = useAuth();

  return (
    <div className="home-view animate-in fade-in">
      <div className="home-hero glass-panel">
        <div className="home-hero-content">
          <Shield size={48} className="icon-indigo" />
          <h1>KSP AI Crime Intelligence Platform</h1>
          <p>Welcome, <strong>{user?.name}</strong> ({user?.designation})</p>
          <div className="user-context-badge">
            Current Jurisdiction: <strong>{user?.unitName}</strong> | District: <strong>{user?.districtName}</strong>
          </div>
        </div>
      </div>

      <div className="home-features-grid">
        <div className="feature-card glass-panel-interactive">
          <Database size={24} className="icon-cyan" />
          <h3>Centralized FIR Database</h3>
          <p>Access structured case master records, suspect details, and incident chronologies securely.</p>
        </div>
        <div className="feature-card glass-panel-interactive">
          <Search size={24} className="icon-emerald" />
          <h3>Smart Global Search</h3>
          <p>Press Ctrl+K anywhere to instantly locate cases, suspects, and officers across your jurisdiction.</p>
        </div>
        <div className="feature-card glass-panel-interactive">
          <ShieldCheck size={24} className="icon-amber" />
          <h3>Role-Based Access</h3>
          <p>Your data access is strictly filtered based on the Karnataka Police DB hierarchy constraints.</p>
        </div>
      </div>
    </div>
  );
}
