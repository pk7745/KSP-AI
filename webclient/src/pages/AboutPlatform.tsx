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
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button 
              onClick={handleBack} 
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer mr-2 shadow-sm"
              title="Navigate Back"
            >
              <ArrowLeft size={14} className="text-blue-700" />
              <span>{isKn ? 'ಹಿಂದಕ್ಕೆ' : 'Back'}</span>
            </button>

            {/* Logo & Branding */}
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src={kspLogo} 
                alt="Karnataka State Police Logo" 
                className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <Shield size={28} className="text-blue-700 hidden sm:block" />
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-blue-900 tracking-tight leading-tight uppercase font-heading">
                  {isKn ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್' : 'Karnataka State Police'}
                </h1>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-500">
                  {isKn ? 'ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್' : 'Crime Intelligence Platform'}
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 text-xs font-bold text-blue-900 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Globe size={14} className="text-blue-600" />
              <span>{isKn ? 'English' : 'ಕನ್ನಡ'}</span>
            </button>

            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <LayoutDashboard size={16} />
              <span>{isKn ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ' : 'Back to Dashboard'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (FULL KANNADA & ENGLISH BILINGUAL SUPPORT) */}
      <main className="max-w-5xl mx-auto px-6 py-16 my-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 border border-blue-200 text-blue-900 text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles size={14} className="text-blue-600" />
            <span>{isKn ? 'ಸಂವಾದಾತ್ಮಕ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪರಿಚಯ' : 'Interactive Platform Introduction'}</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-900 uppercase font-heading">
            {isKn ? 'ಕೆಎಸ್‌ಪಿ ಎಐ ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್' : 'KSP AI Crime Intelligence Platform'}
          </h1>

          <p className="text-base sm:text-2xl text-blue-900 max-w-3xl mx-auto font-extrabold leading-relaxed">
            {isKn
              ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್‌ಗಾಗಿ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಆಧಾರಿತ ತನಿಖಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್.'
              : 'AI Powered Investigation Platform for Karnataka State Police.'
            }
          </p>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            {isKn
              ? 'ಸಿಎಸ್‌ಟಿಎನ್‌ಎಸ್ ಡಾಟಾ ಸಂಯೋಜನೆ, ಎಐ ಒಸಿಆರ್ ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆ, ಜೆಮಿನಿ ಕಾನೂನು ಸಹಾಯಕ, ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆ ಮತ್ತು ಅಪರಾಧಿಗಳ ಜಾಲ ನಕ್ಷೆಯನ್ನು ಪ್ರದರ್ಶಿಸುವ 10-ದೃಶ್ಯಗಳ ಪರಿಚಯಾತ್ಮಕ ಪ್ರಸ್ತುತಿಯನ್ನು ವೀಕ್ಷಿಸಿ.'
              : 'Experience our 10-scene interactive onboarding presentation highlighting CCTNS data integration, AI OCR evidence forensics, Gemini legal assistant, GIS hotspot mapping, and criminal network graphs.'
            }
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setIsTouring(true)}
              className="px-8 py-4 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-blue-700/20 flex items-center gap-3 transition-all transform hover:scale-105 cursor-pointer border border-blue-600"
            >
              <Play size={20} className="fill-current" />
              <span>{isKn ? 'ಪ್ರದರ್ಶನ ಪ್ರಾರಂಭಿಸಿ' : 'Start Platform Tour'}</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 text-slate-900 font-extrabold text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <LayoutDashboard size={18} />
              <span>{isKn ? 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ' : 'Back to Dashboard'}</span>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-4 rounded-2xl bg-transparent hover:bg-slate-200/60 text-slate-700 hover:text-slate-900 font-extrabold text-sm transition-all cursor-pointer"
            >
              <span>{isKn ? 'ಪ್ರದರ್ಶನ ಬಿಟ್ಟುಬಿಡಿ' : 'Skip Tour'}</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
