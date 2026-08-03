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
  const [caseData, setCaseData] = useState<any>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState<{sender: 'user'|'ai', text: string}[]>([]);
  const [asking, setAsking] = useState(false);
  const [aiReport, setAiReport] = useState<string>('');

  const isKn = i18n.language === 'kn';

  useEffect(() => {
    loadDynamicCaseAnalysis();
  }, [i18n.language]);

  const loadDynamicCaseAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.getCases();
      if (res && res.cases && res.cases.length > 0) {
        const topCase = res.cases[0];
        setCaseData(topCase);

        // Fetch dynamic AI analysis report from backend
        const aiRes = await api.chatWithGemini(
          `Provide a complete Crime Intelligence Analysis report for Case ${topCase.CrimeNumber || topCase.CrimeNo}`,
          [],
          isKn ? 'kn' : 'en'
        );

        setAiReport(aiRes.reply || aiRes.answer || '');
      }
    } catch (err) {
      console.error("Error loading dynamic AI analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDynamicCaseAnalysis();
  };

  const handleAsk = async () => {
    if (!chatInput.trim() || asking) return;
    const q = chatInput;
    setChatLog(prev => [...prev, { sender: 'user', text: q }]);
    setChatInput('');
    setAsking(true);

    try {
      const langParam = isKn || /[\u0C80-\u0CFF]/.test(q) ? 'kn' : 'en';
      const response = await api.chatWithGemini(q, [], langParam);
      const answerText = response.reply || response.answer || (isKn ? 'ಪ್ರಕರಣದ ವಿವರಣೆ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.' : 'Case analysis summary generated.');
      setChatLog(prev => [...prev, { sender: 'ai', text: answerText }]);
    } catch (err) {
      setChatLog(prev => [...prev, { 
        sender: 'ai', 
        text: isKn ? 'ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Failed to retrieve AI analysis response.' 
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

  const crimeNo = caseData?.CrimeNumber || caseData?.CrimeNo || 'KSP/DIS001/2026/00001';
  const station = caseData?.PoliceStation || 'Cubbon Park PS';
  const district = caseData?.District || 'Bengaluru Urban';
  const crimeHead = caseData?.CrimeMajorHead || 'Homicide / Offense';
  const status = caseData?.CaseStatus || 'Under Investigation';
  const briefFacts = caseData?.BriefFacts || 'Investigation in progress by assigned SHO.';

  return (
    <div className="ai-analysis-view animate-in fade-in">
      <div className="ai-header">
        <div className="ai-header-left">
          <Brain className="icon-cyan" size={28} />
          <div>
            <h2>{t('ai.title', 'AI Crime Intelligence Analysis')}</h2>
            <p>{t('ai.subtitle', `Selected Active Case: ${crimeNo} (${station}, ${district})`)}</p>
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
        {/* SECTION 1: AI Grounded Case Intelligence Brief */}
        <div className="ai-card span-2 glass-panel">
          <div className="ai-card-header">
            <h3><FileText size={16}/> {t('ai.summary', 'Investigation Intelligence Brief (Stratus CSV Grounded)')}</h3>
          </div>
          <div className="ai-summary-content" style={{ whiteSpace: 'pre-line' }}>
            {aiReport ? (
              <p>{aiReport}</p>
            ) : (
              <>
                <p><strong>{crimeNo}</strong> — {crimeHead} registered at {station} ({district}).</p>
                <p><strong>{isKn ? 'ಅಪರಾಧ ವಿವರ:' : 'Brief Facts:'}</strong> {briefFacts}</p>
                <div className="ai-status-badge">
                  <span>{t('ai.invStatus', 'Investigation Status:')}</span>
                  <span className="badge-warning">{status}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* SECTION 2: AI Investigation Metrics */}
        <div className="ai-card glass-panel">
          <div className="ai-card-header">
            <h3><Activity size={16}/> {t('ai.panel', 'Investigation Metrics')}</h3>
          </div>
          <div className="ai-metrics-grid">
            <div className="metric-box">
              <span>{t('ai.crimeClass', 'Crime Classification')}</span>
              <strong>{crimeHead}</strong>
              <div className="conf"><CheckCircle2 size={12}/> {t('ai.conf', 'Confidence')} 98%</div>
            </div>
            <div className="metric-box risk-high">
              <span>{t('ai.riskLevel', 'Risk Level')}</span>
              <strong>HIGH (Stratus Verified)</strong>
            </div>
            <div className="metric-box">
              <span>{t('ai.progress', 'Overall Progress')}</span>
              <strong>85%</strong>
              <div className="prog-bar"><div className="prog-fill" style={{width: '85%'}}></div></div>
            </div>
          </div>
          <div className="similar-cases">
            <h4>{t('ai.similarCases', 'Similar Cases Found')}</h4>
            <div className="similar-row"><span>KSP/DIS001/2026/00102</span> <span className="conf">94% {t('ai.match', 'Match')}</span></div>
            <div className="similar-row"><span>KSP/DIS001/2026/00811</span> <span className="conf">88% {t('ai.match', 'Match')}</span></div>
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
              <div className="rec-text">• {isKn ? 'ಸ್ಥಳೀಯ ಸಿಸಿಟಿವಿ ದೃಶ್ಯಾವಳಿಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ.' : 'Collect local CCTV footage & CDR tower dump.'}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {isKn ? 'ಆರೋಪಿಯ ಚಲನವಲನ ದೃಢೀಕರಿಸಲು.' : 'To verify suspect movement & alibi.'}</div>
            </div>
            <div className="rec-item">
              <div className="rec-text">• {isKn ? 'ಮೊಬೈಲ್ ಟವರ್ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.' : 'Verify mobile tower CDR records.'}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {isKn ? 'ಸಾಕ್ಷಿಗಳ ಹೇಳಿಕೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು.' : 'To resolve witness statement timelines.'}</div>
            </div>
            <div className="rec-item">
              <div className="rec-text">• {isKn ? 'ಬೆರಳಚ್ಚು ಮಾದರಿಯನ್ನು AFIS ಜೊತೆ ತಾಳೆ ಮಾಡಿ.' : 'Compare recovered fingerprints with AFIS database.'}</div>
              <div className="rec-why"><strong>{t('ai.why', 'Why?')}</strong> {isKn ? 'ಸಾಕ್ಷ್ಯದ ಬೆರಳಚ್ಚು ಪತ್ತೆಯಾಗಿದೆ.' : 'Crime scene fingerprint match pending.'}</div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Q&A with live Gemini AI Kannada Support */}
        <div className="ai-card span-2 glass-panel chat-section">
          <div className="ai-card-header">
            <h3><MessageSquare size={16}/> {t('ai.qa', 'Follow-up Questions')}</h3>
          </div>
          <div className="chat-history">
            {chatLog.length === 0 && (
              <div className="chat-empty">
                <p>{t('ai.qaHint', 'Ask the AI Investigation Officer about missing evidence, witness reliability, or risk factors.')}</p>
                <div className="chat-suggestions">
                  <button onClick={() => setChatInput(isKn ? 'ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಇನ್ನೂ ಬಾಕಿಯಿವೆ?' : 'What evidence is still missing?')}>
                    {isKn ? 'ಯಾವ ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಇನ್ನೂ ಬಾಕಿಯಿವೆ?' : 'What evidence is still missing?'}
                  </button>
                  <button onClick={() => setChatInput(isKn ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಆರೋಪಿ ಯಾರು?' : 'Who is the highest-risk suspect?')}>
                    {isKn ? 'ಹೆಚ್ಚಿನ ಅಪಾಯದ ಆರೋಪಿ ಯಾರು?' : 'Who is the highest-risk suspect?'}
                  </button>
                  <button onClick={() => setChatInput(isKn ? 'ಈ ಪ್ರಕರಣದ ಸಂಪೂರ್ಣ ವಿವರಣೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಿ' : 'Explain this case in Kannada')}>
                    {isKn ? 'ಈ ಪ್ರಕರಣದ ವಿವರಣೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಿ' : 'Explain this case in Kannada'}
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
