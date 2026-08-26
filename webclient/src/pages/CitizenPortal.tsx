import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Search, FileText, MapPin, PhoneCall, AlertTriangle, 
  HelpCircle, ShieldCheck, UserCheck, ChevronRight, Lock, 
  Globe, HeartHandshake, CheckCircle2, ChevronDown, ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer/Footer';
import kspLogo from '../assets/ksp-logo.svg';

export function CitizenPortal() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language === 'kn' ? 'kn' : 'en';

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [complaintIdInput, setComplaintIdInput] = useState('');
  const [trackStatus, setTrackStatus] = useState<string | null>(null);

  const toggleLanguage = () => {
    i18n.changeLanguage(lang === 'kn' ? 'en' : 'kn');
  };

  const handleTrackComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintIdInput.trim()) return;
    setTrackStatus(
      lang === 'kn'
        ? `ಅರ್ಜಿ ನಂಬರ್ ${complaintIdInput}: ತನಿಖಾಧಿಕಾರಿ ನಿರಂಜನ್ ರಾಜ್ ಅವರಿಗೆ ನಿಯೋಜಿಸಲಾಗಿದೆ. ಪ್ರಸ್ತುತ ಸ್ಥಳ ಪರಿಶೀಲನೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ.`
        : `Petition Ref #${complaintIdInput}: Assigned to IO Inspector Niranjan Raj. Investigation & crime scene verification in progress.`
    );
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const services = [
    {
      title: lang === 'kn' ? 'ದೂರು ಉಚಿತ ದಾಖಲಾತಿ' : 'Report Complaint / Petition',
      desc: lang === 'kn' ? 'ಅಪರಾಧ ಅಥವಾ ಕಾನೂನು ಸುವ್ಯವಸ್ಥೆ ಸಮಸ್ಯೆಗಳನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ವರದಿ ಮಾಡಿ.' : 'File non-cognizable reports and complaint petitions directly to your station online.',
      btn: lang === 'kn' ? 'ದೂರು ಸಲ್ಲಿಸಿ' : 'File Complaint',
      icon: FileText,
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      title: lang === 'kn' ? 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Complaint',
      desc: lang === 'kn' ? 'ನಿಮ್ಮ ದೂರಿನ ತನಿಖಾ ಸ್ಥಿತಿಯನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.' : 'Check real-time investigation progress using your petition number.',
      btn: lang === 'kn' ? 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Status',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      title: lang === 'kn' ? 'ಕಳೆದುಹೋದ ಮತ್ತು ಸಿಕ್ಕಿದ ಆಸ್ತಿ' : 'Lost and Found',
      desc: lang === 'kn' ? 'ಕಳೆದುಹೋದ ವಸ್ತುಗಳನ್ನು ವರದಿ ಮಾಡಿ ಅಥವಾ ಹುಡುಕಿ.' : 'Search lost documents, mobile devices, and report found articles.',
      btn: lang === 'kn' ? 'ವರದಿ ವೀಕ್ಷಿಸಿ' : 'Explore Items',
      icon: Search,
      color: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      title: lang === 'kn' ? 'ಪೋಲಿಸ್ ಠಾಣೆ ಹುಡುಕಿ' : 'Find Police Station',
      desc: lang === 'kn' ? 'ನಿಮ್ಮ ಹತ್ತಿರದ ಪೋಲಿಸ್ ಠಾಣೆಯನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ.' : 'Locate nearest jurisdictional police station with contact numbers.',
      btn: lang === 'kn' ? 'ಠಾಣೆ ಹುಡುಕಿ' : 'Locate Station',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      title: lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು' : 'Safety Tips',
      desc: lang === 'kn' ? 'ಮಹಿಳೆಯರು, ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ಮಕ್ಕಳಿಗಾಗಿ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ.' : 'Essential safety guidelines for cyber security, women & child safety.',
      btn: lang === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ಓದಿ' : 'Read Guidelines',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      title: lang === 'kn' ? 'ಸಮುದಾಯ ಜಾಗೃತಿ' : 'Community Awareness',
      desc: lang === 'kn' ? 'ಅಪರಾಧ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಜಾಗೃತಿ ಅಭಿಯಾನಗಳು.' : 'Latest crime prevention campaigns, traffic rules, and drug awareness.',
      btn: lang === 'kn' ? 'ಅಭಿಯಾನ ವೀಕ್ಷಿಸಿ' : 'View Campaigns',
      icon: HeartHandshake,
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const emergencyHelplines = [
    { title: lang === 'kn' ? 'ಪೊಲೀಸ್ ತುರ್ತು ಸೇವೆ' : 'Police Emergency', number: '112', desc: lang === 'kn' ? '24/7 ತುರ್ತು ಸ್ಪಂದನೆ' : 'National Emergency Helpline', icon: PhoneCall, bg: 'bg-red-600 text-white' },
    { title: lang === 'kn' ? 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ' : 'Women Helpline', number: '1091', desc: lang === 'kn' ? 'ಮಹಿಳೆಯರ ಸುರಕ್ಷತೆ' : 'Immediate Women Protection', icon: Shield, bg: 'bg-pink-600 text-white' },
    { title: lang === 'kn' ? 'ಮಕ್ಕಳ ಸಹಾಯವಾಣಿ' : 'Child Helpline', number: '1098', desc: lang === 'kn' ? 'ಮಕ್ಕಳ ರಕ್ಷಣೆ ಸೇವೆ' : 'Child Care & Protection', icon: HeartHandshake, bg: 'bg-blue-600 text-white' },
    { title: lang === 'kn' ? 'ಸೈಬರ್ ಕ್ರೈಮ್' : 'Cyber Crime Helpline', number: '1930', desc: lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ಹಣಕಾಸು ವಂಚನೆ' : 'Financial Fraud Helpline', icon: AlertTriangle, bg: 'bg-indigo-600 text-white' },
    { title: lang === 'kn' ? 'ಆಂಬುಲೆನ್ಸ್ ಸೇವೆ' : 'Ambulance Medical', number: '108', desc: lang === 'kn' ? 'ತುರ್ತು ವೈದ್ಯಕೀಯ ಸೇವೆ' : 'Emergency Medical Response', icon: PhoneCall, bg: 'bg-emerald-600 text-white' }
  ];

  const faqs = [
    {
      q: lang === 'kn' ? 'ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ದೂರು ಸಲ್ಲಿಸುವುದು ಹೇಗೆ?' : 'How to report a complaint online?',
      a: lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ "ದೂರು ಸಲ್ಲಿಸಿ" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ, ನಿಮ್ಮ ವಿವರಗಳು ಮತ್ತು ಘಟನೆಯ ಸ್ಥಳವನ್ನು ನಮೂದಿಸಿ ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ.' : 'Click "Report Complaint" on the Citizen Portal, fill in your details, incident date and station location, then submit to receive an instant acknowledgement number.'
    },
    {
      q: lang === 'kn' ? 'ಎಫ್‌ಐಆರ್ ಅಥವಾ ದೂರನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುವುದು ಹೇಗೆ?' : 'How to track FIR or complaint status?',
      a: lang === 'kn' ? 'ನಿಮ್ಮ ದೂರು ಸಂಖ್ಯೆಯನ್ನು "ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ" ವಿಭಾಗದಲ್ಲಿ ನಮೂದಿಸಿ ತನಿಖೆಯ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿಯನ್ನು ಪಡೆಯಿರಿ.' : 'Enter your Complaint Petition Reference ID into the "Track Complaint" search bar to view current investigating officer details and status.'
    },
    {
      q: lang === 'kn' ? 'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಪೊಲೀಸರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ಹೇಗೆ?' : 'How to contact police during an emergency?',
      a: lang === 'kn' ? 'ಉಚಿತ ತುರ್ತು ಸಂಖ್ಯೆ 112 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ತುರ್ತು ಸೇವೆಗಳ ಪುಟದಿಂದ ತ್ವರಿತ ಕರೆ ಮಾಡಿ.' : 'Dial 112 immediately from any mobile or landline. Your location will be automatically traced to dispatch the nearest PCR vehicle.'
    },
    {
      q: lang === 'kn' ? 'ಸೈಬರ್ ಅಪರಾಧ ವಂಚನೆಯನ್ನು ವರದಿ ಮಾಡುವುದು ಹೇಗೆ?' : 'How to report cyber crime or financial fraud?',
      a: lang === 'kn' ? 'ಹಣಕಾಸಿನ ಸೈಬರ್ ವಂಚನೆ ಸಂಭವಿಸಿದ ತಕ್ಷಣ 1930 ಹೆಲ್ಪ್‌ಲೈನ್‌ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ cybercrime.gov.in ನಲ್ಲಿ ದೂರು ದಾಖಲಿಸಿ.' : 'Dial 1930 within the golden hour to freeze stolen funds, or report online via the National Cyber Crime Reporting Portal.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-blue-700" />
              <span>{lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={kspLogo} 
                alt="Karnataka State Police Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <Shield size={28} className="text-blue-700 hidden sm:block" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-blue-950 tracking-tight leading-tight uppercase font-heading">
                  Karnataka State Police
                </h1>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
                  {lang === 'kn' ? 'ನಾಗರಿಕ ಸೇವೆಗಳ ಪೋರ್ಟಲ್' : 'Official Citizen Services Portal'}
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-500 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-white shadow-sm"
            >
              <Globe size={14} className="text-blue-600" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <Link 
              to="/emergency-services" 
              className="px-3 py-1.5 rounded-lg bg-red-100 text-red-800 font-bold text-xs border border-red-300 transition-colors"
            >
              {lang === 'kn' ? 'ತುರ್ತು ಸೇವೆಗಳು (112)' : 'Emergency Services'}
            </Link>

            <button 
              onClick={() => navigate('/')} 
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">{lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Officer Login'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section - Clean Light Style */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-950 to-slate-950 text-white py-16 px-6 relative shadow-xl">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-white text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <ShieldCheck size={14} className="text-blue-200" />
              <span>{lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ನಾಗರಿಕ ಪೊಲೀಸ್ ಸೇವೆಗಳು' : '24x7 Digital Citizen Police Services'}</span>
            </div>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight uppercase font-heading text-white drop-shadow-md">
              {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸೇವಾ ಪೋರ್ಟಲ್' : 'KSP Citizen Services Portal'}
            </h1>

            <p className="text-base sm:text-xl text-blue-100 max-w-2xl mx-auto font-bold leading-relaxed">
              {lang === 'kn' 
                ? 'ದೂರುಗಳನ್ನು ಸಲ್ಲಿಸಿ, ತನಿಖೆಯ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಹತ್ತಿರದ ಪೊಲೀಸ್ ಠಾಣೆಗಳನ್ನು ಪತ್ತೆ ಮಾಡಿ.' 
                : 'Empowering Karnataka citizens with online petition reporting, real-time complaint tracking, and instant emergency hotlines.'}
            </p>

            {/* Complaint Track Search Form */}
            <form onSubmit={handleTrackComplaint} className="max-w-xl mx-auto pt-4 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-md font-bold"
                  placeholder={lang === 'kn' ? 'ದೂರು/ಅರ್ಜಿ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ (ಉದಾ: PET-2026-88)' : 'Enter Complaint Ref # (e.g. PET-2026-88)'}
                  value={complaintIdInput}
                  onChange={e => setComplaintIdInput(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer transition-all border border-blue-400"
              >
                {lang === 'kn' ? 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Status'}
              </button>
            </form>

            {trackStatus && (
              <div className="max-w-xl mx-auto p-4 bg-white/95 border-2 border-blue-400 rounded-xl text-xs text-blue-950 font-mono text-left shadow-xl font-bold">
                ✓ {trackStatus}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Citizen Services Grid - Clean Light Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {lang === 'kn' ? 'ಲಭ್ಯವಿರುವ ಆನ್‌ಲೈನ್ ಸೇವೆಗಳು' : 'Digital Citizen Services'}
          </h2>
          <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
            {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕರಿಗಾಗಿ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಒದಗಿಸುವ ಡಿಜಿಟಲ್ ಸೇವೆಗಳು' : 'Access essential police services online without visiting the police station.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md ${item.color}`}>
                  <item.icon size={26} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs font-medium text-slate-600 leading-relaxed mb-6">{item.desc}</p>
              </div>

              <button 
                onClick={() => {
                  if (item.title.includes('Track') || item.title.includes('ಟ್ರ್ಯಾಕ್')) {
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  } else {
                    navigate('/emergency-services');
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-50 border border-slate-300 text-blue-900 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>{item.btn}</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Helplines Bar */}
      <section className="bg-slate-100 border-y border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-8">
            {lang === 'kn' ? '24/7 ತುರ್ತು ಸಹಾಯವಾಣಿ ಎಮರ್ಜೆನ್ಸಿ ಲೈನ್ಸ್' : '24/7 Emergency Response Numbers'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {emergencyHelplines.map((h, idx) => (
              <a 
                key={idx}
                href={`tel:${h.number}`}
                className={`p-4 rounded-2xl ${h.bg} hover:scale-105 transition-all text-center flex flex-col items-center justify-center shadow-md cursor-pointer`}
              >
                <h.icon size={22} className="mb-2" />
                <span className="text-[11px] font-extrabold block truncate">{h.title}</span>
                <span className="text-2xl font-black font-mono tracking-tight my-1">{h.number}</span>
                <span className="text-[10px] opacity-90 block truncate">{h.desc}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {lang === 'kn' ? 'ಸಾಮಾನ್ಯವಾಗಿ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'Frequently Asked Questions (FAQ)'}
          </h2>
          <p className="text-xs text-slate-500 font-semibold">{lang === 'kn' ? 'ನಾಗರಿಕ ಪೊಲೀಸ್ ಸೇವೆಗಳ ಕುರಿತು ಉತ್ತರಗಳು' : 'Answers to common queries about citizen police petitions and emergency hotlines.'}</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden cursor-pointer shadow-sm"
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div className="p-4 flex items-center justify-between font-bold text-xs text-slate-900">
                <span>{faq.q}</span>
                <ChevronDown size={16} className={`text-blue-700 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 font-medium">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
