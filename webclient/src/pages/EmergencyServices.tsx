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
      color: 'bg-red-600 border-red-700 text-white'
    },
    {
      title: lang === 'kn' ? 'ಅಗ್ನಿಶಾಮಕ ದಳ' : 'Fire & Rescue Service',
      number: '101',
      desc: lang === 'kn' ? 'ಅಗ್ನಿ ಅವಘಡಗಳು ಮತ್ತು ತಕ್ಷಣದ ರಕ್ಷಣೆಗಾಗಿ' : 'Immediate response for fire breakouts, building collapses & rescue.',
      icon: Flame,
      color: 'bg-amber-600 border-amber-700 text-white'
    },
    {
      title: lang === 'kn' ? 'ಆಂಬುಲೆನ್ಸ್ ವೈದ್ಯಕೀಯ ಸೇವೆ' : 'Emergency Ambulance Service',
      number: '108',
      desc: lang === 'kn' ? 'ತೀವ್ರ ವೈದ್ಯಕೀಯ ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಆಸ್ಪತ್ರೆ ಸಾಗಣೆ' : '24/7 critical medical response and immediate patient transport.',
      icon: Ambulance,
      color: 'bg-emerald-600 border-emerald-700 text-white'
    },
    {
      title: lang === 'kn' ? 'ಮಹಿಳಾ ಸುರಕ್ಷತಾ ಸಹಾಯವಾಣಿ' : 'Women Safety Protection',
      number: '1091',
      desc: lang === 'kn' ? 'ಮಹಿಳೆಯರ ಮೇಲಿನ ದೌರ್ಜನ್ಯ ಮತ್ತು ರಕ್ಷಣೆಗೆ 24/7 ನೆರವು' : 'Dedicated round-the-clock emergency assistance for women in distress.',
      icon: Shield,
      color: 'bg-pink-600 border-pink-700 text-white'
    },
    {
      title: lang === 'kn' ? 'ಮಕ್ಕಳ ರಕ್ಷಣಾ ಸಹಾಯವಾಣಿ' : 'Childline Emergency',
      number: '1098',
      desc: lang === 'kn' ? 'ಅಪಾಯದಲ್ಲಿರುವ ಮಕ್ಕಳ ತಕ್ಷಣದ ಸುರಕ್ಷತೆ ಮತ್ತು ರಕ್ಷಣೆ' : 'Free national helpline for children needing care, protection & rescue.',
      icon: HeartHandshake,
      color: 'bg-blue-600 border-blue-700 text-white'
    },
    {
      title: lang === 'kn' ? 'ಸೈಬರ್ ಕ್ರೈಮ್ ಆರ್ಥಿಕ ವಂಚನೆ' : 'National Cyber Financial Helpline',
      number: '1930',
      desc: lang === 'kn' ? 'ಆನ್‌ಲೈನ್ ಆರ್ಥಿಕ ವಂಚನೆಯಾದ ತಕ್ಷಣ ಕರೆ ಮಾಡಿ ಖಾತೆ ಬ್ಲಾಕ್ ಮಾಡಿ' : 'Toll-free helpline to report financial bank frauds within golden hour.',
      icon: ShieldAlert,
      color: 'bg-indigo-600 border-indigo-700 text-white'
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* Public Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Back Navigation Button */}
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-red-600" />
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
              <Shield size={28} className="text-red-600 hidden sm:block" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-blue-950 tracking-tight leading-tight uppercase font-heading">
                  Karnataka State Police
                </h1>
                <p className="text-[11px] sm:text-xs font-bold text-red-600 font-mono">
                  Emergency Command & Control Center (112)
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-red-600 text-xs font-bold text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe size={14} className="text-red-600" />
              <span>{lang === 'kn' ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <Link 
              to="/citizen-portal" 
              className="px-3 py-1.5 rounded-lg hover:bg-blue-50 text-blue-800 font-bold text-xs border border-transparent hover:border-blue-200 transition-colors"
            >
              {lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen Portal'}
            </Link>

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

      {/* Red Alert Emergency Hero Banner */}
      <section className="bg-gradient-to-r from-red-700 via-red-800 to-rose-900 text-white py-16 px-6 relative overflow-hidden shadow-xl">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/40 text-white text-xs font-black uppercase tracking-widest mb-6 animate-pulse shadow-sm">
              <AlertOctagon size={16} className="text-amber-300" />
              {lang === 'kn' ? 'ರಾಷ್ಟ್ರೀಯ ತುರ್ತು ಪ್ರತಿಕ್ರಿಯಾ ವ್ಯವಸ್ಥೆ (112)' : '24/7 Immediate Emergency Assistance'}
            </span>

            <h1 className="text-3xl sm:text-6xl font-black tracking-tight mb-4 text-white uppercase font-heading drop-shadow-md">
              {lang === 'kn' ? 'ತಕ್ಷಣದ ಸಹಾಯ ಬೇಕೇ?' : 'Need Immediate Help?'}
            </h1>

            <p className="text-base sm:text-xl text-red-50 font-medium max-w-2xl mx-auto leading-relaxed mb-8">
              {lang === 'kn' 
                ? 'ಯಾವುದೇ ಆಪತ್ತು ಅಥವಾ ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ತಕ್ಷಣ 112 ಗೆ ಕರೆ ಮಾಡಿ.' 
                : 'Dial 112 for immediate dispatch of Police, Fire, or Ambulance services anywhere in Karnataka.'}
            </p>

            <div className="flex justify-center">
              <a 
                href="tel:112"
                className="group relative inline-flex items-center gap-4 px-8 py-5 rounded-2xl bg-white hover:bg-slate-100 text-red-700 font-black text-xl sm:text-2xl shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-red-200"
              >
                <PhoneCall size={32} className="text-red-600 animate-bounce" />
                <span>{lang === 'kn' ? '112 ಗೆ ಉಚಿತ ಕರೆ ಮಾಡಿ' : 'CALL 112 NOW'}</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Helpline Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {lang === 'kn' ? 'ವಿಶೇಷ ತುರ್ತು ಹೆಲ್ಪ್‌ಲೈನ್‌ಗಳು' : 'Specialized Emergency Cards'}
          </h2>
          <p className="text-sm font-semibold text-slate-600 max-w-xl mx-auto">
            {lang === 'kn' ? 'ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಅನುಗುಣವಾಗಿ ಸಂಬಂಧಿಸಿದ ತುರ್ತು ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿ' : 'Direct emergency numbers for police, fire, ambulance, women safety, and cyber fraud.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {emergencyCards.map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-md ${card.color}`}>
                  <card.icon size={26} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-1">{card.title}</h3>
                <div className="text-3xl font-black text-red-600 tracking-tight mb-2">{card.number}</div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed mb-6">{card.desc}</p>
              </div>

              <a 
                href={`tel:${card.number}`}
                className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <PhoneCall size={16} />
                <span>{lang === 'kn' ? 'ನೇರ ಕರೆ ಮಾಡಿ' : 'Call Number'} ({card.number})</span>
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Instructions Section */}
      <section className="bg-red-50/80 border-y-2 border-red-200 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider mb-2">
              <Info size={14} /> {lang === 'kn' ? 'ಮಾರ್ಗದರ್ಶಿ ನಿಯಮಗಳು' : 'Protocol Standard'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
              {lang === 'kn' ? 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಪಾಲಿಸಬೇಕಾದ ಕ್ರಮಗಳು' : 'What to Do in an Emergency'}
            </h2>
            <p className="text-sm font-bold text-red-900">
              {lang === 'kn' ? 'ತ್ವರಿತ ನೆರವು ಪಡೆಯಲು ಈ 4 ಸರಳ ನಿಯಮಗಳನ್ನು ಅನುಸರಿಸಿ' : 'Follow these 4 simple steps when calling emergency services.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructions.map((inst, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow">
                    {inst.step}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{inst.title}</h3>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{inst.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Police Station Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {lang === 'kn' ? 'ಹತ್ತಿರದ ಪೋಲಿಸ್ ಠಾಣೆ' : 'Nearest Police Station Location'}
          </h2>
          <p className="text-sm font-semibold text-slate-600">
            {lang === 'kn' ? 'ನಿಮ್ಮ ಹತ್ತಿರದ ಜಿಲ್ಲಾ ಮತ್ತು ನಗರ ಪೋಲಿಸ್ ಠಾಣೆಯ ಮಾಹಿತಿಯನ್ನು ವೀಕ್ಷಿಸಿ' : 'Locate nearby stations across Bengaluru, Mysuru, Mangaluru, Belagavi and all districts.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-3">
          <div className="p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-4 border border-blue-300 shadow-sm">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {lang === 'kn' ? 'ನಗರ ನಿಯಂತ್ರಣ ಕೊಠಡಿ' : 'Nearest Jurisdictional Station'}
              </h3>
              <p className="text-xs font-bold text-slate-700 mb-4 leading-relaxed">
                {lang === 'kn'
                  ? 'ಬೆಂಗಳೂರು ನಗರ ಪೋಲಿಸ್ ಪ್ರಧಾನ ಕಛೇರಿ, ಇನ್‌ಸ್ಪೆಕ್ಟರ್ ಕಚೇರಿ.'
                  : 'Bengaluru City Police Headquarters & District Command Control Rooms.'}
              </p>
              <div className="space-y-2 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{lang === 'kn' ? 'ಅಪರಾಧ ತನಿಖಾ ವಿಭಾಗ' : 'Crime Investigation Division'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{lang === 'kn' ? '24/7 ಪಿಸಿಆರ್ ವಾಹನ ನಿಯೋಜನೆ' : '24/7 Mobile Patrol PCR Support'}</span>
                </div>
              </div>
            </div>

            <button className="mt-8 py-3.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm">
              <Compass size={16} />
              <span>{lang === 'kn' ? 'ಗೂಗಲ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ವೀಕ್ಷಿಸಿ' : 'Open Directions in Google Maps'}</span>
            </button>
          </div>

          {/* Map Section */}
          <div className="lg:col-span-2 bg-blue-900 relative min-h-[300px] flex items-center justify-center text-white p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-800 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Compass size={36} className="text-cyan-300 animate-spin-slow" />
              </div>
              <h4 className="text-lg sm:text-xl font-black text-white mb-2 tracking-wide font-heading">
                {lang === 'kn' ? 'ಕರ್ನಾಟಕ ಪೋಲಿಸ್ ಜಿಪಿಎಸ್ ನಕ್ಷೆ ಸಕ್ರಿಯವಾಗಿದೆ' : 'Karnataka Police GPS Map GIS Active'}
              </h4>
              <p className="text-xs sm:text-sm font-bold text-cyan-200 max-w-md mx-auto leading-relaxed">
                {lang === 'kn' 
                  ? 'ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಸ್ಥಳದ ಆಧಾರದ ಮೇಲೆ ಹತ್ತಿರದ ಪೋಲಿಸ್ ಠಾಣೆಗಳನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ.'
                  : 'Automated location detection tracing closest district station and patrol vehicle.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
