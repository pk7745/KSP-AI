import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Play, ArrowLeft, LayoutDashboard, Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PlatformTour } from '../components/PlatformTour/PlatformTour';
import { Footer } from '../components/Footer/Footer';
import kspLogo from '../assets/ksp-logo.svg';

export function AboutPlatform() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isTouring, setIsTouring] = useState(false);
  const lang = i18n.language === 'kn' ? 'kn' : 'en';
  const isKn = lang === 'kn';

  const toggleLanguage = () => {
    i18n.changeLanguage(isKn ? 'en' : 'kn');
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/dashboard');
    }
  };

  if (isTouring) {
    return (
      <PlatformTour
        onExit={() => setIsTouring(false)}
        onEnterPlatform={() => navigate('/dashboard')}
        lang={lang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Subtle Gradient Spheres */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Clean Light Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-blue-700" />
              <span>{isKn ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
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
                  {isKn ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್' : 'Karnataka State Police'}
                </h1>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-600">
                  {isKn ? 'ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್' : 'Crime Intelligence Platform'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:border-blue-500 text-xs font-bold text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer bg-white shadow-sm"
            >
              <Globe size={14} className="text-blue-600" />
              <span>{isKn ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <LayoutDashboard size={16} />
              <span>{isKn ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ' : 'Back to Dashboard'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean Light Style */}
      <main className="max-w-5xl mx-auto px-6 py-16 my-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/90 border border-blue-300 text-blue-900 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-blue-700" />
            <span>{isKn ? 'ಸಂವಾದಾತ್ಮಕ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪರಿಚಯ' : 'Interactive Platform Introduction'}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 uppercase font-heading leading-tight">
            {isKn ? 'ಕೆಎಸ್‌ಪಿ ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್' : 'KSP AI Crime Intelligence Platform'}
          </h1>

          <p className="text-base sm:text-2xl text-blue-950 max-w-3xl mx-auto font-extrabold leading-relaxed">
            {isKn
              ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್‌ಗಾಗಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ತನಿಖಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.'
              : 'AI Powered Investigation Platform for Karnataka State Police.'
            }
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            {isKn
              ? 'ಸಿಎಸ್‌ಟಿಎನ್‌ಎಸ್ ಕ್ರೈಮ್ ಡೇಟಾಬೇಸ್‌ಗಳೊಂದಿಗೆ ನೈಸರ್ಗಿಕ ಭಾಷೆಯಲ್ಲಿ (ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್) ಸಂವಹನ ನಡೆಸಿ, ಅಪರಾಧ ಶೈಲಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ.'
              : 'Empowering 1,100+ police stations across Karnataka with natural language RAG intelligence, 360-degree case analytics, and automated dossier exports.'
            }
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button
              onClick={() => setIsTouring(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-xl hover:scale-105 transition-all cursor-pointer border border-blue-950"
            >
              <Play size={20} className="fill-white" />
              <span>{isKn ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪರಿಚಯ ವೀಕ್ಷಿಸಿ' : 'Start Interactive Platform Tour'}</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
            >
              <LayoutDashboard size={20} className="text-blue-700" />
              <span>{isKn ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ' : 'Explore Live Dashboard'}</span>
            </button>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <CheckCircle2 size={26} className="text-blue-700 mb-3" />
              <h3 className="text-base font-extrabold text-slate-900 mb-1">{isKn ? '360° ಪ್ರಕರಣಗಳ ವಿಶ್ಲೇಷಣೆ' : '360° Case Intelligence'}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{isKn ? 'ಸಾಕ್ಷ್ಯಗಳು, ಅಪರಾಧಿಗಳು ಮತ್ತು ಕಾಲಾವಧಿ ವರದಿಗಳನ್ನು ಏಕೀಕೃತವಾಗಿ ವೀಕ್ಷಿಸಿ.' : 'Unified view of FIRs, evidence lockers, CCTV footage, and digital forensic reports.'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <CheckCircle2 size={26} className="text-emerald-600 mb-3" />
              <h3 className="text-base font-extrabold text-slate-900 mb-1">{isKn ? 'ದ್ವಿಭಾಷಾ ಎಐ ಸಹಾಯಕ' : 'Bilingual AI Assistant'}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{isKn ? 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ನೇರ ಆಜ್ಞೆಗಳು ಮತ್ತು ಧ್ವನಿ ಸಹಾಯಕ.' : 'Sub-10ms RAG querying in English & Kannada with dual-layer Google TTS audio.'}</p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md">
              <CheckCircle2 size={26} className="text-amber-600 mb-3" />
              <h3 className="text-base font-extrabold text-slate-900 mb-1">{isKn ? 'ಅಪರಾಧ ಜಾಲದ ಮ್ಯಾಪಿಂಗ್' : 'Criminal Nexus Mapping'}</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{isKn ? '22,471 ಕ್ಕೂ ಹೆಚ್ಚು ಸಂಪರ್ಕಿತ ಸಾಕ್ಷ್ಯಗಳನ್ನು ಮತ್ತು ಆಪಾದಿತರ ಲಿಂಕ್‌ಗಳನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ.' : 'Dynamic graph linking 22,471 entities across 28 CCTNS datasets with 0 orphans.'}</p>
            </div>
          </div>

        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
