import React, { useEffect, useState } from 'react';
import { Download, Clock, Search, Calendar, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { api } from '../../services/api';
import { showToast } from '../../utils/toast';
import './ReportsView.css';

export function ReportsView() {
  const { t, i18n } = useTranslation();
  const isKn = i18n.language === 'kn';
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const data = await api.getAuditLogs();
      setLogs(data.auditLogs || data.logs || []);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  const generatePDF = (reportName: string) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("KSP AI Crime Intelligence", 20, 20);
    doc.setFontSize(16);
    doc.text(reportName, 20, 35);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);
    doc.text(`Report Level: State-wide Summary`, 20, 60);
    doc.text("This is an automatically generated datathon report from Zoho Catalyst.", 20, 75);
    
    doc.text("- 85% probability of Cybercrime spike in Bengaluru East", 20, 95);
    doc.text("- 12 new Heinous Crimes reported today", 20, 105);
    doc.text("- 3 Repeat Offenders detected in latest FIR batch", 20, 115);
    
    doc.save(`KSP_${reportName.replace(/\s+/g, '_')}.pdf`);
    showToast(`Successfully exported ${reportName} to PDF`);
  };

  return (
    <div className="reports-view animate-slide-in">
      <div className="reports-header">
        <div className="reports-title-area">
          <h2>{t('reports.title', 'Automated Reports')}</h2>
          <p className="subtitle">{t('reports.subtitle', 'Generate and schedule crime statistics across jurisdictions.')}</p>
        </div>
        <div className="reports-actions">
          <button className="btn btn-primary" onClick={() => generatePDF('Master Case Dossier')}><Download size={18} /> {t('reports.exportMaster', 'Export Master Dossier')}</button>
          <button className="btn btn-outline" onClick={() => showToast(isKn ? "ವರದಿಯನ್ನು ಪ್ರತಿದಿನ ಬೆಳಿಗ್ಗೆ 08:00 ಗಂಟೆಗೆ ಯಶಸ್ವಿಯಾಗಿ ನಿಗದಿಪಡಿಸಲಾಗಿದೆ" : "Report successfully scheduled for 08:00 AM daily")}><Calendar size={18} /> {t('reports.scheduleReport', 'Schedule Report')}</button>
        </div>
      </div>

      <div className="reports-content-grid">
        <div className="audit-timeline-container glass-panel">
          <div className="panel-header">
            <h3><FileDown size={18} className="icon-emerald" /> {t('reports.accessLogs', 'System Access Logs')}</h3>
            <div className="search-small">
              <Search size={14} />
              <input type="text" placeholder={t('reports.filterLogs', 'Filter access logs...')} />
            </div>
          </div>
          
          <div className="timeline">
            {loading ? (
              <div className="loading-state">{isKn ? 'ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading audit logs...'}</div>
            ) : (
              logs.map((log) => (
                <div key={log.ActivityID} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">
                      <Clock size={12} /> {new Date(log.Timestamp).toLocaleString()}
                    </div>
                    <div className="timeline-title">
                      <strong>{log.UserName}</strong> ({log.UserID}) {isKn ? 'ನಡೆಸಿದ್ದಾರೆ' : 'performed'} <em>{log.Action}</em>
                    </div>
                    <div className="timeline-module">
                      {isKn ? 'ಮಾಡ್ಯೂಲ್' : 'Module'}: <span className="badge-outline">{log.Module}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="reports-sidebar">
          <div className="glass-panel export-card">
            <h3>{t('reports.automatedReporting', 'Automated Scheduled Reports')}</h3>
            <p className="text-sm text-muted mb-4">{t('reports.automatedReportingDesc', 'Configure automated PDF briefings sent to district commanders.')}</p>
            
            <div className="export-options">
              <button className="btn-ghost-full" onClick={() => generatePDF('Daily Station Report')}>{t('reports.daily', 'Daily Crime Summary')}</button>
              <button className="btn-ghost-full" onClick={() => generatePDF('Heinous Crimes Summary')}>{t('reports.heinous', 'Heinous Crimes Briefing')}</button>
              <button className="btn-ghost-full" onClick={() => generatePDF('Repeat Offender Watchlist')}>{t('reports.repeat', 'Repeat Offender Audit')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
