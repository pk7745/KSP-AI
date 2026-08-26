import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Database, FileSearch, Mic, MicOff, Download, ExternalLink, Sparkles } from 'lucide-react';
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
  const isKn = i18n.language === 'kn';
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isKn 
        ? 'ನಮಸ್ಕಾರ ಆಫೀಸರ್. ನಾನು ಕೆ.ಎಸ್.ಪಿ ಅಪರಾಧ ಗುಪ್ತಚರ ಎಐ ಸಹಾಯಕ. 5,500+ ಸಿಎಸ್‌ಟಿಎನ್‌ಎಸ್ ಪ್ರಕರಣಗಳಿಗೆ ಸಂಪರ್ಕಗೊಂಡಿದ್ದೇನೆ.\n\nನಿಮ್ಮ ತನಿಖಾ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ (ಸಂತ್ರಸ್ತರ ಇತರ ಪ್ರಕರಣಗಳ ಪರಿಶೀಲನೆ, ಆಪಾದಿತರ ಅಪರಾಧ ಶೈಲಿ, ಅಥವಾ ಹೊಸ ಪ್ರಕರಣದ ಸಾಧ್ಯತೆಗಳು).'
        : 'Greetings Officer. I am the KSP AI Crime Intelligence Assistant, grounded in 5,500+ CCTNS FIR database records.\n\nAsk any investigative question (e.g. Victim cross-case occurrences, Accused crime pattern & location, or New case crime possibilities).',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const presetQueries = isKn ? [
    { label: '👤 ಸಂತ್ರಸ್ತರ ಹೆಸರು & ಇತರ ಪ್ರಕರಣಗಳ ಹಾಜರಾತಿ', query: 'What is victim name in case KSP/DIS001/2026/00001? Is victim present in any other case?' },
    { label: '🕵️ ಆಪಾದಿತರ ಅಪರಾಧ ಶೈಲಿ & ಮುಖ್ಯ ಅಪರಾಧ', query: 'What is the accused pattern of crime? What kind of crime has that accused done more?' },
    { label: '📌 ಆಪಾದಿತರ ಮೂಲ ಸ್ಥಳ', query: 'Which location is that accused from?' },
    { label: '🔮 ನೂತನ ಪ್ರಕರಣದ ಅಪರಾಧ ಸಾಧ್ಯತೆಗಳು', query: 'Analyze crime possibilities for a new case: A house lock broken at night and gold stolen...' }
  ] : [
    { label: '👤 Victim Cross-Case Occurrence', query: 'What is victim name in case KSP/DIS001/2026/00001? Is victim present in any other case?' },
    { label: '🕵️ Accused Crime Pattern & Frequency', query: 'What is the accused pattern of crime? What kind of crime has that accused done more?' },
    { label: '📌 Accused Native Location', query: 'Which location is that accused from?' },
    { label: '🔮 New Case Possibility Analysis', query: 'Analyze crime possibilities for a new case: A house lock broken at night and gold stolen...' }
  ];

  const handleSend = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const qText = customQuery || input;
    if (!qText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: qText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customQuery) setInput('');
    setIsLoading(true);

    try {
      const response = await api.chatWithGemini(userMessage.content, messages, i18n.language);
      const answerContent = response.reply || response.answer || (isKn ? 'ಉತ್ತರವನ್ನು ರಚಿಸಲಾಗಿದೆ.' : 'AI investigation response generated.');

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
        content: isKn ? 'ಕ್ಷಮಿಸಿ, ದತ್ತಾಂಶಸಂಚಯದಿಂದ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.' : 'Sorry, failed to retrieve intelligence response from CCTNS backend. Please try again.',
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
    recognition.lang = isKn ? 'kn-IN' : 'en-IN';
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
    <div className="ai-chat-view animate-fade-in w-full min-h-[calc(100vh-90px)] flex flex-col justify-between p-2 sm:p-4 max-w-5xl mx-auto">
      
      {/* Sleek Minimal Top Header */}
      <div className="chat-header glass-panel flex items-center justify-between p-3 mb-3 rounded-xl border border-slate-800 bg-slate-900/90 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center">
            <Bot className="text-cyan-400" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wide font-heading">{t('chat.title', 'KSP AI Investigator')}</h3>
            <p className="text-[11px] font-bold text-cyan-400 font-mono">{t('chat.subtitle', 'Grounded in 5,500+ CCTNS FIR Database Records')}</p>
          </div>
        </div>

        <button 
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm" 
          onClick={exportPDF} 
          title="Export PDF Dossier"
        >
          <Download size={14} className="text-cyan-400" />
          <span>Export Dossier</span>
        </button>
      </div>
      
      {/* Clean Centered Messages Area */}
      <div className="chat-messages flex-1 overflow-y-auto space-y-4 p-4 bg-slate-950/60 border border-slate-800 rounded-2xl shadow-inner max-h-[calc(100vh-250px)]" ref={chatAreaRef}>
        {messages.map(msg => (
          <div key={msg.id} className={`message-wrapper flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
                <Bot size={18} />
              </div>
            )}

            <div className={`message-content-box max-w-2xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-slate-950 font-bold rounded-tr-none' 
                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none font-sans space-y-2'
            }`}>
              <div className="message-text whitespace-pre-line">{msg.content}</div>
              
              {msg.sql && (
                <div className="mt-2 p-2 bg-slate-950 rounded border border-slate-800 text-[11px] font-mono text-cyan-400">
                  <Database size={12} className="inline mr-1" />
                  <code>{msg.sql}</code>
                </div>
              )}
              
              {msg.evidence && msg.evidence.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="text-[11px] font-extrabold text-cyan-400 flex items-center gap-1">
                    <FileSearch size={12} />
                    <span>Grounded CCTNS Provenance Records:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.evidence.slice(0, 4).map((item, idx) => (
                      <button 
                        key={idx} 
                        className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                        onClick={() => openCase360(item.CrimeNumber || item.CrimeNo || item.CaseMasterID)}
                      >
                        <span>{item.CrimeNumber || item.CrimeNo || 'Record'}</span>
                        <ExternalLink size={10} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0 mt-1">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message-wrapper flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Bot size={18} className="animate-spin" />
            </div>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400 font-mono animate-pulse">
              Synthesizing response from CCTNS database records...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Police Query Chips */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Sparkles size={14} className="text-cyan-400 shrink-0 mr-1" />
        {presetQueries.map((item, idx) => (
          <button
            key={idx}
            type="button"
            className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 hover:text-cyan-400 whitespace-nowrap cursor-pointer transition-all shadow-sm"
            onClick={() => handleSend(undefined, item.query)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Sleek Minimal Bottom Input Bar */}
      <form className="chat-input-area flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl" onSubmit={handleSend}>
        <button 
          type="button" 
          className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${isListening ? 'bg-red-950 border-red-500 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'}`}
          onClick={toggleListen}
          title="Voice Speech Input"
        >
          {isListening ? <MicOff size={18} className="animate-pulse" /> : <Mic size={18} />}
        </button>

        <input 
          type="text" 
          className="flex-1 bg-transparent border-none text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2 font-sans"
          placeholder={isKn ? 'ನಿಮ್ಮ ತನಿಖಾ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ: ಅಪರಾಧ ಶೈಲಿ, ಸಂತ್ರಸ್ತರ ಲಭ್ಯತೆ)...' : 'Ask about Victim cross-case, Accused crime pattern, Location, or New case possibilities...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />

        <button 
          type="submit" 
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all disabled:opacity-50" 
          disabled={!input.trim() || isLoading}
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>

    </div>
  );
}
