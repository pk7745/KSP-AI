import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Sparkles, CheckCircle2, ArrowRight, LayoutDashboard, FileText,
  Microscope, MessageSquare, Map, Network, BarChart2, Users, AlertCircle,
  Activity, Search, ShieldAlert, Cpu, Bell, Check
} from 'lucide-react';
import type { TourScene } from '../../data/tourScenes';
import kspLogo from '../../assets/ksp-logo.svg';

interface SceneRendererProps {
  scene: TourScene;
  onEnterPlatform?: () => void;
  lang?: 'en' | 'kn';
}

export const SceneRenderer: React.FC<SceneRendererProps> = React.memo(({ scene, onEnterPlatform, lang = 'en' }) => {
  const isKn = lang === 'kn';

  const title = scene.title[lang] || scene.title.en;
  const subtitle = scene.subtitle[lang] || scene.subtitle.en;

  return (
    <div className="w-full max-w-5xl mx-auto h-[54vh] sm:h-[58vh] flex flex-col justify-between p-4 sm:p-6 bg-white border-2 border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xl relative overflow-hidden backdrop-blur-2xl my-1 text-slate-900 font-sans will-change-transform shrink-0">
      
      {/* Ambient Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.12, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-40 -left-40 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" 
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`${scene.id}-${lang}`}
          initial={{ opacity: 0, scale: 0.99, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.005, y: -4 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 flex flex-col items-center text-center justify-between h-full w-full"
        >
          {/* Scene Header */}
          <div className="mb-2 space-y-0.5 shrink-0">
            <span className="px-3 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-900 text-[10px] sm:text-xs font-black uppercase tracking-wider inline-block">
              {isKn ? `ದೃಶ್ಯ ${scene.id} / 10 • ಕರ್ನಾಟಕ ಪೋಲಿಸ್` : `Scene ${scene.id} of 10 • KSP AI Intelligence`}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-heading tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-[11px] sm:text-xs font-extrabold text-blue-900 max-w-xl mx-auto line-clamp-1">
              {subtitle}
            </p>
          </div>

          {/* Dedicated Bulletproof Visual UI Previews (Scene 1 to 10) */}
          <div className="w-full flex-1 my-1 overflow-hidden flex flex-col items-center justify-center">
            
            {/* Scene 1: Welcome & CCTNS Integration */}
            {scene.id === 1 && (
              <div className="space-y-4 max-w-2xl mx-auto py-2 h-full flex flex-col justify-center">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-blue-50 border-2 border-blue-200 p-3 flex items-center justify-center mx-auto shadow-lg"
                >
                  <img src={kspLogo} alt="KSP Logo" className="w-full h-full object-contain" decoding="sync" />
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <div className="text-lg sm:text-xl font-black text-blue-900">1,024+</div>
                    <div className="text-[11px] font-bold text-slate-600">{isKn ? 'CCTNS ಪ್ರಕರಣಗಳು' : 'CCTNS Case Ledger'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <div className="text-lg sm:text-xl font-black text-emerald-700">31</div>
                    <div className="text-[11px] font-bold text-slate-600">{isKn ? 'ಕರ್ನಾಟಕ ಜಿಲ್ಲೆಗಳು' : 'Karnataka Districts'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                    <div className="text-lg sm:text-xl font-black text-indigo-900">100%</div>
                    <div className="text-[11px] font-bold text-slate-600">{isKn ? 'ಎಐ ಭದ್ರತಾ ಪ್ರವೇಶ' : 'RBAC Clearance'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 2: Real-time Intelligence Dashboard */}
            {scene.id === 2 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <LayoutDashboard size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ರಾಜ್ಯ ಮಟ್ಟದ ಅಪರಾಧ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್' : 'Statewide Crime Dashboard'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold animate-pulse">● {isKn ? 'ಲೈವ್ ಸಿಂಕ್' : 'LIVE SYNC'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ಒಟ್ಟು ಪ್ರಕರಣಗಳು' : 'Total Cases'}</div>
                    <div className="text-lg font-black text-cyan-400 font-mono">1,024</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ನಿರ್ಣಾಯಕ ಎಚ್ಚರಿಕೆ' : 'Critical Alerts'}</div>
                    <div className="text-lg font-black text-rose-400 font-mono">18</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ತನಿಖೆಯಲ್ಲಿದೆ' : 'Active FIRs'}</div>
                    <div className="text-lg font-black text-emerald-400 font-mono">412</div>
                  </div>
                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ಘೋರ ಅಪರಾಧಗಳು' : 'Heinous Crimes'}</div>
                    <div className="text-lg font-black text-amber-400 font-mono">87</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 3: FIR Dossier & Case Management */}
            {scene.id === 3 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಎಫ್‌ಐಆರ್ ಪ್ರಕರಣಗಳ ರಿಜಿಸ್ಟರ್' : 'CCTNS FIR Case Database'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">FIR #0142/2026</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-cyan-300">CRIME #0142/2026 • WHITEFIELD PS</div>
                      <div className="text-[11px] text-slate-300 font-medium">{isKn ? 'ಸೈಬರ್ ಹಣಕಾಸು ವಂಚನೆ • ಐಪಿಸಿ 420' : 'Cyber Financial Fraud • IPC Sec 420'}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">{isKn ? 'ತನಿಖೆಯಲ್ಲಿದೆ' : 'Under Investigation'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-cyan-300">CRIME #0139/2026 • MYSURU CITY PS</div>
                      <div className="text-[11px] text-slate-300 font-medium">{isKn ? 'ಘೋರ ಕಳವು ಪ್ರಕರಣ • ಐಪಿಸಿ 379' : 'Grand Larceny & Burglary • IPC Sec 379'}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">{isKn ? 'ದೋಷಾರೋಪ ಸಲ್ಲಿಕೆ' : 'Charge Sheeted'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 4: AI Forensic Evidence Analysis (Gemini OCR) */}
            {scene.id === 4 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Microscope size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಎಐ ಫೋರೆನ್ಸಿಕ್ ಸಾಕ್ಷ್ಯ ಒಸಿಆರ್' : 'AI Evidence Forensic OCR'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">98.4% Confidence</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-cyan-500/40 space-y-2">
                  <div className="text-xs font-black text-cyan-300 flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-400" />
                    <span>{isKn ? 'ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಾಕ್ಷ್ಯದಿಂದ ಪ್ರತ್ಯೇಕಿಸಿದ ಶಂಕಿತರ ವಿವರಗಳು' : 'Extracted Entities from Forensic Document'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-slate-950 p-2 rounded text-slate-300">Name: Rajesh Kumar</div>
                    <div className="bg-slate-950 p-2 rounded text-slate-300">Aadhaar: XXXX-8912</div>
                    <div className="bg-slate-950 p-2 rounded text-slate-300">Bank: HDFC #901823912</div>
                    <div className="bg-slate-950 p-2 rounded text-slate-300">Phone: +91 9845012345</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 5: Gemini AI Legal Assistant */}
            {scene.id === 5 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಎಐ ತನಿಖಾಧಿಕಾರಿ ಕಾನೂನು ಸಹಾಯಕ' : 'AI Investigator Gemini Legal Assistant'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">IPC / BNS Legal Search</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-blue-950/80 p-2.5 rounded-xl border border-blue-800 text-blue-200">
                    <strong>Officer:</strong> {isKn ? 'ವೈಟ್‌ಫೀಲ್ಡ್ ಠಾಣೆಯ ಸೈಬರ್ ಪ್ರಕರಣಗಳ ವರದಿ ನೀಡಿ' : 'Generate legal dossier for active cyber cases in Whitefield.'}
                  </div>
                  <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 text-slate-200">
                    <strong>Gemini AI:</strong> {isKn ? 'ವೈಟ್‌ಫೀಲ್ಡ್ ಠಾಣೆಯ 14 ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ. ಐಪಿಸಿ 420 ಮತ್ತು ಐಟಿ ಕಾಯ್ದೆಯಡಿ ನ್ಯಾಯಾಲಯದ ಸಲ್ಲಿಕೆ ಪಿಡಿಎಫ್ ತಯಾರಾಗಿದೆ.' : 'Analyzed 14 active cases. Court-ready PDF summary with IPC 420 and IT Act sections is ready.'}
                  </div>
                </div>
              </div>
            )}

            {/* Scene 6: GIS Crime Hotspot Map */}
            {scene.id === 6 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Map size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಜಿಐಎಸ್ ಅಪರಾಧ ಸಾಂದ್ರತಾ ನಕ್ಷೆ' : 'GIS Spatial Crime Hotspots'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">Hoysala Route #14</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <div className="flex justify-center items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                    <span className="text-xs font-mono text-cyan-300 font-bold">HIGH RISK HOTSPOT • BENGALURU EAST (ZONE 4)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{isKn ? 'ಹೊಯ್ಸಳ ಗಸ್ತು ವಾಹನ 12 ಮತ್ತು 14 ಕ್ಕೆ ಸ್ವಯಂಚಾಲಿತ ಪ್ರಸ್ತುತ ಮಾರ್ಗ ಶಿಫಾರಸು ಕಳುಹಿಸಲಾಗಿದೆ.' : 'Automated Hoysala Mobile Patrol Dispatch recommended for peak risk hours (22:00 - 04:00).'}</p>
                </div>
              </div>
            )}

            {/* Scene 7: Criminal Nexus Network Graph */}
            {scene.id === 7 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Network size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಜಾಲ ವಿಶ್ಲೇಷಣೆ' : 'Criminal Syndicate Nexus Graph'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">Network Hub Active</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/40 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-purple-300 font-mono">SUSPECT: ANAND VERMA (HUB NODE)</div>
                    <div className="text-[11px] text-slate-400">{isKn ? '3 ಜಿಲ್ಲೆಗಳಲ್ಲಿ 7 ಒಡನಾಡಿಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿತ' : 'Linked with 7 repeat co-accused across 3 districts.'}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-purple-900 text-purple-200 font-bold text-[10px]">7 LINKED FIRs</span>
                </div>
              </div>
            )}

            {/* Scene 8: Automated Reports & Export */}
            {scene.id === 8 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart2 size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳ ರಫ್ತು' : 'Automated Master Crime Dossier'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">PDF / Excel Export</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                    <div className="font-bold text-cyan-300 mb-1">SCRB Monthly Intelligence Summary</div>
                    <div className="text-[10px] text-slate-400">PDF • Ready for Judicial Submission</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                    <div className="font-bold text-cyan-300 mb-1">District Crime Analytics Ledger</div>
                    <div className="text-[10px] text-slate-400">Excel • 1,024 Verified Incident Records</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 9: Officer Portal & Caseload */}
            {scene.id === 9 && (
              <div className="w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 text-left shadow-2xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-cyan-400" />
                    <span className="text-xs font-black text-white font-mono uppercase">{isKn ? 'ಅಧಿಕಾರಿ ಕಾರ್ಯಭಾರ ಪೋರ್ಟಲ್' : 'Officer Caseload & Scorecard'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">DSP Rank Clearance</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-lg font-black text-emerald-400 font-mono">92.4%</div>
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ಶಿಕ್ಷೆಯ ಪ್ರಮಾಣ' : 'Conviction Rate'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-lg font-black text-cyan-400 font-mono">14 Days</div>
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ಸರಾಸರಿ ಪರಿಹಾರ ಸಮಯ' : 'Avg Resolution'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
                    <div className="text-lg font-black text-amber-400 font-mono">8 Active</div>
                    <div className="text-[10px] text-slate-400 font-bold">{isKn ? 'ನಿಗದಿತ ಪ್ರಕರಣಗಳು' : 'Assigned Cases'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Scene 10: Closing Platform Synthesis */}
            {scene.id === 10 && (
              <div className="space-y-4 max-w-xl mx-auto py-2 h-full flex flex-col justify-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-900 border-2 border-blue-700 p-3 flex items-center justify-center mx-auto shadow-xl">
                  <Shield size={32} className="text-white" />
                </div>
                <p className="text-xs sm:text-sm font-extrabold text-slate-700">
                  {isKn 
                    ? 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಪಡೆಗೆ ಎಐ ತಂತ್ರಜ್ಞಾನ ಸಂಪೂರ್ಣವಾಗಿ ಸಿದ್ಧಗೊಂಡಿದೆ.' 
                    : 'The Karnataka State Police AI Crime Intelligence Platform is live and operational.'}
                </p>
                {onEnterPlatform && (
                  <button
                    onClick={onEnterPlatform}
                    aria-label="Enter Platform Now"
                    className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-xl transition-all cursor-pointer border-2 border-blue-600 flex items-center gap-2 mx-auto focus:ring-4 focus:ring-blue-400"
                  >
                    <span>{isKn ? 'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಪ್ರವೇಶಿಸಿ' : 'Enter Platform Now'}</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
