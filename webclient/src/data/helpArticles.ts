export interface HelpArticle {
  id: string;
  title: { en: string; kn: string };
  category: string;
  iconName: string;
  popular?: boolean;
  description: { en: string; kn: string };
  steps: { en: string[]; kn: string[] };
  tips: { en: string[]; kn: string[] };
  relatedArticleIds: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: 'dashboard-overview',
    title: { en: 'Dashboard Overview', kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಅವಲೋಕನ' },
    category: 'Getting Started',
    iconName: 'LayoutDashboard',
    popular: true,
    description: {
      en: 'Learn how to navigate the main KSP AI Intelligence Dashboard, track live CCTNS FIR velocity, and monitor district crime trends.',
      kn: 'ಮುಖ್ಯ ಕೆಎಸ್‌ಪಿ ಎಐ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಸಿಎಸ್‌ಟಿಎನ್ಎಸ್ ನೈಜ-ಸಮಯದ ಪ್ರಕರಣಗಳ ವೇಗ ಮತ್ತು ಜಿಲ್ಲಾ ಅಪರಾಧ ಪ್ರವೃತ್ತಿಗಳನ್ನು ವೀಕ್ಷಿಸುವುದನ್ನು ಕಲಿಯಿರಿ.'
    },
    steps: {
      en: [
        'Log in to your Officer Account using your Badge ID.',
        'View total active case counts, critical alerts, and heinous crime metrics at the top.',
        'Inspect the Monthly Crime Trend chart for seasonal pattern analysis.',
        'Use the top search bar to quickly query any FIR number, officer, or jurisdiction.'
      ],
      kn: [
        'ನಿಮ್ಮ ಬ್ಯಾಡ್ಜ್ ಐಡಿ ಬಳಸಿ ಅಧಿಕಾರಿಯ ಖಾತೆಗೆ ಲಾಗಿನ್ ಆಗಿ.',
        'ಮೇಲ್ಭಾಗದಲ್ಲಿ ಒಟ್ಟು ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು ಮತ್ತು ನಿರ್ಣಾಯಕ ಎಚ್ಚರಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ.',
        'ಮಾಸಿಕ ಅಪರಾಧ ಪ್ರವೃತ್ತಿ ಚಾರ್ಟ್ ಪರಿಶೀಲಿಸಿ.',
        'ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ ಅಥವಾ ಸ್ಥಳವನ್ನು ಹುಡುಕಲು ಮೇಲಿನ ಸರ್ಚ್ ಬಾರ್ ಬಳಸಿ.'
      ]
    },
    tips: {
      en: [
        'Click on any metric card to filter the underlying case list directly.',
        'Toggle between English and Kannada in the header navigation at any time.'
      ],
      kn: [
        'ಪ್ರಕರಣಗಳ ಪಟ್ಟಿಯನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು ಯಾವುದೇ ಮೆಟ್ರಿಕ್ ಕಾರ್ಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        'ಹೆಡರ್‌ನಲ್ಲಿರುವ ಭಾಷಾ ಬಟನ್ ಬಳಸಿ ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ನಡುವೆ ಬದಲಾಯಿಸಿ.'
      ]
    },
    relatedArticleIds: ['managing-cases', 'notifications', 'language-switching']
  },
  {
    id: 'creating-case',
    title: { en: 'Creating a New Case / FIR', kn: 'ಹೊಸ ಪ್ರಕರಣ / ಎಫ್‌ಐಆರ್ ನೋಂದಣಿ' },
    category: 'Managing Cases',
    iconName: 'FileText',
    popular: true,
    description: {
      en: 'Step-by-step guide to registering a new FIR or importing CCTNS case records into the KSP AI platform.',
      kn: 'ಹೊಸ ಎಫ್‌ಐಆರ್ ನೋಂದಾಯಿಸುವ ಅಥವಾ ಸಿಎಸ್‌ಟಿಎನ್‌ಎಸ್ ಪ್ರಕರಣಗಳ ದಾಖಲೆಗಳನ್ನು ಸಿಂಕ್ ಮಾಡುವ ಹಂತ-ಹಂತದ ಮಾರ್ಗದರ್ಶಿ.'
    },
    steps: {
      en: [
        'Navigate to the Cases Database module from the sidebar.',
        'Click the "+ New Case / Register FIR" button in the top right.',
        'Enter FIR Number, Crime Major Head (e.g. Cybercrime, Homicide), Incident Location, and Offense Details.',
        'Select assigned Investigating Officer (IO) and Station jurisdiction.',
        'Click "Submit Case Record" to sync with Zoho Catalyst Data Store.'
      ],
      kn: [
        'ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಪ್ರಕರಣಗಳ ಡೇಟಾಬೇಸ್ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ.',
        'ಮೇಲಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿರುವ "+ ಹೊಸ ಪ್ರಕರಣ ನೋಂದಾಯಿಸಿ" ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        'ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ, ಅಪರಾಧ ಶೀರ್ಷಿಕೆ ಮತ್ತು ಸ್ಥಳದ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ.',
        'ನಿಯೋಜಿತ ತನಿಖಾಧಿಕಾರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        'ಡೇಟಾಸ್ಟೋರ್ ಸಿಂಕ್ ಮಾಡಲು "ಸಲ್ಲಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'Ensure CCTNS Crime Major Head matches official IPC/BNS statutory codes.',
        'Once created, open the Case 360 Workspace to attach evidence and generate legal briefs.'
      ],
      kn: [
        'ಅಪರಾಧ ಶೀರ್ಷಿಕೆಯು ಅಧಿಕೃತ ಐಪಿಸಿ/ಬಿಎನ್‌ಎಸ್ ಕಾಯ್ದೆಗೆ ಅನುಗುಣವಾಗಿದೆ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        'ಪ್ರಕರಣ ರಚಿಸಿದ ನಂತರ ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ಲಗತ್ತಿಸಲು ಕೇಸ್ 360 ವರ್ಕ್‌ಸ್ಪೇಸ್ ಬಳಸಿ.'
      ]
    },
    relatedArticleIds: ['updating-status', 'uploading-evidence', 'reports-module']
  },
  {
    id: 'updating-status',
    title: { en: 'Updating Investigation Status', kn: 'ತನಿಖಾ ಸ್ಥಿತಿಯನ್ನು ನವೀಕರಿಸುವುದು' },
    category: 'Managing Cases',
    iconName: 'CheckCircle2',
    popular: false,
    description: {
      en: 'How to update case statuses from Under Investigation to Charge Sheeted, Pending Trial, or Closed.',
      kn: 'ಪ್ರಕರಣದ ಸ್ಥಿತಿಯನ್ನು ತನಿಖೆಯಲ್ಲಿದೆ ಎಂಬ ಹಂತದಿಂದ ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಕೆ ಅಥವಾ ಮುಚ್ಚಲಾಗಿದೆ ಎಂದು ನವೀಕರಿಸುವುದು.'
    },
    steps: {
      en: [
        'Open the targeted case inside the Cases Database or Case 360 Workspace.',
        'Locate the "Investigation Status" dropdown badge.',
        'Select the new status (e.g., Charge Sheeted, Convicted, Closed).',
        'Add required officer remarks and judicial chargesheet reference numbers.',
        'Save changes to broadcast status updates to SCRB commanders.'
      ],
      kn: [
        'ಪ್ರಕರಣಗಳ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಸೂಕ್ತ ಪ್ರಕರಣವನ್ನು ತೆರೆಯಿರಿ.',
        '"ತನಿಖಾ ಸ್ಥಿತಿ" ಡ್ರಾಪ್‌ಡೌನ್ ಆಯ್ಕೆಮಾಡಿ.',
        'ಹೊಸ ಸ್ಥಿತಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (ಉದಾ. ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಕೆ).',
        'ಅಗತ್ಯ ಟಿಪ್ಪಣಿಗಳು ಮತ್ತು ದೋಷಾರೋಪ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ ಬದಲಾವಣೆ ಉಳಿಸಿ.'
      ]
    },
    tips: {
      en: [
        'Updating status to "Closed" or "Charge Sheeted" recalculates officer conviction scorecards.'
      ],
      kn: [
        'ಸ್ಥಿತಿಯನ್ನು "ಮುಚ್ಚಲಾಗಿದೆ" ಎಂದು ನವೀಕರಿಸುವುದರಿಂದ ಅಧಿಕಾರಿಯ ಸ್ಕೋರ್‌ಕಾರ್ಡ್ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ.'
      ]
    },
    relatedArticleIds: ['creating-case', 'officer-profile']
  },
  {
    id: 'uploading-evidence',
    title: { en: 'Uploading & Analyzing Evidence', kn: 'ಸಾಕ್ಷ್ಯಾಧಾರ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ' },
    category: 'AI Forensic Tools',
    iconName: 'Microscope',
    popular: true,
    description: {
      en: 'Upload physical evidence scans, forensic documents, and CCTV images for AI OCR extraction.',
      kn: 'ಎಐ ಒಸಿಆರ್ ತಂತ್ರಜ್ಞಾನದ ಮೂಲಕ ದಾಖಲೆಗಳು, ಸಿಸಿಟಿವಿ ಚಿತ್ರಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ.'
    },
    steps: {
      en: [
        'Go to the AI Evidence Analysis module from the sidebar.',
        'Select target FIR or drag and drop scanned forensic PDFs and image evidence.',
        'The Gemini AI OCR engine automatically extracts bank account numbers, suspect names, and Aadhaar IDs.',
        'Review confidence metrics and export the digitized evidence ledger.'
      ],
      kn: [
        'ಎಐ ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆ ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ.',
        'ಫೋರೆನ್ಸಿಕ್ ದಾಖಲೆಗಳು ಅಥವಾ ಚಿತ್ರಗಳನ್ನು ಡ್ರಾಗ್ ಮಾಡಿ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
        'ಎಐ ಎಂಜಿನ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಶಂಕಿತರ ಹೆಸರುಗಳು ಮತ್ತು ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ.',
        'ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶವನ್ನು ಪರಿಶೀಲಿಸಿ ರಫ್ತು ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'PDF files up to 25MB and high-resolution JPEG/PNG formats yield highest OCR accuracy.'
      ],
      kn: [
        'ಉತ್ತಮ ಒಸಿಆರ್ ನಿಖರತೆಗಾಗಿ ಸ್ಪಷ್ಟ ಹೆಚ್‌ಡಿ ಪಿಡಿಎಫ್ ಅಥವಾ ಜೆಪಿಇಜಿ ಫೈಲ್‌ಗಳನ್ನು ಬಳಸಿ.'
      ]
    },
    relatedArticleIds: ['using-ai-investigator', 'creating-case']
  },
  {
    id: 'viewing-crime-maps',
    title: { en: 'Viewing GIS Crime Maps & Hotspots', kn: 'ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳು' },
    category: 'GIS & Patrol',
    iconName: 'Map',
    popular: true,
    description: {
      en: 'Explore GIS crime spatial heatmaps, temporal risk projections, and automated Hoysala patrol routes.',
      kn: 'ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆ, ಗಸ್ತು ಮಾರ್ಗಗಳು ಮತ್ತು ನಗರಗಳ ಅಪರಾಧ ಸಾಂದ್ರತೆಯನ್ನು ವೀಕ್ಷಿಸಿ.'
    },
    steps: {
      en: [
        'Open the Predictive Analytics & Patrol module.',
        'Filter by district (e.g. Bengaluru City, Mysuru, Mangaluru, Belagavi).',
        'Review color-coded heatmaps indicating high-density crime crime zones.',
        'Inspect AI-generated patrol route recommendations for Hoysala mobile units.'
      ],
      kn: [
        'ಮುನ್ಸೂಚಕ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಗಸ್ತು ವಿಭಾಗ ತೆರೆಯಿರಿ.',
        'ಜಿಲ್ಲೆಯ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ (ಉದಾ. ಬೆಂಗಳೂರು ನಗರ, ಮೈಸೂರು).',
        'ಅಪರಾಧ ಸಾಂದ್ರತೆಯ ಬಣ್ಣ-ಸಂಕೇತ ನಕ್ಷೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.',
        'ಹೊಯ್ಸಳ ಗಸ್ತು ವಾಹನಗಳ ಎಐ ಶಿಫಾರಸು ಮಾರ್ಗಗಳನ್ನು ವೀಕ್ಷಿಸಿ.'
      ]
    },
    tips: {
      en: [
        'Use temporal sliders to inspect weekend vs weekday crime velocity trends.'
      ],
      kn: [
        'ವಾರಾಂತ್ಯ ಮತ್ತು ವಾರದ ದಿನಗಳ ಅಪರಾಧ ಪ್ರವೃತ್ತಿಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಸಮಯದ ಫಿಲ್ಟರ್ ಬಳಸಿ.'
      ]
    },
    relatedArticleIds: ['dashboard-overview', 'creating-case']
  },
  {
    id: 'using-ai-investigator',
    title: { en: 'Using AI Investigator (Gemini Chat)', kn: 'ಎಐ ತನಿಖಾಧಿಕಾರಿ ಸಹಾಯಕ (Gemini Chat)' },
    category: 'AI Assistant',
    iconName: 'MessageSquare',
    popular: true,
    description: {
      en: 'Ask natural language queries, look up BNS/IPC legal sections, and draft Kannada search warrants.',
      kn: 'ನೈಸರ್ಗಿಕ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ, ಐಪಿಸಿ-ಬಿಎನ್‌ಎಸ್ ಕಾಯ್ದೆಗಳು ಮತ್ತು ಕನ್ನಡ ಸರ್ಚ್ ವಾರಂಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ.'
    },
    steps: {
      en: [
        'Click AI Investigator in the sidebar navigation.',
        'Type your query in English or Kannada (e.g., "Show active cybercrime cases in Whitefield PS").',
        'The assistant runs ZCQL queries on Zoho Catalyst DB and responds with grounded intelligence dossiers.',
        'Click "Export PDF" to generate court-ready legal briefs.'
      ],
      kn: [
        'ಸೈಡ್‌ಬಾರ್‌ನಲ್ಲಿರುವ ಎಐ ತನಿಖಾಧಿಕಾರಿ ವಿಭಾಗವನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ.',
        'ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆಯನ್ನು ಟೈಪ್ ಮಾಡಿ.',
        'ಎಐ ಸಿಸ್ಟಮ್ ಡೇಟಾಸ್ಟೋರ್‌ನಿಂದ ಮಾಹಿತಿಯನ್ನು ಮರುಪಡೆದು ವರದಿಯನ್ನು ನೀಡುತ್ತದೆ.',
        'ನ್ಯಾಯಾಲಯದ ಸಲ್ಲಿಕೆಗೆ ಪಿಡಿಎಫ್ ರಫ್ತು ಮಾಡಲು "Export PDF" ಕ್ಲಿಕ್ ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'You can dictate queries using voice input in both English and Kannada.'
      ],
      kn: [
        'ನೀವು ಧ್ವನಿ ಇನ್ಪುಟ್ ಬಳಸಿ ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡ ಎರಡರಲ್ಲೂ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.'
      ]
    },
    relatedArticleIds: ['uploading-evidence', 'reports-module']
  },
  {
    id: 'criminal-nexus-analysis',
    title: { en: 'Criminal Nexus Graph Analysis', kn: 'ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಜಾಲ ವಿಶ್ಲೇಷಣೆ' },
    category: 'Advanced Analytics',
    iconName: 'Network',
    popular: false,
    description: {
      en: 'Visualize multi-district criminal syndicates, repeat offender hubs, and linked case networks.',
      kn: 'ಶಂಕಿತರು, ಅಪರಾಧ ಗುಂಪುಗಳು ಮತ್ತು ಜಿಲ್ಲಾ ಜಾಲಗಳ ನಡುವಿನ ಸಂಪರ್ಕ ನಕ್ಷೆಯನ್ನು ವೀಕ್ಷಿಸಿ.'
    },
    steps: {
      en: [
        'Select Criminal Nexus from the sidebar menu.',
        'Search suspect name, phone number, or Aadhaar ID.',
        'Inspect force-directed graph nodes representing repeat offenders, shared associates, and common getaway vehicles.',
        'Click any node to reveal linked CCTNS FIR numbers.'
      ],
      kn: [
        'ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಆಯ್ಕೆಮಾಡಿ.',
        'ಶಂಕಿತರ ಹೆಸರು, ಫೋನ್ ಸಂಖ್ಯೆ ಅಥವಾ ಆಧಾರ್ ಮೂಲಕ ಹುಡುಕಿ.',
        'ಸಂಪರ್ಕ ನೋಡ್‌ಗಳು ಮತ್ತು ಜಾಲಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
        'ಸಂಬಂಧಿತ ಎಫ್‌ಐಆರ್ ವೀಕ್ಷಿಸಲು ನೋಡ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'Primary Hub nodes are highlighted in glowing red indicating high syndicate centrality.'
      ],
      kn: [
        'ಪ್ರಮುಖ ಜಾಲ ಕೇಂದ್ರಗಳು ಕೆಂಪು ಬಣ್ಣದಲ್ಲಿ ಹೈಲೈಟ್ ಆಗುತ್ತವೆ.'
      ]
    },
    relatedArticleIds: ['using-ai-investigator', 'viewing-crime-maps']
  },
  {
    id: 'reports-module',
    title: { en: 'Generating & Exporting Reports', kn: 'ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳ ರಫ್ತು' },
    category: 'Reports & Audit',
    iconName: 'BarChart2',
    popular: false,
    description: {
      en: 'Generate automated master crime dossiers, monthly SCRB statistics, and judicial PDF exports.',
      kn: 'ಸ್ವಯಂಚಾಲಿತ ಅಪರಾಧ ವರದಿಗಳು, ಮಾಸಿಕ ಅಂಕಿಅಂಶಗಳು ಮತ್ತು ಪಿಡಿಎಫ್ ದಾಖಲೆಗಳನ್ನು ರಫ್ತು ಮಾಡಿ.'
    },
    steps: {
      en: [
        'Navigate to Automated Reports in the sidebar.',
        'Select date range, district jurisdiction, and crime major heads.',
        'Click "Export Master Dossier" for full Excel data or "Export PDF" for judicial briefs.',
        'Configure scheduled automated report emails for senior police commanders.'
      ],
      kn: [
        'ಸೈಡ್‌ಬಾರ್‌ನಲ್ಲಿರುವ ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು ವಿಭಾಗಕ್ಕೆ ಹೋಗಿ.',
        'ದಿನಾಂಕ ಶ್ರೇಣಿ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        '"ಮಾಸ್ಟರ್ ದಸ್ತಾವೇಜು ರಫ್ತು ಮಾಡಿ" ಅಥವಾ "ಪಿಡಿಎಫ್ ರಫ್ತು" ಕ್ಲಿಕ್ ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'Reports automatically include watermarked officer badge clearance for chain of custody security.'
      ],
      kn: [
        'ರಫ್ತು ಮಾಡಿದ ಪ್ರತಿಯೊಂದು ವರದಿಯು ಅಧಿಕೃತ ವಾಟರ್‌ಮಾರ್ಕ್ ಒಳಗೊಂಡಿರುತ್ತದೆ.'
      ]
    },
    relatedArticleIds: ['dashboard-overview', 'creating-case']
  },
  {
    id: 'officer-profile',
    title: { en: 'Officer Profile & Caseload', kn: 'ಅಧಿಕಾರಿ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಪ್ರಕರಣಗಳು' },
    category: 'Officer Account',
    iconName: 'Users',
    popular: false,
    description: {
      en: 'View assigned active caseload, conviction rate scorecards, and update officer profile details.',
      kn: 'ನಿಮಗೆ ನಿಯೋಜಿಸಲಾದ ಪ್ರಕರಣಗಳು, ಶಿಕ್ಷೆಯ ಪ್ರಮಾಣ ಮತ್ತು ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
    },
    steps: {
      en: [
        'Open Officer Portal from the sidebar.',
        'Inspect your conviction rate scorecard, average resolution time, and AI risk score.',
        'Review your daily intelligence briefing and active case queue.',
        'Click "Edit Profile" to update phone numbers or station contact details.'
      ],
      kn: [
        'ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಅಧಿಕಾರಿ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ.',
        'ನಿಮ್ಮ ಶಿಕ್ಷೆಯ ಪ್ರಮಾಣ ಮತ್ತು ದೈನಂದಿನ ಕಾರ್ಯಭಾರವನ್ನು ವೀಕ್ಷಿಸಿ.',
        'ಸಂಪರ್ಕ ಸಂಖ್ಯೆಗಳನ್ನು ಸಂಪಾದಿಸಲು "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.'
      ]
    },
    tips: {
      en: [
        'Caseload queues update automatically when SHOs assign new FIRs to your badge ID.'
      ],
      kn: [
        'ನಿಮಗೆ ಹೊಸ ಪ್ರಕರಣ ನಿಯೋಜಿಸಿದಾಗ ನಿಮ್ಮ ಕಾರ್ಯಭಾರ ಪಟ್ಟಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ನವೀಕರಣಗೊಳ್ಳುತ್ತದೆ.'
      ]
    },
    relatedArticleIds: ['creating-case', 'notifications']
  },
  {
    id: 'notifications',
    title: { en: 'Notifications & Emergency Alerts', kn: 'ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸೂಚನೆಗಳು' },
    category: 'Alerts',
    iconName: 'Bell',
    popular: false,
    description: {
      en: 'Configure real-time 112 CAD emergency dispatch notifications and heinous crime alerts.',
      kn: '112 ತುರ್ತು ಡಿಸ್ಪ್ಯಾಚ್ ಅಲರ್ಟ್‌ಗಳು ಮತ್ತು ಘೋರ ಅಪರಾಧ ಎಚ್ಚರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.'
    },
    steps: {
      en: [
        'Click the bell notification icon in the top header or navigate to System Settings.',
        'Toggle real-time alerts for 112 emergency calls, heinous crime FIRs, and high-risk suspect movements.',
        'Set audio notification chimes and browser push notifications.'
      ],
      kn: [
        'ಮೇಲಿನ ಹೆಡರ್‌ನಲ್ಲಿರುವ ಬೆಲ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        '112 ತುರ್ತು ಕರೆಗಳು ಮತ್ತು ಘೋರ ಅಪರಾಧಗಳ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ.'
      ]
    },
    tips: {
      en: [
        'Critical 112 dispatch alerts remain active even when working inside Case 360 Workspace.'
      ],
      kn: [
        'ನಿರ್ಣಾಯಕ 112 ಎಚ್ಚರಿಕೆಗಳು ಅಪ್ಲಿಕೇಶನ್‌ನ ಯಾವುದೇ ವಿಭಾಗದಲ್ಲಿದ್ದಾಗಲೂ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತವೆ.'
      ]
    },
    relatedArticleIds: ['dashboard-overview', 'viewing-crime-maps']
  },
  {
    id: 'language-switching',
    title: { en: 'Language Switching (English / Kannada)', kn: 'ಭಾಷೆ ಬದಲಾವಣೆ (ಇಂಗ್ಲಿಷ್ / ಕನ್ನಡ)' },
    category: 'System Preferences',
    iconName: 'Globe',
    popular: false,
    description: {
      en: 'How to switch the entire application UI and AI voice narration between English and Kannada.',
      kn: 'ಸಂಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಎಐ ಧ್ವನಿ ಪ್ರಸ್ತುತಿಯನ್ನು ಇಂಗ್ಲಿಷ್ ಮತ್ತು ಕನ್ನಡದ ನಡುವೆ ಬದಲಾಯಿಸುವುದು.'
    },
    steps: {
      en: [
        'Locate the Language Toggle button (EN / ಕನ್ನಡ) in the top right header.',
        'Clicking the button instantly converts all titles, menus, case summaries, and buttons to Kannada.',
        'You can also change language preference permanently inside System Settings.'
      ],
      kn: [
        'ಮೇಲಿನ ಬಲ ಮೂಲೆಯಲ್ಲಿರುವ (EN / ಕನ್ನಡ) ಬಟನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
        'ಇದು ಸಂಪೂರ್ಣ ಅಪ್ಲಿಕೇಶನ್ ಇಂಟರ್ಫೇಸ್ ಅನ್ನು ತಕ್ಷಣ ಕನ್ನಡಕ್ಕೆ ಪರಿವರ್ತಿಸುತ್ತದೆ.'
      ]
    },
    tips: {
      en: [
        'In Platform Tour mode, toggling language updates voice narration MP3 streams on the fly without refreshing!'
      ],
      kn: [
        'ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಟೂರ್‌ನಲ್ಲಿದ್ದಾಗ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿದರೆ ಎಐ ಧ್ವನಿಯು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕನ್ನಡಕ್ಕೆ ಬದಲಾಗುತ್ತದೆ.'
      ]
    },
    relatedArticleIds: ['dashboard-overview', 'using-ai-investigator']
  },
  {
    id: 'emergency-access',
    title: { en: 'Emergency Access & Security Overrides', kn: 'ತುರ್ತು ಪ್ರವೇಶ ಮತ್ತು ಭದ್ರತಾ ತೆರವು' },
    category: 'Security & Access',
    iconName: 'ShieldAlert',
    popular: false,
    description: {
      en: 'Guidelines for requesting emergency cross-jurisdiction clearance and high-priority audit logs.',
      kn: 'ತುರ್ತು ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಇತರೆ ಜಿಲ್ಲೆಗಳ ಪ್ರಕರಣಗಳ ಪ್ರವೇಶ ಪಡೆಯುವ ವಿಧಾನ.'
    },
    steps: {
      en: [
        'If a case requires cross-jurisdiction inspection outside your assigned district, click "Request Emergency Access".',
        'Enter valid operational justification and DSP badge approval.',
        'Temporary 24-hour clearance is granted and logged in the immutable Catalyst Audit Ledger.'
      ],
      kn: [
        'ಇತರೆ ಜಿಲ್ಲೆಗಳ ಪ್ರಕರಣ ಪರಿಶೀಲನೆಗೆ "ತುರ್ತು ಪ್ರವೇಶ ವಿನಂತಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ.',
        'ಸೂಕ್ತ ಕಾರಣವನ್ನು ನಮೂದಿಸಿ ಅನುಮೋದನೆ ಪಡೆಯಿರಿ.'
      ]
    },
    tips: {
      en: [
        'All emergency override requests are reviewed by the State Crime Records Bureau audit committee.'
      ],
      kn: [
        'ಎಲ್ಲಾ ತುರ್ತು ಪ್ರವೇಶ ವಿನಂತಿಗಳನ್ನು ಎಸ್‌ಸಿಆರ್‌ಬಿ ಪರಿಶೋಧನಾ ಸಮಿತಿಯು ಪರಿಶೀಲಿಸುತ್ತದೆ.'
      ]
    },
    relatedArticleIds: ['creating-case', 'officer-profile']
  }
];
