import React, { useEffect, useState } from 'react';
import { Download, Shield, Clock, Search, Calendar, FileDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { api } from '../../services/api';
import { showToast } from '../../utils/toast';
import './ReportsView.css';

export function ReportsView() {
  const { t } = useTranslation();
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
    
    // Some mock data rows
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
          <h2>{t('reports.title')}</h2>
          <p className="subtitle">{t('reports.subtitle')}</p>
        </div>
        <div className="reports-actions">
          <button className="btn btn-primary" onClick={() => generatePDF('Master Case Dossier')}><Download size={18} /> {t('reports.exportMaster')}</button>
          <button className="btn btn-outline" onClick={() => showToast(t('reports.logs.success') || "Report successfully scheduled for 08:00 AM daily")}><Calendar size={18} /> {t('reports.scheduleReport')}</button>
        </div>
      </div>

      <div className="reports-content-grid">
        <div className="audit-timeline-container glass-panel">
          <div className="panel-header">
            <h3><FileDown size={18} className="icon-emerald" /> {t('reports.accessLogs')}</h3>
            <div className="search-small">
              <Search size={14} />
              <input type="text" placeholder={t('reports.filterLogs')} />
            </div>
          </div>
          
          <div className="timeline">
            {loading ? (
              <div className="loading-state">{t('reports.loading')}</div>
            ) : (
              logs.map((log) => (
                <div key={log.ActivityID} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-time">
                      <Clock size={12} /> {new Date(log.Timestamp).toLocaleString()}
                    </div>
                    <div className="timeline-title">
                      <strong>{log.UserName}</strong> ({log.UserID}) {t('reports.performed')} <em>{log.Action}</em>
                    </div>
                    <div className="timeline-module">
                      {t('reports.module')}: <span className="badge-outline">{log.Module}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="reports-sidebar">
          <div className="glass-panel export-card">
            <h3>{t('reports.automatedReporting')}</h3>
            <p className="text-sm text-muted mb-4">{t('reports.automatedReportingDesc')}</p>
            
            <div className="export-options">
              <button className="btn-ghost-full" onClick={() => generatePDF('Daily Station Report')}>{t('reports.daily')}</button>
              <button className="btn-ghost-full" onClick={() => generatePDF('Heinous Crimes Summary')}>{t('reports.heinous')}</button>
              <button className="btn-ghost-full" onClick={() => generatePDF('Repeat Offender Watchlist')}>{t('reports.repeat')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
