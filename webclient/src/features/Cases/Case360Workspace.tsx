import React, { useState } from 'react';
import { X, Clock, FileText, User, ShieldAlert, Sparkles, Download, CheckSquare, Square, Link2, Lightbulb, Heart, Image, FileVideo, FileAudio, File, ChevronRight, Activity, MapPin, Scale, Eye, Users, Lock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../utils/toast';
import { useNavigation } from '../../context/NavigationContext';
import './Case360.css';

export function Case360Workspace({ caseDetails, onClose }: { caseDetails: any, onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { setCurrentView } = useNavigation();
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);

  // Render Jurisdiction & Rank Restriction Banner if case is outside assigned district/rank
  if (caseDetails?.isRestricted) {
    return (
      <div className="case-360-overlay animate-fade-in">
        <div className="case-360-container animate-slide-up max-w-xl mx-auto my-auto p-6 bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl text-slate-100 font-sans">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/50 flex items-center justify-center">
                <Lock size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Jurisdiction & Rank Restriction</h3>
                <p className="text-xs text-red-400 font-medium font-mono">FIR Ref: {caseDetails.caseNumber || 'Restricted Case'}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="py-6 text-xs text-slate-200 leading-relaxed space-y-3">
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-200 font-semibold text-xs flex items-start gap-2">
              <ShieldAlert size={18} className="text-red-400 shrink-0 mt-0.5" />
              <span>{caseDetails.message || 'This case cannot be viewed as it is outside your jurisdiction or officer rank.'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-[11px] leading-normal">
              {caseDetails.reason || `Assigned to ${caseDetails.districtName || 'another district'}.`}
            </div>
            
            <p className="text-slate-400 text-[11px]">
              {i18n.language === 'kn'
                ? 'ಪ್ರಕರಣದ ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಎಮರ್ಜೆನ್ಸಿ ಕಮಾಂಡ್ ಸೆಂಟರ್ ಮೂಲಕ ತುರ್ತು ಪ್ರವೇಶಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.'
                : 'To access restricted case dossiers outside your assigned district, submit an Emergency Access Request or contact the District SP.'}
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button className="btn btn-outline text-xs" onClick={onClose}>
              {t('case360.close', 'Close')}
            </button>
            <button 
              className="btn btn-primary text-xs flex items-center gap-1.5" 
              onClick={() => { onClose(); setCurrentView('command'); }}
            >
              <ShieldAlert size={14} /> Request Emergency Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  const cd = caseDetails?.caseDetails || {};
  
  const [checklist, setChecklist] = useState([
    { id: 1, text: i18n.language === 'kn' ? 'ಸಾಕ್ಷಿಗಳ ಹೇಳಿಕೆಯನ್ನು ದಾಖಲಿಸಿ' : 'Record witness statements', done: true },
    { id: 2, text: i18n.language === 'kn' ? 'ಘಟನಾ ಸ್ಥಳದಿಂದ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿ ಸಂಗ್ರಹಿಸಿ' : 'Collect CCTV footage from scene', done: true },
    { id: 3, text: i18n.language === 'kn' ? 'ಫೊರೆನ್ಸಿಕ್ ಮಾದರಿಗಳನ್ನು ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಕಳುಹಿಸಿ' : 'Send forensic samples to lab', done: false },
    { id: 4, text: i18n.language === 'kn' ? 'ಮುಖ್ಯ ಶಂಕಿತನ ವಿವರ ಪರಿಶೀಲಿಸಿ' : 'Verify alibi of primary suspect', done: false }
  ]);

  const toggleCheckItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const generateCaseBrief = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('KSP AI — Intelligence Report', 20, 20);
    doc.setFontSize(14);
    doc.text(`FIR: ${cd.CrimeNo || 'N/A'}`, 20, 35);
    doc.text(`Status: ${cd.CaseStatus || 'Under Investigation'}`, 20, 45);
    doc.setFontSize(11);
    const briefLines = doc.splitTextToSize(cd.BriefFacts || '', 170);
    doc.text(briefLines, 20, 60);
    doc.save(`KSP_Intelligence_${String(cd.CrimeNo || 'case').replace(/\//g, '_')}.pdf`);
    showToast('Intelligence Report exported to PDF');
  };

  const getEvidenceIcon = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'video': return <FileVideo size={24} className="text-cyan" />;
      case 'image': return <Image size={24} className="text-emerald" />;
      case 'audio': return <FileAudio size={24} className="text-amber" />;
      default: return <File size={24} className="text-indigo" />;
    }
  };

  const navigateToPeople = () => {
    onClose();
    setCurrentView('people');
  };

  return (
    <div className="case-360-overlay animate-fade-in">
      <div className="case-360-container animate-slide-up">
        {/* Header Bar */}
        <div className="workspace-header">
          <div className="flex-row align-center gap-md">
            <button className="btn-icon" onClick={onClose}><X size={24} /></button>
            <div>
              <div className="flex-row align-center gap-sm">
                <h2 className="workspace-title">{cd.CrimeNo || 'FIR Record'}</h2>
                <span className={`status-badge ${cd.CaseStatus === 'Under Investigation' ? 'badge-amber' : 'badge-emerald'}`}>
                  {String(t(`cases.statuses.${cd.CaseStatus}`, cd.CaseStatus || 'Active'))}
                </span>
              </div>
              <p className="text-muted mt-xs">
                <MapPin size={14} className="inline-icon" /> {cd.DistrictName} • {cd.PoliceStationName} | 
                <Scale size={14} className="inline-icon ml-md" /> {t(`db.crimeHeads.${cd.CrimeMajorHead}`, cd.CrimeMajorHead)}
              </p>
            </div>
          </div>
          
          <div className="flex-row gap-sm">
            <button className="btn btn-outline" onClick={generateCaseBrief}>
              <Download size={16} /> {t('case360.exportReport', 'Export Intelligence Report')}
            </button>
            <button className="btn btn-primary" onClick={() => showToast('Case marked as Resolved')}>
              <Activity size={16} /> {t('case360.resolveCase', 'Resolve Case')}
            </button>
          </div>
        </div>

        {/* Massive 360 Grid */}
        <div className="workspace-grid">
          
          {/* Column 1: Core Details & AI */}
          <div className="workspace-col">
            <div className="panel-box wireframe-box registration-mark">
              <h4><FileText size={16} className="text-cyan" /> {t('case360.briefFacts', 'FIR Brief Facts')}</h4>
              <p className="mt-sm leading-relaxed">{cd.BriefFacts || 'Brief facts filed in CCTNS CaseMaster.'}</p>
              
              {cd.ActSections && (
                <div className="mt-md p-sm glass-panel-inner rounded">
                  <span className="text-xs text-muted">{t('case360.applicableActs', 'APPLICABLE ACTS & SECTIONS')}</span>
                  <p className="text-sm font-mono text-cyan mt-xs">{cd.ActSections}</p>
                </div>
              )}
              
              <div className="mt-md pt-md border-top">
                <h4 className="flex-row align-center gap-sm">
                  <Sparkles size={16} className="text-indigo" /> {t('case360.aiAssistant', 'AI Investigation Assistant')}
                </h4>
                <div className="ai-chat-bubble mt-sm">
                  <p className="text-sm">
                    {i18n.language === 'kn'
                      ? `${cd.DistrictName} ಸರಹದ್ದಿನಲ್ಲಿ ಈ ಪ್ರಕರಣದ ಮಾದರಿಯು ಸಕ್ರಿಯ ಅಪರಾಧ ಗುಂಪುಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದೆ. ಸಿಸಿಟಿವಿ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.`
                      : `Based on the MO and registered sections, this case pattern correlates with active crime clusters in ${cd.DistrictName}. I recommend reviewing CCTV evidence and checking tower dump logs.`
                    }
                  </p>
                  <div className="flex-row gap-xs mt-sm">
                    <button className="btn btn-ghost text-xs" onClick={() => showToast('Search Warrant draft generated')}>
                      {t('case360.generateWarrants', 'Generate Warrants')}
                    </button>
                    <button className="btn btn-ghost text-xs" onClick={() => showToast('Chargesheet template prepared')}>
                      {t('case360.draftChargesheet', 'Draft Chargesheet')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-box wireframe-box registration-mark">
              <h4><CheckSquare size={16} className="text-emerald" /> {t('case360.checklist', 'Investigation Checklist')}</h4>
              <div className="checklist mt-sm">
                {checklist.map(item => (
                  <div key={item.id} className={`checklist-item ${item.done ? 'done' : ''}`} onClick={() => toggleCheckItem(item.id)}>
                    {item.done ? <CheckSquare size={16} className="text-emerald" /> : <Square size={16} />}
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: People CRM & Timeline */}
          <div className="workspace-col">
            <div className="panel-box wireframe-box registration-mark">
              <div className="flex-row justify-between align-center">
                <h4><Users size={16} className="text-amber" /> {t('case360.entities', 'Involved Entities')}</h4>
                <button className="btn btn-ghost text-xs" onClick={navigateToPeople}>
                  {t('case360.peopleCrm', 'Open People CRM')} <ChevronRight size={14} />
                </button>
              </div>
              
              <div className="mt-sm">
                <h5 className="text-crimson font-sm mb-xs">{t('case360.accused', 'ACCUSED')} ({caseDetails.accused?.length || 0})</h5>
                {caseDetails.accused?.map((a: any) => (
                  <div 
                    key={a.AccusedID} 
                    className="entity-card accused-card clickable"
                    onClick={navigateToPeople}
                    title="Click to view in People CRM"
                  >
                    <ShieldAlert size={16} className="text-crimson" />
                    <div className="flex-1">
                      <strong>{a.AccusedName}</strong> ({a.Age || 'N/A'}y)
                      <div className="text-xs text-muted">{String(t(`cases.statuses.${a.ArrestStatus}`, a.ArrestStatus || 'Under Investigation'))}</div>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))}
                {!caseDetails.accused?.length && (
                  <p className="text-muted text-xs py-xs">{t('case360.noAccused', 'No accused recorded.')}</p>
                )}

                <h5 className="text-cyan font-sm mt-md mb-xs">{t('case360.victims', 'VICTIMS')} ({caseDetails.victims?.length || 0})</h5>
                {caseDetails.victims?.map((v: any) => (
                  <div 
                    key={v.VictimID} 
                    className="entity-card victim-card clickable"
                    onClick={navigateToPeople}
                    title="Click to view in People CRM"
                  >
                    <User size={16} className="text-cyan" />
                    <div className="flex-1">
                      <strong>{v.VictimName}</strong> ({v.Age || 'N/A'}y)
                      <div className="text-xs text-muted">{v.VictimStatus || 'Victim'}</div>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))}
                {!caseDetails.victims?.length && (
                  <p className="text-muted text-xs py-xs">{t('case360.noVictims', 'No victims recorded.')}</p>
                )}
              </div>
            </div>

            <div className="panel-box wireframe-box registration-mark">
              <h4><Clock size={16} className="text-indigo" /> {t('case360.timeline', 'Investigation Timeline')}</h4>
              <div className="vertical-timeline mt-md">
                <div className="vt-item">
                  <div className="vt-dot bg-cyan"></div>
                  <div className="vt-content">
                    <span className="vt-date">{cd.CrimeRegisteredDate ? new Date(cd.CrimeRegisteredDate).toLocaleDateString() : 'Active'}</span>
                    <p>{i18n.language === 'kn' ? `ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಲಾಗಿದೆ: ${cd.PoliceStationName}` : `FIR Registered at ${cd.PoliceStationName}`}</p>
                  </div>
                </div>
                {caseDetails.evidence?.length > 0 && (
                  <div className="vt-item">
                    <div className="vt-dot bg-emerald"></div>
                    <div className="vt-content">
                      <span className="vt-date">{i18n.language === 'kn' ? 'ಸಾಕ್ಷ್ಯಾಧಾರ ದಾಖಲಾಗಿದೆ' : 'Evidence Logged'}</span>
                      <p>{i18n.language === 'kn' ? `${caseDetails.evidence.length} ಸಾಕ್ಷ್ಯಗಳನ್ನು ಕ್ಯಾಟಲಿಸ್ಟ್‌ನಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ` : `${caseDetails.evidence.length} items logged in Stratus storage`}</p>
                    </div>
                  </div>
                )}
                {caseDetails.accused?.length > 0 && (
                  <div className="vt-item">
                    <div className="vt-dot bg-crimson"></div>
                    <div className="vt-content">
                      <span className="vt-date">{i18n.language === 'kn' ? 'ಆರೋಪಿಯನ್ನು ಗುರುತಿಸಲಾಗಿದೆ' : 'Accused Identified'}</span>
                      <p>{caseDetails.accused[0].AccusedName} ({caseDetails.accused[0].ArrestStatus || 'Accused'})</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Evidence & Graph */}
          <div className="workspace-col">
            <div className="panel-box flex-1 wireframe-box registration-mark">
              <h4><Image size={16} className="text-emerald" /> {t('case360.evidenceViewer', 'Evidence Viewer')}</h4>
              <div className="evidence-grid mt-sm">
                {caseDetails.evidence?.map((e: any) => (
                  <div 
                    key={e.EvidenceID} 
                    className="evidence-box clickable"
                    onClick={() => setSelectedEvidence(e)}
                  >
                    {getEvidenceIcon(e.EvidenceType)}
                    <div className="mt-xs text-xs fw-bold text-center truncate">{e.Description || `Evidence #${e.EvidenceNumber}`}</div>
                    <div className="badge-cyan text-xs mt-xs">AI OCR Scanned</div>
                  </div>
                ))}
                {!caseDetails.evidence?.length && (
                  <p className="text-muted text-sm text-center py-lg">{t('case360.noEvidence', 'No evidence uploaded yet.')}</p>
                )}
              </div>
            </div>

            <div className="panel-box flex-1 wireframe-box registration-mark">
              <div className="flex-row justify-between align-center">
                <h4><Link2 size={16} className="text-amber" /> {t('case360.nexus', 'Criminal Nexus')}</h4>
                <button className="btn btn-ghost text-xs" onClick={() => { onClose(); setCurrentView('network'); }}>
                  {t('case360.analyzeNetwork', 'Full Graph')} <ChevronRight size={14} />
                </button>
              </div>
              <div className="nexus-placeholder mt-sm p-md text-center">
                <p className="text-sm opacity-70">
                  {caseDetails.accused?.length 
                    ? `Linked Suspect: ${caseDetails.accused[0].AccusedName} (${caseDetails.accused.length} active connection)`
                    : (i18n.language === 'kn' ? 'ಯಾವುದೇ ನೆಟ್‌ವರ್ಕ್ ಸಂಪರ್ಕ ಕಂಡುಬಂದಿಲ್ಲ.' : 'No cross-jurisdiction nexus identified yet.')}
                </p>
                <button 
                  className="btn btn-outline text-xs mt-md"
                  onClick={() => { onClose(); setCurrentView('network'); }}
                >
                  {t('case360.analyzeNetwork', 'Analyze Criminal Network')}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Evidence Preview Modal */}
      {selectedEvidence && (
        <div className="search-modal-overlay" onClick={() => setSelectedEvidence(null)}>
          <div className="search-modal glass-panel" onClick={e => e.stopPropagation()} style={{ padding: 24, maxWidth: 500 }}>
            <div className="flex-row justify-between align-center mb-md">
              <h3 className="flex-row align-center gap-sm">
                {getEvidenceIcon(selectedEvidence.EvidenceType)}
                Evidence Item #{selectedEvidence.EvidenceNumber}
              </h3>
              <button className="btn-icon" onClick={() => setSelectedEvidence(null)}><X size={20} /></button>
            </div>
            
            <div className="p-md glass-panel-inner rounded mb-md">
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Type</span>
                  <span className="value fw-bold text-cyan">{selectedEvidence.EvidenceType || 'Document'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Date Collected</span>
                  <span className="value">{selectedEvidence.CollectionDate || 'N/A'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Collected By</span>
                  <span className="value">{selectedEvidence.CollectedBy || 'Investigating Team'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Chain of Custody</span>
                  <span className="value text-emerald fw-bold">Verified</span>
                </div>
              </div>
            </div>

            <div className="mb-md">
              <span className="label">Description & Facts</span>
              <p className="text-sm mt-xs leading-relaxed">{selectedEvidence.Description || 'No detailed description provided.'}</p>
            </div>

            <div className="p-md bg-dark rounded border border-cyan mb-md">
              <span className="label text-cyan flex-row align-center gap-xs">
                <Sparkles size={14} /> AI Analysis & OCR Extracted Metadata
              </span>
              <p className="text-xs mt-xs text-muted font-mono">
                {selectedEvidence.AiOcrText || 'Metadata index matched against regional crime database. High confidence indicator.'}
              </p>
            </div>

            <div className="flex-row justify-end gap-sm">
              <button className="btn btn-outline" onClick={() => setSelectedEvidence(null)}>{t('case360.close', 'Close')}</button>
              <button className="btn btn-primary" onClick={() => showToast('Evidence file requested from Stratus bucket')}>
                <Download size={16} /> {t('case360.downloadFile', 'Download File')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
