/**
 * KSP Pure-Kannada Lexicon & Transliteration Engine
 * -------------------------------------------------
 * Guarantees that Multi-Case Comparison reports rendered in Kannada mode contain
 * NO English descriptive words. Works in two passes:
 *   1. Domain dictionary replacement (longest phrase first) for every categorical
 *      value present in the authorised Stratus CSV datasets.
 *   2. Phonetic transliteration of any remaining Latin proper nouns (person names,
 *      place names) into Kannada script — while preserving pure identifiers
 *      (case numbers, phone numbers, ID codes, dates) untouched.
 *
 * No external dependencies (safe to import in unit tests without node_modules).
 */

// ---------------------------------------------------------------------------
// 1. DOMAIN DICTIONARY (English -> pure Kannada)
// ---------------------------------------------------------------------------
export const KN_LEXICON = {
  // ---- Crime Major Heads -------------------------------------------------
  'Public Disturbance & Miscellaneous': 'ಸಾರ್ವಜನಿಕ ಶಾಂತಿಭಂಗ ಮತ್ತು ಇತರೆ',
  'Cyber Crime & Online Fraud': 'ಸೈಬರ್ ಅಪರಾಧ ಮತ್ತು ಆನ್‌ಲೈನ್ ವಂಚನೆ',
  'Organized Crime & Extortion': 'ಸಂಘಟಿತ ಅಪರಾಧ ಮತ್ತು ಸುಲಿಗೆ',
  'Economic & White Collar Offence': 'ಆರ್ಥಿಕ ಮತ್ತು ಶ್ವೇತವಸ್ತ್ರ ಅಪರಾಧ',
  'Crime Against Women & Children': 'ಮಹಿಳೆಯರು ಮತ್ತು ಮಕ್ಕಳ ವಿರುದ್ಧದ ಅಪರಾಧ',
  'Environmental & Forest Crime': 'ಪರಿಸರ ಮತ್ತು ಅರಣ್ಯ ಅಪರಾಧ',
  'Traffic & Road Incident': 'ಸಂಚಾರ ಮತ್ತು ರಸ್ತೆ ಘಟನೆ',
  'Narcotics & Contraband': 'ಮಾದಕ ದ್ರವ್ಯ ಮತ್ತು ನಿಷೇಧಿತ ಸರಕು',
  'Terror & National Security': 'ಭಯೋತ್ಪಾದನೆ ಮತ್ತು ರಾಷ್ಟ್ರೀಯ ಭದ್ರತೆ',
  'Violent Crime': 'ಹಿಂಸಾತ್ಮಕ ಅಪರಾಧ',
  'Property Crime': 'ಆಸ್ತಿ ಅಪರಾಧ',

  // ---- Crime Minor Heads -------------------------------------------------
  'Attempt to Murder': 'ಕೊಲೆ ಯತ್ನ',
  'Assault & Grievous Hurt': 'ಹಲ್ಲೆ ಮತ್ತು ಗಂಭೀರ ಗಾಯ',
  'Missing Person': 'ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ',
  'Chain Snatching': 'ಸರಗಳವು',
  'Online Banking Fraud': 'ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆ',
  'Identity Theft': 'ಗುರುತಿನ ಕಳವು',
  'UPI Fraud': 'ಯುಪಿಐ ವಂಚನೆ',
  'ATM Fraud': 'ಎಟಿಎಂ ವಂಚನೆ',
  'Sexual Assault': 'ಲೈಂಗಿಕ ದೌರ್ಜನ್ಯ',
  'Domestic Violence': 'ಕೌಟುಂಬಿಕ ಹಿಂಸೆ',
  'Illegal Weapons': 'ಅಕ್ರಮ ಆಯುಧ',
  'Drug Trafficking': 'ಮಾದಕ ದ್ರವ್ಯ ಸಾಗಣೆ',
  'Human Trafficking': 'ಮಾನವ ಕಳ್ಳಸಾಗಣೆ',
  'Wildlife Crime': 'ವನ್ಯಜೀವಿ ಅಪರಾಧ',
  'Forest Crime': 'ಅರಣ್ಯ ಅಪರಾಧ',
  'Terror Related Activity': 'ಭಯೋತ್ಪಾದನಾ ಚಟುವಟಿಕೆ',
  'Economic Offence': 'ಆರ್ಥಿಕ ಅಪರಾಧ',
  'White Collar Crime': 'ಶ್ವೇತವಸ್ತ್ರ ಅಪರಾಧ',
  'Counterfeit Currency': 'ನಕಲಿ ನೋಟು',
  'Fake Documents': 'ನಕಲಿ ದಾಖಲೆ',
  'Hit and Run': 'ಡಿಕ್ಕಿ ಹೊಡೆದು ಪಲಾಯನ',
  'Road Accident': 'ರಸ್ತೆ ಅಪಘಾತ',
  'Fire Incident': 'ಬೆಂಕಿ ಅವಘಡ',
  'Unknown Dead Body': 'ಅಪರಿಚಿತ ಶವ',
  'Suicide Investigation': 'ಆತ್ಮಹತ್ಯೆ ತನಿಖೆ',
  'Property Disputes': 'ಆಸ್ತಿ ವಿವಾದ',
  'Vehicle Theft': 'ವಾಹನ ಕಳವು',
  'Murder': 'ಕೊಲೆ',
  'Kidnapping': 'ಅಪಹರಣ',
  'Burglary': 'ಕನ್ನಗಳವು',
  'Robbery': 'ದರೋಡೆ',
  'Theft': 'ಕಳವು',
  'Cybercrime': 'ಸೈಬರ್ ಅಪರಾಧ',
  'Cyber Crime': 'ಸೈಬರ್ ಅಪರಾಧ',
  'POCSO': 'ಪೋಕ್ಸೊ',
  'Rape': 'ಅತ್ಯಾಚಾರ',
  'Gambling': 'ಜೂಜು',
  'Corruption': 'ಭ್ರಷ್ಟಾಚಾರ',
  'Smuggling': 'ಕಳ್ಳಸಾಗಣೆ',
  'Extortion': 'ಸುಲಿಗೆ',
  'Blackmail': 'ಬೆದರಿಕೆ ಹಣ ವಸೂಲಿ',
  'Cheating': 'ವಂಚನೆ',
  'Fraud': 'ವಂಚನೆ',

  // ---- Case Statuses -----------------------------------------------------
  'Closed / Undetected': 'ಪ್ರಕರಣ ಪತ್ತೆಯಾಗದೆ ಮುಚ್ಚಲಾಗಿದೆ',
  'Under Investigation': 'ತನಿಖೆಯಲ್ಲಿದೆ',
  'Charge Sheeted': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
  'Charge Sheet Filed': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
  'Pending Trial': 'ವಿಚಾರಣೆ ಬಾಕಿ',
  'Convicted': 'ಶಿಕ್ಷೆಯಾಗಿದೆ',
  'Acquitted': 'ಖುಲಾಸೆಗೊಂಡಿದೆ',
  'Closed': 'ಮುಚ್ಚಲಾಗಿದೆ',

  // ---- Victim / Medical --------------------------------------------------
  'Minor Contusion': 'ಸಣ್ಣ ತರಚು ಗಾಯ',
  'Fatal Injury': 'ಮಾರಣಾಂತಿಕ ಗಾಯ',
  'Grievous Injury': 'ಗಂಭೀರ ಗಾಯ',
  'Simple Injury': 'ಸಾಧಾರಣ ಗಾಯ',
  'Safe & Recovered': 'ಸುರಕ್ಷಿತ ಮತ್ತು ಚೇತರಿಸಿಕೊಂಡಿದ್ದಾರೆ',
  'Deceased': 'ಮೃತಪಟ್ಟಿದ್ದಾರೆ',
  'Critical': 'ಗಂಭೀರ ಸ್ಥಿತಿ',
  'Stable': 'ಸ್ಥಿರ ಸ್ಥಿತಿ',
  'Mild': 'ಸೌಮ್ಯ',

  // ---- Accused -----------------------------------------------------------
  'Yes (Repeat Offender)': 'ಹೌದು (ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿ)',
  'Under Judicial Review': 'ನ್ಯಾಯಾಂಗ ಪರಿಶೀಲನೆಯಲ್ಲಿ',
  'Bail Rejected': 'ಜಾಮೀನು ತಿರಸ್ಕೃತ',
  'Bail Granted': 'ಜಾಮೀನು ಮಂಜೂರು',
  'Not in Custody': 'ವಶದಲ್ಲಿಲ್ಲ',
  'Judicial Custody': 'ನ್ಯಾಯಾಂಗ ವಶ',
  'Police Custody': 'ಪೊಲೀಸ್ ವಶ',
  'Arrested': 'ಬಂಧಿಸಲಾಗಿದೆ',
  'Absconding': 'ತಲೆಮರೆಸಿಕೊಂಡಿದ್ದಾನೆ',
  'Indian': 'ಭಾರತೀಯ',

  // ---- Evidence / Forensic ----------------------------------------------
  'Verified & Cataloged': 'ಪರಿಶೀಲಿಸಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ',
  'Intact Chain of Custody': 'ಸಮಗ್ರ ವಶ ಸರಪಳಿ',
  'Digital Document': 'ಡಿಜಿಟಲ್ ದಾಖಲೆ',
  'Physical Weapon': 'ಭೌತಿಕ ಆಯುಧ',
  'Video Footage': 'ವೀಡಿಯೊ ದೃಶ್ಯಾವಳಿ',
  'Biological Sample': 'ಜೈವಿಕ ಮಾದರಿ',
  'Fingerprint': 'ಬೆರಳಚ್ಚು',
  'Forensic Report': 'ವಿಧಿವಿಜ್ಞಾನ ವರದಿ',

  // ---- Witness -----------------------------------------------------------
  'Independent Witness': 'ಸ್ವತಂತ್ರ ಸಾಕ್ಷಿ',
  'Eyewitness': 'ಪ್ರತ್ಯಕ್ಷ ಸಾಕ್ಷಿ',
  'Hostile Witness': 'ವಿರೋಧಿ ಸಾಕ್ಷಿ',

  // ---- Occupations -------------------------------------------------------
  'Unemployed / Daily Wager': 'ನಿರುದ್ಯೋಗಿ / ದಿನಗೂಲಿ ಕಾರ್ಮಿಕ',
  'IT Software Engineer': 'ಐಟಿ ತಂತ್ರಾಂಶ ಎಂಜಿನಿಯರ್',
  'Business Owner': 'ಉದ್ಯಮಿ',
  'Student': 'ವಿದ್ಯಾರ್ಥಿ',
  'Farmer': 'ರೈತ',

  // ---- Gender ------------------------------------------------------------
  'Male': 'ಪುರುಷ',
  'Female': 'ಮಹಿಳೆ',
  'Other': 'ಇತರೆ',
  'None': 'ಇಲ್ಲ',
  'Unknown': 'ಅಜ್ಞಾತ',
  'Not Available': 'ಲಭ್ಯವಿಲ್ಲ',
  'Yes': 'ಹೌದು',
  'No': 'ಇಲ್ಲ',

  // ---- Common brief-fact fragments & connectors -------------------------
  'reported at': 'ವರದಿಯಾಗಿದೆ',
  'Incident occurred near': 'ಘಟನೆ ಸಂಭವಿಸಿದ ಸ್ಥಳ',
  'Premeditated homicide investigation': 'ಪೂರ್ವಯೋಜಿತ ಕೊಲೆ ತನಿಖೆ',
  'Violent assault with deadly weapon': 'ಮಾರಕ ಆಯುಧದಿಂದ ಹಿಂಸಾತ್ಮಕ ಹಲ್ಲೆ',
  'Physical injury caused during gang': 'ಗುಂಪು ಘರ್ಷಣೆಯ ವೇಳೆ ದೈಹಿಕ ಗಾಯ',
  'Key forensic evidence collected for': 'ಗಾಗಿ ಪ್ರಮುಖ ವಿಧಿವಿಜ್ಞಾನ ಸಾಕ್ಷ್ಯ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ',
  'Statement of': 'ಹೇಳಿಕೆ',
  'recorded regarding': 'ಕುರಿತು ದಾಖಲಿಸಲಾಗಿದೆ',
  'Accused in': 'ಆರೋಪಿ',
  'Resident of': 'ನಿವಾಸಿ',
  'Indexed via AI OCR': 'ಎಐ ಒಸಿಆರ್ ಮೂಲಕ ಸೂಚೀಕೃತ',
  'Central Station Locker': 'ಕೇಂದ್ರ ಠಾಣೆ ಲಾಕರ್',
  'Crime Scene': 'ಅಪರಾಧ ಸ್ಥಳ',
  'Cyber Crime PS': 'ಸೈಬರ್ ಅಪರಾಧ ಠಾಣೆ',
  'Town PS': 'ಟೌನ್ ಠಾಣೆ',
  'Police Station': 'ಪೊಲೀಸ್ ಠಾಣೆ',
  'Karnataka': 'ಕರ್ನಾಟಕ',
  'Brief': 'ಸಂಕ್ಷಿಪ್ತ ವಿವರ',

  // ---- Comparison pattern classifications -------------------------------
  'Serial / Syndicated Crime Pattern': 'ಸರಣಿ / ಸಂಘಟಿತ ಅಪರಾಧ ಮಾದರಿ',
  'Independent Parallel Investigations': 'ಸ್ವತಂತ್ರ ಸಮಾನಾಂತರ ತನಿಖೆಗಳು',
  'Common Modus Crime Cluster': 'ಸಾಮಾನ್ಯ ಕಾರ್ಯವಿಧಾನ ಅಪರಾಧ ಗುಚ್ಛ',
  'Linked Crime Pattern': 'ಸಂಬಂಧಿತ ಅಪರಾಧ ಮಾದರಿ',
  'Method under investigation': 'ವಿಧಾನ ತನಿಖೆಯಲ್ಲಿದೆ',

  // ---- Statutory acronyms (kept in Kannada script) ----------------------
  'IT Act': 'ಐಟಿ ಕಾಯ್ದೆ',
  'BNSS': 'ಬಿಎನ್‌ಎಸ್‌ಎಸ್',
  'POCSO': 'ಪೋಕ್ಸೊ',
  'NDPS': 'ಎನ್‌ಡಿಪಿಎಸ್',
  'CrPC': 'ಸಿಆರ್‌ಪಿಸಿ',
  'IPC': 'ಐಪಿಸಿ',
  'BNS': 'ಬಿಎನ್‌ಎಸ್',

  // ---- Police-station name components & jurisdiction --------------------
  'Statewide (Karnataka)': 'ರಾಜ್ಯವ್ಯಾಪಿ (ಕರ್ನಾಟಕ)',
  'Statewide': 'ರಾಜ್ಯವ್ಯಾಪಿ',
  'Central PS': 'ಕೇಂದ್ರ ಠಾಣೆ',
  'Central': 'ಕೇಂದ್ರ',
  'Rural': 'ಗ್ರಾಮಾಂತರ',
  'Urban': 'ನಗರ',
  'City': 'ನಗರ',
  'Town': 'ಟೌನ್',
  'Sector': 'ವಲಯ',

  // ---- Districts (Karnataka) --------------------------------------------
  'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
  'Bengaluru Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
  'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
  'Dakshina Kannada (Mangaluru)': 'ದಕ್ಷಿಣ ಕನ್ನಡ (ಮಂಗಳೂರು)',
  'Uttara Kannada (Karwar)': 'ಉತ್ತರ ಕನ್ನಡ (ಕಾರವಾರ)',
  'Vijayanagara (Hospete)': 'ವಿಜಯನಗರ (ಹೊಸಪೇಟೆ)',
  'Hubballi City': 'ಹುಬ್ಬಳ್ಳಿ ನಗರ',
  'Ramanagara': 'ರಾಮನಗರ',
  'Chikkaballapura': 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
  'Chamarajanagara': 'ಚಾಮರಾಜನಗರ',
  'Chitradurga': 'ಚಿತ್ರದುರ್ಗ',
  'Davanagere': 'ದಾವಣಗೆರೆ',
  'Shivamogga': 'ಶಿವಮೊಗ್ಗ',
  'Tumakuru': 'ತುಮಕೂರು',
  'Kalaburagi': 'ಕಲಬುರಗಿ',
  'Vijayapura': 'ವಿಜಯಪುರ',
  'Bagalkote': 'ಬಾಗಲಕೋಟೆ',
  'Chikkamagaluru': 'ಚಿಕ್ಕಮಗಳೂರು',
  'Mangaluru': 'ಮಂಗಳೂರು',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Ballari': 'ಬಳ್ಳಾರಿ',
  'Raichur': 'ರಾಯಚೂರು',
  'Vijayanagara': 'ವಿಜಯನಗರ',
  'Mysuru': 'ಮೈಸೂರು',
  'Mandya': 'ಮಂಡ್ಯ',
  'Hassan': 'ಹಾಸನ',
  'Kolar': 'ಕೋಲಾರ',
  'Koppal': 'ಕೊಪ್ಪಳ',
  'Kodagu': 'ಕೊಡಗು',
  'Gadag': 'ಗದಗ',
  'Haveri': 'ಹಾವೇರಿ',
  'Dharwad': 'ಧಾರವಾಡ',
  'Udupi': 'ಉಡುಪಿ',
  'Yadgir': 'ಯಾದಗಿರಿ',
  'Bidar': 'ಬೀದರ್',
  'Karwar': 'ಕಾರವಾರ',
  'Hospete': 'ಹೊಸಪೇಟೆ',
};

