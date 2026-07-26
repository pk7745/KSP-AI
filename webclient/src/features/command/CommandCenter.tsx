import React, { useState, useEffect, useRef } from 'react';
import { kspApi } from '../../services/api/kspApi';
import type { ChatResponse } from '../../services/api/kspApi';
import { 
  Send, 
  Mic, 
  MicOff, 
  FileDown, 
  Sparkles, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  User, 
  Bot,
  RefreshCw
} from 'lucide-react';
import jsPDF from 'jspdf';

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  dossier?: any;
  sources?: string[];
  confidence?: number;
  queryPlan?: string;
  cases?: any[];
}

export const CommandCenter: React.FC = () => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: 'Namaskara! I am KSP-AI, your Karnataka State Crime Intelligence assistant. Query crime records in English or Kannada (ಉದಾಹರಣೆಗೆ: "ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆಯ ಕಳವು ಪ್ರಕರಣಗಳು"). How can I assist your investigation today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 1.0,
      sources: ['CaseMaster', 'District', 'Unit'],
      queryPlan: 'SELECT * FROM CaseMaster WHERE Status = active LIMIT 5'
    }
  ]);

  const [input, setInput] = useState('');
  const [lang, setLang] = useState<'en' | 'kn'>('en');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedDossiers, setExpandedDossiers] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Web Speech API STT Setup
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = lang === 'kn' ? 'kn-IN' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [lang]);

  const toggleSpeech = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = lang === 'kn' ? 'kn-IN' : 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ sender: m.sender, text: m.text }));
      const response: ChatResponse = await kspApi.sendChatMessage({
        message: textToSend,
        lang,
        history: historyPayload
      });

      const aiMsg: MessageItem = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dossier: response.dossier,
        sources: response.sources,
        confidence: response.confidence,
        queryPlan: response.queryPlan,
        cases: response.retrievedCases
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'Sorry, I encountered an issue querying the SCRB data store. Please verify backend connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleDossier = (msgId: string) => {
    setExpandedDossiers(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  // PDF Export
  const exportConversationPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(30, 64, 175);
    doc.text('KARNATAKA STATE POLICE - SCRB CRIME DOSSIER', 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()} | Official Police Record`, 14, 28);
    doc.line(14, 32, 196, 32);

    let y = 40;
    messages.forEach((m) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(m.sender === 'user' ? 0 : 30);
      doc.text(`[${m.timestamp}] ${m.sender === 'user' ? 'INVESTIGATOR' : 'KSP-AI RESPONSE'}:`, 14, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50);
      const splitText = doc.splitTextToSize(m.text, 175);
      doc.text(splitText, 14, y);
      y += splitText.length * 5 + 4;

      if (m.queryPlan) {
        doc.setFontSize(8);
        doc.setTextColor(120);
        doc.text(`Evidence Query: ${m.queryPlan}`, 14, y);
        y += 6;
      }
    });

    doc.save(`KSP_SCRB_Dossier_${Date.now()}.pdf`);
  };

  const sampleQueries = [
    'Show high-value burglaries in Whitefield PS',
    'ವೈಟ್‌ಫೀಲ್ಡ್‌ನ ಅಪರಾಧ ಪ್ರಕರಣಗಳ ಸಾರಾಂಶ ನೀಡಿ',
    'List active NDPS cases in Mangaluru',
    'Show repeat offenders in Bengaluru City'
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col max-w-6xl mx-auto p-6 space-y-4 animate-in fade-in duration-150">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-medium">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-[var(--text-primary)]">AI Conversational Command Center</h2>
            <p className="text-[11px] text-[var(--text-muted)]">Grounded on Catalyst ZCQL Data Store • Audit Trails</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[var(--bg-primary)] p-0.5 rounded-lg border text-xs" style={{ borderColor: 'var(--border)' }}>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'en' ? 'bg-blue-600 text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              English
            </button>
            <button
              onClick={() => setLang('kn')}
              className={`px-2.5 py-1 rounded-md transition-colors ${lang === 'kn' ? 'bg-blue-600 text-white font-medium' : 'text-[var(--text-secondary)]'}`}
            >
              ಕನ್ನಡ (Kannada)
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            onClick={exportConversationPDF}
            className="px-3 py-1.5 rounded-md border hover:bg-[var(--surface-hover)] text-xs flex items-center gap-1.5 transition-colors text-[var(--text-primary)]"
            style={{ borderColor: 'var(--border)' }}
          >
            <FileDown className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Dossier (PDF)</span>
          </button>
        </div>
      </div>

      {/* Chat Conversation Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium ${
              msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble Container */}
            <div className="space-y-2">
              <div
                className={`p-4 rounded-xl text-xs space-y-2 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-700 text-white rounded-tr-none'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] border rounded-tl-none'
                }`}
                style={{ borderColor: msg.sender === 'user' ? 'transparent' : 'var(--border)' }}
              >
                <div className="whitespace-pre-wrap leading-relaxed">
                  {msg.text}
                </div>

                {/* Retrieved Cases Mini Cards */}
                {msg.cases && msg.cases.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                    <div className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                      Retrieved Grounding FIRs:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.cases.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded text-[10px] font-mono border border-blue-200 dark:border-blue-800">
                          CrimeNo: {c.CrimeNo || c.CaseNo} ({c.CrimeMajorHead || 'Case'})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Explainable AI Evidence Dossier Expander (Section 4.8) */}
              {msg.sender === 'ai' && (msg.queryPlan || msg.sources) && (
                <div className="text-[11px]">
                  <button
                    onClick={() => toggleDossier(msg.id)}
                    className="flex items-center gap-1.5 text-[var(--text-muted)] hover:text-blue-600 transition-colors font-medium"
                  >
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>Explainable AI Evidence Dossier</span>
                    {expandedDossiers[msg.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {expandedDossiers[msg.id] && (
                    <div
                      className="mt-2 p-3 rounded-lg border text-xs space-y-2 bg-[var(--bg-primary)] text-[var(--text-secondary)] animate-in fade-in"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[var(--text-primary)]">Confidence Score:</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                          {Math.round((msg.confidence || 0.95) * 100)}% Match
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">Generated ZCQL Query:</span>
                        <pre className="mt-1 p-2 rounded bg-slate-900 text-amber-300 font-mono text-[10px] overflow-x-auto">
                          {msg.queryPlan}
                        </pre>
                      </div>
                      <div>
                        <span className="font-medium text-[var(--text-primary)]">Source Tables:</span>
                        <div className="flex items-center gap-1 mt-1">
                          {(msg.sources || ['CaseMaster']).map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 text-[10px] bg-[var(--surface-hover)] border rounded">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] p-3">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Querying ZCQL Data Store & generating grounded intelligence...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Queries */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] uppercase font-medium text-[var(--text-muted)] shrink-0">Quick Queries:</span>
        {sampleQueries.map((sq, i) => (
          <button
            key={i}
            onClick={() => handleSend(sq)}
            className="px-2.5 py-1 rounded-full text-[11px] border hover:bg-[var(--surface-hover)] whitespace-nowrap text-[var(--text-secondary)] transition-colors"
            style={{ borderColor: 'var(--border)' }}
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div className="pt-2">
        <div
          className="flex items-center gap-2 p-2 rounded-xl border bg-[var(--surface)] shadow-sm focus-within:ring-2 focus-within:ring-blue-600 transition-all"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Mic STT Button */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-lg transition-colors ${
              isListening ? 'bg-red-600 text-white animate-pulse' : 'hover:bg-[var(--surface-hover)] text-[var(--text-muted)]'
            }`}
            title="Speech-to-Text Input (Kannada / English)"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={
              lang === 'kn'
                ? 'ಅಪರಾಧ ದಾಖಲೆಗಳು, FIR ಮತ್ತು ಪ್ರಕರಣಗಳ ವಿವರಗಳನ್ನು ಕೇಳಿ...'
                : 'Ask about FIRs, accused, crime hotspots, or sections...'
            }
            className="flex-1 text-xs bg-transparent focus:outline-none text-[var(--text-primary)]"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Ask AI</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
