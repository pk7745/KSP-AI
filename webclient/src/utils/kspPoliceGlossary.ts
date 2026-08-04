/**
 * Human-Curated Karnataka State Police (KSP) Legal & Police Terminology Glossary
 * Section 2.3 of Transformation Master Prompt v2.0
 * Ensures identical court-admissible terminology across UI and AI outputs.
 */

export interface GlossaryEntry {
  en: string;
  kn: string;
  category: 'rank' | 'section' | 'status' | 'crimeHead' | 'legal';
}

export const KSP_POLICE_GLOSSARY: Record<string, GlossaryEntry> = {
  // Police Ranks
  DGP: { en: 'Director General & Inspector General of Police', kn: 'ಮಹಾನಿರ್ದೇಶಕರು ಮತ್ತು ಪೊಲೀಸ್ ಮಹಾನಿರೀಕ್ಷಕರು (DGP)', category: 'rank' },
  IGP: { en: 'Inspector General of Police', kn: 'ಪೊಲೀಸ್ ಮಹಾನಿರೀಕ್ಷಕರು (IGP)', category: 'rank' },
  SP: { en: 'Superintendent of Police', kn: 'ಪೊಲೀಸ್ ಸೂಪರಿಂಟೆಂಡೆಂಟ್ (SP)', category: 'rank' },
  DSP: { en: 'Deputy Superintendent of Police', kn: 'ಉಪ ಪೊಲೀಸ್ ಸೂಪರಿಂಟೆಂಡೆಂಟ್ (DSP)', category: 'rank' },
  SHO: { en: 'Station House Officer', kn: 'ಠಾಣಾಧಿಕಾರಿ (SHO)', category: 'rank' },
  IO: { en: 'Investigating Officer', kn: 'ತನಿಖಾಧಿಕಾರಿ (IO)', category: 'rank' },

  // Key Legal & IPC/BNS Sections
  'Sec 302 IPC': { en: 'Punishment for Murder (Sec 302 IPC / Sec 103 BNS)', kn: 'ಕೊಲೆ ಅಪರಾಧ (Sec 302 IPC / Sec 103 BNS)', category: 'section' },
  'Sec 307 IPC': { en: 'Attempt to Murder (Sec 307 IPC / Sec 109 BNS)', kn: 'ಕೊಲೆ ಯತ್ನ (Sec 307 IPC / Sec 109 BNS)', category: 'section' },
  'Sec 379 IPC': { en: 'Punishment for Theft (Sec 379 IPC / Sec 303 BNS)', kn: 'ಕಳ್ಳತನ (Sec 379 IPC / Sec 303 BNS)', category: 'section' },
  'Sec 420 IPC': { en: 'Cheating & Dishonesty (Sec 420 IPC / Sec 318 BNS)', kn: 'ವಂಚನೆ ಮತ್ತು ಮೋಸ (Sec 420 IPC / Sec 318 BNS)', category: 'section' },
  'Sec 161 CrPC': { en: 'Examination of Witnesses by Police (Sec 161 CrPC)', kn: 'ಸಾಕ್ಷಿಗಳ ವಿಚಾರಣೆ (Sec 161 CrPC)', category: 'legal' },
  'Sec 65B Evidence Act': { en: 'Admissibility of Electronic Records', kn: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಾಕ್ಷ್ಯ ಮಾನ್ಯತೆ (Sec 65B)', category: 'legal' },

  // Case Statuses
  'Under Investigation': { en: 'Under Investigation', kn: 'ತನಿಖೆಯಲ್ಲಿದೆ', category: 'status' },
  'Charge Sheeted': { en: 'Charge Sheeted', kn: 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ', category: 'status' },
  Solved: { en: 'Solved', kn: 'ಪ್ರಕರಣ ಇತ್ಯರ್ಥಗೊಂಡಿದೆ', category: 'status' },
  Unsolved: { en: 'Unsolved', kn: 'ಇತ್ಯರ್ಥವಾಗದ ಪ್ರಕರಣ', category: 'status' },
  Closed: { en: 'Closed & Archived', kn: 'ಪ್ರಕರಣ ಮುಕ್ತಾಯಗೊಂಡಿದೆ', category: 'status' },
  Transferred: { en: 'Transferred to Agency/CID', kn: 'ಸಿಐಡಿ/ಇತರ ಸಂಸ್ಥೆಗೆ ವರ್ಗಾಯಿಸಲಾಗಿದೆ', category: 'status' }
};

export function translatePoliceTerm(term: string, isKn: boolean): string {
  if (!term) return '';
  if (!isKn) return term;

  const match = KSP_POLICE_GLOSSARY[term];
  if (match) return match.kn;

  // Partial replacement fallback for mixed string values
  let result = String(term);
  Object.entries(KSP_POLICE_GLOSSARY).forEach(([key, entry]) => {
    if (result.includes(key)) {
      result = result.replaceAll(key, entry.kn);
    }
  });

  return result;
}