// Sort keys by length (desc) so multi-word phrases are replaced before shorter substrings.
const SORTED_KEYS = Object.keys(KN_LEXICON).sort((a, b) => b.length - a.length);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pre-compile one case-insensitive regex per key.
const COMPILED = SORTED_KEYS.map(k => ({ re: new RegExp(escapeRegex(k), 'gi'), kn: KN_LEXICON[k] }));

// ---------------------------------------------------------------------------
// 2. PHONETIC TRANSLITERATION (Latin -> Kannada script)
// ---------------------------------------------------------------------------
const CONSONANTS = [
  ['chh', 'ಛ'], ['shh', 'ಷ'], ['ng', 'ಂಗ'], ['nk', 'ಂಕ'],
  ['kh', 'ಖ'], ['gh', 'ಘ'], ['ch', 'ಚ'], ['jh', 'ಝ'], ['th', 'ತ'], ['dh', 'ಧ'],
  ['ph', 'ಫ'], ['bh', 'ಭ'], ['sh', 'ಶ'], ['ck', 'ಕ'],
  ['k', 'ಕ'], ['g', 'ಗ'], ['c', 'ಕ'], ['j', 'ಜ'], ['t', 'ಟ'], ['d', 'ಡ'],
  ['n', 'ನ'], ['p', 'ಪ'], ['b', 'ಬ'], ['m', 'ಮ'], ['y', 'ಯ'], ['r', 'ರ'],
  ['l', 'ಲ'], ['v', 'ವ'], ['w', 'ವ'], ['s', 'ಸ'], ['h', 'ಹ'], ['z', 'ಜ'],
  ['f', 'ಫ'], ['q', 'ಕ'], ['x', 'ಕ್ಸ'],
];
// [full-vowel (word start), vowel-sign (after consonant)]
const VOWELS = [
  ['ai', ['ಐ', 'ೈ']], ['au', ['ಔ', 'ೌ']], ['aa', ['ಆ', 'ಾ']], ['ee', ['ಈ', 'ೀ']],
  ['ea', ['ಈ', 'ೀ']], ['oo', ['ಊ', 'ೂ']], ['ou', ['ಔ', 'ೌ']], ['ei', ['ೇ', 'ೇ']],
  ['a', ['ಅ', '']], ['i', ['ಇ', 'ಿ']], ['e', ['ಎ', 'ೆ']], ['u', ['ಉ', 'ು']], ['o', ['ಒ', 'ೊ']],
];

