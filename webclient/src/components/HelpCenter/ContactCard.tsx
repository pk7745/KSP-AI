import React from 'react';
import { Mail, Phone, Clock, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';

interface ContactCardProps {
  lang?: 'en' | 'kn';
}

export const ContactCard: React.FC<ContactCardProps> = ({ lang = 'en' }) => {
  const isKn = lang === 'kn';

  return (
    <div className="w-full bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-800">
      {/* Ambient Mesh */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-4 text-cyan-300 text-xs font-black uppercase tracking-widest">
        <Shield size={16} className="text-amber-400" />
        <span>{isKn ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ • 24×7 ಅಧಿಕೃತ ಬೆಂಬಲ' : 'KSP Official Support Contacts'}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Support Email */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
          <div className="p-2.5 rounded-xl bg-blue-600/60 text-white shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {isKn ? 'ಇಮೇಲ್ ಬೆಂಬಲ' : 'Support Email'}
            </div>
            <a href="mailto:karnataka@ksp.gov.in" className="text-sm font-black text-white hover:text-cyan-300 transition-colors block mt-0.5 font-mono">
              karnataka@ksp.gov.in
            </a>
          </div>
        </div>

        {/* Support Phone */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
          <div className="p-2.5 rounded-xl bg-emerald-600/60 text-white shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {isKn ? 'ದೂರವಾಣಿ ಸಹಾಯವಾಣಿ' : 'Support Phone'}
            </div>
            <a href="tel:+918023456789" className="text-sm font-black text-white hover:text-cyan-300 transition-colors block mt-0.5 font-mono">
              +91 80 2345 6789
            </a>
          </div>
        </div>

        {/* Support Availability */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
          <div className="p-2.5 rounded-xl bg-amber-500/60 text-white shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {isKn ? 'ಲಭ್ಯತೆ' : 'Support Availability'}
            </div>
            <div className="text-xs font-black text-white mt-0.5">
              {isKn ? '24 ಗಂಟೆಗಳು • ವಾರದ 7 ದಿನಗಳು' : '24 Hours / 7 Days a Week'}
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all">
          <div className="p-2.5 rounded-xl bg-indigo-600/60 text-white shrink-0">
            <MessageSquare size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              {isKn ? 'ಪ್ರತಿಕ್ರಿಯೆ ಸಮಯ' : 'Response Time'}
            </div>
            <div className="text-xs font-black text-white mt-0.5">
              {isKn ? 'ಚಾಟ್‌ಬಾಟ್ ಮೂಲಕ ತಕ್ಷಣ • ಇಮೇಲ್ ಮೂಲಕ 1 ದಿನ' : 'Immediate via Chatbot / 1 Day via Email'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
