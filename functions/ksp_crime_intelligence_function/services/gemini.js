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

export function translateTextToKannada(text) {
  if (!text) return '';
  let str = String(text);
  Object.keys(KANNADA_TRANSLATION_MAP).forEach(key => {
    if (str.includes(key)) {
      str = str.replaceAll(key, KANNADA_TRANSLATION_MAP[key]);
    }
  });
  return str;
}

export async function processConversationalQuery({ message, history = [], lang = 'en', retrievedFacts = [], similarCases = [], officerContext = {} }) {
  const isKannadaRequested = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message) || message.toLowerCase().includes('kannada');

  const systemPrompt = `
You are KSP-AI, the official Crime Intelligence AI for Karnataka State Police (SCRB).

MASTER ENTITY RELATIONSHIP MAP (KSP DATABASE TOPOLOGY):
1. CaseMaster is the central parent table (CaseID, FIRNumber, FIRDate, ComplaintDescription, IncidentDateTime, Latitude, Longitude).
2. CaseMaster FKs: CrimeMajorHeadID -> CrimeMajorHeadMaster, CrimeMinorHeadID -> CrimeMinorHeadMaster, CaseStatusID -> CaseStatusMaster, DistrictID -> DistrictMaster, PoliceStationID -> PoliceStationMaster.
3. Child Tables: Accused, Victim, Witness, Evidence, ComplainantDetails, ArrestSurrender, ChargesheetDetails, AIAnalysis.

INSTRUCTIONS FOR GENERATING INVESTIGATION INTELLIGENCE REPORTS:
1. Format responses clearly as a formal "INVESTIGATION INTELLIGENCE REPORT".
2. Include: Case Summaries, Similar Cases (% Match Scores), Victims, Accused, Known Associates, Evidence, Weapons/Modus Operandi, Crime Pattern, Timeline, District, Investigating Officer, Current Status, Recommendations, Risk Level, Suggested Next Steps.
3. CITE DATABASE SOURCES: Include Case IDs, Victim IDs, Accused IDs, Evidence IDs, and Officer IDs.
${isKannadaRequested 
  ? "CRITICAL MANDATE: Write your ENTIRE response in 100% pure, natural, fluent Kannada language. Convert EVERY SINGLE WORD (headers, crime heads, station names, district names, case statuses, descriptions, bullet points, recommendations) into pure Kannada (e.g. Murder -> ಕೊಲೆ ಪ್ರಕರಣ, Under Investigation -> ತನಿಖೆಯಲ್ಲಿದೆ). DO NOT include English words or English text in parentheses!" 
  : "Write your response in authoritative, professional English."
}
`;

  const processedFacts = retrievedFacts.map(f => {
    if (!isKannadaRequested) return f;
    return {
      ...f,
      CrimeMajorHeadName: translateTextToKannada(f.CrimeMajorHeadName || f.CrimeMajorHead),
      StationName: translateTextToKannada(f.StationName || f.PoliceStation),
      DistrictName: translateTextToKannada(f.DistrictName || f.District),
      CaseStatusName: translateTextToKannada(f.CaseStatusName || f.CaseStatus),
      ComplaintDescription: translateTextToKannada(f.ComplaintDescription || f.BriefFacts)
    };
  });

  const factsText = JSON.stringify(processedFacts, null, 2);
  const similarityText = JSON.stringify(similarCases.map(s => ({
    crimeNo: s.caseRecord.CrimeNumber || s.caseRecord.CrimeNo,
    similarityScore: `${s.similarityScore}%`,
    matchingFactors: s.matchingFactors
  })), null, 2);

  const fullPrompt = `
System Instructions:
${systemPrompt}

Retrieved Authorized Grounding Facts (${processedFacts.length} records):
${factsText}

Case Similarity Search Results:
${similarityText}

Officer Context:
Authorized District: ${officerContext.authorizedDistrict || 'Bengaluru Urban'}

Language Preference: ${isKannadaRequested ? 'Kannada (kn)' : 'English (en)'}

User Query:
${message}
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent(fullPrompt);
      let reply = result.response.text();

      if (isKannadaRequested) {
        reply = translateTextToKannada(reply);
      }

      return {
        reply,
        modelUsed: 'gemini-1.5-pro',
        grounded: true
      };
    } catch (err) {
      console.warn('[GEMINI WARNING] Gemini API call error:', err.message);
    }
  }

  return fallbackResponseGenerator(message, retrievedFacts, similarCases, isKannadaRequested ? 'kn' : 'en');
}

function fallbackResponseGenerator(message, facts, similarCases, lang) {
  const isKn = lang === 'kn' || /[\u0C80-\u0CFF]/.test(message) || message.toLowerCase().includes('kannada');
  const lowerMsg = message.toLowerCase();

  if (isKn) {
    let knReply = `### 🚔 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ (SCRB) ತನಿಖಾ ಗುಪ್ತಚರ ವರದಿ\n\n`;
    knReply += `ಅಧಿಕೃತ ಡಾಟಾಸ್ಟೋರ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ **${facts.length} ತಾಳೆಯಾಗುವ ಸಕ್ರಿಯ ತನಿಖಾ ಪ್ರಕರಣಗಳು** ಪತ್ತೆಯಾಗಿವೆ:\n\n`;
    
    facts.slice(0, 5).forEach((f, idx) => {
      const crimeHead = translateTextToKannada(f.CrimeMajorHeadName || f.CrimeMajorHead || 'ಸೈಬರ್ ಅಪರಾಧ');
      const station = translateTextToKannada(f.StationName || f.PoliceStation || 'ವೈಟ್‌ಫೀಲ್ಡ್ ಪೊಲೀಸ್ ಠಾಣೆ');
      const district = translateTextToKannada(f.DistrictName || f.District || 'ಬೆಂಗಳೂರು ನಗರ');
      const status = translateTextToKannada(f.CaseStatusName || f.CaseStatus || 'ತನಿಖೆಯಲ್ಲಿದೆ');
      const desc = translateTextToKannada(f.ComplaintDescription || f.BriefFacts || 'ತನಿಖಾಧಿಕಾರಿಗಳಿಂದ ತನಿಖೆ ಮುಂದುವರಿದಿದೆ.');

      knReply += `#### ${idx + 1}. ಪ್ರಕರಣ ಸಂಖ್ಯೆ: \`${f.FIRNumber || f.CrimeNo || f.CrimeNumber || 'KSP/2026/0101'}\`\n`;
      knReply += `• **ಅಪರಾಧ ಪ್ರಕಾರ:** ${crimeHead}\n`;
      knReply += `• **ಠಾಣೆ/ಜಿಲ್ಲೆ:** ${station} (${district})\n`;
      knReply += `• **ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ:** *${status}*\n`;
      knReply += `• **ವಿವರ:** ${desc}\n\n`;
    });

    if (similarCases && similarCases.length > 0) {
      knReply += `---\n### 🔍 ಪ್ರಕರಣ ಸಮಾನತೆ ಮತ್ತು ಮಾದರಿ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Similarity Engine)\n\n`;
      similarCases.forEach(s => {
        const cNo = s.caseRecord.CrimeNumber || s.caseRecord.CrimeNo;
        knReply += `• **ಪ್ರಕರಣ ${cNo}:** **${s.similarityScore}% ಸಮಾನತೆ match** (${s.matchingFactors.map(m => translateTextToKannada(m)).join(', ')})\n`;
      });
      knReply += `\n`;
    }

    knReply += `---\n📌 **ಆಧಾರಿತ ಡಾಟಾಬೇಸ್ ಬೆಂಬಲ (Database Source Citations):**\n`;
    knReply += `• **ಪ್ರಕರಣ ಮೂಲಗಳು:** ${facts.map(f => f.FIRNumber || f.CrimeNo || f.CrimeNumber).join(', ')}\n\n`;
    knReply += `💡 **ತನಿಖಾಧಿಕಾರಿಗಳ ಜಾಗೃತಿ ಸಲಹೆ:** ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ 'Case 360' ವರ್ಕ್‌ಸ್ಪೇಸ್‌ ವೀಕ್ಷಿಸಿ.`;

    return {
      reply: translateTextToKannada(knReply),
      modelUsed: 'rule-engine-kannada',
      grounded: true
    };
  }

  let title = "Investigation Intelligence Report";
  if (lowerMsg.includes('cyber')) title = "Cyber Crime Investigation Intelligence Report";
  else if (lowerMsg.includes('murder')) title = "Homicide & Murder Investigation Intelligence Report";
  else if (lowerMsg.includes('theft')) title = "Property & Vehicle Theft Intelligence Report";

  let summaryText = `### 🚔 Karnataka State Police (SCRB) - ${title}\n\n`;
  summaryText += `Based on the SCRB CaseMaster datastore, **${facts.length} active case records** matched your query:\n\n`;

  if (facts.length > 0) {
    facts.slice(0, 5).forEach((f, idx) => {
      summaryText += `#### ${idx + 1}. FIR Reference: \`${f.FIRNumber || f.CrimeNo || f.CrimeNumber || 'KSP/BLR/2026/0101'}\`\n`;
      summaryText += `• **Crime Head:** ${f.CrimeMajorHeadName || f.CrimeMajorHead || 'Cybercrime / Offense'}\n`;
      summaryText += `• **Jurisdiction:** ${f.StationName || f.PoliceStation || 'Whitefield PS'} (${f.DistrictName || f.District || 'Bengaluru City'})\n`;
      summaryText += `• **Status:** *${f.CaseStatusName || f.CaseStatus || 'Under Investigation'}*\n`;
      summaryText += `• **Brief Facts:** ${f.ComplaintDescription || f.BriefFacts || 'Active investigation in progress by assigned SHO.'}\n\n`;
    });

    if (similarCases && similarCases.length > 0) {
      summaryText += `---\n### 🔍 Case Similarity & Pattern Matching Engine\n\n`;
      similarCases.forEach(s => {
        const cNo = s.caseRecord.CrimeNumber || s.caseRecord.CrimeNo;
        summaryText += `• **Case \`${cNo}\`:** **${s.similarityScore}% Similar Match** (${s.matchingFactors.join(', ')})\n`;
      });
      summaryText += `\n`;
    }

    summaryText += `---\n📌 **Database Source Citations:**\n`;
    summaryText += `• **Case IDs:** ${facts.map(f => f.FIRNumber || f.CrimeNo || f.CrimeNumber).join(', ')}\n\n`;
    summaryText += `💡 **AI Recommendation for IO:** Select any case card in the **Recent Cases Dossiers** sidebar to open full Case 360 Workspace details, evidence chain, and suspect nexus.`;
  } else {
    summaryText += `No matching investigation was found in the authorised records.`;
  }

  return {
    reply: summaryText,
    modelUsed: 'grounded-rule-engine',
    grounded: true
  };
}
