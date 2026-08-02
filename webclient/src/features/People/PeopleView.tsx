import React, { useState, useEffect } from 'react';
import { Users, Search, UserX, UserCheck, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import './PeopleView.css';

export function PeopleView() {
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';
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
    const riskMapKn: Record<string, string> = {
      'LOW': 'ಕಡಿಮೆ ಅಪಾಯ',
      'MEDIUM': 'ಮಧ್ಯಮ ಅಪಾಯ',
      'HIGH': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
      'VERY HIGH': 'ಅತ್ಯಂತ ಹೆಚ್ಚಿನ ಅಪಾಯ'
    };
    const displayText = isKn ? (riskMapKn[label] || `${label} ಅಪಾಯ`) : `${label} RISK`;
    return <span className={`badge ${colors[label] || 'bg-gray'}`}>{displayText}</span>;
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
          <div className="loading-state">{isKn ? 'ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading intelligence records...'}</div>
        ) : (
          <div className="people-grid">
            <div className="people-list glass-panel">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{isKn ? 'ಹೆಸರು' : 'Name'}</th>
                    <th>{isKn ? 'ಪಾತ್ರ' : 'Role'}</th>
                    <th>{isKn ? 'ಸಂಬಂಧಿತ ಪ್ರಕರಣ' : 'Linked Case'}</th>
                    <th>{isKn ? 'ಅಪಾಯ' : 'Risk'}</th>
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
                      <span className="label">{isKn ? 'ವಯಸ್ಸು/ಲಿಂಗ' : 'Age/Gender'}</span>
                      <span className="value">{selectedPerson.age} / {selectedPerson.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{isKn ? 'ದೂರವಾಣಿ' : 'Phone'}</span>
                      <span className="value">{selectedPerson.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{isKn ? 'ಸ್ಥಳೀಯ ವಿಳಾಸ' : 'Address'}</span>
                      <span className="value">{selectedPerson.address}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">{isKn ? 'ಅಪಾಯದ ಮಟ್ಟ' : 'Risk Assessment'}</span>
                      <span className="value">{getRiskBadge(selectedPerson.riskLabel)}</span>
                    </div>
                  </div>

                  <div className="mt-md">
                    <button 
                      className="btn btn-primary w-full"
                      onClick={() => openCase360(selectedPerson.linkedCase)}
                    >
                      {isKn ? 'ಪ್ರಕರಣ 360 ಕಾರ್ಯಸ್ಥಳ ತೆರೆಯಿರಿ' : 'Open Case 360 Workspace'}
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
