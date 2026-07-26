import { SCENE_NARRATIONS, type SceneNarration } from './narrations';

export interface LocalizedText {
  en: string;
  kn: string;
}

export interface TourScene {
  id: number;
  title: LocalizedText;
  subtitle: LocalizedText;
  duration: number; // in seconds
  highlightedFeature: string;
  placeholderNarration: LocalizedText;
  animationType: 'fade' | 'slide' | 'zoom' | 'blur';
  features: {
    en: string[];
    kn: string[];
  };
  audioUrl?: string; // Reserved slot for Google Cloud TTS MP3 audio
}

export const TOUR_SCENES: TourScene[] = [
  {
    id: 1,
    title: {
      en: "Welcome to KSP AI Platform",
      kn: "ಕರ್ನಾಟಕ ಪೋಲಿಸ್ ಎಐ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಸುಸ್ವಾಗತ"
    },
    subtitle: {
      en: "Karnataka State Police AI Crime Intelligence Platform",
      kn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ವ್ಯವಸ್ಥೆ"
    },
    duration: SCENE_NARRATIONS[1].durationSec,
    highlightedFeature: "Platform Welcome & Architecture",
    placeholderNarration: {
      en: SCENE_NARRATIONS[1].textEn,
      kn: SCENE_NARRATIONS[1].textKn
    },
    animationType: "zoom",
    features: {
      en: ["CCTNS Ledger Sync", "Gemini AI Investigation Engine", "Statewide Jurisdiction Map"],
      kn: ["CCTNS ಲೆಡ್ಜರ್ ಸಿಂಕ್", "ಜೆಮಿನಿ ಎಐ ತನಿಖಾ ಎಂಜಿನ್", "ರಾಜ್ಯಾದ್ಯಂತ ವ್ಯಾಪ್ತಿ ನಕ್ಷೆ"]
    },
    audioUrl: SCENE_NARRATIONS[1].audioUrlEn
  },
  {
    id: 2,
    title: {
      en: "Real-time Intelligence Dashboard",
      kn: "ನೈಜ-ಸಮಯದ ಗುಪ್ತಚರ ಡೇಶ್ಬೋರ್ಡ್"
    },
    subtitle: {
      en: "Unified Analytics & District Threat Feeds",
      kn: "ಏಕೀಕೃತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಜಿಲ್ಲಾ ಅಪರಾಧ ಲೈವ್ ಫೀಡ್"
    },
    duration: SCENE_NARRATIONS[2].durationSec,
    highlightedFeature: "Live Command Overview",
    placeholderNarration: {
      en: SCENE_NARRATIONS[2].textEn,
      kn: SCENE_NARRATIONS[2].textKn
    },
    animationType: "slide",
    features: {
      en: ["Real-time Analytics", "District Intelligence", "Live Notifications", "Crime Statistics"],
      kn: ["ನೈಜ-ಸಮಯದ ವಿಶ್ಲೇಷಣೆ", "ಜಿಲ್ಲಾ ಗುಪ್ತಚರ", "ಲೈವ್ ಸೂಚನೆಗಳು", "ಅಪರಾಧ ಅಂಕಿ-ಅಂಶಗಳು"]
    },
    audioUrl: SCENE_NARRATIONS[2].audioUrlEn
  },
  {
    id: 3,
    title: {
      en: "Statewide Case Repository",
      kn: "ರಾಜ್ಯಾದ್ಯಂತ ಪ್ರಕರಣಗಳ ಸಂಗ್ರಹಾಗಾರ"
    },
    subtitle: {
      en: "Digital FIRs & Investigation Workflows",
      kn: "ಡಿಜಿಟಲ್ ಎಫ್‌ಐಆರ್ ಮತ್ತು ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳು"
    },
    duration: SCENE_NARRATIONS[3].durationSec,
    highlightedFeature: "CCTNS Case Master",
    placeholderNarration: {
      en: SCENE_NARRATIONS[3].textEn,
      kn: SCENE_NARRATIONS[3].textKn
    },
    animationType: "fade",
    features: {
      en: ["FIR Records", "Investigation Tracking", "Evidence Logs", "Officer Assignments"],
      kn: ["ಎಫ್‌ಐಆರ್ ದಾಖಲೆಗಳು", "ತನಿಖಾ ಟ್ರ್ಯಾಕಿಂಗ್", "ಸಾಕ್ಷ್ಯಾಧಾರ ಲಾಗ್", "ಅಧಿಕಾರಿಗಳ ನಿಯೋಜನೆ"]
    },
    audioUrl: SCENE_NARRATIONS[3].audioUrlEn
  },
  {
    id: 4,
    title: {
      en: "AI Evidence Analysis & OCR",
      kn: "ಎಐ ಸಾಕ್ಷ್ಯಾಧಾರ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಒಸಿಆರ್"
    },
    subtitle: {
      en: "Automated Document & Media Forensics",
      kn: "ಸ್ವಯಂಚಾಲಿತ ದಾಖಲೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಸಾಕ್ಷ್ಯ ವಿಶ್ಲೇಷಣೆ"
    },
    duration: SCENE_NARRATIONS[4].durationSec,
    highlightedFeature: "AI Media Scanner",
    placeholderNarration: {
      en: SCENE_NARRATIONS[4].textEn,
      kn: SCENE_NARRATIONS[4].textKn
    },
    animationType: "blur",
    features: {
      en: ["Documents & Reports", "Image Forensics", "AI OCR Analysis", "Evidence Dossiers"],
      kn: ["ದಾಖಲೆಗಳು ಮತ್ತು ವರದಿಗಳು", "ಚಿತ್ರ ಫೊರೆನ್ಸಿಕ್ಸ್", "ಎಐ ಒಸಿಆರ್ ವಿಶ್ಲೇಷಣೆ", "ಸಾಕ್ಷ್ಯ ಡಾಕ್ಯುಮೆಂಟ್"]
    },
    audioUrl: SCENE_NARRATIONS[4].audioUrlEn
  },
  {
    id: 5,
    title: {
      en: "AI Investigator Assistant",
      kn: "ಎಐ ತನಿಖಾ ಸಹಾಯಕ"
    },
    subtitle: {
      en: "Natural Language Legal & Case Queries",
      kn: "ನೈಸರ್ಗಿಕ ಭಾಷೆಯ ಕಾನೂನು ಮತ್ತು ಪ್ರಕರಣಗಳ ಹುಡುಕಾಟ"
    },
    duration: SCENE_NARRATIONS[5].durationSec,
    highlightedFeature: "Conversational Intelligence",
    placeholderNarration: {
      en: SCENE_NARRATIONS[5].textEn,
      kn: SCENE_NARRATIONS[5].textKn
    },
    animationType: "slide",
    features: {
      en: ["AI Natural Language Search", "Officer Decision Support", "Smart Investigation Prompts"],
      kn: ["ಎಐ ಸಹಜ ಭಾಷಾ ಹುಡುಕಾಟ", "ಅಧಿಕಾರಿಗಳ ನಿರ್ಧಾರ ಬೆಂಬಲ", "ಸ್ಮಾರ್ಟ್ ತನಿಖಾ ಸಲಹೆಗಳು"]
    },
    audioUrl: SCENE_NARRATIONS[5].audioUrlEn
  },
  {
    id: 6,
    title: {
      en: "GIS Crime Hotspot Mapping",
      kn: "ಜಿಐಎಸ್ ಅಪರಾಧ ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ"
    },
    subtitle: {
      en: "Predictive Spatial Intelligence",
      kn: "ಮುನ್ಸೂಚನಾ ಸ್ಥಳೀಯ ಗುಪ್ತಚರ ಮಾಹಿತಿ"
    },
    duration: SCENE_NARRATIONS[6].durationSec,
    highlightedFeature: "GIS Spatial Heatmap",
    placeholderNarration: {
      en: SCENE_NARRATIONS[6].textEn,
      kn: SCENE_NARRATIONS[6].textKn
    },
    animationType: "zoom",
    features: {
      en: ["Crime Heat Map", "High-Priority Hotspots", "District Patrol Intelligence"],
      kn: ["ಅಪರಾಧ ಹೀಟ್ ಮ್ಯಾಪ್", "ಅಧಿಕ ಮುನ್ನೆಚ್ಚರಿಕೆ ಪ್ರದೇಶ", "ಜಿಲ್ಲಾ ಗಸ್ತು ಮಾಹಿತಿ"]
    },
    audioUrl: SCENE_NARRATIONS[6].audioUrlEn
  },
  {
    id: 7,
    title: {
      en: "Criminal Nexus Graph",
      kn: "ಅಪರಾಧಿಗಳ ಜಾಲ ನಕ್ಷೆ (ನೆಟ್‌ವರ್ಕ್)"
    },
    subtitle: {
      en: "Cross-District Suspect Connection Mapping",
      kn: "ವಿವಿಧ ಜಿಲ್ಲೆಗಳ ಶಂಕಿತರ ಸಂಪರ್ಕ ವಿಶ್ಲೇಷಣೆ"
    },
    duration: SCENE_NARRATIONS[7].durationSec,
    highlightedFeature: "Network Graph Analytics",
    placeholderNarration: {
      en: SCENE_NARRATIONS[7].textEn,
      kn: SCENE_NARRATIONS[7].textKn
    },
    animationType: "fade",
    features: {
      en: ["Suspect Nodes", "Relationship Linkages", "Hidden Syndicate Detection"],
      kn: ["ಶಂಕಿತ ನೋಡ್‌ಗಳು", "ಸಂಪರ್ಕ ಕೊಂಡಿಗಳು", "ಅಪರಾಧ ಗುಂಪು ಪತ್ತೆ"]
    },
    audioUrl: SCENE_NARRATIONS[7].audioUrlEn
  },
  {
    id: 8,
    title: {
      en: "Automated Reports & Analytics",
      kn: "ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಣೆ"
    },
    subtitle: {
      en: "PDF & Excel Intelligence Dossiers",
      kn: "ಪಿಡಿಎಫ್ ಮತ್ತು ಎಕ್ಸೆಲ್ ಗುಪ್ತಚರ ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳು"
    },
    duration: SCENE_NARRATIONS[8].durationSec,
    highlightedFeature: "Executive Reports Engine",
    placeholderNarration: {
      en: SCENE_NARRATIONS[8].textEn,
      kn: SCENE_NARRATIONS[8].textKn
    },
    animationType: "slide",
    features: {
      en: ["Executive Analytics", "PDF Intelligence Export", "Excel Master Reports", "AI Case Dossiers"],
      kn: ["ಕಾರ್ಯನಿರ್ವಾಹಕ ವಿಶ್ಲೇಷಣೆ", "ಪಿಡಿಎಫ್ ರಫ್ತು", "ಎಕ್ಸೆಲ್ ಮಾಸ್ಟರ್ ವರದಿ", "ಎಐ ಪ್ರಕರಣಗಳ ವರದಿ"]
    },
    audioUrl: SCENE_NARRATIONS[8].audioUrlEn
  },
  {
    id: 9,
    title: {
      en: "Bank-Grade RBAC Security",
      kn: "ಉನ್ನತ ಮಟ್ಟದ ಆರ್‌ಬಿಎಸಿ ಭದ್ರತೆ"
    },
    subtitle: {
      en: "Role-Based Clearance & Emergency Access",
      kn: "ಹುದ್ದೆ ಆಧಾರಿತ ಪ್ರವೇಶ ಮತ್ತು ತುರ್ತು ಅನುಮತಿ"
    },
    duration: SCENE_NARRATIONS[9].durationSec,
    highlightedFeature: "RBAC Security Standard",
    placeholderNarration: {
      en: SCENE_NARRATIONS[9].textEn,
      kn: SCENE_NARRATIONS[9].textKn
    },
    animationType: "blur",
    features: {
      en: ["Secure Officer Authentication", "Role-Based Access Control", "District Permission Matrix"],
      kn: ["ಸುರಕ್ಷಿತ ಅಧಿಕಾರಿ ಲಾಗಿನ್", "ಹುದ್ದೆ ಆಧಾರಿತ ನಿಯಂತ್ರಣ", "ಜಿಲ್ಲಾ ಪ್ರವೇಶ ಮ್ಯಾಟ್ರಿಕ್ಸ್"]
    },
    audioUrl: SCENE_NARRATIONS[9].audioUrlEn
  },
  {
    id: 10,
    title: {
      en: "Building a Safer Karnataka",
      kn: "ಸುರಕ್ಷಿತ ಕರ್ನಾಟಕ ನಿರ್ಮಾಣ"
    },
    subtitle: {
      en: "Artificial Intelligence + Karnataka State Police",
      kn: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ + ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್"
    },
    duration: SCENE_NARRATIONS[10].durationSec,
    highlightedFeature: "KSP Vision 2026",
    placeholderNarration: {
      en: SCENE_NARRATIONS[10].textEn,
      kn: SCENE_NARRATIONS[10].textKn
    },
    animationType: "zoom",
    features: {
      en: ["Next-Gen Law Enforcement", "AI-Powered Crime Prevention", "Statewide Safety First"],
      kn: ["ಮುಂದಿನ ಪೀಳಿಗೆಯ ಕಾನೂನು ಜಾರಿ", "ಎಐ ಅಪರಾಧ ತಡೆಗಟ್ಟುವಿಕೆ", "ರಾಜ್ಯಾದ್ಯಂತ ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ"]
    },
    audioUrl: SCENE_NARRATIONS[10].audioUrlEn
  }
];
