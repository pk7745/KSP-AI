import React, { useEffect, useState } from 'react';
import { Shield, Clock, FileCheck, Award, Target, Activity, CheckCircle, AlertTriangle, Lightbulb, Bell, FileText, Briefcase, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../context/NavigationContext';
import { EditProfileModal } from '../../components/EditProfileModal';
import './OfficerPortalView.css';

export function OfficerPortalView() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const { openCase360 } = useNavigation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!user) return;
      try {
        const res = await api.getOfficerProfile(user.employeeId);
        setData(res);
      } catch (err) {
        console.error("Failed to load officer data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading || !data) {
    return <div className="loading-state">{i18n.language === 'kn' ? 'ಅಧಿಕಾರಿ ದತ್ತಾಂಶವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading Officer Intelligence...'}</div>;
  }

  const { profile, assignedCases, recentActivity } = data;

  // AI Recommendation Logic based on workload
  const caseCount = assignedCases.length;
  let aiRecommendation = '';
  if (caseCount > 8) {
    aiRecommendation = i18n.language === 'kn'
      ? `ಹೆಚ್ಚಿನ ಕಾರ್ಯಭಾರ ಪತ್ತೆಯಾಗಿದೆ (${caseCount} ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು). ದರವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಲು 2 ಪ್ರಕರಣಗಳನ್ನು ಕಿರಿಯ ಅಧಿಕಾರಿಗೆ ವರ್ಗಾಯಿಸಲು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.`
      : `High workload detected (${caseCount} active cases). Recommend transferring 2 non-heinous cases to a junior officer to maintain clearance rate.`;
  } else {
    aiRecommendation = i18n.language === 'kn'
      ? `ಕಾರ್ಯಭಾರ ಅತ್ಯುತ್ತಮವಾಗಿದೆ. ಎಫ್‌ಐಆರ್ ${assignedCases[0]?.CrimeNo || 'N/A'} ನ ಫೊರೆನ್ಸಿಕ್ ಪರಿಶೀಲನೆಗೆ ಆದ್ಯತೆ ನೀಡಿ.`
      : `Workload optimal. Prioritize FIR ${assignedCases[0]?.CrimeNo || 'N/A'} for forensic follow-up.`;
  }

  return (
    <div className="officer-portal animate-slide-in">
      {/* Top Profile Banner */}
      <div className="portal-header glass-panel">
        <div className="officer-profile">
          <div className="officer-avatar">
            <div className="avatar-placeholder bg-indigo">
              {profile.OfficerName.charAt(0)}
            </div>
          </div>
          <div>
            <div className="flex-row align-center gap-sm">
              <h2>{user?.name || profile.OfficerName}</h2>
              <button 
                className="btn btn-ghost p-xs text-cyan"
                onClick={() => setShowEditModal(true)}
                title={t('officerPortal.editProfile', 'Edit Profile')}
              >
                <Edit2 size={16} />
              </button>
            </div>
            <p className="subtitle">ID: {profile.OfficerID} | {user?.rank || profile.Rank} | {profile.DistrictName} {i18n.language === 'kn' ? 'ಜಿಲ್ಲೆ' : 'District'}</p>
          </div>
        </div>
        
        <div className="performance-metrics flex-row gap-lg">
          <div className="metric">
            <span className="metric-label">{t('officerPortal.convictionRate', 'Conviction Rate')}</span>
            <span className="metric-val text-emerald">89%</span>
          </div>
          <div className="metric">
            <span className="metric-label">{t('officerPortal.avgResolution', 'Avg. Resolution')}</span>
            <span className="metric-val text-cyan">42 {i18n.language === 'kn' ? 'ದಿನಗಳು' : 'Days'}</span>
          </div>
          <div className="metric">
            <span className="metric-label">{t('officerPortal.aiRiskScore', 'AI Risk Score')}</span>
            <span className="metric-val text-amber">{i18n.language === 'kn' ? 'ಕಡಿಮೆ' : 'Low'}</span>
          </div>
        </div>
      </div>

      <div className="portal-grid mt-lg">
        
        {/* Left Column: Daily Briefing Inbox */}
        <div className="portal-col main-col">
          <div className="glass-panel p-lg">
            <div className="flex-row align-center gap-sm mb-md">
              <Bell size={20} className="text-amber" />
              <h3>{t('officerPortal.dailyBriefing', 'Daily Intelligence Briefing')}</h3>
            </div>
            
            <div className="briefing-list">
              <div className="briefing-item alert">
                <AlertTriangle size={18} className="text-crimson mt-xs" />
                <div>
                  <strong>{i18n.language === 'kn' ? 'ಮುಂಬರುವ ನ್ಯಾಯಾಲಯದ ವಿಚಾರಣೆ' : 'Upcoming Court Hearing'}</strong>
                  <p className="text-sm mt-xs">
                    {i18n.language === 'kn'
                      ? 'ಎಫ್‌ಐಆರ್ KSP/BLR/2026/0145 ವಿಚಾರಣೆ ನಾಳೆ ಬೆಳಿಗ್ಗೆ 10:30 ಕ್ಕೆ ನಿಗದಿಯಾಗಿದೆ.'
                      : 'FIR KSP/BLR/2026/0145 hearing is scheduled for tomorrow at 10:30 AM. Ensure Chargesheet is printed.'
                    }
                  </p>
                </div>
              </div>
              
              <div className="briefing-item action">
                <FileCheck size={18} className="text-cyan mt-xs" />
                <div>
                  <strong>{i18n.language === 'kn' ? 'ಸಾಕ್ಷ್ಯ ಒಸಿಆರ್ ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Evidence OCR Completed'}</strong>
                  <p className="text-sm mt-xs">
                    {i18n.language === 'kn'
                      ? 'ಎಐ "Bank_Statement.pdf" ನಿಂದ ಪಠ್ಯವನ್ನು ಹೊರತೆಗೆದಿದೆ. 3 ಅನುಮಾನಾಸ್ಪದ ವಹಿವಾಟುಗಳನ್ನು ಗುರುತಿಸಲಾಗಿದೆ.'
                      : 'AI has finished extracting text from "Bank_Statement.pdf". 3 suspicious transactions flagged.'
                    }
                  </p>
                </div>
              </div>

              <div className="briefing-item ai">
                <Lightbulb size={18} className="text-indigo mt-xs" />
                <div>
                  <strong>{i18n.language === 'kn' ? 'ಎಐ ಶಿಫಾರಸು' : 'AI Recommendation'}</strong>
                  <p className="text-sm mt-xs">{aiRecommendation}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-lg mt-md">
            <div className="flex-row align-center gap-sm mb-md">
              <Briefcase size={20} className="text-cyan" />
              <h3>{t('officerPortal.activeCaseload', 'My Active Caseload')} ({assignedCases.length})</h3>
            </div>
            
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('officerPortal.firNumber', 'FIR Number')}</th>
                  <th>{t('officerPortal.registered', 'Registered')}</th>
                  <th>{t('officerPortal.status', 'Status')}</th>
                  <th>{t('officerPortal.action', 'Action')}</th>
                </tr>
              </thead>
              <tbody>
                {assignedCases.map((c: any) => (
                  <tr key={c.CrimeNo}>
                    <td className="fw-bold">{c.CrimeNo}</td>
                    <td>{new Date(c.CrimeRegisteredDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${c.CaseStatus === 'Under Investigation' ? 'badge-amber' : 'badge-emerald'}`}>
                        {String(t(`cases.statuses.${c.CaseStatus}`, c.CaseStatus))}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-ghost text-sm"
                        onClick={() => openCase360(c.CaseMasterID)}
                      >
                        {t('officerPortal.openWorkspace', 'Open Workspace')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="portal-col side-col">
          <div className="glass-panel p-lg h-full">
            <div className="flex-row align-center gap-sm mb-md">
              <Activity size={20} className="text-emerald" />
              <h3>{t('officerPortal.recentActivity', 'Recent System Activity')}</h3>
            </div>
            
            <div className="vertical-timeline mini">
              {recentActivity.map((act: any) => (
                <div key={act.LogID} className="vt-item">
                  <div className="vt-dot bg-cyan"></div>
                  <div className="vt-content">
                    <span className="vt-date">{new Date(act.Timestamp).toLocaleString()}</span>
                    <p className="text-sm fw-bold">{act.Action}</p>
                    <p className="text-xs opacity-70">Case: {act.CaseID} • Module: {act.Module}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-muted text-sm text-center py-lg">{i18n.language === 'kn' ? 'ಯಾವುದೇ ಚಟುವಟಿಕೆ ಇಲ್ಲ.' : 'No recent activity logged.'}</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {showEditModal && <EditProfileModal onClose={() => setShowEditModal(false)} />}
    </div>
  );
}
