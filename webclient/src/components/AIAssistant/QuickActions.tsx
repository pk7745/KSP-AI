import React from 'react';
import { HelpCircle, FileText, Search, Map, Bell, Keyboard, UserCheck } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { showToast } from '../../utils/toast';

interface QuickActionsProps {
  lang: 'en' | 'kn';
}

export function QuickActions({ lang }: QuickActionsProps) {
  const { setCurrentView, openCase360 } = useNavigation();

  const actions = [
    {
      label: lang === 'kn' ? 'ಈ ಪುಟವನ್ನು ವಿವರಿಸಿ' : 'Explain this page',
      icon: HelpCircle,
      action: () => showToast('Assistant: Displaying detailed page guidance')
    },
    {
      label: lang === 'kn' ? 'ಶಾರ್ಟ್‌ಕಟ್‌ಗಳನ್ನು ತೋರಿಸಿ' : 'Show keyboard shortcuts',
      icon: Keyboard,
      action: () => showToast('Shortcuts: [Alt+S] Search, [Alt+D] Dashboard, [Alt+C] Cases')
    },
    {
      label: lang === 'kn' ? 'ವರದಿ ರಚಿಸಿ' : 'Generate report',
      icon: FileText,
      action: () => setCurrentView('reports')
    },
    {
      label: lang === 'kn' ? 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಿ' : 'Search FIR',
      icon: Search,
      action: () => setCurrentView('cases')
    },
    {
      label: lang === 'kn' ? 'ಅಪರಾಧ ನಕ್ಷೆ ತೆರೆಯಿರಿ' : 'Open Crime Map',
      icon: Map,
      action: () => setCurrentView('predictive')
    },
    {
      label: lang === 'kn' ? 'ಸೂಚನೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ' : 'View Notifications',
      icon: Bell,
      action: () => setCurrentView('dashboard')
    },
    {
      label: lang === 'kn' ? 'ಅಧಿಕಾರಿಯನ್ನು ಹುಡುಕಿ' : 'Search officer',
      icon: UserCheck,
      action: () => setCurrentView('officer')
    }
  ];

  return (
    <div className="mt-3 pt-3 border-t border-slate-800">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
        {lang === 'kn' ? 'ತ್ವರಿತ ಕ್ರಮಗಳು:' : 'Helpful Quick Actions:'}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {actions.map((act, idx) => (
          <button
            key={idx}
            onClick={act.action}
            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <act.icon size={11} className="text-cyan-400" />
            <span>{act.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
