import React, { useEffect, useState } from 'react';
import { FileText, Search, Filter, X, Scale, RefreshCw } from 'lucide-react';
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

  // Case Comparison Modal States
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [caseA, setCaseA] = useState('');
  const [caseB, setCaseB] = useState('');
  const [comparing, setComparing] = useState(false);
  const [comparisonReport, setComparisonReport] = useState('');

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

      if (data.cases && data.cases.length >= 2) {
        setCaseA(data.cases[0].CrimeNumber || data.cases[0].CrimeNo || '');
        setCaseB(data.cases[1].CrimeNumber || data.cases[1].CrimeNo || '');
      }
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

  const handleRunComparison = async () => {
    if (!caseA || !caseB) return;
    setComparing(true);
    try {
      const queryStr = `Compare Case ${caseA} with Case ${caseB}`;
      const res = await api.chatWithGemini(queryStr, [], isKn ? 'kn' : 'en');
      setComparisonReport(res.reply || res.answer || '');
    } catch (err) {
      showToast('Failed to compare cases');
    } finally {
      setComparing(false);
    }
  };

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

          <button className="btn btn-secondary flex items-center gap-2" onClick={() => setShowCompareModal(true)}>
            <Scale size={16} /> {isKn ? '⚖️ ಪ್ರಕರಣಗಳ ಹೋಲಿಕೆ' : '⚖️ Compare Cases'}
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
                <tr key={c.CaseMasterID || c.CrimeNo}>
                  <td className="font-mono text-cyan-400 font-bold">{c.CrimeNo}</td>
                  <td>{tr(c.DistrictName)} • {tr(c.StationName || c.UnitName)}</td>
                  <td>{tr(c.CrimeMajorHead)}</td>
                  <td>{c.CrimeRegisteredDate ? c.CrimeRegisteredDate.substring(0, 10) : '2026-01-15'}</td>
                  <td><span className="badge badge-warning">{tr(c.CaseStatus || 'Under Investigation')}</span></td>
                  <td><span className="badge badge-danger">{tr(c.GravityOffence || 'Heinous')}</span></td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => openDrawer(c.CrimeNo)}>
                      <FileText size={14} /> {isKn ? 'ಕೇಸ್ 360 ವೀಕ್ಷಿಸಿ' : 'View Case 360'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* CASE 360 WORKSPACE DRAWER */}
      {selectedCase && (
        <div className="drawer-overlay" onClick={closeDrawer}>
          <div className="drawer-container glass-panel" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>{isKn ? 'ಕೇಸ್ 360 ತನಿಖಾ ವರ್ಕ್‌ಸ್ಪೇಸ್' : 'Case 360 Investigation Workspace'}</h3>
              <button className="close-btn" onClick={closeDrawer}><X size={20} /></button>
            </div>
            {drawerLoading ? (
              <div className="loading-state p-6">{isKn ? 'ಡಾಟಾಸ್ಟೋರ್‌ನಿಂದ ಪ್ರಕರಣದ ವಿವರ ಹಿಂಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Loading Case Details from Catalyst Stratus...'}</div>
            ) : (
              caseDetails && <Case360Workspace caseDetails={caseDetails} onClose={closeDrawer} />
            )}
          </div>
        </div>
      )}

      {/* CASE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="drawer-overlay" onClick={() => setShowCompareModal(false)}>
          <div className="glass-panel p-6 max-w-4xl w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
              <h3 className="text-xl font-bold flex items-center gap-2 text-cyan-400">
                <Scale size={24} /> {isKn ? '⚖️ ಪ್ರಕರಣಗಳ ಸಾಲಿನಲ್ಲಿ ನೇರ ಹೋಲಿಕೆ (Side-by-Side Case Comparison)' : '⚖️ Side-by-Side Case Comparison Engine'}
              </h3>
              <button onClick={() => setShowCompareModal(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">{isKn ? 'ಪ್ರಕರಣ A (Select Case A):' : 'Select Case A:'}</label>
                <select className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-sm" value={caseA} onChange={e => setCaseA(e.target.value)}>
                  {cases.map(c => <option key={c.CrimeNo} value={c.CrimeNo}>{c.CrimeNo} - {c.CrimeMajorHead}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">{isKn ? 'ಪ್ರಕರಣ B (Select Case B):' : 'Select Case B:'}</label>
                <select className="w-full bg-gray-800 border border-gray-700 text-white rounded p-2 text-sm" value={caseB} onChange={e => setCaseB(e.target.value)}>
                  {cases.map(c => <option key={c.CrimeNo} value={c.CrimeNo}>{c.CrimeNo} - {c.CrimeMajorHead}</option>)}
                </select>
              </div>
            </div>

            <button 
              className="btn btn-primary w-full py-2 flex justify-center items-center gap-2 mb-4"
              onClick={handleRunComparison}
              disabled={comparing}
            >
              {comparing ? <RefreshCw className="animate-spin" size={16} /> : <Scale size={16} />}
              {comparing ? (isKn ? 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...' : 'Running Comparison Engine...') : (isKn ? 'ನೇರ ಹೋಲಿಕೆ ಚಾಲನೆ ಮಾಡಿ' : 'Run Side-by-Side Comparison')}
            </button>

            {comparisonReport && (
              <div className="bg-gray-900/80 border border-cyan-500/30 rounded p-4 text-sm text-gray-200 leading-relaxed">
                <div style={{ whiteSpace: 'pre-line' }}>{comparisonReport}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
