import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ChevronRight, AlertCircle, Key, User, Globe, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import kspLogo from '../../assets/ksp-logo.svg';
import './LoginView.css';

interface LoginViewProps {
  onBack?: () => void;
}

export function LoginView({ onBack }: LoginViewProps) {
  const { user, login } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
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

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/citizen-portal');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (user) {
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
      if (response && response.user) {
        login(response.user);
      } else {
        setError(t('login.errorInvalid', 'Invalid response from server'));
      }
    } catch (err: any) {
      setError(t('login.errorCreds', 'Invalid credentials or network error'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCreds = (id: string, pass: string) => {
    if (user) {
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
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <button 
            type="button"
            className="btn btn-ghost flex items-center gap-1 text-[11px] font-bold px-2 py-0.5" 
            onClick={handleBackClick}
            title="Navigate Back to Landing Page"
          >
            <ArrowLeft size={14} className="icon-cyan" />
            <span>{isKn ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
          </button>

          <button 
            type="button"
            className="btn btn-ghost flex items-center gap-1 text-[11px] font-bold px-2 py-0.5" 
            onClick={toggleLanguage} 
            title={t('header.toggleKannada')}
          >
            <Globe size={14} className="icon-cyan" />
            <span className="font-heading font-bold">{isKn ? 'EN' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Minimized Compact Login Header */}
        <div className="login-header flex flex-col items-center">
          <img 
            src={kspLogo} 
            alt="Official KSP Logo" 
            className="h-12 w-auto object-contain mb-2 select-none drop-shadow-md"
          />
          <h2 className="login-title text-cyan-400 font-bold text-lg">{t('login.title', 'KSP OFFICER PORTAL')}</h2>
          <p className="subtitle text-slate-400 text-xs">{t('login.subtitle', 'Karnataka State Police Intelligence Terminal')}</p>
        </div>

        {/* Error / Alert Message */}
        {error && (
          <div className="login-error">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="flex gap-1 mb-1 p-1 bg-slate-900/80 rounded border border-slate-800">
            <button 
              type="button"
              className={`flex-1 py-1 text-[11px] font-bold rounded transition-colors ${authType === 'id' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setAuthType('id')}
            >
              Officer ID
            </button>
            <button 
              type="button"
              className={`flex-1 py-1 text-[11px] font-bold rounded transition-colors ${authType === 'email' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setAuthType('email')}
            >
              Email
            </button>
            <button 
              type="button"
              className={`flex-1 py-1 text-[11px] font-bold rounded transition-colors ${authType === 'phone' ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setAuthType('phone')}
            >
              Phone
            </button>
          </div>

          <div className="input-with-icon">
            {authType === 'id' && <User className="input-icon" size={16} />}
            {authType === 'email' && <Mail className="input-icon" size={16} />}
            {authType === 'phone' && <Phone className="input-icon" size={16} />}
            <input 
              type={authType === 'email' ? 'email' : authType === 'phone' ? 'tel' : 'text'}
              className="input-wireframe text-xs"
              placeholder={
                authType === 'id' ? t('login.empIdPlaceholder', 'Officer Employee ID (e.g. OFF001)') :
                authType === 'email' ? 'Officer Email Address' :
                'Registered Mobile Number'
              }
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {!forgotMode && (
            <div className="input-with-icon">
              <Key className="input-icon" size={16} />
              <input 
                type="password"
                className="input-wireframe text-xs"
                placeholder={t('login.passwordPlaceholder', 'Password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!forgotMode}
              />
            </div>
          )}

          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <button 
              type="button"
              className="hover:text-cyan-400 underline transition-colors"
              onClick={() => { setForgotMode(!forgotMode); setError(''); }}
            >
              {forgotMode ? 'Back to Password Login' : 'Forgot Password?'}
            </button>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-2 font-bold text-xs flex justify-center items-center gap-1.5"
            disabled={loading}
          >
            <span>{forgotMode ? 'Send Reset Link' : (isKn ? 'ಪ್ರವೇಶಿಸಿ (LOG IN)' : t('login.submit', 'AUTHENTICATE & LOG IN'))}</span>
            <ChevronRight size={14} />
          </button>
        </form>

        {/* Demo Roles Quick Select */}
        <div className="login-footer">
          <p className="text-[11px] text-slate-400 mb-2 font-semibold">{t('login.quickRoleSelect', 'Quick Demo Officer Credentials:')}</p>
          <div className="demo-accounts-grid">
            <button type="button" className="demo-btn-pill" onClick={() => fillDemoCreds('OFF001', 'ksp123')}>
              OFF001 (SHO)
            </button>
            <button type="button" className="demo-btn-pill" onClick={() => fillDemoCreds('OFF002', 'ksp123')}>
              OFF002 (SP)
            </button>
            <button type="button" className="demo-btn-pill" onClick={() => fillDemoCreds('OFF008', 'ksp123')}>
              OFF008 (DGP)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
