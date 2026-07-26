import React from 'react';
import { X, UserCheck, Calendar, MapPin } from 'lucide-react';

interface CaseDetailModalProps {
  caseObj: any | null;
  onClose: () => void;
}

export const CaseDetailModal: React.FC<CaseDetailModalProps> = ({ caseObj, onClose }) => {
  if (!caseObj) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-xl bg-[var(--surface)] h-full border-l p-6 overflow-y-auto space-y-6 shadow-2xl animate-in slide-in-from-right duration-200"
        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Official KSP Crime Record
            </span>
            <h2 className="text-base font-mono font-medium text-[var(--text-primary)]">
              FIR {caseObj.CrimeNo}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Facts Badge Row */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-[var(--bg-primary)] space-y-1" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Crime Category</div>
            <div className="font-medium">{caseObj.CrimeMajorHead}</div>
            <div className="text-[10px] text-blue-600">{caseObj.CrimeMinorHead}</div>
          </div>
          <div className="p-3 rounded-lg border bg-[var(--bg-primary)] space-y-1" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] text-[var(--text-muted)] uppercase">Case Status</div>
            <span className="inline-block px-2 py-0.5 text-[10px] rounded font-medium bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
              {caseObj.CaseStatus}
            </span>
          </div>
        </div>

        {/* Location & Officer */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{caseObj.PoliceStationName}</div>
              <div className="text-[var(--text-muted)]">{caseObj.DistrictName} (Lat: {caseObj.latitude}, Lng: {caseObj.longitude})</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">{caseObj.InvestigatingOfficer || 'Ins. Ramesh Kumar (KGID: 88412)'}</div>
              <div className="text-[var(--text-muted)]">Investigating Officer Assigned</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Registered: {caseObj.CrimeRegisteredDate}</div>
              <div className="text-[var(--text-muted)]">Incident Date: {caseObj.IncidentFromDate}</div>
            </div>
          </div>
        </div>

        {/* Legal Act & Sections */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Legal Acts & Sections Charged
          </h3>
          <div className="p-3 rounded-lg border bg-[var(--bg-primary)] text-xs font-mono text-amber-700 dark:text-amber-300 font-medium" style={{ borderColor: 'var(--border)' }}>
            {caseObj.ActSections || 'IPC 392, IPC 457, IPC 380'}
          </div>
        </div>

        {/* Brief Facts */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Brief Facts & Case Summary
          </h3>
          <div className="p-4 rounded-lg border bg-[var(--bg-primary)] text-xs leading-relaxed text-[var(--text-secondary)]" style={{ borderColor: 'var(--border)' }}>
            {caseObj.BriefFacts}
          </div>
        </div>
      </div>
    </div>
  );
};
