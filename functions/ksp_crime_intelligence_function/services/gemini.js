import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Dictionary to translate English crime terms into 100% pure Kannada (no English in parenthesis)
const KANNADA_TRANSLATION_MAP = {
  // Crime Major & Minor Heads
  'Attempt to murder using a sharp weapon': 'ಚೂಪಾದ ಆಯುಧದಿಂದ ಕೊಲೆಗೆ ಯತ್ನಿಸಲಾಗಿದೆ.',
  'Attempt to murder using sharp weapon': 'ಚೂಪಾದ ಆಯುಧದಿಂದ ಕೊಲೆಗೆ ಯತ್ನಿಸಲಾಗಿದೆ.',
  'Motorcycle stolen from parking area': 'ಪಾರ್ಕಿಂಗ್ ಪ್ರದೇಶದಿಂದ ಬೈಕ್ ಕಳವಾಗಿದೆ.',
  'Online banking fraud reported': 'ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆ ವರದಿಯಾಗಿದೆ.',
  'Domestic violence complaint registered': 'ಗೃಹ ಹಿಂಸಾಚಾರ ದೂರು ದಾಖಲಾಗಿದೆ.',
  'Victim found murdered in a residential apartment': 'ವಸತಿ ಅಪಾರ್ಟ್‌ಮೆಂಟ್‌ನಲ್ಲಿ ಸಂತ್ರಸ್ತರು ಕೊಲೆಯಾದ ಸ್ಥಿತಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿದ್ದಾರೆ.',
  'Victim found dead under suspicious circumstances in residential quarters.': 'ವಸತಿ ಅಪಾರ್ಟ್‌ಮೆಂಟ್‌ನಲ್ಲಿ ಸಂತ್ರಸ್ತರು ಕೊಲೆಯಾದ ಸ್ಥಿತಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿದ್ದಾರೆ.',

  'Murder': 'ಕೊಲೆ ಪ್ರಕರಣ',
  'Homicide': 'ಕೊಲೆ ಪ್ರಕರಣ',
  'Attempt to Murder': 'ಕೊಲೆಗೆ ಯತ್ನ',
  'Attempted Homicide': 'ಕೊಲೆಗೆ ಯತ್ನ',
  'Assault & Grievous Hurt': 'ತೀವ್ರ ಹಲ್ಲೆ',
  'Grievous Assault & Extortion': 'ತೀವ್ರ ಹಲ್ಲೆ ಮತ್ತು ವಸೂಲಿ',
  'Grievous Assault': 'ತೀವ್ರ ಹಲ್ಲೆ',
  'Assault': 'ಹಲ್ಲೆ ಪ್ರಕರಣ',
  'Kidnapping': 'ಅಪಹರಣ ಪ್ರಕರಣ',
  'Missing Person': 'ಕಾಣೆಯಾದ ವ್ಯಕ್ತಿ',
  'Cybercrime': 'ಸೈಬರ್ ಅಪರಾಧ',
  'Cyber Crime': 'ಸೈಬರ್ ಅಪರಾಧ',
  'Cyber Fraud': 'ಸೈಬರ್ ವಂಚನೆ',
  'UPI Phishing Fraud': 'ಯುಪಿಐ ಫಿಶಿಂಗ್ ವಂಚನೆ',
  'UPI Fraud': 'ಯುಪಿಐ ವಂಚನೆ',
  'Online Banking Fraud': 'ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವಂಚನೆ',
  'Identity Theft': 'ಗುರುತು ಕಳವು',
  'ATM Fraud': 'ಎಟಿಎಂ ವಂಚನೆ',
  'Theft': 'ಕಳವು / ಕಳ್ಳತನ',
  'Vehicle Theft': 'ವಾಹನ ಕಳವು',
  'Burglary': 'ಕನ್ನಗಳವು / ಕಳ್ಳತನ',
  'Armed Robbery': 'ಸಶಸ್ತ್ರ ದರೋಡೆ',
  'Commercial Burglary': 'ವಾಣಿಜ್ಯ ಮಳಿಗೆ ಕಳ್ಳತನ',
  'Robbery': 'ದರೋಡೆ',
  'Chain Snatching': 'ಚೈನ್ ಸ್ನ್ಯಾಚಿಂಗ್',
  'Rape': 'ಲೈಂಗಿಕ ದೌರ್ಜನ್ಯ / ಅತ್ಯಾಚಾರ',
  'Sexual Assault': 'ಲೈಂಗಿಕ ದೌರ್ಜನ್ಯ',
  'POCSO': 'ಪೋಕ್ಸೋ ಅಪರಾಧ',
  'Domestic Violence': 'ಗೃಹ ಹಿಂಸಾಚಾರ',
  'Crime Against Women': 'ಮಹಿಳೆಯರ ವಿರುದ್ಧದ ಅಪರಾಧ',
  'Illegal Weapons': 'ಅಕ್ರಮ ಆಯುಧಗಳ ಸಾಗಾಣಿಕೆ',
  'NDPS': 'ಮಾದಕ ದ್ರವ್ಯ ಅಪರಾಧ',
  'Drug Trafficking': 'ಮಾದಕ ದ್ರವ್ಯ ಸಾಗಾಣಿಕೆ',
  'MDMA Interception': 'ಎಂಡಿಎಂಎ ಸಿಂಥೆಟಿಕ್ ಡ್ರಗ್ಸ್ ಸಪ್ಲೈ',
  'Human Trafficking': 'ಮಾನವ ಸಾಗಾಣಿಕೆ',
  'Gambling': 'ಅಕ್ರಮ ಜೂಜು',
  'Wildlife Crime': 'ವನ್ಯಜೀವಿ ಅಪರಾಧ',
  'Forest Crime': 'ಅರಣ್ಯ ಅಪರಾಧ',
  'Land Title Deed Forgery': 'ಜಮೀನು ಪತ್ರ ನಕಲಿ ರಚನೆ',
  'Counterfeit Currency': 'ನಕಲಿ ನೋಟು ಚಲಾವಣೆ',
  'Hit and Run': 'ಹಿಟ್ ಆಂಡ್ ರನ್',
  'Road Accident': 'ರಸ್ತೆ ಅಪಘಾತ',
  
  // Statuses
  'Under Investigation': 'ತನಿಖೆಯಲ್ಲಿದೆ',
  'Charge Sheeted': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ',
  'Charge Sheet Filed': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ',
  'Pending Trial': 'ವಿಚಾರಣೆ ಬಾಕಿಯಿದೆ',
  'Convicted': 'ದೋಷಿ ಎಂದು ಸಾಬೀತಾಗಿದೆ',
  'Acquitted': 'ಖುಲಾಸೆಗೊಳಿಸಲಾಗಿದೆ',
  'Closed / Undetected': 'ಪ್ರಕರಣ ಮುಚ್ಚಲಾಗಿದೆ',
  'Closed': 'ಮುಚ್ಚಲಾಗಿದೆ',

  // Stations & Districts
  'Police Station': 'ಪೊಲೀಸ್ ಠಾಣೆ',
  'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
  'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
  'Mysuru': 'ಮೈಸೂರು',
  'Mangaluru': 'ಮಂಗಳೂರು',
  'Belagavi': 'ಬೆಳಗಾವಿ',
  'Hubballi-Dharwad': 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ',
  'Cubbon Park Police Station': 'ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Whitefield Police Station': 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Whitefield PS': 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Indiranagar Police Station': 'ಇಂದಿರಾನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Electronic City Police Station': 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Jayanagar Police Station': 'ಜಯನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Koramangala PS': 'ಕೋರಮಂಗಲ ಪೊಲೀಸ್ ಠಾಣೆ'
};

