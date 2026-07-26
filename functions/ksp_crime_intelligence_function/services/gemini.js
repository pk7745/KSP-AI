import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

// Dictionary to translate English crime terms into Kannada
const KANNADA_TRANSLATION_MAP = {
  // Crime Heads
  'Murder': 'ಕೊಲೆ ಪ್ರಕರಣ (Murder)',
  'Homicide': 'ಕೊಲೆ ಪ್ರಕರಣ (Homicide)',
  'Cybercrime': 'ಸೈಬರ್ ಅಪರಾಧ (Cybercrime)',
  'Cyber Crime': 'ಸೈಬರ್ ಅಪರಾಧ (Cyber Crime)',
  'Theft': 'ಕಳವು/ಕಳ್ಳತನ (Theft)',
  'Vehicle Theft': 'ವಾಹನ ಕಳವು (Vehicle Theft)',
  'Burglary': 'ಸಂತೋಷದ ಒಳನುಗ್ಗುವಿಕೆ/ಕಳ್ಳತನ (Burglary)',
  'Robbery': 'ದರೋಡೆ (Robbery)',
  'Assault': 'ಹಲ್ಲೆ ಪ್ರಕರಣ (Assault)',
  'NDPS': 'ಮಾದಕ ದ್ರವ್ಯ ಪ್ರಕರಣ (NDPS)',
  
  // Statuses
  'Under Investigation': 'ತನಿಖೆಯಲ್ಲಿದೆ (Under Investigation)',
  'Charge Sheeted': 'ದೋಷಾರೋಪ ಪಟ್ಟಿ ಸಲ್ಲಿಸಲಾಗಿದೆ (Charge Sheeted)',
  'Pending Trial': 'ವಿಚಾರಣೆ ಬಾಕಿಯಿದೆ (Pending Trial)',
  'Convicted': 'ದೋಷಿ ಎಂದು ಸಾಬೀತಾಗಿದೆ (Convicted)',
  'Acquitted': 'ಖುಲಾಸೆಗೊಳಿಸಲಾಗಿದೆ (Acquitted)',
  'Closed': 'ಮುಚ್ಚಲಾಗಿದೆ (Closed)',

  // Stations & Districts
  'Police Station': 'ಪೊಲೀಸ್ ಠಾಣೆ',
  'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
  'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
  'Cubbon Park Police Station': 'ಕಬ್ಬನ್ ಪಾರ್ಕ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Whitefield PS': 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Koramangala PS': 'ಕೋರಮಂಗಲ ಪೊಲೀಸ್ ಠಾಣೆ',
  'Jayanagar PS': 'ಜಯನಗರ ಪೊಲೀಸ್ ಠಾಣೆ',

  // Descriptions
  'Victim found murdered in a residential apartment': 'ವಸತಿ ಅಪಾರ್ಟ್‌ಮೆಂಟ್‌ನಲ್ಲಿ ಸಂತ್ರಸ್ತರು ಕೊಲೆಯಾದ ಸ್ಥಿತಿಯಲ್ಲಿ ಪತ್ತೆಯಾಗಿದ್ದಾರೆ.',
  'Cyber fraud involving unauthorized online banking transfer': 'ಅನಧಿಕೃತ ಆನ್‌ಲೈನ್ ಬ್ಯಾಂಕಿಂಗ್ ವರ್ಗಾವಣೆಯನ್ನು ಒಳಗೊಂಡಿರುವ ಸೈಬರ್ ವಂಚನೆ.',
  'Vehicle stolen from public parking area': 'ಸಾರ್ವಜನಿಕ ಪಾರ್ಕಿಂಗ್ ಪ್ರದೇಶದಿಂದ ವಾಹನ ಕಳವಾಗಿದೆ.',
  'Commercial shop burglary during midnight hours': 'ಮಧ್ಯರಾತ್ರಿಯ ಸಮಯದಲ್ಲಿ ವಾಣಿಜ್ಯ ಮಳಿಗೆಯಲ್ಲಿ ಕಳ್ಳತನ.'
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
  const isKannadaRequested = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message) || message.toLowerCase().includes('kannada') || message.toLowerCase().includes('kannada');

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
  ? "CRITICAL MANDATE: Write your ENTIRE response in 100% pure, natural, fluent Kannada language (Noto Sans Kannada script). Convert ALL crime heads, station names, district names, case statuses, and descriptions into pure Kannada (e.g. Murder -> ಕೊಲೆ ಪ್ರಕರಣ, Under Investigation -> ತನಿಖೆಯಲ್ಲಿದೆ). DO NOT leave English words in the case summaries!" 
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
      const reply = result.response.text();
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
      const crimeHead = translateTextToKannada(f.CrimeMajorHeadName || 'Cybercrime');
      const station = translateTextToKannada(f.StationName || 'Whitefield PS');
      const district = translateTextToKannada(f.DistrictName || 'Bengaluru City');
      const status = translateTextToKannada(f.CaseStatusName || 'Under Investigation');
      const desc = translateTextToKannada(f.ComplaintDescription || 'ತನಿಖಾಧಿಕಾರಿಗಳಿಂದ ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.');

      knReply += `${idx + 1}. **FIR No: ${f.FIRNumber || f.CrimeNo || 'KSP/2026/0101'}**\n`;
      knReply += `   • **ಅಪರಾಧ ಪ್ರಕಾರ:** ${crimeHead}\n`;
      knReply += `   • **ಠಾಣೆ/ಜಿಲ್ಲೆ:** ${station} (${district})\n`;
      knReply += `   • **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:** *${status}*\n`;
      knReply += `   • **ವಿವರ:** ${desc}\n\n`;
    });

    knReply += `\n**ತನಿಖಾಧಿಕಾರಿಗಳ ಜಾಗೃತಿ ಸಲಹೆ:** ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ 'Case 360' ವರ್ಕ್‌ಸ್ಪೇಸ್‌ ವೀಕ್ಷಿಸಿ.`;

    return {
      reply: knReply,
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
