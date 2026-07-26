import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Key, Clock, CheckCircle, Lock, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { showToast } from '../utils/toast';
import { useAuth } from '../context/AuthContext';
import './EditProfileModal.css'; // Reuse sleek glass modal styles

interface EmergencyAccessModalProps {
  onClose: () => void;
}

export function EmergencyAccessModal({ onClose }: EmergencyAccessModalProps) {
  const { user } = useAuth();
  const [officerId, setOfficerId] = useState('OFF002');
  const [caseId, setCaseId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [reason, setReason] = useState('Special Multi-District Taskforce Assignment');
  const [submitting, setSubmitting] = useState(false);
  const [activeGrants, setActiveGrants] = useState<any[]>([]);
  const [loadingGrants, setLoadingGrants] = useState(true);

  const fetchGrants = async () => {
    try {
      setLoadingGrants(true);
      const res = await api.listEmergencyAccess();
      if (Array.isArray(res)) {
        setActiveGrants(res);
      } else if (res && res.accessLogs) {
        setActiveGrants(res.accessLogs);
      }
    } catch (err) {
      console.error('Failed to load emergency grants:', err);
    } finally {
      setLoadingGrants(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.grantEmergencyAccess({
        grantedToOfficerId: officerId,
        caseId: caseId.trim() || undefined,
        districtId: districtId.trim() || undefined,
        permissionType: 'FULL',
        reason,
        durationHours: Number(durationHours)
      });
      showToast(`Emergency access granted to Officer ${officerId} for ${durationHours}h`);
      fetchGrants();
      setCaseId('');
    } catch (err: any) {
      showToast(err.message || 'Failed to grant emergency access');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (accessId: string) => {
    try {
      await api.revokeEmergencyAccess(accessId);
      showToast('Emergency access override revoked');
      fetchGrants();
    } catch (err: any) {
      showToast('Failed to revoke access');
    }
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal glass-panel" onClick={e => e.stopPropagation()} style={{ maxWidth: 650, padding: 28 }}>
        
        {/* Header */}
        <div className="flex-row justify-between align-center mb-md border-bottom pb-sm">
          <div className="flex-row align-center gap-sm">
            <ShieldAlert size={24} className="text-crimson" />
            <div>
              <h3 className="font-heading text-lg">Emergency Access Management</h3>
              <p className="text-muted text-xs">Grant temporary cross-jurisdictional overrides (Catalyst Data Store)</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Grant Form */}
        <form onSubmit={handleGrantAccess} className="mb-lg p-md glass-panel-inner rounded">
          <h4 className="text-cyan font-sm mb-sm flex-row align-center gap-xs">
            <Key size={16} /> Issue Emergency Jurisdiction Override
          </h4>

          <div className="grid grid-cols-2 gap-sm">
            <div className="form-group">
              <label className="text-xs">Target Officer ID</label>
              <input 
                type="text" 
                className="input-glass" 
                value={officerId}
                onChange={e => setOfficerId(e.target.value)}
                placeholder="e.g. OFF002"
                required
              />
            </div>
            <div className="form-group">
              <label className="text-xs">Duration (Hours)</label>
              <select 
                className="input-glass" 
                value={durationHours}
                onChange={e => setDurationHours(Number(e.target.value))}
              >
                <option value={12}>12 Hours</option>
                <option value={24}>24 Hours (1 Day)</option>
                <option value={48}>48 Hours (2 Days)</option>
                <option value={72}>72 Hours (3 Days)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="text-xs">Specific FIR / Case ID (Optional)</label>
              <input 
                type="text" 
                className="input-glass" 
                value={caseId}
                onChange={e => setCaseId(e.target.value)}
                placeholder="e.g. KSP/DIS002/2026/0001"
              />
            </div>
            <div className="form-group">
              <label className="text-xs">Specific District ID (Optional)</label>
              <input 
                type="text" 
                className="input-glass" 
                value={districtId}
                onChange={e => setDistrictId(e.target.value)}
                placeholder="e.g. DIS002 (Mysuru)"
              />
            </div>
          </div>

          <div className="form-group mt-sm">
            <label className="text-xs">Justification & Reason</label>
            <input 
              type="text" 
              className="input-glass" 
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Multi-jurisdiction inter-state investigation"
              required
            />
          </div>

          <div className="flex-row justify-end mt-md">
            <button type="submit" className="btn btn-primary text-xs" disabled={submitting}>
              {submitting ? 'Granting Override...' : 'Grant Emergency Access'}
            </button>
          </div>
        </form>

        {/* Active Overrides */}
        <div>
          <h4 className="text-sm font-bold mb-xs">Active & Recorded Emergency Overrides</h4>
          {loadingGrants ? (
            <p className="text-xs text-muted">Loading access records...</p>
          ) : (
            <div className="max-h-48 overflow-y-auto space-y-xs">
              {activeGrants.map((g: any, idx: number) => (
                <div key={g.AccessID || g.ROWID || idx} className="p-sm glass-panel-inner rounded flex-row justify-between align-center text-xs">
                  <div>
                    <span className="fw-bold text-cyan">{g.GrantedToOfficerID}</span>
                    <span className="text-muted ml-xs">granted by {g.GrantedByOfficerID}</span>
                    <div className="text-muted mt-xs">
                      Reason: {g.Reason} | Expires: {g.ExpiresAt ? new Date(g.ExpiresAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                  <div className="flex-row align-center gap-xs">
                    <span className={`badge ${g.Status === 'Active' ? 'badge-emerald' : 'badge-crimson'}`}>
                      {g.Status || 'Active'}
                    </span>
                    {g.Status === 'Active' && (
                      <button 
                        className="btn btn-ghost text-xs text-crimson" 
                        onClick={() => handleRevoke(g.ROWID || g.AccessID)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {activeGrants.length === 0 && (
                <p className="text-xs text-muted py-sm text-center">No active emergency overrides issued.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
