export interface SceneNarration {
  sceneId: number;
  textEn: string;
  textKn: string;
  audioUrlEn: string; // Relative path for subfolder hosting (/app/audio/en/)
  audioUrlKn: string; // Relative path for subfolder hosting (/app/audio/kn/)
  durationSec: number;
  wordCountEn: number;
}

export const SCENE_NARRATIONS: Record<number, SceneNarration> = {
  1: {
    sceneId: 1,
    textEn: "Welcome to the Karnataka State Police AI Crime Intelligence Platform — an advanced AI-powered investigation system engineered for modern law enforcement across Karnataka.",
    textKn: "ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್‌ಗೆ ಸುಸ್ವಾಗತ — ಇದು ಆಧುನಿಕ ಕಾನೂನು ಜಾರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಅತ್ಯಾಧುನಿಕ ಎಐ ತನಿಖಾ ವ್ಯವಸ್ಥೆಯಾಗಿದೆ.",
    audioUrlEn: "./audio/en/scene_1.mp3",
    audioUrlKn: "./audio/kn/scene_1.mp3",
    durationSec: 6,
    wordCountEn: 22
  },
  2: {
    sceneId: 2,
    textEn: "The Real-Time Intelligence Dashboard aggregates CCTNS FIR velocity, live 112 emergency dispatch alerts, and crime surge analytics from 31 district command centers.",
    textKn: "ನೈಜ-ಸಮಯದ ಇಂಟೆಲಿಜೆನ್ಸ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ 31 ಜಿಲ್ಲಾ ಕಂಟ್ರೋಲ್ ರೂಮ್‌ಗಳಿಂದ ಎಫ್‌ಐಆರ್ ವೇಗ, 112 ತುರ್ತು ಅಲರ್ಟ್‌ಗಳು ಮತ್ತು ಅಪರಾಧ ವಿಶ್ಲೇಷಣೆಗಳನ್ನು ಒಟ್ಟುಗೂಡಿಸುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_2.mp3",
    audioUrlKn: "./audio/kn/scene_2.mp3",
    durationSec: 7,
    wordCountEn: 23
  },
  3: {
    sceneId: 3,
    textEn: "The Statewide Case Repository enables officers to instantly query over 1,000 CCTNS crime records, track investigation workflows, and manage evidence logs.",
    textKn: "ರಾಜ್ಯಾದ್ಯಂತ ಪ್ರಕರಣಗಳ ಸಂಗ್ರಹಾಗಾರವು 1,000 ಕ್ಕೂ ಹೆಚ್ಚು CCTNS ಅಪರಾಧ ದಾಖಲೆಗಳು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ತಕ್ಷಣ ವೀಕ್ಷಿಸಲು ನೆರವಾಗುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_3.mp3",
    audioUrlKn: "./audio/kn/scene_3.mp3",
    durationSec: 7,
    wordCountEn: 21
  },
  4: {
    sceneId: 4,
    textEn: "AI Evidence Analysis uses advanced Optical Character Recognition to automatically extract suspect names, bank account numbers, and IP addresses from scanned physical documents.",
    textKn: "ಎಐ ಸಾಕ್ಷ್ಯಾಧಾರ ವಿಶ್ಲೇಷಣೆಯು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದ ಫೊರೆನ್ಸಿಕ್ ದಾಖಲೆಗಳಿಂದ ಶಂಕಿತರ ಹೆಸರುಗಳು, ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಐಪಿ ವಿಳಾಸಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪ್ರತ್ಯೇಕಿಸುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_4.mp3",
    audioUrlKn: "./audio/kn/scene_4.mp3",
    durationSec: 8,
    wordCountEn: 24
  },
  5: {
    sceneId: 5,
    textEn: "Powered by Google Gemini, the AI Investigator assists officers with natural language legal queries, IPC and BNS section lookups, and Kannada search warrant generation.",
    textKn: "ಗೂಗಲ್ ಜೆಮಿನಿ ಬೆಂಬಲಿತ ಎಐ ತನಿಖಾ ಸಹಾಯಕವು ನೈಸರ್ಗಿಕ ಭಾಷೆಯ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳು, ಐಪಿಸಿ-ಬಿಎನ್‌ಎಸ್ ಕಾಯ್ದೆಗಳು ಮತ್ತು ಕನ್ನಡ ಸರ್ಚ್ ವಾರಂಟ್‌ಗಳನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_5.mp3",
    audioUrlKn: "./audio/kn/scene_5.mp3",
    durationSec: 8,
    wordCountEn: 24
  },
  6: {
    sceneId: 6,
    textEn: "GIS Crime Hotspot Mapping visualizes crime density heatmaps across major Karnataka cities including Bengaluru, Mysuru, Mangaluru, Belagavi, and Hubballi.",
    textKn: "ಜಿಐಎಸ್ ಅಪರಾಧ ನಕ್ಷೆಯು ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಗಳೂರು, ಬೆಳಗಾವಿ ಮತ್ತು ಹುಬ್ಬಳ್ಳಿಯ ಅಪರಾಧ ಸಾಂದ್ರತೆ ಮತ್ತು ಗಸ್ತು ಮಾರ್ಗಗಳನ್ನು ಪ್ರದರ್ಶಿಸುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_6.mp3",
    audioUrlKn: "./audio/kn/scene_6.mp3",
    durationSec: 7,
    wordCountEn: 20
  },
  7: {
    sceneId: 7,
    textEn: "Criminal Nexus Graph analytics automatically uncover hidden networks, repeat offender linkages, and cross-district criminal syndicate operations.",
    textKn: "ಅಪರಾಧಿಗಳ ಜಾಲ ನಕ್ಷೆಯು ಶಂಕಿತರು ಮತ್ತು ಅಪರಾಧ ಗುಂಪುಗಳ ನಡುವಿನ ಗುಪ್ತ ಸಂಪರ್ಕಗಳನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಪತ್ತೆಹಚ್ಚುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_7.mp3",
    audioUrlKn: "./audio/kn/scene_7.mp3",
    durationSec: 7,
    wordCountEn: 17
  },
  8: {
    sceneId: 8,
    textEn: "Automated Reports and Analytics generate court-ready PDF briefs and master Excel datasets for senior police commanders and judicial submissions in seconds.",
    textKn: "ಸ್ವಯಂಚಾಲಿತ ವರದಿಗಳು ನ್ಯಾಯಾಲಯದ ಸಲ್ಲಿಕೆಗೆ ಮತ್ತು ಹಿರಿಯ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ಅಗತ್ಯವಾದ ಪಿಡಿಎಫ್ ಮತ್ತು ಎಕ್ಸೆಲ್ ಡಾಕ್ಯುಮೆಂಟ್‌ಗಳನ್ನು ತಕ್ಷಣವೇ ರಫ್ತು ಮಾಡುತ್ತವೆ.",
    audioUrlEn: "./audio/en/scene_8.mp3",
    audioUrlKn: "./audio/kn/scene_8.mp3",
    durationSec: 7,
    wordCountEn: 21
  },
  9: {
    sceneId: 9,
    textEn: "Bank-Grade Role-Based Access Control enforces strict clearance levels for IOs, SHOs, and DSPs, protecting sensitive case intelligence across jurisdiction boundaries.",
    textKn: "ಬ್ಯಾಂಕ್ ಮಟ್ಟದ ಆರ್‌ಬಿಎಸಿ ಭದ್ರತೆಯು ತನಿಖಾಧಿಕಾರಿಗಳು ಮತ್ತು ಹಿರಿಯ ಅಧಿಕಾರಿಗಳಿಗೆ ಕಟ್ಟುನಿಟ್ಟಾದ ಹುದ್ದೆ ಆಧಾರಿತ ಪ್ರವೇಶ ನಿಯಂತ್ರಣವನ್ನು ಒದಗಿಸುತ್ತದೆ.",
    audioUrlEn: "./audio/en/scene_9.mp3",
    audioUrlKn: "./audio/kn/scene_9.mp3",
    durationSec: 8,
    wordCountEn: 21
  },
  10: {
    sceneId: 10,
    textEn: "Together, Artificial Intelligence and the Karnataka State Police are building a safer Karnataka through proactive crime prevention and swift intelligence.",
    textKn: "ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಒಟ್ಟಾಗಿ ಅಪರಾಧ ತಡೆಗಟ್ಟುವಿಕೆ ಮತ್ತು ಜಾಗರೂಕತೆಯ ಮೂಲಕ ಸುರಕ್ಷಿತ ಕರ್ನಾಟಕವನ್ನು ನಿರ್ಮಿಸುತ್ತಿವೆ.",
    audioUrlEn: "./audio/en/scene_10.mp3",
    audioUrlKn: "./audio/kn/scene_10.mp3",
    durationSec: 7,
    wordCountEn: 21
  }
};