function transliterateWord(word) {
  const s = word.toLowerCase();
  let out = '';
  let i = 0;
  let pendingConsonant = false;
  while (i < s.length) {
    let matched = false;
    for (const [lat, kn] of CONSONANTS) {
      if (s.startsWith(lat, i)) {
        if (pendingConsonant) out += '್';
        out += kn;
        i += lat.length;
        pendingConsonant = true;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    for (const [lat, forms] of VOWELS) {
      if (s.startsWith(lat, i)) {
        out += pendingConsonant ? forms[1] : forms[0];
        i += lat.length;
        pendingConsonant = false;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    i++; // skip apostrophes / unknown
  }
  if (pendingConsonant) out += '್';
  return out || word;
}

// Preserve identifiers: transliterate a Latin run only when it is NOT adjacent to a
// digit or identifier punctuation (so KSP/DIS001/2026, FP-2026-1, phone numbers,
// e-mails and dates are kept verbatim).
function transliterateLatin(text) {
  return text.replace(/[A-Za-z][A-Za-z'’]*/g, (word, offset, full) => {
    const before = full[offset - 1] || '';
    const after = full[offset + word.length] || '';
    if (/[0-9/@_\-.]/.test(before) || /[0-9/@_\-]/.test(after)) return word; // identifier fragment
    if (word.length <= 1) return word;
    return transliterateWord(word);
  });
}

// ---------------------------------------------------------------------------
// 3. PUBLIC API
// ---------------------------------------------------------------------------
/**
 * Convert an arbitrary English/mixed string into pure Kannada script.
 * @param {string} text
 * @param {object} [opts] - { transliterate: boolean } (default true)
 */
export function toPureKannada(text, opts = {}) {
  if (text === null || text === undefined) return '';
  let s = String(text);
  for (const { re, kn } of COMPILED) {
    if (re.test(s)) {
      re.lastIndex = 0;
      s = s.replace(re, kn);
    }
    re.lastIndex = 0;
  }
  if (opts.transliterate === false) return s;
  return transliterateLatin(s);
}

/** Dictionary-only translation (no transliteration of leftover proper nouns). */
export function toKannadaDict(text) {
  return toPureKannada(text, { transliterate: false });
}

/** Returns true when the string contains any residual Latin descriptive word. */
export function hasLatinWord(text) {
  // A "word" = >=2 consecutive letters not glued to a digit/identifier punctuation.
  const m = String(text || '').match(/[A-Za-z][A-Za-z'’]*/g) || [];
  return m.some(w => {
    const idx = String(text).indexOf(w);
    const before = String(text)[idx - 1] || '';
    const after = String(text)[idx + w.length] || '';
    if (/[0-9/@_\-.]/.test(before) || /[0-9/@_\-]/.test(after)) return false;
    return w.length >= 2;
  });
}

export default { toPureKannada, toKannadaDict, hasLatinWord, KN_LEXICON };
