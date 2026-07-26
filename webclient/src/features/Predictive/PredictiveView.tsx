import React, { useState } from 'react';
import { Target, TrendingUp, AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../utils/toast';
import './PredictiveView.css';

export function PredictiveView() {
  const { t } = useTranslation();
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [heatmapKey, setHeatmapKey] = useState(0);
  const [showExplainAI, setShowExplainAI] = useState(false);

  const handleRecalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
      setHeatmapKey(prev => prev + 1); // Force re-render of heatmap to shuffle colors
      showToast(t('reports.logs.success') || "Risk models updated successfully!");
    }, 1500);
  };
  
  return (
    <div className="predictive-view animate-slide-in">
      <div className="predictive-header">
        <div className="predictive-title-area">
          <h2>{t('predictive.title')}</h2>
          <p className="subtitle">{t('predictive.subtitle')}</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleRecalculate}
          disabled={isRecalculating}
        >
          <Target size={18} className={isRecalculating ? "spin" : ""} /> 
          {isRecalculating ? t('cases.drawer.loading') : t('predictive.recalculate')}
        </button>
      </div>

      <div className="predictive-content">
        <div className="predictive-grid">
          {/* Early Warning Panel */}
          <div className="glass-panel predictive-panel">
            <div className="panel-header">
              <h3><AlertTriangle size={18} className="icon-amber" /> {t('predictive.earlyWarning')}</h3>
            </div>
            <div className="panel-body">
              <div className="warning-card critical">
                <div className="warning-header">
                  <strong>{t('predictive.alerts.cyberSpike')}</strong>
                  <span className="badge-outline">98% {t('predictive.probability')}</span>
                </div>
                <p>{t('predictive.alerts.cyberDesc')}</p>
                <button className="btn btn-ghost text-sm" style={{marginTop: 8}} onClick={() => setShowExplainAI(true)}>
                  <Info size={14} /> Explain AI Decision
                </button>
              </div>

              <div className="warning-card high mt-4">
                <div className="warning-header">
                  <strong>{t('predictive.alerts.theftCluster')}</strong>
                  <span className="badge-outline">72% {t('predictive.probability')}</span>
                </div>
                <p>{t('predictive.alerts.theftDesc')}</p>
              </div>
            </div>
          </div>

          {/* Resource Allocation */}
          <div className="glass-panel predictive-panel">
            <div className="panel-header">
              <h3><ShieldCheck size={18} className="icon-emerald" /> {t('predictive.patrol')}</h3>
            </div>
            <div className="panel-body">
              <div className="allocation-item">
                <div className="allocation-header">
                  <strong>{t('predictive.recommendations.hoysala')}</strong>
                  <span className="badge-outline">{t('predictive.highPriority')}</span>
                </div>
                <p>{t('predictive.recommendations.hoysalaDesc')}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: '85%', background: 'var(--accent-amber)' }}></div>
                </div>
              </div>

              <div className="allocation-item">
                <div className="allocation-header">
                  <strong>{t('predictive.recommendations.beat')}</strong>
                  <span className="badge-outline">{t('predictive.modPriority')}</span>
                </div>
                <p>{t('predictive.recommendations.beatDesc')}</p>
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: '60%', background: 'var(--accent-cyan)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Temporal Trends */}
        <div className="glass-panel predictive-panel temporal-panel">
          <div className="panel-header">
            <h3><TrendingUp size={18} className="icon-cyan" /> {t('predictive.temporalRisk')}</h3>
          </div>
          <div className="heatmap-mock" key={heatmapKey}>
            {/* Mock heatmap visual */}
            <div className="heatmap-row">
              <span>{t('predictive.days.mon')}</span>
              <div className={`heat-cell ${['low', 'med'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['low', 'med'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['low', 'med', 'high'][Math.floor(Math.random() * 3)]}`}></div>
              <div className={`heat-cell ${['low', 'med'][Math.floor(Math.random() * 2)]}`}></div>
            </div>
            <div className="heatmap-row">
              <span>{t('predictive.days.tue')}</span>
              <div className={`heat-cell ${['low', 'med'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell low`}></div>
              <div className={`heat-cell low`}></div>
              <div className={`heat-cell ${['low', 'med'][Math.floor(Math.random() * 2)]}`}></div>
            </div>
            <div className="heatmap-row">
              <span>{t('predictive.days.fri')}</span>
              <div className={`heat-cell ${['med', 'high'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['high', 'critical'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['critical', 'high'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['med', 'high'][Math.floor(Math.random() * 2)]}`}></div>
            </div>
            <div className="heatmap-row">
              <span>{t('predictive.days.sat')}</span>
              <div className={`heat-cell ${['med', 'high'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['critical', 'high'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['critical', 'high'][Math.floor(Math.random() * 2)]}`}></div>
              <div className={`heat-cell ${['high', 'med'][Math.floor(Math.random() * 2)]}`}></div>
            </div>
            <div className="heatmap-legend">
              <span>{t('predictive.lowRisk')}</span>
              <div className="legend-gradient"></div>
              <span>{t('predictive.highRisk')}</span>
            </div>
          </div>
        </div>
      </div>

    {/* Explainable AI Slide Panel */}
    {showExplainAI && (
      <>
        <div className="xai-overlay" onClick={() => setShowExplainAI(false)}></div>
        <div className="xai-panel glass-panel">
          <div className="xai-header">
            <h3><Info size={18} className="icon-cyan" /> {t('predictive.xaiTitle', 'Explainable AI — Decision Rationale')}</h3>
            <button className="btn-icon" onClick={() => setShowExplainAI(false)}><X size={20} /></button>
          </div>
          <div className="xai-body">
            <div className="xai-section">
              <h4>{t('predictive.xaiPred', 'Prediction: Cyber Fraud Spike (98% Confidence)')}</h4>
              <p className="text-muted">{t('predictive.xaiDesc', 'The AI model analyzed 12 features across 3 years of CCTNS data.')}</p>
            </div>
            <div className="xai-section">
              <h4>{t('predictive.xaiFactors', 'Top Contributing Factors')}</h4>
              <div className="xai-factor">
                <div className="xai-factor-bar">
                  <span>{t('predictive.xaiF1', 'Historical Trend (same month, last 3 years)')}</span>
                  <div className="xai-bar-track"><div className="xai-bar-fill" style={{width: '92%', background: 'var(--accent-crimson)'}}></div></div>
                  <span className="xai-pct">92%</span>
                </div>
              </div>
              <div className="xai-factor">
                <div className="xai-factor-bar">
                  <span>{t('predictive.xaiF2', 'Upcoming IT Corridor Salary Cycle')}</span>
                  <div className="xai-bar-track"><div className="xai-bar-fill" style={{width: '78%', background: 'var(--accent-amber)'}}></div></div>
                  <span className="xai-pct">78%</span>
                </div>
              </div>
              <div className="xai-factor">
                <div className="xai-factor-bar">
                  <span>{t('predictive.xaiF3', 'Recent surge in phishing domain registrations')}</span>
                  <div className="xai-bar-track"><div className="xai-bar-fill" style={{width: '65%', background: 'var(--accent-amber)'}}></div></div>
                  <span className="xai-pct">65%</span>
                </div>
              </div>
              <div className="xai-factor">
                <div className="xai-factor-bar">
                  <span>{t('predictive.xaiF4', 'Arrest of key syndicate member created power vacuum')}</span>
                  <div className="xai-bar-track"><div className="xai-bar-fill" style={{width: '51%', background: 'var(--accent-cyan)'}}></div></div>
                  <span className="xai-pct">51%</span>
                </div>
              </div>
            </div>
            <div className="xai-section">
              <h4>{t('predictive.xaiModel', 'AI Model Information')}</h4>
              <div className="xai-meta">
                <span>Model: Gemini 2.5 Flash + CatBoost Ensemble</span>
                <span>Training Data: 2.4M Karnataka FIRs (2020–2026)</span>
                <span>Last Retrained: 2026-07-22</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
}
