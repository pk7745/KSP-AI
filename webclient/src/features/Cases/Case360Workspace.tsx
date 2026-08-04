import React, { useState } from 'react';
import { X, Clock, FileText, User, ShieldAlert, Sparkles, Download, CheckSquare, Square, Link2, Lightbulb, Heart, Image, FileVideo, FileAudio, File, ChevronRight, Activity, MapPin, Scale, Eye, Users, Lock } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../utils/toast';
import { useNavigation } from '../../context/NavigationContext';
import './Case360.css';

const translateValue = (val: string, isKn: boolean) => {
  if (!isKn || !val) return val;
  const map: Record<string, string> = {
    'Safe & Recovered': 'ಸುರಕ್ಷಿತ ಮತ್ತು ಚೇತರಿಸಿಕೊಂಡಿದ್ದಾರೆ',
    'Safe': 'ಸುರಕ್ಷಿತ',
    'Deceased': 'ಮೃತಪಟ್ಟಿದ್ದಾರೆ',
    'Critical': 'ಗಂಭೀರ ಸ್ಥಿತಿ',
    'Mild': 'ಸಾಮಾನ್ಯ ಗಾಯ',
    'Minor': 'ಸಾಮಾನ್ಯ ಗಾಯ',
    'Fatal': 'ಮಾರಕ ಗಾಯ',
    'Under Investigation': 'ತನಿಖೆಯಲ್ಲಿದೆ',
    'Charge Sheeted': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
    'Arrested': 'ಬಂಧಿಸಲಾಗಿದೆ',
    'Bail Rejected': 'ಜಾಮೀನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    'Judicial Custody': 'ನ್ಯಾಯಾಂಗ ಬಂಧನ',
    'Not in Custody': 'ಬಂಧನದಲ್ಲಿಲ್ಲ',
    'None': 'ಯಾವುದೂ ಇಲ್ಲ',
    'Victim': 'ಸಂತ್ರಸ್ತರು',
    'Eyewitness': 'ಪ್ರತ್ಯಕ್ಷದರ್ಶಿ'
  };

  let res = String(val);
  Object.keys(map).forEach(k => {
    if (res.includes(k)) {
      res = res.replaceAll(k, map[k]);
    }
  });

  res = res.replaceAll('Missing Person reported at', 'ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿಯ ಪ್ರಕರಣ ದಾಖಲಾಗಿದೆ:')
           .replaceAll('Brief: Trace & locate missing citizen petition.', 'ವಿವರ: ಕಾಣೆಯಾದ ಸಾರ್ವಜನಿಕರನ್ನು ಪತ್ತೆಹಚ್ಚುವ ಅರ್ಜಿ.')
           .replaceAll('Incident occurred near', 'ಘಟನೆಯು ಸಮೀಪ ಸಂಭವಿಸಿದೆ:')
           .replaceAll('Karnataka', 'ಕರ್ನಾಟಕ')
           .replaceAll('High-value tech warehouse burglary', 'ತಂತ್ರಜ್ಞಾನ ಗೋದಾಮಿನಲ್ಲಿ ಹೆಚ್ಚಿನ ಮೌಲ್ಯದ ಕಳ್ಳತನ')
           .replaceAll('Victim defrauded of', 'ಸಂತ್ರಸ್ತರಿಗೆ ವಂಚಿಸಲಾಗಿದೆ')
           .replaceAll('through fake electricity bill payment link sent via WhatsApp.', 'ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಕಳುಹಿಸಲಾದ ನಕಲಿ ವಿದ್ಯುತ್ ಬಿಲ್ ಲಿಂಕ್ ಮೂಲಕ.')
           .replaceAll('Fraudulent account traced to Jamtara module.', 'ವಂಚನೆಯ ಖಾತೆಯನ್ನು ಜಮ್ತಾರಾ ಮಾಡ್ಯೂಲ್‌ಗೆ ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ.');

  return res;
};

