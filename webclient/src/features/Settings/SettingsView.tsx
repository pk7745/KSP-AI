import React, { useState, useEffect } from 'react';
import { Save, Shield, Database, Bell, Settings2, Key, Bot, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './SettingsView.css';

export function SettingsView() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('account');
  const [vpgEnabled, setVpgEnabled] = useState(true);

  useEffect(() => {
    const pref = localStorage.getItem('ksp_vpg_enabled');
    if (pref !== null) {
      setVpgEnabled(pref === 'true');
    }
  }, []);

  const handleVpgToggle = (enabled: boolean) => {
    setVpgEnabled(enabled);
    localStorage.setItem('ksp_vpg_enabled', String(enabled));
  };

  const tabs = [
    { id: 'account', icon: Shield, label: t('settings.tabs.account', 'Account Profile') },
    { id: 'api', icon: Key, label: t('settings.tabs.api', 'API & Integration') },
    { id: 'system', icon: Settings2, label: t('settings.tabs.system', 'System Preferences') },
    { id: 'notifications', icon: Bell, label: t('settings.tabs.notifications', 'Alerts') }
  ];

  return (
    <div className="settings-view animate-in fade-in">
      <div className="settings-header">
        <div>
          <h2>{t('nav.settings', 'System Settings')}</h2>
          <p>{t('settings.subtitle', 'Manage your KSP AI configuration and connected services')}</p>
        </div>
        <button className="btn-primary">
          <Save size={16} />
          {t('common.save', 'Save Changes')}
        </button>
      </div>

      <div className="settings-layout glass-panel">
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content">
          {activeTab === 'account' && (
            <div className="settings-panel">
              <h3>{t('settings.profile', 'Officer Profile')}</h3>
              
              <div className="form-group">
                <label>{t('settings.name', 'Full Name')}</label>
                <input type="text" defaultValue="Officer Rajesh Kumar" className="settings-input" />
              </div>
              
              <div className="form-group">
                <label>{t('settings.badge', 'Badge ID')}</label>
                <input type="text" defaultValue="KSP-ID-4921" disabled className="settings-input disabled" />
              </div>

              <div className="form-group">
                <label>{t('settings.language', 'Language Preference')}</label>
                <select 
                  className="settings-input" 
                  value={i18n.language} 
                  onChange={(e) => i18n.changeLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                </select>
                <p className="hint">{t('settings.langHint', 'This changes the entire application interface language.')}</p>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="settings-panel">
              <h3>{t('settings.integration', 'AI Integration')}</h3>
              
              <div className="form-group">
                <label>
                  <Database size={16} />
                  Zoho Catalyst Endpoint
                </label>
                <input type="text" defaultValue="https://catalyst.zoho.com/api/v1/ksp-prod" className="settings-input" />
              </div>

              <div className="form-group">
                <label>
                  <Bot size={16} />
                  Google Gemini Model
                </label>
                <select className="settings-input">
                  <option>gemini-2.5-flash</option>
                  <option>gemini-1.5-pro</option>
                </select>
              </div>

              <div className="status-box success">
                <CheckCircle size={20} />
                <div>
                  <strong>{t('settings.connected', 'Services Connected')}</strong>
                  <p>{t('settings.connectedDesc', 'All external APIs are responding normally.')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="settings-panel">
              <h3>{t('settings.tabs.system', 'System Preferences')}</h3>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="vpg-toggle" 
                  checked={vpgEnabled} 
                  onChange={(e) => handleVpgToggle(e.target.checked)} 
                  style={{ width: '18px', height: '18px' }} 
                />
                <label htmlFor="vpg-toggle" style={{ marginBottom: 0, fontWeight: 600 }}>
                  {i18n.language === 'kn' ? 'ವರ್ಚುವಲ್ ಪೋಲಿಸ್ ಗೈಡ್ ಸಕ್ರಿಯಗೊಳಿಸಿ' : 'Enable Virtual Police Guide Introductions'}
                </label>
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Theme Preference</label>
                <select className="settings-input" defaultValue="light">
                  <option value="light">Light Mode (Clean Enterprise)</option>
                  <option value="dark">Dark Mode (Professional Slate)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Data Sync Frequency</label>
                <select className="settings-input" defaultValue="realtime">
                  <option value="realtime">Real-time (WebSocket)</option>
                  <option value="15m">Every 15 Minutes</option>
                  <option value="1h">Hourly</option>
                </select>
                <p className="hint">Controls how often the dashboard refreshes external case data.</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-panel">
              <h3>{t('settings.tabs.notifications', 'Alerts & Notifications')}</h3>
              
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input type="checkbox" id="email-alerts" defaultChecked style={{ width: '18px', height: '18px' }} />
                <label htmlFor="email-alerts" style={{ marginBottom: 0 }}>Enable Email Alerts for High-Risk Cases</label>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                <input type="checkbox" id="sms-alerts" defaultChecked style={{ width: '18px', height: '18px' }} />
                <label htmlFor="sms-alerts" style={{ marginBottom: 0 }}>Enable SMS Alerts for Predictive Hotspots</label>
              </div>

              <div className="status-box success" style={{ marginTop: '32px' }}>
                <Bell size={20} />
                <div>
                  <strong>Notification Channels Active</strong>
                  <p>Your contact details are synchronized with the State HRMS.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
