import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import kspLogo from '../../assets/ksp-logo.svg';

export function Footer() {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'kn' ? 'kn' : 'en';

  return (
    <footer className="bg-slate-900 text-slate-100 pt-12 pb-8 border-t-4 border-blue-600 shadow-inner">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        
        {/* Col 1: About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={kspLogo} alt="KSP Official Logo" className="h-10 w-10 object-contain bg-white rounded-full p-1" loading="lazy" />
            <Shield size={24} className="text-cyan-400" />
            <div>
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">Karnataka State Police</h4>
              <p className="text-xs text-cyan-300 font-bold">Crime Intelligence Platform</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            {lang === 'kn'
              ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ ಮತ್ತು ಅಪರಾಧ ನಿಯಂತ್ರಣಕ್ಕಾಗಿ 24/7 ಸೇವೆ ನೀಡುತ್ತಿದೆ.'
              : 'Official portal of Karnataka State Police dedicated to public safety, swift crime intelligence, and citizen services across all districts.'}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-widest mb-4 pb-1 border-b border-slate-700">
            {lang === 'kn' ? 'ಸೇವಾ ಲಿಂಕ್‌ಗಳು' : 'Quick Navigation'}
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li>
              <Link to="/citizen-portal" className="text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1">
                <span>•</span> {lang === 'kn' ? 'ನಾಗರಿಕ ಪೋರ್ಟಲ್' : 'Citizen Portal'}
              </Link>
            </li>
            <li>
              <Link to="/emergency-services" className="text-slate-200 hover:text-rose-400 transition-colors flex items-center gap-1">
                <span>•</span> {lang === 'kn' ? 'ತುರ್ತು ಸೇವೆಗಳು (112)' : 'Emergency Services (112)'}
              </Link>
            </li>
            <li>
              <Link to="/" className="text-slate-200 hover:text-cyan-300 transition-colors flex items-center gap-1">
                <span>•</span> {lang === 'kn' ? 'ಅಧಿಕಾರಿ ಲಾಗಿನ್' : 'Officer Portal Access'}
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Citizen Charter & Governance */}
        <div>
          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-widest mb-4 pb-1 border-b border-slate-700">
            {lang === 'kn' ? 'ನಾಗರಿಕ ಸನ್ನದು ಮತ್ತು ನಿಯಮಗಳು' : 'Citizen Charter & Legal'}
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold text-slate-200">
            <li><a href="#" className="hover:text-cyan-300 transition-colors">• {lang === 'kn' ? 'ನಾಗರಿಕ ಸನ್ನದು' : 'Citizen Charter'}</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition-colors">• {lang === 'kn' ? 'ಖಾಸಗಿತನದ ನೀತಿ' : 'Privacy Policy'}</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition-colors">• {lang === 'kn' ? 'ಬಳಕೆಯ ನಿಯಮಗಳು' : 'Terms & Conditions'}</a></li>
            <li><a href="#" className="hover:text-cyan-300 transition-colors">• {lang === 'kn' ? 'ಸೈಬರ್ ಭದ್ರತಾ ಮಾರ್ಗದರ್ಶಿ' : 'Cyber Safety Guidelines'}</a></li>
          </ul>
        </div>

        {/* Col 4: Contact Emergency */}
        <div>
          <h4 className="text-xs font-black text-cyan-300 uppercase tracking-widest mb-4 pb-1 border-b border-slate-700">
            {lang === 'kn' ? 'ಸಂಪರ್ಕ ಮತ್ತು ಸಹಾಯವಾಣಿ' : 'Emergency Contacts'}
          </h4>
          <div className="space-y-3 text-xs font-semibold text-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0">
                <Phone size={14} className="text-red-400" />
              </div>
              <span className="text-white font-bold">{lang === 'kn' ? 'ತುರ್ತು ಸಹಾಯವಾಣಿ: 112' : 'National Emergency: 112'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center shrink-0">
                <Phone size={14} className="text-cyan-400" />
              </div>
              <span className="text-white font-bold">{lang === 'kn' ? 'ಸೈಬರ್ ಕ್ರೈಮ್ ಹೆಲ್ಪ್‌ಲೈನ್: 1930' : 'Cyber Crime Helpline: 1930'}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-500/50 flex items-center justify-center shrink-0">
                <MapPin size={14} className="text-amber-400" />
              </div>
              <span>{lang === 'kn' ? 'ಪೋಲಿಸ್ ಪ್ರಧಾನ ಕಚೇರಿ, ನೃಪತುಂಗ ರಸ್ತೆ, ಬೆಂಗಳೂರು' : 'Police Headquarters, Nrupathunga Road, Bengaluru'}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-300 font-medium">
        <p>&copy; {new Date().getFullYear()} Karnataka State Police. All rights reserved. Government of Karnataka.</p>
        <div className="flex items-center gap-4 mt-3 md:mt-0 font-bold text-cyan-300">
          <span>Official Portal</span>
          <span>•</span>
          <span>Zoho Catalyst Cloud Engine</span>
        </div>
      </div>
    </footer>
  );
}
