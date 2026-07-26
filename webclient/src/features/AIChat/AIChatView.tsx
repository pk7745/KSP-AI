import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Database, FileSearch, Mic, MicOff, Download, FolderOpen, ExternalLink } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useTranslation } from 'react-i18next';
import { api } from '../../services/api';
import { useNavigation } from '../../context/NavigationContext';
import './AIChatView.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  evidence?: any[];
  sql?: string;
  timestamp: Date;
}

export function AIChatView() {
  const { t, i18n } = useTranslation();
  const { openCase360 } = useNavigation();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: i18n.language === 'kn' 
        ? 'ನಮಸ್ಕಾರ, ನಾನು ಕೆ.ಎಸ್.ಪಿ ಅಪರಾಧ ಗುಪ್ತಚರ ಎಐ ಸಹಾಯಕ. ಕೇಸ್ ಮ್ಯಾಸ್ಟರ್ ಡಾಟಾಸ್ಟೋರ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿದ್ದೇನೆ. ನಿಮ್ಮ ತನಿಖೆಯಲ್ಲಿ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?'
        : 'I am the KSP Crime Intelligence AI. I am connected to the CaseMaster Catalyst datastore. How can I assist you with your investigation today?',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentCases, setRecentCases] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load Recent Cases for quick reference
  useEffect(() => {
    async function loadCases() {
      try {
        const res = await api.getCases();
        if (res && res.cases) {
          setRecentCases(res.cases.slice(0, 10));
        }
      } catch (err) {
        console.error("Failed to load recent cases in chat sidebar", err);
      }
    }
    loadCases();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Backend AI API
      const response = await api.chatWithGemini(userMessage.content, messages, i18n.language);
      const answerContent = response.reply || response.answer || (i18n.language === 'kn' ? 'ಉತ್ತರವನ್ನು ರಚಿಸಲಾಗಿದೆ.' : 'AI investigation response generated.');

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answerContent,
        sql: response.queryPlan || response.sql,
        evidence: response.retrievedCases || response.evidence,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: i18n.language === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.' : 'Sorry, failed to connect to Gemini AI backend. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const exportPDF = async () => {
    if (!chatAreaRef.current) return;
    
    try {
      const canvas = await html2canvas(chatAreaRef.current, {
        backgroundColor: '#020617',
        scale: 2
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('KSP_AI_Investigation_Dossier.pdf');
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  return (
    <div className="ai-chat-view animate-slide-in">
      <div className="chat-layout">
        
        {/* Main Chat Area */}
        <div className="chat-main glass-panel">
          <div className="chat-header">
            <div className="chat-header-title">
              <div className="header-icon-box">
                <Bot className="icon-cyan" size={24} />
              </div>
              <div>
                <h3>{t('chat.title', 'KSP AI Investigator')}</h3>
                <p className="subtitle">{t('chat.subtitle', 'Grounded in SCRB CaseMaster datastore')}</p>
              </div>
            </div>
            <button className="btn btn-ghost" onClick={exportPDF} title={t('chat.exportPdf', 'Export PDF')}>
              <Download size={18} /> {t('chat.exportPdf', 'Export Dossier')}
            </button>
          </div>
          
          <div className="chat-messages" ref={chatAreaRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                </div>
                <div className="message-content-box">
                  <div className="message-text" style={{ whiteSpace: 'pre-line' }}>{msg.content}</div>
                  
                  {msg.sql && (
                    <div className="message-sql">
                      <div className="sql-header">
                        <Database size={14} /> {t('chat.sqlQuery', 'ZCQL Query Executed')}
                      </div>
                      <code>{msg.sql}</code>
                    </div>
                  )}
                  
                  {msg.evidence && msg.evidence.length > 0 && (
                    <div className="message-evidence">
                      <div className="evidence-header">
                        <FileSearch size={14} /> {t('chat.evidence', 'Grounded Case Records')}
                      </div>
                      <div className="evidence-items">
                        {msg.evidence.map((item, idx) => (
                          <div key={idx} className="evidence-item flex-row justify-between align-center p-xs">
                            <div>
                              <span className="badge-cyan">{item.CrimeNo || item.FIRNumber || 'Record'}</span>
                              <span className="evidence-detail ml-xs">{item.DistrictName || item.District || ''}</span>
                            </div>
                            {item.CaseMasterID && (
                              <button 
                                className="btn-ghost text-xs text-cyan flex-row gap-xs align-center"
                                onClick={() => openCase360(item.CaseMasterID)}
                              >
                                View 360 <ExternalLink size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-wrapper assistant">
                <div className="message-avatar"><Bot size={20} /></div>
                <div className="message-content-box typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <button 
              type="button" 
              className={`btn-icon mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListen}
              title={t('chat.dictate', 'Dictate')}
            >
              {isListening ? <MicOff size={20} className="icon-crimson" /> : <Mic size={20} />}
            </button>
            <input 
              type="text" 
              className="chat-input input-glass" 
              placeholder={t('chat.placeholder', 'Ask about FIRs, accused, IPC sections, or criminal history...')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="btn btn-primary chat-send-btn" disabled={!input.trim() || isLoading}>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Sidebar: Recent Cases Dossier Selector (Chat Capabilities Removed completely) */}
        <div className="chat-sidebar glass-panel">
          <div className="sidebar-header border-b border-glass pb-sm mb-sm">
            <FolderOpen className="icon-cyan" size={20} />
            <h3>{i18n.language === 'kn' ? 'ಇತ್ತೀಚಿನ ಪ್ರಕರಣಗಳು' : 'Recent Cases Dossiers'}</h3>
          </div>
          
          <div className="recent-cases-list" style={{ maxHeight: '520px', overflowY: 'auto' }}>
            {recentCases.map((c: any) => (
              <div 
                key={c.CrimeNo || c.CaseMasterID}
                className="p-sm mb-xs glass-panel-interactive rounded cursor-pointer border border-slate-800 hover:border-cyan-500/50 transition-all"
                onClick={() => openCase360(c.CaseMasterID || c.CrimeNo)}
              >
                <div className="flex-row justify-between align-center">
                  <strong className="text-cyan text-sm">{c.CrimeNo}</strong>
                  <span className="text-xs text-amber">{c.CaseStatus}</span>
                </div>
                <p className="text-xs text-slate-300 mt-xs font-medium">{c.CrimeMajorHeadName || c.CrimeMajorHead || 'Investigation'}</p>
                <p className="text-xs text-muted mt-xs truncate">{c.CrimeRegisteredDate ? new Date(c.CrimeRegisteredDate).toLocaleDateString() : ''} • {c.DistrictName}</p>
                <button 
                  className="btn-ghost text-xs text-cyan p-0 mt-xs flex-row gap-xs align-center hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInput(i18n.language === 'kn' ? `ಪ್ರಕರಣ ${c.CrimeNo} ನ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ` : `Provide detailed investigation analysis for case ${c.CrimeNo}`);
                  }}
                >
                  <Bot size={12} /> {i18n.language === 'kn' ? 'ಎಐ ಪ್ರಶ್ನಿಸಿ' : 'Ask AI'}
                </button>
              </div>
            ))}
            {recentCases.length === 0 && (
              <p className="text-xs text-muted py-sm">{i18n.language === 'kn' ? 'ಪ್ರಕರಣಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading recent cases...'}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
