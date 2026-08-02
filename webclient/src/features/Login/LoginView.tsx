import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ChevronRight, AlertCircle, Key, User, Globe, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import kspLogo from '../../assets/ksp-logo.svg';
import './LoginView.css';

export function LoginView() {
  const { user, login } = useAuth();
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';
  
  const [authType, setAuthType] = useState<'id' | 'email' | 'phone'>('id');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(isKn ? 'en' : 'kn');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = '#/';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if device/session is already logged in and not logged out
    const activeSession = sessionStorage.getItem('ksp_user') || user;
    if (activeSession) {
      setError(isKn ? 'ಈಗಾಗಲೇ ಲಾಗ್ ಇನ್ ಆಗಿದ್ದೀರಿ (Already logged in)' : 'Already logged in');
      return;
    }

    setLoading(true);

    if (forgotMode) {
      setTimeout(() => {
        setError(isKn ? 'ನಿಮ್ಮ ನೋಂದಾಯಿತ ಸಂಪರ್ಕಕ್ಕೆ ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Password reset link sent to your registered contact.');
        setLoading(false);
        setForgotMode(false);
      }, 1500);
      return;
    }

    try {
      const response = await api.login(identifier, password);
      if (response.user) {
        login(response.user);
      } else {
        setError(t('login.errorInvalid'));
      }
    } catch (err: any) {
      setError(t('login.errorCreds'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (id: string, pass: string) => {
    // Check if device is already logged in
    const activeSession = sessionStorage.getItem('ksp_user') || user;
    if (activeSession) {
      setError(isKn ? 'ಈಗಾಗಲೇ ಲಾಗ್ ಇನ್ ಆಗಿದ್ದೀರಿ (Already logged in)' : 'Already logged in');
      return;
    }
    setAuthType('id');
    setIdentifier(id);
    setPassword(pass);
    setError('');
    setForgotMode(false);
  };

  return (
    <div className="login-container animate-fade-in">
      <div className="login-box wireframe-box relative">
        
        {/* Top Control Bar with Back Button & Language Toggle */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
          <button 
            type="button"
            className="btn btn-ghost flex items-center gap-1.5 text-xs font-bold px-2 py-1" 
            onClick={handleBack}
            title="Navigate Back to Landing Page"
          >
            <ArrowLeft size={16} className="icon-cyan" />
            <span>{isKn ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
          </button>

          <button 
            type="button"
            className="btn btn-ghost flex items-center gap-1.5 text-xs font-bold px-2 py-1" 
            onClick={toggleLanguage} 
            title={t('header.toggleKannada')}
          >
            <Globe size={16} className="icon-cyan" />
            <span className="font-heading font-bold">{isKn ? 'EN' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Login Header with Official KSP Emblem Logo */}
        <div className="login-header flex flex-col items-center">
          <img 
            src={kspLogo} 
            alt="Official Karnataka State Police Logo" 
            className="h-16 sm:h-20 w-auto object-contain mb-3 select-none drop-shadow-lg"
            decoding="sync"
          />
          <div className="flex items-center justify-center gap-2 mb-1">
            <Shield size={24} className="icon-cyan" />
            <h2 className="login-title font-heading">{t('login.secureLogin')}</h2>
          </div>
          <span className="badge-outline">{t('login.authorizedOnly')}</span>
        </div>

        {error && (
          <div className="login-error glass-panel">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          {!forgotMode && (
            <div className="auth-tabs flex-row gap-xs mb-md border-bottom pb-sm">
              <button type="button" className={`btn btn-ghost text-xs ${authType === 'id' ? 'text-cyan' : ''}`} onClick={() => setAuthType('id')}>
                ID
              </button>
              <button type="button" className={`btn btn-ghost text-xs ${authType === 'email' ? 'text-cyan' : ''}`} onClick={() => setAuthType('email')}>
                EMAIL
              </button>
              <button type="button" className={`btn btn-ghost text-xs ${authType === 'phone' ? 'text-cyan' : ''}`} onClick={() => setAuthType('phone')}>
                PHONE
              </button>
            </div>
          )}

          <div className="form-group">
            <label>
              {authType === 'id' ? t('login.officerId') : authType === 'email' ? t('login.email') : t('login.phone')}
            </label>
            <div className="input-with-icon">
              {authType === 'id' ? <User size={16} className="input-icon" /> : 
               authType === 'email' ? <Mail size={16} className="input-icon" /> : 
               <Phone size={16} className="input-icon" />}
              <input 
                type={authType === 'email' ? "email" : "text"}
                className="input-wireframe" 
                placeholder={authType === 'id' ? "e.g. OFF001" : authType === 'email' ? "officer@ksp.gov.in" : "+91 9876543210"}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>
          
          {!forgotMode && (
            <div className="form-group">
              <div className="flex-row justify-between align-center">
                <label>{t('login.password')}</label>
                <button type="button" className="text-xs text-cyan bg-transparent border-none cursor-pointer" onClick={() => setForgotMode(true)}>
                  {t('login.forgotPassword')}
                </button>
              </div>
              <div className="input-with-icon">
                <Key size={16} className="input-icon" />
                <input 
                  type="password" 
                  className="input-wireframe" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
          <button type="submit" className="btn btn-primary registration-mark mt-4" disabled={loading}>
            {loading ? t('login.authenticating') : (forgotMode ? "RESET PASSWORD" : t('login.authenticate'))} <ChevronRight size={16} />
          </button>

          {forgotMode && (
            <button type="button" className="btn btn-ghost mt-sm w-full" onClick={() => setForgotMode(false)}>
              Back to Login
            </button>
          )}
        </form>

        <div className="login-footer">
          <p className="text-muted text-sm mb-2">{t('login.demoAccounts')}</p>
          <div className="demo-accounts-grid">
            <button type="button" className="btn btn-ghost text-xs" onClick={() => fillDemoCreds('OFF002', 'ksp123')}>
              {t('login.loadIo')}
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => fillDemoCreds('OFF001', 'ksp123')}>
              {t('login.loadSho')}
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => fillDemoCreds('OFF004', 'ksp123')}>
              {t('login.loadDsp')}
            </button>
            <button type="button" className="btn btn-ghost text-xs" onClick={() => fillDemoCreds('OFF008', 'ksp123')}>
              {t('login.loadAdmin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
