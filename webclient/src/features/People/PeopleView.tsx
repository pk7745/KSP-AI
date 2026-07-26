import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, AlertTriangle, UserX, UserCheck, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import './PeopleView.css';

export function PeopleView() {
  const { t, i18n } = useTranslation();
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<any | null>(null);
  const { openCase360 } = useNavigation();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPeople();
        setPeople(res.people);
      } catch (err) {
        console.error("Failed to load people", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = people.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.role?.toLowerCase().includes(search.toLowerCase()) ||
    p.linkedCase?.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch(role) {
      case 'Accused': return <UserX size={16} className="text-crimson" />;
      case 'Victim': return <ShieldAlert size={16} className="text-amber" />;
      case 'Witness': return <UserCheck size={16} className="text-cyan" />;
      default: return <Users size={16} className="text-emerald" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch(role) {
      case 'Accused': return t('people.accused', 'Accused');
      case 'Victim': return t('people.victim', 'Victim');
      case 'Witness': return t('people.witness', 'Witness');
      default: return role;
    }
  };

  const getRiskBadge = (label: string) => {
    if (!label) return null;
    const colors: Record<string, string> = {
      'VERY HIGH': 'bg-crimson',
      'HIGH': 'bg-amber',
      'MEDIUM': 'bg-blue',
      'LOW': 'bg-emerald'
    };
    return <span className={`badge ${colors[label] || 'bg-gray'}`}>{label} RISK</span>;
  };

  return (
    <div className="people-view animate-slide-in">
      <div className="header-area">
        <div>
          <h2>{t('people.title', 'People Intelligence CRM')}</h2>
          <p className="subtitle">{t('people.subtitle', 'Unified cross-reference for Accused, Victims, and Witnesses')}</p>
        </div>
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder={t('people.searchPlaceholder', 'Search citizen (Name, Phone, Aadhaar, Crime ID)...')} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="content-area">
        {loading ? (
          <div className="loading-state">{i18n.language === 'kn' ? 'ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading intelligence records...'}</div>
        ) : (
          <div className="people-grid">
            <div className="people-list glass-panel">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{i18n.language === 'kn' ? 'ಹೆಸರು' : 'Name'}</th>
                    <th>{i18n.language === 'kn' ? 'ಪಾತ್ರ' : 'Role'}</th>
                    <th>{i18n.language === 'kn' ? 'ಸಂಬಂಧಿತ ಪ್ರಕರಣ' : 'Linked Case'}</th>
                    <th>{i18n.language === 'kn' ? 'ಅಪಾಯ' : 'Risk'}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr 
                      key={p.id} 
                      onClick={() => setSelectedPerson(p)}
                      className={selectedPerson?.id === p.id ? 'selected' : ''}
                    >
                      <td className="fw-bold">{p.name}</td>
                      <td>
                        <div className="flex-row gap-xs align-center">
                          {getRoleIcon(p.role)}
                          <span>{getRoleLabel(p.role)}</span>
                        </div>
                      </td>
                      <td>{p.linkedCase}</td>
                      <td>{getRiskBadge(p.riskLabel)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={4} className="text-center">{t('people.noPeople', 'No citizen profiles found matching search criteria.')}</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedPerson && (
              <div className="person-drawer glass-panel animate-fade-in">
                <div className="drawer-header">
                  <h3>{selectedPerson.name}</h3>
                  <div className="flex-row gap-xs mt-xs">
                    {getRoleIcon(selectedPerson.role)}
                    <span className="fw-bold">{getRoleLabel(selectedPerson.role)}</span>
                  </div>
                </div>
                
                <div className="drawer-body mt-md">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">{i18n.language === 'kn' ? 'ವಯಸ್ಸು/ಲಿಂಗ' : 'Age/Gender'}</span>
                      <span className="value">{selectedPerson.age} / {selectedPerson.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{i18n.language === 'kn' ? 'ದೂರವಾಣಿ' : 'Phone'}</span>
                      <span className="value">{selectedPerson.phone || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{i18n.language === 'kn' ? 'ವೃತ್ತಿ' : 'Occupation'}</span>
                      <span className="value">{selectedPerson.occupation || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{i18n.language === 'kn' ? 'ಸ್ಥಿತಿ' : 'Status'}</span>
                      <span className="value fw-bold text-amber">{selectedPerson.status}</span>
                    </div>
                  </div>

                  {selectedPerson.riskLabel && (
                    <div className="risk-card mt-md">
                      <h4>{i18n.language === 'kn' ? 'ಎಐ ಅಪಾಯದ ಮೌಲ್ಯಮಾಪನ' : 'AI Risk Assessment'}</h4>
                      <div className="flex-row gap-md mt-sm align-center">
                        <div className="score-circle">
                          {selectedPerson.riskScore}
                        </div>
                        <div>
                          {getRiskBadge(selectedPerson.riskLabel)}
                          <p className="mt-xs font-sm opacity-70">
                            {i18n.language === 'kn' ? 'ಅಪರಾಧ ಇತಿಹಾಸ ಮತ್ತು ಅಪಾಯದ ಸೂಚಕಗಳ ಆಧಾರದ ಮೇಲೆ.' : 'Based on criminal history, bail jumps, and violence indicators.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="case-link mt-md p-md glass-panel-inner">
                    <h4>{i18n.language === 'kn' ? 'ಮುಖ್ಯ ಪ್ರಕರಣ' : 'Primary Case'}</h4>
                    <p className="mt-sm fw-bold text-cyan">{selectedPerson.linkedCase}</p>
                    <div className="info-grid mt-sm">
                      <div className="info-item">
                        <span className="label">{i18n.language === 'kn' ? 'ತನಿಖಾಧಿಕಾರಿ' : 'Investigating Officer'}</span>
                        <span className="value">{selectedPerson.officer || 'Unknown'}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">{i18n.language === 'kn' ? 'ಠಾಣೆ' : 'Station'}</span>
                        <span className="value">{selectedPerson.station || 'Unknown'}</span>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary mt-sm w-full"
                      onClick={() => openCase360(selectedPerson.caseId || selectedPerson.linkedCase)}
                    >
                      {i18n.language === 'kn' ? 'ಪ್ರಕರಣ 360 ವೀಕ್ಷಿಸಿ' : 'View Case 360'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
