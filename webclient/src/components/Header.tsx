import React, { useState, useEffect } from 'react';
import { Bell, Search, User, Sun, Moon, Globe, Command, FileText, Users, MapPin, Shield, Edit2, LogOut, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '../context/NavigationContext';
import { api } from '../services/api';
import { EditProfileModal } from './EditProfileModal';
import { EmergencyAccessModal } from './EmergencyAccessModal';
import './Header.css';

export function Header() {
  const { user, logout } = useAuth();
  const { goBack } = useNavigation();
  const { t, i18n } = useTranslation();
  const [theme, setTheme] = useState('light');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setSearchQuery('');
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      const res = await api.search(searchQuery.trim());
      setSearchResults(res.results || []);
      setIsSearching(false);
    };

    const debounce = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleBackClick = () => {
    goBack();
  };

  const groupedResults = searchResults.reduce<Record<string, any[]>>((acc, item) => {
    const typeKey = (item.type || 'other').toLowerCase();
    if (!acc[typeKey]) acc[typeKey] = [];
    acc[typeKey].push(item);
    return acc;
  }, {});

  const getIconForType = (type: string) => {
    if (type === 'case') return FileText;
    if (type === 'accused') return Users;
    if (type === 'officer') return Shield;
    return MapPin;
  };

  const typeLabels: Record<string, string> = { 
    case: t('header.cases', 'Cases'), 
    accused: t('header.suspects', 'Accused / Suspects'), 
    officer: t('header.officers', 'Officers'), 
    location: t('header.locations', 'Locations') 
  };
  
  return (
    <>
      <header className="app-header glass-panel">
        <div className="flex-row align-center gap-sm">
          {/* Universal Back Navigation Button */}
          <button 
            onClick={handleBackClick} 
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
            title="Navigate Back"
          >
            <ArrowLeft size={15} className="text-cyan" />
            <span>{i18n.language === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
          </button>

          <div className="header-search" onClick={() => { setShowSearch(true); setSearchQuery(''); }}>
            <Search className="search-icon" size={18} />
            <div className="search-placeholder">
              <span>{t('header.searchPlaceholder', 'Search (FIR, Officer, Location)...')}</span>
              <kbd className="kbd-shortcut"><Command size={12}/> K</kbd>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-status">
            <span className="status-dot animate-pulse-glow"></span>
            <span className="status-text">{t('header.syncActive', 'Catalyst Sync Active')}</span>
          </div>
          
          <button 
            className="icon-btn" 
            onClick={() => i18n.changeLanguage(i18n.language === 'kn' ? 'en' : 'kn')} 
            title={t('header.toggleKannada', 'Toggle Language')}
          >
            <Globe size={18} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '4px' }}>
              {i18n.language === 'kn' ? "EN" : "ಕನ್ನಡ"}
            </span>
          </button>

          <button className="icon-btn" onClick={toggleTheme} title={t('header.toggleTheme', 'Theme')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="notification-wrapper" style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            {showNotifications && (
              <div className="notification-dropdown glass-panel">
                <h4>{t('header.notifications', 'Notifications')}</h4>
                <div className="notification-list">
                  <div className="notification-item unread">
                    <div className="notif-dot"></div>
                    <div className="notif-content">
                      <p><strong>{t('dashboardAlerts.newFir')}</strong></p>
                      <span>{t('dashboardAlerts.mock1')}</span>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notif-dot"></div>
                    <div className="notif-content">
                      <p><strong>{t('dashboardAlerts.at')} Whitefield PS</strong></p>
                      <span>{t('dashboardAlerts.mock2')}</span>
                    </div>
                  </div>
                  <div className="notification-item unread">
                    <div className="notif-dot"></div>
                    <div className="notif-content">
                      <p><strong>{t('header.statusUpdate', 'Status Update')}</strong></p>
                      <span>{t('dashboardAlerts.mock3')}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="user-profile" style={{ position: 'relative' }}>
            <div 
              className="user-profile-trigger flex-row align-center gap-sm cursor-pointer"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="avatar">
                <User size={18} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'SCRB Analyst'}</span>
                <span className="user-role">{user?.rank || 'State Admin'}</span>
              </div>
            </div>

            {showProfileMenu && (
              <div className="notification-dropdown glass-panel" style={{ right: 0, minWidth: '200px' }}>
                <div className="notification-list">
                  {(user?.role === 'ADMIN' || user?.role === 'DSP') && (
                    <button 
                      className="nav-item cursor-pointer w-full text-left bg-transparent border-none py-sm px-md flex-row align-center gap-sm hover-bg-light text-cyan"
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowEmergencyModal(true);
                      }}
                    >
                      <Shield size={16} /> {t('header.emergencyAccess', 'Emergency Access')}
                    </button>
                  )}
                  <button 
                    className="nav-item cursor-pointer w-full text-left bg-transparent border-none py-sm px-md flex-row align-center gap-sm hover-bg-light"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit2 size={16} /> {t('header.editProfile', 'Edit Profile')}
                  </button>
                  <button 
                    className="nav-item cursor-pointer w-full text-left bg-transparent border-none py-sm px-md flex-row align-center gap-sm hover-bg-light text-crimson"
                    onClick={logout}
                  >
                    <LogOut size={16} /> {t('nav.logout', 'Logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
      {showEmergencyModal && <EmergencyAccessModal onClose={() => setShowEmergencyModal(false)} />}

      {/* Smart Global Search Modal */}
      {showSearch && (
        <div className="search-modal-overlay" onClick={() => setShowSearch(false)}>
          <div className="search-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="search-modal-input">
              <Search size={20} className="icon-cyan" />
              <input 
                type="text" 
                placeholder={t('header.searchOverlayPlaceholder')} 
                autoFocus 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <kbd className="kbd-shortcut" style={{ marginLeft: 'auto' }}>ESC</kbd>
            </div>
            <div className="search-modal-results">
              {!searchQuery.trim() && (
                <p className="text-muted text-sm" style={{ padding: '16px' }}>{t('header.searchOverlayHelper')}</p>
              )}
              {isSearching && searchQuery.trim() && (
                <p className="text-muted text-sm" style={{ padding: '16px' }}>{t('header.searchingLive', 'Searching live database...')}</p>
              )}
              {!isSearching && searchQuery.trim() && searchResults.length === 0 && (
                <p className="text-muted text-sm" style={{ padding: '16px' }}>{t('header.noResults', 'No results found for')} "{searchQuery}"</p>
              )}
              {!isSearching && Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="search-result-group">
                  <div className="search-group-label">{typeLabels[type] || type}</div>
                  {items.map((item, i) => {
                    const Icon = getIconForType(type);
                    return (
                      <div key={i} className="search-result-item" onClick={() => setShowSearch(false)}>
                        <Icon size={16} className="search-result-icon" />
                        <div className="search-result-text">
                          <span className="search-result-title">{item.title}</span>
                          <span className="search-result-sub">{item.subtitle}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
