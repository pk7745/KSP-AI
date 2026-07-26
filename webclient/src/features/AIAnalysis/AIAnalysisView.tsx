import React, { useState, useEffect } from 'react';
import { 
  Brain, FileText, Target, AlertTriangle, ShieldAlert,
  Activity, CheckCircle2, ChevronRight, Fingerprint, 
  Users, CalendarClock, Download, RefreshCw, Send,
  MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import './AIAnalysisView.css';

export function AIAnalysisView() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{sender: 'user'|'ai', text: string}[]>([]);
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    // Simulate initial AI analysis generation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const handleAsk = async () => {
    if (!chatInput.trim() || asking) return;
    const q = chatInput;
    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setChatInput('');
    setAsking(true);

    try {
      // Determine language: if query contains Kannada script or language toggle is 'kn', pass 'kn'
      const isKn = i18n.language === 'kn' || /[\u0C80-\u0CFF]/.test(q) || q.toLowerCase().includes('kannada');
      const langParam = isKn ? 'kn' : 'en';

      const response = await api.chatWithGemini(q, [], langParam);
      const answerText = response.reply || response.answer || (isKn ? 'ಪ್ರಕರಣದ ವಿವರಣೆ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.' : 'Case analysis summary generated.');
      setChatLog(prev => [...prev, { sender: 'ai', text: answerText }]);
    } catch (err) {
      setChatLog(prev => [...prev, { 
        sender: 'ai', 
        text: i18n.language === 'kn' ? 'ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to retrieve AI analysis response.' 
      }]);
    } finally {
      setAsking(false);
    }
  };

  if (loading) {
    return (
      <div className="ai-analysis-loading">
        <Brain className="w-12 h-12 animate-pulse-glow" style={{ color: 'var(--accent-cyan)' }} />
        <h2>{t('ai.analyzing', 'AI Investigation Officer analyzing case records...')}</h2>
        <p>{t('ai.analyzingSub', 'Cross-referencing Victim, Witness, and Evidence data across Catalyst Data Store')}</p>
        <div className="loading-bar"><div className="loading-bar-fill"></div></div>
      </div>
    );
  }

  return (
    <div className="ai-analysis-view animate-in fade-in">
      <div className="ai-header">
        <div className="ai-header-left">
          <Brain className="icon-cyan" size={28} />
          <div>
            <h2>{t('ai.title', 'AI Investigation Analysis')}</h2>
            <p>{t('ai.subtitle', 'Selected Case: FIR 2026-104 (Whitefield PS)')}</p>
          </div>
        </div>
        <div className="ai-header-actions">
          <button className="btn-secondary" onClick={handleRefresh}>
            <RefreshCw size={16} />
            {t('ai.refresh', 'Refresh Analysis')}
          </button>
          <button className="btn-primary">
            <Download size={16} />
            {t('ai.exportBrief', 'Generate Case Brief')}
          </button>
        </div>
      </div>

      <div className="ai-grid">
        {/* SECTION 1: AI Case Summary */}
        <div className="ai-card span-2 glass-panel">
          <div className="ai-card-header">
            <h3><FileText size={16}/> {t('ai.summary', 'Case Summary')}</h3>
          </div>
          <div className="ai-summary-content">
            <p><strong>{t('ai.firRef', 'FIR 2026-104')}</strong> {t('ai.sum1', 'involves an organized vehicle theft.')}</p>
            <p>{t('ai.sum2', 'The incident occurred in Whitefield.')}</p>
            <p>{t('ai.sum3', 'Two suspects have been identified.')}</p>
            <p>{t('ai.sum4', 'Five witnesses have been interviewed.')}</p>
            <p>{t('ai.sum5', 'Three CCTV clips have been collected.')}</p>
            <p>{t('ai.sum6', 'One fingerprint remains unmatched.')}</p>
            <div className="ai-status-badge">
              <span>{t('ai.invStatus', 'Investigation Status:')}</span>
              <span className="badge-warning">{t('ai.underInv', 'Under Investigation')}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: AI Investigation Panel */}
        <div className="ai-card glass-panel">
          <div className="ai-card-header">
            <h3><Activity size={16}/> {t('ai.panel', 'Investigation Metrics')}</h3>
          </div>
          <div className="ai-metrics-grid">
            <div className="metric-box">
              <span>{t('ai.crimeClass', 'Crime Classification')}</span>
              <strong>{t('ai.vehicleTheft', 'Vehicle Theft')}</strong>
              <div className="conf"><CheckCircle2 size={12}/> {t('ai.conf', 'Confidence')} 96%</div>
            </div>
            <div className="metric-box risk-high">
              <span>{t('ai.riskLevel', 'Risk Level')}</span>
              <strong>HIGH</strong>
            </div>
            <div className="metric-box">
              <span>{t('ai.progress', 'Overall Progress')}</span>
              <strong>76%</strong>
              <div className="prog-bar"><div className="prog-fill" style={{width: '76%'}}></div></div>
            </div>
          </div>
          <div className="similar-cases">
            <h4>{t('ai.similarCases', 'Similar Cases Found')}</h4>
            <div className="similar-row"><span>FIR-1045</span> <span className="conf">91% {t('ai.match', 'Match')}</span></div>
            <div className="similar-row"><span>FIR-998</span> <span className="conf">86% {t('ai.match', 'Match')}</span></div>
          </div>
        </div>

        {/* SECTION 3: AI Recommendations */}
        <div className="ai-card glass-panel">
          <div className="ai-card-header">
            <h3><Target size={16}/> {t('ai.recommendations', 'Recommended Next Steps')}</h3>
            <span className="badge-danger">HIGH PRIORITY</span>
          </div>
          <div className="ai-recs">
            <div className="rec-item">
              <div className="rec-text">• {t('ai.rec1', 'Collect CCTV footage from MG Road.')}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {t('ai.why1', 'CCTV evidence is currently incomplete.')}</div>
            </div>
            <div className="rec-item">
              <div className="rec-text">• {t('ai.rec2', 'Verify mobile tower records.')}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {t('ai.why2', 'Witness statements conflict regarding time.')}</div>
            </div>
            <div className="rec-item">
              <div className="rec-text">• {t('ai.rec3', 'Match recovered fingerprints.')}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {t('ai.why3', '1 fingerprint remains completely unmatched.')}</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Evidence & Suspect Analysis */}
        <div className="ai-card glass-panel">
          <div className="ai-card-header">
            <h3><Fingerprint size={16}/> {t('ai.evidenceAnalysis', 'Evidence & Suspect Analysis')}</h3>
          </div>
          <div className="ev-split">
            <div className="ev-left">
              <h4>{t('ai.evSummary', 'Evidence Summary (12 Items)')}</h4>
              <ul className="ev-list">
                <li>{t('ai.ev1', 'Vehicle visible')}</li>
                <li>{t('ai.ev2', 'Number plate partially visible')}</li>
                <li>{t('ai.ev3', 'Face detected')}</li>
                <li>{t('ai.ev4', 'Possible weapon detected')}</li>
              </ul>
            </div>
            <div className="ev-right">
              <h4>{t('ai.primarySuspect', 'Primary Suspect: John Doe')}</h4>
              <div className="suspect-risk">{t('ai.risk', 'Risk:')} <span className="text-red-500">HIGH (89%)</span></div>
              <div className="suspect-reasons">
                <p>✓ {t('ai.rsn1', 'Vehicle owner')}</p>
                <p>✓ {t('ai.rsn2', 'Previous theft history')}</p>
                <p>✓ {t('ai.rsn3', 'Phone active nearby')}</p>
              </div>
            </div>
          </div>
          
          <div className="pattern-box mt-4">
            <h4><ShieldAlert size={14}/> {t('ai.pattern', 'Crime Pattern Detected: Organized Crime')}</h4>
            <p>{t('ai.patternDesc', 'Repeat vehicle theft, Weekend activity, Similar entry method.')} (87% {t('ai.conf', 'Confidence')})</p>
          </div>
        </div>

        {/* SECTION 5: Timeline & Checklist */}
        <div className="ai-card glass-panel">
          <div className="ai-card-header">
            <h3><CalendarClock size={16}/> {t('ai.timeline', 'Timeline & Checklist')}</h3>
          </div>
          <div className="timeline-split">
            <div className="timeline-list">
              <div className="tl-item"><span className="time">12:30 PM</span> {t('ai.tl1', 'Complaint Filed')}</div>
              <div className="tl-item"><span className="time">1:20 PM</span> {t('ai.tl2', 'Officer Assigned')}</div>
              <div className="tl-item"><span className="time">2:15 PM</span> {t('ai.tl3', 'Evidence Uploaded')}</div>
              <div className="tl-item"><span className="time">3:10 PM</span> {t('ai.tl4', 'Witness Interview')}</div>
            </div>
            <div className="checklist-list">
              <div className="chk-item done">☑ {t('ai.chk1', 'FIR Registered')}</div>
              <div className="chk-item done">☑ {t('ai.chk2', 'Victim Interview')}</div>
              <div className="chk-item done">☑ {t('ai.chk3', 'Scene Visit')}</div>
              <div className="chk-item pend">☐ {t('ai.chk4', 'CCTV Collection')}</div>
              <div className="chk-item pend">☐ {t('ai.chk5', 'Arrest')}</div>
              <div className="chk-item pend">☐ {t('ai.chk6', 'Chargesheet')}</div>
            </div>
          </div>
        </div>

        {/* SECTION 6: Q&A with live Gemini AI Kannada Support */}
        <div className="ai-card span-2 glass-panel chat-section">
          <div className="ai-card-header">
            <h3><MessageSquare size={16}/> {t('ai.qa', 'Follow-up Questions')}</h3>
          </div>
          <div className="chat-history">
            {chatLog.length === 0 && (
              <div className="chat-empty">
                <p>{t('ai.qaHint', 'Ask the AI Investigation Officer about missing evidence, witness reliability, or risk factors.')}</p>
                <div className="chat-suggestions">
                  <button onClick={() => setChatInput(i18n.language === 'kn' ? 'ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಇನ್ನೂ ಬಾಕಿಯಿವೆ?' : 'What evidence is still missing?')}>
                    {i18n.language === 'kn' ? 'ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಇನ್ನೂ ಬಾಕಿಯಿವೆ?' : 'What evidence is still missing?'}
                  </button>
                  <button onClick={() => setChatInput(i18n.language === 'kn' ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಆರೋಪಿ ಯಾರು?' : 'Who is the highest-risk suspect?')}>
                    {i18n.language === 'kn' ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಆರೋಪಿ ಯಾರು?' : 'Who is the highest-risk suspect?'}
                  </button>
                  <button onClick={() => setChatInput(i18n.language === 'kn' ? 'ಈ ಪ್ರಕರಣದ ಸಂಪೂರ್ಣ ವಿವರಣೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಿ' : 'Explain this case in Kannada')}>
                    {i18n.language === 'kn' ? 'ಈ ಪ್ರಕರಣದ ವಿವರಣೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಿ' : 'Explain this case in Kannada'}
                  </button>
                </div>
              </div>
            )}
            {chatLog.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`} style={{ whiteSpace: 'pre-line' }}>
                {msg.text}
              </div>
            ))}
            {asking && (
              <div className="chat-bubble ai typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
          </div>
          <div className="chat-input-row">
            <input 
              type="text" 
              placeholder={t('ai.chatPlaceholder', 'Ask anything about this case...')} 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              disabled={asking}
            />
            <button onClick={handleAsk} disabled={asking}><Send size={16}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
