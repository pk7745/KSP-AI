export interface FAQItem {
  id: string;
  question: { en: string; kn: string };
  answer: { en: string; kn: string };
  category: string;
  keywords: string[];
}

export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      en: 'How do I create a new FIR / Case?',
      kn: 'ಹೊಸ ಎಫ್‌ಐಆರ್ / ಪ್ರಕರಣವನ್ನು ಹೇಗೆ ನೋಂದಾಯಿಸುವುದು?'
    },
    answer: {
      en: 'Go to the Cases Database module from the sidebar and click the "+ New Case / Register FIR" button. Fill in FIR number, crime head, jurisdiction, and click Submit.',
      kn: 'ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಪ್ರಕರಣಗಳ ಡೇಟಾಬೇಸ್ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ "+ ಹೊಸ ಪ್ರಕರಣ ನೋಂದಾಯಿಸಿ" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ. ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ, ಅಪರಾಧ ಪ್ರಕಾರ ಮತ್ತು ಸ್ಥಳದ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಸಲ್ಲಿಸಿ.'
    },
    category: 'Cases',
    keywords: ['create', 'new', 'fir', 'case', 'register', 'add', 'ನೋಂದಣಿ', 'ಪ್ರಕರಣ']
  },
  {
    id: 'faq-2',
    question: {
      en: 'How do I upload evidence for AI OCR analysis?',
      kn: 'ಎಐ ಒಸಿಆರ್ ವಿಶ್ಲೇಷಣೆಗಾಗಿ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಹೇಗೆ ಅಪ್‌ಲೋಡ್ ಮಾಡುವುದು?'
    },
    answer: {
      en: 'Navigate to AI Evidence Analysis in the sidebar. Select your target FIR and drag-and-drop scanned forensic PDFs or images. The AI OCR engine automatically extracts bank accounts, suspect names, and Aadhaar numbers.',
      kn: 'ಎಐ ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ. ಫೋರೆನ್ಸಿಕ್ ಪಿಡಿಎಫ್ ಅಥವಾ ಚಿತ್ರಗಳನ್ನು ಡ್ರಾಗ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ. ಎಐ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಾಕ್ಷ್ಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.'
    },
    category: 'Evidence',
    keywords: ['upload', 'evidence', 'ocr', 'document', 'pdf', 'scan', 'ಸಾಕ್ಷ್ಯ', 'ಅಪ್‌ಲೋಡ್']
  },
  {
    id: 'faq-3',
    question: {
      en: 'How do I search criminals or suspect networks?',
      kn: 'ಕ್ರಿಮಿನಲ್‌ಗಳು ಅಥವಾ ಶಂಕಿತ ಜಾಲಗಳನ್ನು ಹೇಗೆ ಹುಡುಕುವುದು?'
    },
    answer: {
      en: 'Open Criminal Nexus from the sidebar. Type a suspect name, phone number, or Aadhaar ID into the search box to view linked cases, repeat offender hubs, and associate networks.',
      kn: 'ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ತೆರೆಯಿರಿ. ಶಂಕಿತರ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಆಧಾರ್ ಐಡಿ ನಮೂದಿಸಿ ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳು ಮತ್ತು ಜಾಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
    },
    category: 'Nexus',
    keywords: ['search', 'criminal', 'suspect', 'network', 'nexus', 'repeat offender', 'ಶಂಕಿತರು', 'ಕ್ರಿಮಿನಲ್']
  },
  {
    id: 'faq-4',
    question: {
      en: 'How does Criminal Nexus work?',
      kn: 'ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?'
    },
    answer: {
      en: 'Criminal Nexus analyzes shared addresses, phone numbers, vehicle registrations, and co-accused FIRs across Karnataka to automatically construct force-directed network graphs.',
      kn: 'ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳು, ವಾಹನ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಹಿಂದಿನ ಅಪರಾಧಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ನಕ್ಷೆಯನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.'
    },
    category: 'Nexus',
    keywords: ['nexus', 'work', 'graph', 'associates', 'syndicate', 'ನೆಕ್ಸಸ್', 'ಜಾಲ']
  },
  {
    id: 'faq-5',
    question: {
      en: 'How do I use the AI Investigator?',
      kn: 'ಎಐ ತನಿಖಾಧಿಕಾರಿ ಸಹಾಯಕವನ್ನು ಹೇಗೆ ಬಳಸುವುದು?'
    },
    answer: {
      en: 'Select AI Investigator from the sidebar. You can type or dictate queries in English or Kannada (e.g. "Show active cybercrime cases in Bengaluru"). It executes ZCQL queries on Zoho Catalyst and generates court-ready legal briefs.',
      kn: 'ಎಐ ತನಿಖಾಧಿಕಾರಿ ವಿಭಾಗವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ. ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಸಿಸಿಟಿಎನ್‌ಎಸ್ ಡೇಟಾಸ್ಟೋರ್‌ನಿಂದ ತಕ್ಷಣ ವರದಿ ಪಡೆಯಿರಿ.'
    },
    category: 'AI Assistant',
    keywords: ['ai', 'investigator', 'gemini', 'chat', 'ask', 'query', 'zcql', 'ತನಿಖಾಧಿಕಾರಿ']
  },
  {
    id: 'faq-6',
    question: {
      en: 'How do I download or export reports?',
      kn: 'ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ರಫ್ತು ಮಾಡುವುದು ಹೇಗೆ?'
    },
    answer: {
      en: 'Go to Automated Reports or AI Investigator and click "Export Master Dossier" for Excel spreadsheets or "Export PDF" for court-ready legal reports.',
      kn: 'ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು ಅಥವಾ ಎಐ ತನಿಖಾಧಿಕಾರಿ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ "Export PDF" ಅಥವಾ "ಮಾಸ್ಟರ್ ದಸ್ತಾವೇಜು ರಫ್ತು" ಕ್ಲಿಕ್ ಮಾಡಿ.'
    },
    category: 'Reports',
    keywords: ['download', 'export', 'pdf', 'excel', 'report', 'dossier', 'ರಫ್ತು', 'ವರದಿ']
  },
  {
    id: 'faq-7',
    question: {
      en: 'Where can I find notifications and alerts?',
      kn: 'ಸೂಚನೆಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ಎಲ್ಲಿ ಕಾಣಬಹುದು?'
    },
    answer: {
      en: 'Click the bell notification icon in the top header or view the Live CAD Sync panel inside the Intelligence Dashboard and Command Center.',
      kn: 'ಮೇಲಿನ ಹೆಡರ್‌ನಲ್ಲಿರುವ ಬೆಲ್ ಐಕಾನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಲೈವ್ ಕಂಟ್ರೋಲ್ ರೂಮ್ ವಿಭಾಗದಲ್ಲಿ ವೀಕ್ಷಿಸಿ.'
    },
    category: 'Alerts',
    keywords: ['notification', 'alert', 'bell', '112', 'cad', 'ಸೂಚನೆ', 'ಎಚ್ಚರಿಕೆ']
  },
  {
    id: 'faq-8',
    question: {
      en: 'How do I change my password or edit profile?',
      kn: 'ನನ್ನ ಗುಪ್ತಪದವನ್ನು ಬದಲಾಯಿಸುವುದು ಅಥವಾ ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸುವುದು ಹೇಗೆ?'
    },
    answer: {
      en: 'Open Officer Portal from the sidebar and click "Edit Profile". Enter your updated phone number, station assignment, or new password and click Save.',
      kn: 'ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್ ತೆರೆದು "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ. ಹೊಸ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ ಉಳಿಸಿ.'
    },
    category: 'Account',
    keywords: ['password', 'profile', 'change', 'edit', 'badge', 'account', 'ಗುಪ್ತಪದ', 'ಪ್ರೊಫೈಲ್']
  },
  {
    id: 'faq-9',
    question: {
      en: 'How do I switch languages between English and Kannada?',
      kn: 'ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸುವುದು ಹೇಗೆ?'
    },
    answer: {
      en: 'Click the language toggle button (EN / ಕನ್ನಡ) in the top right header navigation. The entire interface and AI guide instantly update to your selected language.',
      kn: 'ಮೇಲಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿರುವ (EN / ಕನ್ನಡ) ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.'
    },
    category: 'System',
    keywords: ['language', 'kannada', 'english', 'switch', 'translate', 'ಭಾಷೆ', 'ಕನ್ನಡ']
  },
  {
    id: 'faq-10',
    question: {
      en: 'How do I contact KSP AI Support?',
      kn: 'ಕೆಎಸ್‌ಪಿ ಎಐ ಬೆಂಬಲವನ್ನು ಹೇಗೆ ಸಂಪರ್ಕಿಸುವುದು?'
    },
    answer: {
      en: 'Email support is available at karnataka@ksp.gov.in or call +91 80 2345 6789. Officers can also chat 24x7 with this internal virtual support assistant.',
      kn: 'ಇಮೇಲ್ karnataka@ksp.gov.in ಅಥವಾ ದೂರವಾಣಿ +91 80 2345 6789 ಮೂಲಕ ಸಂಪರ್ಕಿಸಬಹುದು.'
    },
    category: 'Contact',
    keywords: ['contact', 'support', 'email', 'phone', 'helpdesk', 'ಸಂಪರ್ಕ', 'ಬೆಂಬಲ']
  },
  {
    id: 'faq-11',
    question: {
      en: 'Where can I find GIS Crime Maps?',
      kn: 'ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆಗಳನ್ನು ಎಲ್ಲಿ ಕಾಣಬಹುದು?'
    },
    answer: {
      en: 'Open Predictive Analytics & Patrol from the sidebar to view spatial heatmaps, temporal risk projections, and Hoysala patrol recommendations.',
      kn: 'ಮುನ್ಸೂಚಕ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಗಸ್ತು ವಿಭಾಗವನ್ನು ತೆರೆದು ನಕ್ಷೆ ಮತ್ತು ಗಸ್ತು ಮಾರ್ಗಗಳನ್ನು ವೀಕ್ಷಿಸಿ.'
    },
    category: 'GIS',
    keywords: ['crime map', 'gis', 'heatmap', 'predictive', 'patrol', 'hoysala', 'ನಕ್ಷೆ']
  },
  {
    id: 'faq-12',
    question: {
      en: 'How do I update investigation status?',
      kn: 'ತನಿಖಾ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸುವುದು ಹೇಗೆ?'
    },
    answer: {
      en: 'Open the case in Case 360 Workspace or Cases Database, click the Status dropdown, select the new status (e.g. Charge Sheeted, Convicted, Closed), and save.',
      kn: 'ಪ್ರಕರಣ ತೆರೆದು "ಸ್ಥಿತಿ" ಡ್ರಾಪ್‌ಡೌನ್‌ನಿಂದ ಹೊಸ ಹಂತವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಉಳಿಸಿ.'
    },
    category: 'Cases',
    keywords: ['update', 'status', 'investigation', 'chargesheet', 'convicted', 'closed', 'ಸ್ಥಿತಿ']
  },
  {
    id: 'faq-13',
    question: {
      en: 'What is Emergency Access clearance?',
      kn: 'ತುರ್ತು ಪ್ರವೇಶ (Emergency Access) ಎಂದರೇನು?'
    },
    answer: {
      en: 'Emergency Access grants temporary 24-hour cross-jurisdiction clearance for investigating officers inspecting cases outside their assigned district, logged in the Catalyst Audit Ledger.',
      kn: 'ತುರ್ತು ಪ್ರವೇಶವು ಇತರೆ ಜಿಲ್ಲೆಗಳ ಪ್ರಕರಣಗಳ ಪರಿಶೀಲನೆಗೆ 24 ಗಂಟೆಗಳ ತಾತ್ಕಾಲಿಕ ಅನುಮತಿ ನೀಡುತ್ತದೆ.'
    },
    category: 'Security',
    keywords: ['emergency access', 'clearance', 'override', 'audit', 'cross jurisdiction', 'ತುರ್ತು ಪ್ರವೇಶ']
  }
];