export function Case360Workspace({ caseDetails, onClose }: { caseDetails: any, onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const { setCurrentView } = useNavigation();
  const [selectedEvidence, setSelectedEvidence] = useState<any | null>(null);
  const isKn = i18n.language === 'kn';

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
              {isKn
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

  const cd = caseDetails?.caseDetails || caseDetails || {};
  const victims = caseDetails?.victims || caseDetails?.Victims || [];
  const accused = caseDetails?.accused || caseDetails?.Accused || [];
  const evidence = caseDetails?.evidence || caseDetails?.Evidence || [];
  const witnesses = caseDetails?.witnesses || caseDetails?.Witnesses || [];

  const [checklist, setChecklist] = useState([
    { id: 1, text: isKn ? 'ಸಾಕ್ಷಿಗಳ ಹೇಳಿಕೆಯನ್ನು ದಾಖಲಿಸಿ' : 'Record witness statements', done: true },
    { id: 2, text: isKn ? 'ಘಟನಾ ಸ್ಥಳದಿಂದ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿ ಸಂಗ್ರಹಿಸಿ' : 'Collect CCTV footage from scene', done: true },
    { id: 3, text: isKn ? 'ಫೊರೆನ್ಸಿಕ್ ಮಾದರಿಗಳನ್ನು ಪ್ರಯೋಗಾಲಯಕ್ಕೆ ಕಳುಹಿಸಿ' : 'Send forensic samples to lab', done: false },
    { id: 4, text: isKn ? 'ಮುಖ್ಯ ಶಂಕಿತನ ವಿವರ ಪರಿಶೀಲಿಸಿ' : 'Verify alibi of primary suspect', done: false }
  ]);

  const toggleCheckItem = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const generateCaseBrief = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('KSP AI — Intelligence Report', 20, 20);
    doc.setFontSize(14);
    doc.text(`FIR: ${cd.CrimeNo || cd.CrimeNumber || 'N/A'}`, 20, 35);
    doc.text(`Status: ${cd.CaseStatus || 'Under Investigation'}`, 20, 45);
    doc.setFontSize(11);
    const briefLines = doc.splitTextToSize(cd.BriefFacts || '', 170);
    doc.text(briefLines, 20, 60);
    doc.save(`KSP_Intelligence_${String(cd.CrimeNo || cd.CrimeNumber || 'case').replace(/\//g, '_')}.pdf`);
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

  const crimeNo = cd.CrimeNo || cd.CrimeNumber || 'KSP/DIS001/2026/00001';
  const stationName = cd.PoliceStationName || cd.PoliceStation || 'Cubbon Park PS';
  const districtName = cd.DistrictName || cd.District || 'Bengaluru Urban';
  const crimeHead = cd.CrimeMajorHead || 'Homicide / Offense';
  const caseStatus = cd.CaseStatus || 'Under Investigation';

  return (
    <div className="case-360-overlay animate-fade-in">
      <div className="case-360-container animate-slide-up">
        {/* Header Bar */}
        <div className="workspace-header">
          <div className="flex-row align-center gap-md">
            <button className="btn-icon" onClick={onClose}><X size={24} /></button>
            <div>
              <div className="flex-row align-center gap-sm">
                <h2 className="workspace-title">{crimeNo}</h2>
                <span className={`status-badge ${caseStatus === 'Under Investigation' ? 'badge-amber' : 'badge-emerald'}`}>
                  {translateValue(caseStatus, isKn)}
                </span>
              </div>
              <p className="text-muted mt-xs">
                <MapPin size={14} className="inline-icon" /> {translateValue(districtName, isKn)} • {translateValue(stationName, isKn)} | 
                <Scale size={14} className="inline-icon ml-md" /> {translateValue(crimeHead, isKn)}
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
              <p className="mt-sm leading-relaxed">{translateValue(cd.BriefFacts || 'Brief facts filed in CCTNS CaseMaster.', isKn)}</p>
              
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
                    {isKn
                      ? `${translateValue(districtName, true)} ಸರಹದ್ದಿನಲ್ಲಿ ಈ ಪ್ರಕರಣದ ಮಾದರಿಯು ಸಕ್ರಿಯ ಅಪರಾಧ ಗುಂಪುಗಳೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದೆ. ಸಿಸಿಟಿವಿ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ನಾನು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ.`
                      : `Based on the MO and registered sections, this case pattern correlates with active crime clusters in ${districtName}. I recommend reviewing CCTV evidence and checking tower dump logs.`
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
                <h5 className="text-crimson font-sm mb-xs">{t('case360.accused', 'ACCUSED')} ({accused.length})</h5>
                {accused.map((a: any, idx: number) => (
                  <div 
                    key={a.AccusedID || idx} 
                    className="entity-card accused-card clickable"
                    onClick={navigateToPeople}
                    title="Click to view in People CRM"
                  >
                    <ShieldAlert size={16} className="text-crimson" />
                    <div className="flex-1">
                      <strong>{a.AccusedName || 'Suspect'}</strong> ({a.Age || 'N/A'}{isKn ? ' ವರ್ಷ' : 'y'})
                      <div className="text-xs text-muted">{translateValue(a.ArrestStatus || 'Under Investigation', isKn)}</div>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))}
                {!accused.length && (
                  <p className="text-muted text-xs py-xs">{t('case360.noAccused', 'No accused recorded.')}</p>
                )}

                <h5 className="text-cyan font-sm mt-md mb-xs">{t('case360.victims', 'VICTIMS')} ({victims.length})</h5>
                {victims.map((v: any, idx: number) => (
                  <div 
                    key={v.VictimID || idx} 
                    className="entity-card victim-card clickable"
                    onClick={navigateToPeople}
                    title="Click to view in People CRM"
                  >
                    <User size={16} className="text-cyan" />
                    <div className="flex-1">
                      <strong>{v.VictimName || 'Victim'}</strong> ({v.Age || 'N/A'}{isKn ? ' ವರ್ಷ' : 'y'})
                      <div className="text-xs text-muted">{translateValue(v.VictimStatus || 'Victim', isKn)}</div>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))}
                {!victims.length && (
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
                    <p>{isKn ? `ಎಫ್‌ಐಆರ್ ದಾಖಲಿಸಲಾಗಿದೆ: ${translateValue(stationName, true)}` : `FIR Registered at ${stationName}`}</p>
                  </div>
                </div>
                {evidence.length > 0 && (
                  <div className="vt-item">
                    <div className="vt-dot bg-emerald"></div>
                    <div className="vt-content">
                      <span className="vt-date">{isKn ? 'ಸಾಕ್ಷ್ಯಾಧಾರ ದಾಖಲಾಗಿದೆ' : 'Evidence Logged'}</span>
                      <p>{isKn ? `${evidence.length} ಸಾಕ್ಷ್ಯಗಳನ್ನು ಕ್ಯಾಟಲಿಸ್ಟ್‌ನಲ್ಲಿ ದಾಖಲಿಸಲಾಗಿದೆ` : `${evidence.length} items logged in Stratus storage`}</p>
                    </div>
                  </div>
                )}
                {accused.length > 0 && (
                  <div className="vt-item">
                    <div className="vt-dot bg-crimson"></div>
                    <div className="vt-content">
                      <span className="vt-date">{isKn ? 'ಆರೋಪಿಯನ್ನು ಗುರುತಿಸಲಾಗಿದೆ' : 'Accused Identified'}</span>
                      <p>{accused[0].AccusedName} ({translateValue(accused[0].ArrestStatus || 'Accused', isKn)})</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 3: Evidence & Storage */}
          <div className="workspace-col">
            <div className="panel-box flex-1 wireframe-box registration-mark">
              <h4><FileText size={16} className="text-emerald" /> {t('case360.evidenceVault', 'Evidence Vault & Digital Media')} ({evidence.length})</h4>
              <div className="evidence-grid mt-md">
                {evidence.map((e: any, idx: number) => (
                  <div 
                    key={e.EvidenceID || idx} 
                    className="evidence-card clickable"
                    onClick={() => setSelectedEvidence(e)}
                  >
                    <div className="evidence-icon-wrapper">
                      {getEvidenceIcon(e.EvidenceType)}
                    </div>
                    <div className="evidence-meta">
                      <span className="evidence-title">{e.EvidenceNumber || e.EvidenceID || 'EV-001'}</span>
                      <span className="text-xs text-muted">{translateValue(e.EvidenceType || 'Document', isKn)}</span>
                    </div>
                  </div>
                ))}
                {!evidence.length && (
                  <p className="text-muted text-xs p-md">{t('case360.noEvidence', 'No digital evidence files cataloged.')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
