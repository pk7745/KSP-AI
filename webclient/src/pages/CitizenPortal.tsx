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
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      title: lang === 'kn' ? 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Complaint',
      desc: lang === 'kn' ? 'ನಿಮ್ಮ ದೂರಿನ ತನಿಖಾ ಸ್ಥಿತಿಯನ್ನು ನೈಜ ಸಮಯದಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.' : 'Check real-time investigation progress using your petition number.',
      btn: lang === 'kn' ? 'ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Status',
      icon: Search,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      title: lang === 'kn' ? 'ಕಳೆದುಹೋದ ಮತ್ತು ಸಿಕ್ಕಿದ ಆಸ್ತಿ' : 'Lost and Found',
      desc: lang === 'kn' ? 'ಕಳೆದುಹೋದ ವಸ್ತುಗಳನ್ನು ವರದಿ ಮಾಡಿ ಅಥವಾ ಹುಡುಕಿ.' : 'Search lost documents, mobile devices, and report found articles.',
      btn: lang === 'kn' ? 'ವರದಿ ವೀಕ್ಷಿಸಿ' : 'Explore Items',
      icon: Search,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200'
    },
    {
      title: lang === 'kn' ? 'ಪೋಲಿಸ್ ಠಾಣೆ ಹುಡುಕಿ' : 'Find Police Station',
      desc: lang === 'kn' ? 'ನಿಮ್ಮ ಹತ್ತಿರದ ಪೋಲಿಸ್ ಠಾಣೆಯನ್ನು ನಕ್ಷೆಯಲ್ಲಿ ಗುರುತಿಸಿ.' : 'Locate nearest jurisdictional police station with contact numbers.',
      btn: lang === 'kn' ? 'ಠಾಣೆ ಹುಡುಕಿ' : 'Locate Station',
      icon: MapPin,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      title: lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು' : 'Safety Tips',
      desc: lang === 'kn' ? 'ಮಹಿಳೆಯರು, ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ಮಕ್ಕಳಿಗಾಗಿ ಸುರಕ್ಷತಾ ಮಾರ್ಗದರ್ಶಿ.' : 'Essential safety guidelines for cyber security, women & child safety.',
      btn: lang === 'kn' ? 'ಸಲಹೆಗಳನ್ನು ಓದಿ' : 'Read Guidelines',
      icon: ShieldCheck,
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      title: lang === 'kn' ? 'ಸಮುದಾಯ ಜಾಗೃತಿ' : 'Community Awareness',
      desc: lang === 'kn' ? 'ಅಪರಾಧ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಜಾಗೃತಿ ಅಭಿಯಾನಗಳು.' : 'Latest crime prevention campaigns, traffic rules, and drug awareness.',
      btn: lang === 'kn' ? 'ಅಭಿಯಾನ ವೀಕ್ಷಿಸಿ' : 'View Campaigns',
      icon: HeartHandshake,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Back Navigation Button */}
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-blue-700" />
              <span>{lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
            </button>

            {/* Logo & Branding */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={kspLogo} 
                alt="Karnataka State Police Official Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <Shield size={28} className="text-blue-700 hidden sm:block" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-blue-900 tracking-tight leading-tight uppercase font-heading">
                  Karnataka State Police
                </h1>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                  Crime Intelligence Platform
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 text-xs font-bold text-blue-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe size={14} className="text-blue-600" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <Link 
              to="/citizen-portal" 
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors"
            >
              {lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen Portal'}
            </Link>

            <Link 
              to="/emergency-services" 
              className="px-3 py-1.5 rounded-lg hover:bg-red-50 text-rose-700 font-semibold text-xs border border-transparent hover:border-red-200 transition-colors"
            >
              {lang === 'kn' ? 'ತುರ್ತು ಸೇವೆಗಳು (112)' : 'Emergency Services'}
            </Link>

            <button 
              onClick={() => navigate('/')} 
              className="px-3.5 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">{lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Officer Login'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck size={14} /> {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸೇವಾ ಕೇಂದ್ರ' : 'Public Information & Assistance'}
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-white">
              {lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen Portal'}
            </h1>
            
            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
              {lang === 'kn' 
                ? 'ಸಾರ್ವಜನಿಕ ಪೋಲಿಸ್ ಸೇವೆಗಳು, ಸುರಕ್ಷತಾ ಮಾಹಿತಿ ಮತ್ತು ಆನ್‌ಲೈನ್ ನೆರವನ್ನು ಸುಲಭವಾಗಿ ಪಡೆಯಿರಿ.' 
                : 'Access public police services, safety information and online assistance with official transparency.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="#services-grid" 
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText size={18} /> {lang === 'kn' ? 'ದೂರು ಸಲ್ಲಿಸಿ' : 'Report Complaint'}
              </a>

              <a 
                href="#track-section" 
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur flex items-center gap-2 transition-all cursor-pointer"
              >
                <Search size={18} /> {lang === 'kn' ? 'ದೂರು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ' : 'Track Complaint'}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="services-grid" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            {lang === 'kn' ? 'ಸಾರ್ವಜನಿಕ ಸೇವೆಗಳು' : 'Online Citizen Services'}
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            {lang === 'kn' ? 'ನಾಗರಿಕರಿಗಾಗಿ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೋಲಿಸ್ ಒದಗಿಸುವ ಪ್ರಮುಖ ಸೇವೆಗಳು' : 'Select a service below to register petitions, track status, or locate police stations.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${svc.color}`}>
                  <svc.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{svc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{svc.desc}</p>
              </div>

              <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer">
                <span>{svc.btn}</span>
                <ChevronRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Complaint Tracker Interactive Widget */}
      <section id="track-section" className="bg-blue-50 py-12 px-6 border-y border-blue-100">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border border-blue-200 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4">
            <Search size={22} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {lang === 'kn' ? 'ಅರ್ಜಿ / ದೂರು ಸ್ಥಿತಿ ಪರಿಶೀಲನೆ' : 'Track Complaint Petition Status'}
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            {lang === 'kn' ? 'ನಿಮ್ಮ ದೂರು ಸ್ವೀಕೃತಿ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಉದಾ: KSP/2026/9941)' : 'Enter your registered petition acknowledgement reference number (e.g. KSP/2026/8841)'}
          </p>

          <form onSubmit={handleTrackComplaint} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-4">
            <input 
              type="text" 
              value={complaintIdInput}
              onChange={e => setComplaintIdInput(e.target.value)}
              placeholder="e.g. KSP/2026/8841"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-medium text-slate-800"
            />
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow transition-colors cursor-pointer"
            >
              {lang === 'kn' ? 'ಪರಿಶೀಲಿಸಿ' : 'Track'}
            </button>
          </form>

          {trackStatus && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold text-left flex items-start gap-2"
            >
              <UserCheck size={18} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>{trackStatus}</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Emergency Contacts Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            {lang === 'kn' ? 'ತುರ್ತು ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು' : 'Emergency Contacts & Helplines'}
          </h2>
          <p className="text-sm text-slate-500">
            {lang === 'kn' ? 'ಯಾವುದೇ ರೀತಿಯ ಅಪಾಯದಲ್ಲಿ ತಕ್ಷಣ ಈ ಸಂಖ್ಯೆಗಳಿಗೆ ಕರೆ ಮಾಡಿ' : 'Toll-free 24/7 helplines for immediate police, medical, and cyber response.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {emergencyHelplines.map((hl, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-sm ${hl.bg}`}>
                  <hl.icon size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{hl.title}</h4>
                <div className="text-2xl font-black text-slate-900 tracking-tight mb-1">{hl.number}</div>
                <p className="text-[11px] text-slate-500">{hl.desc}</p>
              </div>
              <a 
                href={`tel:${hl.number}`} 
                className="mt-4 py-2 px-3 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-bold text-center transition-colors block"
              >
                {lang === 'kn' ? 'ಕರೆ ಮಾಡಿ' : 'Call Helpline'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="bg-white py-16 px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              {lang === 'kn' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-sm text-slate-500">
              {lang === 'kn' ? 'ನಾಗರಿಕ ಸೇವೆಗಳ ಕುರಿತು ಮಾಹಿತಿ' : 'Clear guidance on reporting complaints, tracking petitions, and contacting police.'}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 bg-slate-50 hover:bg-slate-100 text-left font-bold text-slate-900 text-sm sm:text-base flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 bg-white border-t border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