function translateTextToKannada(text) {
  if (!text) return '';
  let str = String(text);
  Object.keys(KANNADA_TRANSLATION_MAP).forEach(key => {
    if (str.includes(key)) {
      str = str.replaceAll(key, KANNADA_TRANSLATION_MAP[key]);
    }
  });
  return str;
}

export async function processConversationalQuery({ message, history = [], lang = 'en', retrievedFacts = [] }) {
  const isKannadaRequested = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message) || message.toLowerCase().includes('kannada');

  const systemPrompt = `
You are KSP-AI, the official Crime Intelligence AI for Karnataka State Police (SCRB).

MASTER ENTITY RELATIONSHIP MAP (KSP DATABASE TOPOLOGY):
1. CaseMaster is the central parent table (CaseID, FIRNumber, FIRDate, ComplaintDescription, IncidentDateTime, Latitude, Longitude).
2. CaseMaster FKs: CrimeMajorHeadID -> CrimeMajorHeadMaster, CrimeMinorHeadID -> CrimeMinorHeadMaster, CaseStatusID -> CaseStatusMaster, DistrictID -> DistrictMaster, PoliceStationID -> PoliceStationMaster.
3. Child Tables: Accused, Victim, Witness, Evidence, ComplainantDetails, ArrestSurrender, ChargesheetDetails, AIAnalysis.

INSTRUCTIONS FOR GENERATING INTELLIGENCE DOSSIERS:
1. Always format responses clearly using Markdown headers, bullet points, and clean case summaries.
2. Highlight FIR Numbers (e.g. KSP/BLR/2026/0104), Crime Major Head, Police Station, District, and Investigation Status.
3. Provide actionable intelligence insights and recommended next steps for police officers.
${isKannadaRequested 
  ? "CRITICAL MANDATE: Write your ENTIRE response in 100% pure, natural, fluent Kannada language. Convert EVERY SINGLE WORD (crime heads, station names, district names, case statuses, descriptions, headers, bullet points) into pure Kannada (e.g. Murder -> ಕೊಲೆ ಪ್ರಕರಣ, Under Investigation -> ತನಿಖೆಯಲ್ಲಿದೆ). DO NOT include English words or English text in parentheses!" 
  : "Write your response in authoritative, professional English."
}
`;

  // Pre-translate facts for Gemini prompt if Kannada requested
  const processedFacts = retrievedFacts.map(f => {
    if (!isKannadaRequested) return f;
    return {
      ...f,
      CrimeMajorHeadName: translateTextToKannada(f.CrimeMajorHeadName),
      StationName: translateTextToKannada(f.StationName),
      DistrictName: translateTextToKannada(f.DistrictName),
      CaseStatusName: translateTextToKannada(f.CaseStatusName),
      ComplaintDescription: translateTextToKannada(f.ComplaintDescription)
    };
  });

  const factsText = JSON.stringify(processedFacts, null, 2);

  const fullPrompt = `
System Instructions:
${systemPrompt}

Retrieved Grounding Facts from SCRB Catalyst Data Store (${processedFacts.length} records):
${factsText}

Language Preference: ${isKannadaRequested ? 'Kannada (kn)' : 'English (en)'}

User Query:
${message}
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(fullPrompt);
      let reply = result.response.text();

      // Post-process to ensure 100% pure Kannada translation without residual English parentheses
      if (isKannadaRequested) {
        reply = translateTextToKannada(reply);
      }

      return {
        reply,
        modelUsed: 'gemini-1.5-flash',
        grounded: true
      };
    } catch (err) {
      console.warn('[GEMINI WARNING] Gemini API call error:', err.message);
    }
  }

  return fallbackResponseGenerator(message, retrievedFacts, isKannadaRequested ? 'kn' : 'en');
}

function fallbackResponseGenerator(message, facts, lang) {
  const isKn = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message) || message.toLowerCase().includes('kannada');
  const lowerMsg = message.toLowerCase();

  if (isKn) {
    let knReply = `### 🚔 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ (SCRB) ಅಪರಾಧ ಗುಪ್ತಚರ ವರದಿ\n\n`;
    knReply += `ಲಭ್ಯವಿರುವ ಡಾಟಾಸ್ಟೋರ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ **${facts.length} ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು** ಪತ್ತೆಯಾಗಿವೆ:\n\n`;
    
    facts.slice(0, 5).forEach((f, idx) => {
      const crimeHead = translateTextToKannada(f.CrimeMajorHeadName || 'ಸೈಬರ್ ಅಪರಾಧ');
      const station = translateTextToKannada(f.StationName || 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ');
      const district = translateTextToKannada(f.DistrictName || 'ಬೆಂಗಳೂರು ನಗರ');
      const status = translateTextToKannada(f.CaseStatusName || 'ತನಿಖೆಯಲ್ಲಿದೆ');
      const desc = translateTextToKannada(f.ComplaintDescription || 'ತನಿಖಾಧಿಕಾರಿಗಳಿಂದ ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.');

      knReply += `${idx + 1}. **FIR No: ${f.FIRNumber || f.CrimeNo || 'KSP/2026/0101'}**\n`;
      knReply += `   • **ಅಪರಾಧ ಪ್ರಕಾರ:** ${crimeHead}\n`;
      knReply += `   • **ಠಾಣೆ/ಜಿಲ್ಲೆ:** ${station} (${district})\n`;
      knReply += `   • **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:** *${status}*\n`;
      knReply += `   • **ವಿವರ:** ${desc}\n\n`;
    });

    knReply += `\n**ತನಿಖಾಧಿಕಾರಿಗಳ ಜಾಗೃತಿ ಸಲಹೆ:** ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ 'Case 360' ವರ್ಕ್‌ಸ್ಪೇಸ್‌ ವೀಕ್ಷಿಸಿ.`;

    return {
      reply: translateTextToKannada(knReply),
      modelUsed: 'rule-engine-kannada',
      grounded: true
    };
  }

  let title = "Crime Intelligence Dossier";
  if (lowerMsg.includes('cyber')) title = "Active Cyber Crime Intelligence Dossier";
  else if (lowerMsg.includes('murder')) title = "Active Homicide & Murder Case Intelligence Dossier";
  else if (lowerMsg.includes('theft')) title = "Property & Vehicle Theft Case Dossier";

  let summaryText = `### 🚔 Karnataka State Police (SCRB) - ${title}\n\n`;
  summaryText += `Based on the SCRB CaseMaster datastore, **${facts.length} active case records** matched your query:\n\n`;

  if (facts.length > 0) {
    facts.slice(0, 5).forEach((f, idx) => {
      summaryText += `#### ${idx + 1}. FIR Reference: \`${f.FIRNumber || f.CrimeNo || 'KSP/BLR/2026/0101'}\`\n`;
      summaryText += `• **Crime Head:** ${f.CrimeMajorHeadName || 'Cybercrime / Offense'}\n`;
      summaryText += `• **Jurisdiction:** ${f.StationName || 'Whitefield PS'} (${f.DistrictName || 'Bengaluru City'})\n`;
      summaryText += `• **Status:** *${f.CaseStatusName || 'Under Investigation'}*\n`;
      summaryText += `• **Brief Facts:** ${f.ComplaintDescription || 'Active investigation in progress by assigned SHO.'}\n\n`;
    });

    summaryText += `---\n💡 **AI Recommendation for IO:** Select any case card in the **Recent Cases Dossiers** sidebar to open full Case 360 Workspace details, evidence chain, and suspect nexus.`;
  } else {
    summaryText += `No active cases matched your search query in the datastore.`;
  }

  return {
    reply: summaryText,
    modelUsed: 'grounded-rule-engine',
    grounded: true
  };
}
