import React, { useEffect, useState } from 'react';
import { FileText, Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { api } from '../../services/api';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { Case360Workspace } from './Case360Workspace';
import './CasesView.css';

const textMapKn: Record<string, string> = {
  'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
  'CUBBON PARK POLICE STATION': 'ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'WHITEFIELD POLICE STATION': 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'INDIRANAGAR POLICE STATION': 'ಇಂದಿರಾನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',
  'ELECTRONIC CITY POLICE STATION': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಪೊಲೀಸ್ ಠಾಣೆ',
  'JAYANAGAR POLICE STATION': 'ಜಯನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Murder': 'ಕೊಲೆ',
  'HOMICIDE': 'ನರಹತ್ಯೆ',
  'ATTEMPT TO MURDER': 'ಕೊಲೆ ಯತ್ನ',
  'Theft': 'ಕಳ್ಳತನ',
  'VEHICLE THEFT': 'ವಾಹನ ಕಳವು',
  'Cyber Fraud': 'ಸೈಬರ್ ವಂಚನೆ',
  'ONLINE BANKING FRAUD': 'ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆ',
  'Crime Against Women': 'ಮಹಿಳೆಯರ ಮೇಲಿನ ಅಪರಾಧ',
  'DOMESTIC VIOLENCE': 'ಗೃಹ ಹಿಂಸಾಚಾರ',
  'Property Crime': 'ಆಸ್ತಿ ಅಪರಾಧ',
  'Bodily Offence': 'ದೇಹದ ಮೇಲಿನ ಅಪರಾಧ',
  'Cybercrime': 'ಸೈಬರ್ ಅಪರಾಧ',
  'Narcotics / NDPS': 'ಮಾದಕ ದ್ರವ್ಯ / ಎನ್‌ಡಿಪಿಎಸ್',
  'Under Investigation': 'ತನಿಖೆ ಹಂತದಲ್ಲಿದೆ',
  'UNDER INVESTIGATION': 'ತನಿಖೆ ಹಂತದಲ್ಲಿದೆ',
  'Charge Sheeted': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
  'CHARGE SHEET FILED': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
  'Pending Trial': 'ವಿಚಾರಣೆ ಬಾಕಿಯಿದೆ',
  'PENDING TRIAL': 'ವಿಚಾರಣೆ ಬಾಕಿಯಿದೆ',
  'Convicted': 'ದೋಷಿ ಎಂದು ಸಾಬೀತಾಗಿದೆ',
  'Acquitted': 'ಖುಲಾಸೆಗೊಳಿಸಲಾಗಿದೆ',
  'Closed': 'ಮುಚ್ಚಲಾಗಿದೆ',
  'Heinous': 'ಘೋರ',
  'HEINOUS': 'ಘೋರ',
  'Non-Heinous': 'ಘೋರವಲ್ಲದ',
  'RAREST OF RARE': 'ಅತ್ಯಂತ ಅಪರೂಪದ',
  'GRAVE': 'ಘೋರ',
  'MODERATE': 'ಮಧ್ಯಮ',
  'ORGANIZED CRIME': 'ಸಂಘಟಿತ ಅಪರಾಧ',
  'TERROR RELATED': 'ಭಯೋತ್ಪಾದನೆ ಸಂಬಂಧಿತ'
};

export function CasesView() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isKn = i18n.language === 'kn';
  const { globalCaseId, clearGlobalCase } = useNavigation();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseFacts, setNewCaseFacts] = useState('');
  const [newCaseHead, setNewCaseHead] = useState('1');

  const tr = (val: string) => {
    if (!val) return val;
    if (!isKn) return val;
    return textMapKn[val.trim()] || textMapKn[val.toUpperCase()] || val;
  };

  useEffect(() => {
    async function fetchCases() {
      const data = await api.getCases();
      setCases(data.cases || []);
      setLoading(false);
    }
    fetchCases();
  }, []);

  useEffect(() => {
    if (globalCaseId && !selectedCase && !drawerLoading) {
      openDrawer(globalCaseId);
    }
  }, [globalCaseId, selectedCase, drawerLoading]);

  const filteredCases = cases.filter(c => {
    let hasAccess = true;
    if (user) {
      if (user.role === 'IO' || user.role === 'SHO') {
        hasAccess = c.UnitID === user.unitId;
      } else if (user.role === 'DSP') {
        hasAccess = c.DistrictID === user.districtId;
      }
    }
    if (!hasAccess) return false;

    const matchesSearch = (c.CrimeNo || '').toLowerCase().includes(search.toLowerCase()) || 
      (c.CrimeMajorHead || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.DistrictName || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterActive ? c.CaseStatus === 'Under Investigation' : true;
    
    return matchesSearch && matchesFilter;
  });

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createCase({
        CrimeHeadID: parseInt(newCaseHead),
        BriefFacts: newCaseFacts,
        DistrictID: parseInt(user?.districtId?.replace(/\D/g, '') || '1'),
        UnitID: parseInt(user?.unitId?.replace(/\D/g, '') || '1')
      });
      setShowNewCaseModal(false);
      setNewCaseFacts('');
      showToast(`FIR ${res.data.CrimeNo} registered successfully.`);
      
      const data = await api.getCases();
      setCases(data.cases || []);
    } catch (err) {
      showToast('Failed to register FIR');
    }
  };

  const openDrawer = async (caseId: string) => {
    setSelectedCase(caseId);
    setDrawerLoading(true);
    try {
      const details = await api.getCaseDetails(caseId);
      if (details && !details.error) {
        setCaseDetails(details);
      } else {
        showToast(details?.error || 'Unauthorized access: Case outside your jurisdiction');
        setSelectedCase(null);
      }
    } catch (e) {
      showToast('Unauthorized access: Case outside your jurisdiction');
      setSelectedCase(null);
    }
    setDrawerLoading(false);
  };

  const closeDrawer = () => {
    setSelectedCase(null);
    setCaseDetails(null);
    if (globalCaseId) {
      clearGlobalCase();
    }
  };

  return (
    <div className="cases-view animate-slide-in">
      <div className="cases-header">
        <div className="cases-title-area">
          <h2>{t('cases.title', 'Cases 360 Repository')}</h2>
          <p className="subtitle">{t('cases.subtitle', 'Secure access to Catalyst-indexed FIRs and active investigations.')}</p>
        </div>
        
        <div className="cases-actions flex items-center gap-3">
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder={t('cases.searchPlaceholder', 'Search (FIR, Officer, Location)...')} 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <button 
            className={`btn ${filterActive ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => setFilterActive(!filterActive)}
          >
            <Filter size={16} /> {filterActive ? (isKn ? 'ಫಿಲ್ಟರ್ ತೆಗೆಯಿರಿ' : 'Clear Filter') : t('cases.filterActive', 'Filter (Under Investigation)')}
          </button>

          {(user?.role === 'IO' || user?.role === 'SHO' || user?.role === 'ADMIN') && (
            <button className="btn btn-primary" onClick={() => setShowNewCaseModal(true)}>
              + {isKn ? 'ಹೊಸ ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಿ' : 'New FIR'}
            </button>
          )}
        </div>
      </div>

      <div className="cases-table-container glass-panel">
        {loading ? (
          <div className="loading-state">{t('cases.loading', 'Fetching Case Data...')}</div>
        ) : (
          <table className="cases-table">
            <thead>
              <tr>
                <th>{t('cases.firNo', 'FIR Number')}</th>
                <th>{t('cases.location', 'Location / Station')}</th>
                <th>{t('cases.crimeHead', 'Crime Head')}</th>
                <th>{t('cases.date', 'Registered Date')}</th>
                <th>{t('cases.status', 'Status')}</th>
                <th>{t('cases.gravity', 'Gravity')}</th>
                <th>{t('cases.actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => (
                <tr key={c.CaseMasterID} onClick={() => openDrawer(c.CaseMasterID)} className="clickable-row">
                  <td><strong>{c.CrimeNo}</strong></td>
                  <td>
                    {tr(c.DistrictName)}<br/>
                    <span className="station-name">{tr(c.PoliceStationName)}</span>
                  </td>
                  <td>
                    {tr(c.CrimeMajorHead)}<br/>
                    <span className="minor-head">{tr(c.CrimeMinorHead)}</span>
                  </td>
                  <td>{new Date(c.CrimeRegisteredDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${c.CaseStatus === 'Under Investigation' ? 'badge-amber' : 'badge-emerald'}`}>
                      {tr(c.CaseStatus)}
                    </span>
                  </td>
                  <td>
                    <span className={`gravity-badge ${c.GravityOffence === 'Heinous' ? 'badge-crimson' : 'badge-cyan'}`}>
                      {tr(c.GravityOffence)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); openDrawer(c.CaseMasterID); }}>
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-results">{t('cases.noResults', 'No cases matching your search criteria.')}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Massive Case 360 Workspace Overlay */}
      {selectedCase && caseDetails && !drawerLoading && (
        <Case360Workspace 
          caseDetails={caseDetails} 
          onClose={closeDrawer} 
        />
      )}

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="search-modal-overlay" onClick={() => setShowNewCaseModal(false)}>
          <div className="search-modal" onClick={e => e.stopPropagation()} style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>{isKn ? 'ಹೊಸ ಎಫ್‌ಐಆರ್ ನೋಂದಾಯಿಸಿ' : 'Register New FIR'}</h3>
            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>{isKn ? 'ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ (ಸ್ವಯಂಚಾಲಿತ)' : 'FIR Number (Auto-generated)'}</label>
                <input type="text" className="input-glass" value="KSP/BLR/2026/0199" disabled />
              </div>
              <div className="form-group">
                <label>{isKn ? 'ಪ್ರಮುಖ ಅಪರಾಧ ಶೀರ್ಷಿಕೆ' : 'Crime Major Head'}</label>
                <select className="input-glass" value={newCaseHead} onChange={e => setNewCaseHead(e.target.value)} required>
                  <option value="1">{isKn ? 'ಆಸ್ತಿ ಅಪರಾಧ' : 'Property Crime'}</option>
                  <option value="2">{isKn ? 'ದೇಹದ ಮೇಲಿನ ಅಪರಾಧ' : 'Bodily Offence'}</option>
                  <option value="3">{isKn ? 'ಸೈಬರ್ ಅಪರಾಧ' : 'Cybercrime'}</option>
                  <option value="4">{isKn ? 'ಮಾದಕ ದ್ರವ್ಯ / ಎನ್‌ಡಿಪಿಎಸ್' : 'Narcotics / NDPS'}</option>
                </select>
              </div>
              <div className="form-group">
                <label>{isKn ? 'ಸಂಕ್ಷಿಪ್ತ ವಿವರಗಳು' : 'Brief Facts'}</label>
                <textarea className="input-glass" rows={4} required placeholder={isKn ? 'ಘಟನೆಯ ಸಾರಾಂಶ ನಮೂದಿಸಿ...' : 'Enter incident summary...'} value={newCaseFacts} onChange={e => setNewCaseFacts(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowNewCaseModal(false)}>{isKn ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}</button>
                <button type="submit" className="btn btn-primary">{isKn ? 'ಎಫ್‌ಐಆರ್ ಉಳಿಸಿ' : 'Save FIR'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
