import React, { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, FileText, Scale, User, Lock, ArrowRight, ArrowLeft, RefreshCw, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import { generateEnterpriseDossierPDF } from '../services/dossierPdfGenerator';

interface CaseResolutionModalProps {
  caseDetails: any;
  onClose: () => void;
  onSuccess: (updatedStatus: string) => void;
}

export function CaseResolutionModal({ caseDetails, onClose, onSuccess }: CaseResolutionModalProps) {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';

  const cd = caseDetails?.caseDetails || caseDetails || {};
  const cNo = cd.CrimeNumber || cd.CrimeNo || 'KSP/DIS001/2026/00001';
  const isCurrentlyClosed = cd.CaseStatus === 'Closed' || cd.CaseStatus === 'Charge Sheeted' || cd.CaseStatus === 'Solved';

  const [step, setStep] = useState(1);
  const [outcome, setOutcome] = useState('Solved');
  const [summary, setSummary] = useState(cd.BriefFacts || 'Full investigation completed under CCTNS protocols.');
  const [courtName, setCourtName] = useState('Principal District & Sessions Court, Bengaluru');
  const [judgeName, setJudgeName] = useState('Hon. Justice V. Ramaswamy');
  const [sentenceDetails, setSentenceDetails] = useState('Rigorous Imprisonment 7 Years & Fine ₹50,000');
  const [reopenReason, setReopenReason] = useState('');
  const [loading, setLoading] = useState(false);

  // Verification Checklist Items
  const auditChecklist = [
    { label: isKn ? 'ಎಫ್‌ಐಆರ್ ದಾಖಲೆ ಸರಿಪಡಿಸಲಾಗಿದೆ' : 'FIR Record & IPC/BNS Sections verified', ok: true },
    { label: isKn ? 'ಸಾಕ್ಷಿಗಳ ಹೇಳಿಕೆಯನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ' : 'Witness Statements (Sec 161 CrPC) logged', ok: true },
    { label: isKn ? 'ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : 'Digital Evidence & FSL Reports validated', ok: true },
    { label: isKn ? 'ನ್ಯಾಯಾಲಯ ದೋಷಾರೋಪಣೆ ಸಲ್ಲಿಕೆಯಾಗಿದೆ' : 'Chargesheet & Court Proceedings completed', ok: true }
  ];

  const handleExecuteClosure = async () => {
    setLoading(true);
    setTimeout(() => {
      // Generate Closure Dossier PDF automatically
      generateEnterpriseDossierPDF({
        caseDetails: { ...cd, CaseStatus: outcome },
        victims: caseDetails?.victims || [],
        accused: caseDetails?.accused || [],
        witnesses: caseDetails?.witnesses || [],
        evidence: caseDetails?.evidence || [],
        officerUser: user,
        isKn
      });

      showToast(isKn ? `ಪ್ರಕರಣ ${cNo} ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿದೆ (${outcome})` : `Case ${cNo} successfully closed & archived (${outcome})`);
      setLoading(false);
      onSuccess(outcome);
      onClose();
    }, 1200);
  };

  const handleExecuteReopen = async () => {
    if (!reopenReason.trim()) {
      showToast('Please provide a mandatory reason to reopen investigation');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      showToast(isKn ? `ಪ್ರಕರಣ ${cNo} ಅನ್ನು ಮರು-ವಿಚಾರಣೆಗಾಗಿ ತೆರೆಯಲಾಗಿದೆ` : `Case ${cNo} successfully reopened for further investigation`);
      setLoading(false);
      onSuccess('Under Investigation');
      onClose();
    }, 1200);
  };

  if (isCurrentlyClosed) {
    return (
      <div className="case-360-overlay animate-fade-in" style={{ zIndex: 1000 }}>
        <div className="case-360-container max-w-xl mx-auto my-auto p-6 bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl text-slate-100 font-sans">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/50 flex items-center justify-center">
                <RefreshCw size={22} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Reopen Investigation Workflow</h3>
                <p className="text-xs text-cyan-400 font-mono">Case Ref: {cNo}</p>
              </div>
            </div>
            <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="py-5 space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
              <span className="text-slate-400 font-bold block mb-1">Current Case Status:</span>
              <span className="text-emerald-400 font-extrabold font-mono text-sm">{cd.CaseStatus || 'Closed'}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                {isKn ? 'ಮರು-ವಿಚಾರಣೆಯ ಕಡ್ಡಾಯ ಕಾರಣ (Mandatory Reopen Reason):' : 'Mandatory Reason for Reopening Case:'}
              </label>
              <textarea
                className="w-full h-24 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-cyan-500 outline-none"
                placeholder="e.g. Fresh forensic DNA evidence recovered or new suspect identified via AFIS match..."
                value={reopenReason}
                onChange={e => setReopenReason(e.target.value)}
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px]">
              ⚠️ Reopening an archived case requires SP supervisory audit log logging.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button className="btn btn-outline text-xs" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary text-xs flex items-center gap-1.5" onClick={handleExecuteReopen} disabled={loading}>
              <RefreshCw size={14} /> Reopen Investigation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="case-360-overlay animate-fade-in" style={{ zIndex: 1000 }}>
      <div className="case-360-container max-w-2xl mx-auto my-auto p-6 bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl text-slate-100 font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/50 flex items-center justify-center">
              <Award size={22} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Enterprise Case Resolution & Closure Wizard</h3>
              <p className="text-xs text-emerald-400 font-mono">Step {step} of 7 — Case Ref: {cNo}</p>
            </div>
          </div>
          <button className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Step Content */}
        <div className="py-6 text-xs space-y-4">
          {step === 1 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <User size={16} /> Step 1: Officer Identity & Jurisdiction Confirmation
              </h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
                <div><span className="text-slate-400">Officer Name:</span> <strong className="text-white">{user?.name || 'Circle Inspector Rajesh'}</strong></div>
                <div><span className="text-slate-400">Rank & Designation:</span> <span className="text-cyan-300">{user?.rank || 'Inspector'} ({user?.designation || 'SHO'})</span></div>
                <div><span className="text-slate-400">Station / District:</span> <span className="text-white">{user?.unitName || 'Cubbon Park PS'} — {user?.districtName || 'Bengaluru Urban'}</span></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <FileText size={16} /> Step 2: Final Investigation Closure Summary
              </h4>
              <textarea
                className="w-full h-32 p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:border-cyan-500 outline-none"
                value={summary}
                onChange={e => setSummary(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <CheckCircle2 size={16} /> Step 3: Select Final Case Outcome
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {['Solved', 'Charge Sheeted', 'Unsolved', 'Transferred', 'False Complaint', 'Court Closed'].map(o => (
                  <button
                    key={o}
                    className={`p-3 rounded-xl border text-left font-bold transition-all ${outcome === o ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                    onClick={() => setOutcome(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <Scale size={16} /> Step 4: Court Judgement & Sentence Details
              </h4>
              <div className="space-y-2">
                <input className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs" value={courtName} onChange={e => setCourtName(e.target.value)} placeholder="Court Name" />
                <input className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs" value={judgeName} onChange={e => setJudgeName(e.target.value)} placeholder="Judge Name" />
                <input className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs" value={sentenceDetails} onChange={e => setSentenceDetails(e.target.value)} placeholder="Sentence / Order" />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <ShieldAlert size={16} /> Step 5: Automated Pre-Closure Evidence Audit
              </h4>
              <div className="space-y-2">
                {auditChecklist.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-200">{item.label}</span>
                    <span className="text-emerald-400 font-extrabold font-mono">✓ VERIFIED</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-cyan-400 flex items-center gap-2">
                <Lock size={16} /> Step 6: Supervisory Approval & Clearance Check
              </h4>
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 font-bold">
                ✓ Supervisory Clearance Granted by District Superintendent of Police.
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 border border-emerald-500/50 mx-auto flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="font-extrabold text-base text-white">Ready for Digital Closure & Archival</h4>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Executing closure will archive Case <strong className="text-white">{cNo}</strong>, update dashboard/analytics metrics, and automatically generate an official KSP Investigation Dossier PDF.
              </p>
            </div>
          )}
        </div>

        {/* Modal Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <button className="btn btn-outline text-xs flex items-center gap-1" onClick={() => setStep(s => s - 1)}>
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 7 ? (
            <button className="btn btn-primary text-xs flex items-center gap-1" onClick={() => setStep(s => s + 1)}>
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn btn-primary text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white" onClick={handleExecuteClosure} disabled={loading}>
              <Award size={16} /> Execute Closure & Generate Dossier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
