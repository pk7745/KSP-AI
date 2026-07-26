import React, { useEffect, useState } from 'react';
import { FileText, Search, Filter, X, Clock, User, ShieldAlert, Sparkles, Download, CheckSquare, Square, Link2, Lightbulb, Heart, Image, FileVideo, FileAudio, File } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { api } from '../../services/api';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { Case360Workspace } from './Case360Workspace';
import './CasesView.css';

export function CasesView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { globalCaseId, clearGlobalCase } = useNavigation();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newCaseFacts, setNewCaseFacts] = useState('');
  const [newCaseHead, setNewCaseHead] = useState('1');
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Record witness statements', done: true },
    { id: 2, text: 'Collect CCTV footage from scene', done: true },
    { id: 3, text: 'Send forensic samples to lab', done: false },
    { id: 4, text: 'Verify alibi of primary suspect', done: false },
    { id: 5, text: 'Check mobile tower dump records', done: false },
    { id: 6, text: 'Cross-reference vehicle registration', done: false },
  ]);

  useEffect(() => {
    async function fetchCases() {
      const data = await api.getCases();
      setCases(data.cases || []);
      setLoading(false);
    }
    fetchCases();
  }, []);

  // Effect to automatically open a case if globalCaseId is passed
  useEffect(() => {
    if (globalCaseId && !selectedCase && !drawerLoading) {
      openDrawer(globalCaseId);
    }
  }, [globalCaseId, selectedCase, drawerLoading]);

  const filteredCases = cases.filter(c => {
    // 1. RBAC Filtering
    let hasAccess = true;
    if (user) {
      if (user.role === 'IO' || user.role === 'SHO') {
        hasAccess = c.UnitID === user.unitId;
      } else if (user.role === 'DSP') {
        hasAccess = c.DistrictID === user.districtId;
      }
    }
    if (!hasAccess) return false;

    // 2. Search & Status Filtering
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
      
      // Refresh list
      const data = await api.getCases();
      setCases(data.cases || []);
    } catch (err) {
      showToast('Failed to register FIR');
    }
  };

  const openDrawer = async (caseId: string) => {
    setSelectedCase(caseId);
    setDrawerLoading(true);
    setActiveTab('overview');
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

  const toggleCheckItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const getCaseHealthScore = () => {
    if (!caseDetails) return 0;
    let score = 30; // base
    if (caseDetails.accused?.length > 0) score += 20;
    if (caseDetails.victims?.length > 0) score += 15;
    if (caseDetails.caseDetails?.BriefFacts) score += 15;
    if (caseDetails.caseDetails?.CaseStatus === 'Charge Sheeted') score += 20;
    const checklistDone = checklist.filter(c => c.done).length;
    score += Math.round((checklistDone / checklist.length) * 10);
    return Math.min(score, 100);
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'var(--accent-emerald)';
    if (score >= 50) return 'var(--accent-amber)';
    return 'var(--accent-crimson)';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 50) return 'Fair';
    return 'At Risk';
  };

  const generateCaseBrief = () => {
    if (!caseDetails) return;
    const doc = new jsPDF();
    const cd = caseDetails.caseDetails;
    doc.setFontSize(20);
    doc.text('KSP AI — Legal Case Brief', 20, 20);
    doc.setFontSize(14);
    doc.text(`FIR: ${cd.CrimeNo}`, 20, 35);
    doc.setFontSize(11);
    doc.text(`District: ${cd.DistrictName}`, 20, 45);
    doc.text(`Crime Head: ${cd.CrimeMajorHead}`, 20, 53);
    doc.text(`Status: ${cd.CaseStatus}`, 20, 61);
    doc.text(`Registered: ${new Date(cd.CrimeRegisteredDate).toLocaleDateString()}`, 20, 69);
    doc.text(`Sections: ${cd.ActSections || 'N/A'}`, 20, 77);
    doc.setFontSize(13);
    doc.text('AI-Generated Summary', 20, 92);
    doc.setFontSize(10);
    const briefLines = doc.splitTextToSize(cd.BriefFacts || 'No brief facts available.', 170);
    doc.text(briefLines, 20, 100);
    let y = 100 + briefLines.length * 5 + 10;
    doc.setFontSize(13);
    doc.text('Accused', 20, y);
    y += 8;
    doc.setFontSize(10);
    if (caseDetails.accused?.length > 0) {
      caseDetails.accused.forEach((a: any) => {
        doc.text(`• ${a.AccusedName} (${a.Age}y) — ${a.ArrestStatus}`, 20, y);
        y += 6;
      });
    } else {
      doc.text('No accused recorded.', 20, y);
    }
    doc.save(`KSP_CaseBrief_${cd.CrimeNo.replace(/\//g, '_')}.pdf`);
    showToast('Case brief exported to PDF');
  };

  // Mock related cases 
  const relatedCases = [
    { fir: 'KSP/BLR/2026/0091', head: 'Property Crime', match: '87%' },
    { fir: 'KSP/BLR/2026/0145', head: 'Cybercrime', match: '72%' },
  ];

  // Mock timeline events
  const timelineEvents = [
    { date: '2026-07-10', event: 'FIR Registered', type: 'milestone' },
    { date: '2026-07-11', event: 'Scene of Crime visited, evidence collected', type: 'investigation' },
    { date: '2026-07-12', event: 'Witness statement recorded (3 witnesses)', type: 'witness' },
    { date: '2026-07-14', event: 'CCTV footage retrieved from Brigade Road', type: 'evidence' },
    { date: '2026-07-15', event: 'Primary suspect identified via AI face match', type: 'ai' },
    { date: '2026-07-17', event: 'Suspect arrested at Majestic Bus Stand', type: 'arrest' },
    { date: '2026-07-20', event: 'Forensic report received — weapon match confirmed', type: 'evidence' },
  ];

  // Mock evidence gallery items
  const evidenceItems = [
    { name: 'CCTV-4_BrigadeRd.mp4', type: 'video', aiTag: 'Weapon Detected', confidence: '98%' },
    { name: 'Scene_Photo_01.jpg', type: 'image', aiTag: 'Blood Stain', confidence: '95%' },
    { name: 'Scene_Photo_02.jpg', type: 'image', aiTag: 'Footprint Match', confidence: '78%' },
    { name: 'Witness_Audio_01.mp3', type: 'audio', aiTag: 'Voice Identified', confidence: '62%' },
    { name: 'FIR_Scan.pdf', type: 'document', aiTag: 'OCR Complete', confidence: '99%' },
    { name: 'Forensic_Report.pdf', type: 'document', aiTag: 'Indexed', confidence: '100%' },
  ];

  const getEvidenceIcon = (type: string) => {
    switch(type) {
      case 'video': return <FileVideo size={20} />;
      case 'image': return <Image size={20} />;
      case 'audio': return <FileAudio size={20} />;
      default: return <File size={20} />;
    }
  };

  const healthScore = getCaseHealthScore();

  return (
    <div className="cases-view animate-slide-in">
      <div className="cases-header">
        <div className="cases-title-area">
          <h2>{t('cases.title')}</h2>
          <p className="subtitle">{t('cases.subtitle')}</p>
        </div>
        <div className="cases-actions">
          {(user?.role === 'IO' || user?.role === 'SHO') && (
            <button className="btn btn-primary" onClick={() => setShowNewCaseModal(true)}>
              + New FIR / Investigation
            </button>
          )}
          <div className="search-box">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder={t('cases.searchPlaceholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            className={`btn ${filterActive ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterActive(!filterActive)}
          >
            <Filter size={16} /> {filterActive ? 'Clear Filter' : t('cases.filterActive')}
          </button>
        </div>
      </div>

      <div className="cases-table-container glass-panel">
        {loading ? (
          <div className="loading-state">{t('cases.loading')}</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('cases.firNo')}</th>
                <th>{t('cases.location')}</th>
                <th>{t('cases.crimeHead')}</th>
                <th>{t('cases.date')}</th>
                <th>{t('cases.status')}</th>
                <th>{t('cases.gravity')}</th>
                <th>{t('cases.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map(c => (
                <tr key={c.CaseMasterID} onClick={() => openDrawer(c.CaseMasterID)} className="clickable-row">
                  <td><strong>{c.CrimeNo}</strong></td>
                  <td>
                    {c.DistrictName}<br/>
                    <span className="station-name">{c.PoliceStationName}</span>
                  </td>
                  <td>
                    {c.CrimeMajorHead}<br/>
                    <span className="minor-head">{c.CrimeMinorHead}</span>
                  </td>
                  <td>{new Date(c.CrimeRegisteredDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${c.CaseStatus === 'Under Investigation' ? 'badge-amber' : 'badge-emerald'}`}>
                      {c.CaseStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`gravity-badge ${c.GravityOffence === 'Heinous' ? 'badge-crimson' : 'badge-cyan'}`}>
                      {c.GravityOffence}
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
                  <td colSpan={7} className="no-results">{t('cases.noResults')}</td>
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
            <h3 style={{ marginBottom: '16px' }}>Register New FIR</h3>
            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label>FIR Number (Auto-generated)</label>
                <input type="text" className="input-glass" value="KSP/BLR/2026/0199" disabled />
              </div>
              <div className="form-group">
                <label>Crime Major Head</label>
                <select className="input-glass" value={newCaseHead} onChange={e => setNewCaseHead(e.target.value)} required>
                  <option value="1">Property Crime</option>
                  <option value="2">Bodily Offence</option>
                  <option value="3">Cybercrime</option>
                  <option value="4">Narcotics / NDPS</option>
                </select>
              </div>
              <div className="form-group">
                <label>Brief Facts</label>
                <textarea className="input-glass" rows={4} required placeholder="Enter incident summary..." value={newCaseFacts} onChange={e => setNewCaseFacts(e.target.value)}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowNewCaseModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save FIR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
