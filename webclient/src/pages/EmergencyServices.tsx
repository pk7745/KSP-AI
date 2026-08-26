import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, PhoneCall, AlertOctagon, Flame, Ambulance, 
  ShieldAlert, HeartHandshake, MapPin, Globe, Lock, 
  CheckCircle2, Compass, Radio, Volume2, Info, ArrowLeft
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer/Footer';
import kspLogo from '../assets/ksp-logo.svg';

export function EmergencyServices() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language === 'kn' ? 'kn' : 'en';

  const toggleLanguage = () => {
    i18n.changeLanguage(lang === 'kn' ? 'en' : 'kn');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  const emergencyCards = [
    {
      title: lang === 'kn' ? 'ಪೋಲಿಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ' : 'Police Emergency Response',
      number: '112',
      desc: lang === 'kn' ? 'ಯಾವುದೇ ಅಪರಾಧ, ಕಾನೂನು ಸುವ್ಯವಸ್ಥೆ ಮತ್ತು ಆಪತ್ತಿನ ಸಂದರ್ಭದಲ್ಲಿ' : 'Immediate dispatch of jurisdictional PCR vehicles for crime & law order.',
      icon: ShieldAlert,
      color: 'bg-red-950/80 border-red-500/50 text-red-400'
    },
    {
      title: lang === 'kn' ? 'ಅಗ್ನಿಶಾಮಕ ದಳ' : 'Fire & Rescue Service',
      number: '101',
      desc: lang === 'kn' ? 'ಅಗ್ನಿ ಅವಘಡಗಳು ಮತ್ತು ತಕ್ಷಣದ ರಕ್ಷಣೆಗಾಗಿ' : 'Immediate response for fire breakouts, building collapses & rescue.',
      icon: Flame,
      color: 'bg-amber-950/80 border-amber-500/50 text-amber-400'
    },
    {
      title: lang === 'kn' ? 'ಆಂಬುಲೆನ್ಸ್ ವೈದ್ಯಕೀಯ ಸೇವೆ' : 'Emergency Ambulance Service',
      number: '108',
      desc: lang === 'kn' ? 'ತೀವ್ರ ವೈದ್ಯಕೀಯ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಸಾಗಣೆ' : '24/7 critical medical response and immediate patient transport.',
      icon: Ambulance,
      color: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
    },
    {
      title: lang === 'kn' ? 'ಮಹಿಳಾ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ' : 'Women Safety Protection',
      number: '1091',
      desc: lang === 'kn' ? 'ಮಹಿಳೆಯರ ಮೇಲಿನ ದೌರ್ಜನ್ಯ ಮತ್ತು ರಕ್ಷಣೆಗೆ 24/7 ನೆರವು' : 'Dedicated round-the-clock emergency assistance for women in distress.',
      icon: Shield,
      color: 'bg-pink-950/80 border-pink-500/50 text-pink-400'
    },
    {
      title: lang === 'kn' ? 'ಮಕ್ಕಳ ರಕ್ಷಣಾ ಸಹಾಯವಾಣಿ' : 'Childline Emergency',
      number: '1098',
      desc: lang === 'kn' ? 'ಅಪಾಯದಲ್ಲಿರುವ ಮಕ್ಕಳ ತಕ್ಷಣದ ಸುರಕ್ಷತೆ ಮತ್ತು ರಕ್ಷಣೆ' : 'Free national helpline for children needing care, protection & rescue.',
      icon: HeartHandshake,
      color: 'bg-blue-950/80 border-blue-500/50 text-blue-400'
    },
    {
      title: lang === 'kn' ? 'ಸೈಬರ್ ಕ್ರೈಮ್ ಆರ್ಥಿಕ ವಂಚನೆ' : 'National Cyber Financial Helpline',
      number: '1930',
      desc: lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ಆರ್ಥಿಕ ವಂಚನೆಯಾದ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ ಖಾತೆ ಬ್ಲಾಕ್ ಮಾಡಿ' : 'Toll-free helpline to report financial bank frauds within golden hour.',
      icon: ShieldAlert,
      color: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400'
    }
  ];

  const instructions = [
    {
      step: '1',
      title: lang === 'kn' ? 'ಶಾಂತವಾಗಿರಿ' : 'Stay Calm',
      desc: lang === 'kn' ? 'ಗಾಬರಿಯಾಗಬೇಡಿ, ನಿಖರವಾದ ವಿವರಗಳನ್ನು ನೀಡಲು ಸಿದ್ಧರಾಗಿ.' : 'Take a deep breath. Clear communication helps police dispatchers respond faster.'
    },
    {
      step: '2',
      title: lang === 'kn' ? 'ಸ್ಥಳವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ' : 'Share Location',
      desc: lang === 'kn' ? 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳ, ಹೆಗ್ಗುರುತು ಅಥವಾ ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್ ತಿಳಿಸಿ.' : 'State your exact location, nearby landmark, or street name clearly.'
    },
    {
      step: '3',
      title: lang === 'kn' ? 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಯನ್ನು ವಿವರಿಸಿ' : 'Explain Emergency',
      desc: lang === 'kn' ? 'ಅಪಾಯದ ಸ್ವರೂಪ ಮತ್ತು ಗಾಯಗೊಂಡವರ ಸಂಖ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ.' : 'Specify what happened, nature of danger, and if anyone needs medical assistance.'
    },
    {
      step: '4',
      title: lang === 'kn' ? 'ಮಾರ್ಗದರ್ಶನ ಪಾಲಿಸಿ' : 'Follow Instructions',
      desc: lang === 'kn' ? 'ನಿಯಂತ್ರಣ ಕೊಠಡಿಯ ಅಧಿಕಾರಿಗಳು ನೀಡುವ ಸಲಹೆಯನ್ನು ಅನುಸರಿಸಿ.' : 'Stay on the line. Follow police control room advice until help arrives.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Public Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-red-400" />
              <span>{lang === 'kn' ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
            </button>

            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={kspLogo} 
                alt="Karnataka State Police Official Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <Shield size={28} className="text-red-500 hidden sm:block" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-100 tracking-tight leading-tight uppercase font-heading">
                  Karnataka State Police
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-red-400 font-mono">
                  Emergency Command & Control Center (112)
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-red-500 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe size={14} className="text-red-400" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <Link 
              to="/citizen-portal" 
              className="px-3 py-1.5 rounded-lg hover:bg-slate-800 text-cyan-400 font-bold text-xs border border-slate-800 transition-colors"
            >
              {lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen Portal'}
            </Link>

            <Link 
              to="/emergency-services" 
              className="px-3 py-1.5 rounded-lg bg-red-950/80 text-red-400 font-bold text-xs border border-red-500/40 transition-colors"
            >
              {lang === 'kn' ? 'ತುರ್ತು ಸೇವೆಗಳು (112)' : 'Emergency Services'}
            </Link>

            <button 
              onClick={() => navigate('/')} 
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs shadow flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock size={13} />
              <span className="hidden sm:inline">{lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Officer Login'}</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Red Alert Emergency Hero Banner */}
      <section className="bg-gradient-to-b from-red-950/90 via-slate-950 to-slate-950 text-white py-16 px-6 relative overflow-hidden border-b border-red-900/30">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/60 border border-red-500/50 text-red-300 text-xs font-black uppercase tracking-widest mb-6 animate-pulse shadow-lg">
              <AlertOctagon size={16} className="text-red-400" />
              {lang === 'kn' ? 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯಾ ವ್ಯವಸ್ಥೆ (112)' : '24/7 Immediate Emergency Dispatch Hotline'}
            </span>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight mb-4 text-slate-100 uppercase font-heading drop-shadow-md">
              {lang === 'kn' ? 'ತಕ್ಷಣದ ಸಹಾಯ ಬೇಕೇ?' : 'Need Immediate Police Help?'}
            </h1>

            <p className="text-base sm:text-xl text-red-200 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
              {lang === 'kn' 
                ? 'ಯಾವುದೇ ಆಪತ್ತು ಅಥವಾ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ.' 
                : 'Dial 112 for immediate 24/7 dispatch of Police, Fire, or Ambulance services anywhere in Karnataka.'}
            </p>

            <div className="flex justify-center">
              <a 
                href="tel:112"
                className="group relative inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xl sm:text-2xl shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border border-red-400"
              >
                <PhoneCall size={32} className="text-white animate-bounce" />
                <span>{lang === 'kn' ? '112 ಗೆ ಉಚಿತ ಕರೆ ಮಾಡಿ' : 'CALL 112 NOW'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Helpline Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 mb-2">
            {lang === 'kn' ? 'ವಿಶೇಷ ತುರ್ತು ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು' : 'Specialized Emergency Hotlines'}
          </h2>
          <p className="text-sm font-semibold text-slate-400 max-w-xl mx-auto">
            {lang === 'kn' ? 'ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಅನುಗುಣವಾಗಿ ಸಂಬಂಧಿಸಿದ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ' : 'Direct toll-free hotlines for police response, fire, medical ambulance, women safety, and cyber fraud.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyCards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 border border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${card.color}`}>
                  <card.icon size={26} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-100 mb-1">{card.title}</h3>
                <div className="text-3xl font-black text-red-400 tracking-tight font-mono mb-2">{card.number}</div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">{card.desc}</p>
              </div>

              <a 
                href={`tel:${card.number}`}
                className="w-full py-3 px-4 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <PhoneCall size={16} />
                <span>{lang === 'kn' ? 'ನೇರ ಕರೆ ಮಾಡಿ' : 'Call Toll-Free'} ({card.number})</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Instructions Section */}
      <section className="bg-slate-900/60 border-y border-slate-800 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2">
              <Info size={14} />
              {lang === 'kn' ? 'ತುರ್ತು ಜಾಗೃತಿ' : 'Safety Instructions'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              {lang === 'kn' ? '112 ಗೆ ಕರೆ ಮಾಡುವಾಗ ಅನುಸರಿಸಬೇಕಾದ ಕ್ರಮಗಳು' : 'What to Do When Calling 112'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructions.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-extrabold flex items-center justify-center text-sm font-mono">
                  0{item.step}
                </div>
                <h4 className="font-extrabold text-slate-100 text-base">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
