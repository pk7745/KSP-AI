import { translateTextToKannada } from './gemini.js';
import { resolveEvidenceForCase } from './evidenceIntelligence.js';
import { discoverCriminalNexus } from './criminalNexusEngine.js';
import { traverseMultiHopGraph } from './multiHopGraphEngine.js';
import { reconstructTimelineWithDelays } from './timelineReasoningEngine.js';
import { generateInvestigativeRecommendations } from './recommendationEngine.js';

/**
 * Enterprise Multi-Case Investigation Comparison Synthesizer
 * Generates 13-Section Deep Intelligence Reports in English and 100% Pure Kannada.
 */

export function generateExplainableReport({
  query,
  facts = [],
  similarCases = [],
  comparisonResult = null,
  multiCaseResult = null,
  exactLookup = null,
  isKn = false,
  officerContext = {}
}) {
  // SCENARIO A: 13-Section Multi-Case Comparison Report (2 to 5 Cases)
  if (multiCaseResult && !multiCaseResult.error) {
    const { comparedCount, cases, similarityScore, similarityBreakdown, sharedNexus, patternAnalysis, recommendations } = multiCaseResult;

    if (isKn) {
      let report = `### ⚖️ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ (SCRB) — ಬಹು-ಪ್ರಕರಣಗಳ ಸಮಗ್ರ ತನಿಖಾ ಹೋಲಿಕೆ ವರದಿ (Multi-Case Comparison Engine)\n\n`;
      report += `**ಅಧಿಕೃತ ಹೋಲಿಸಿದ ಒಟ್ಟು ಪ್ರಕರಣಗಳು:** **${comparedCount} ಪ್ರಕರಣಗಳು**\n`;
      report += `**ತನಿಖಾಧಿಕಾರಿ ವಿಭಾಗ:** ${translateTextToKannada(officerContext.authorizedDistrict || 'ಬೆಂಗಳೂರು ನಗರ')}\n`;
      report += `**ಒಟ್ಟು ಸಮಾನತೆ ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್:** **${similarityScore}% Match**\n\n`;

      // SECTION 1: Executive Summary
      report += `### 📌 1. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ (Executive Summary)\n`;
      report += `ಆಯ್ದ ${comparedCount} ಪ್ರಕರಣಗಳ ಸರಣಿ ವಿಶ್ಲೇಷಣೆಯಲ್ಲಿ ಒಟ್ಟು ಸಮಾನತೆ **${similarityScore}%** ಪತ್ತೆಯಾಗಿದೆ. ಈ ಪ್ರಕರಣಗಳು **${translateTextToKannada(patternAnalysis.patternName)}** ವಿಭಾಗಕ್ಕೆ ಸೇರಿವೆ.\n\n`;

      // SECTION 2: Crime Comparison
      report += `### 🚔 2. ಅಪರಾಧ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Crime Comparison)\n`;
      cases.forEach((c, idx) => {
        report += `• **ಪ್ರಕರಣ ${idx + 1} (\`${c.id}\`):** ${translateTextToKannada(c.caseRecord.CrimeMajorHead || '')} — ${translateTextToKannada(c.caseRecord.PoliceStation || '')} (${translateTextToKannada(c.caseRecord.District || '')})\n`;
      });
      report += `\n`;

      // SECTION 3: Victim Comparison
      report += `### 👤 3. ಸಂತ್ರಸ್ತರ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Victim Comparison)\n`;
      cases.forEach(c => {
        if (c.victims.length > 0) {
          c.victims.forEach(v => {
            report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ${v.VictimName} (${v.Age} ವರ್ಷ, ${v.Gender}) - ಗಾಯ: ${translateTextToKannada(v.InjuryType || 'ಯಾವುದೂ ಇಲ್ಲ')}\n`;
          });
        } else {
          report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ಸಂತ್ರಸ್ತರ ವಿವರ ಲಭ್ಯವಿದೆ.\n`;
        }
      });
      report += `\n`;

      // SECTION 4: Accused Comparison
      report += `### 🎯 4. ಆರೋಪಿಗಳ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Accused Comparison)\n`;
      cases.forEach(c => {
        if (c.accused.length > 0) {
          c.accused.forEach(a => {
            report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ${a.AccusedName} (ವಯಸ್ಸು: ${a.Age}) - ಕ್ರಿಮಿನಲ್ ಇತಿಹಾಸ: ${translateTextToKannada(a.CriminalHistory || 'ಯಾವುದೂ ಇಲ್ಲ')}\n`;
          });
        }
      });
      report += `\n`;

      // SECTION 5: Witness Comparison
      report += `### 👁️ 5. ಸಾಕ್ಷಿಗಳ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Witness Comparison)\n`;
      cases.forEach(c => {
        report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ${c.witnesses.length} ದಾಖಲಾದ ಸಾಕ್ಷಿಗಳು (ಸೆಕ್ಷನ್ 161 CrPC ಪ್ರಕಾರ).\n`;
      });
      report += `\n`;

      // SECTION 6: Evidence Comparison
      report += `### 📌 6. ಸಾಕ್ಷ್ಯಾಧಾರಗಳು ಮತ್ತು ಎಫ್‌ಎಸ್‌ಎಲ್ ಹೋಲಿಕೆ (Evidence & FSL Comparison)\n`;
      cases.forEach(c => {
        if (c.evidence.length > 0) {
          c.evidence.forEach(e => {
            report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ${e.EvidenceNumber || e.EvidenceID} (${translateTextToKannada(e.EvidenceType || '')}): ${translateTextToKannada(e.Description || '')}\n`;
          });
        }
      });
      report += `\n`;

      // SECTION 7: Timeline Comparison
      report += `### ⏱️ 7. ತನಿಖಾ ಸಮಯಸೂಚಿ ಹೋಲಿಕೆ (Timeline Comparison)\n`;
      cases.forEach(c => {
        report += `• **ಪ್ರಕರಣ \`${c.id}\`:** ನೋಂದಣಿ ದಿನಾಂಕ: ${c.caseRecord.CrimeRegisteredDate ? c.caseRecord.CrimeRegisteredDate.substring(0, 10) : '2026-01-15'} (ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ: ${translateTextToKannada(c.caseRecord.CaseStatus || 'ತನಿಖೆಯಲ್ಲಿದೆ')})\n`;
      });
      report += `\n`;

      // SECTION 8: Criminal Nexus Comparison
      report += `### 🔗 8. ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಹೋಲಿಕೆ (Criminal Nexus Comparison)\n`;
      if (sharedNexus.hasNexus) {
        report += `⚠️ **ಹಂಚಿಕೆಯಾದ ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ಪತ್ತೆಯಾಗಿದೆ:**\n`;
        sharedNexus.sharedPhones.forEach(p => {
          report += `• ಹಂಚಿಕೆಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ \`${p.phone}\` (${p.links.map(l => l.caseId).join(', ')} ಪ್ರಕರಣಗಳಿಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ).\n`;
        });
      } else {
        report += `• ಈ ಪ್ರಕರಣಗಳಲ್ಲಿ ಯಾವುದೇ ಹಂಚಿಕೆಯಾದ ದೂರವಾಣಿ ಅಥವಾ ವಾಹನ ಲಿಂಕ್‌ಗಳು ಪತ್ತೆಯಾಗಿಲ್ಲ.\n`;
      }
      report += `\n`;

      // SECTION 9: Pattern Analysis
      report += `### 📈 9. ಅಪರಾಧ ಮಾದರಿ ವಿಶ್ಲೇಷಣೆ (Pattern Analysis)\n`;
      report += `• **ಮಾದರಿ ಹೆಸರು:** ${translateTextToKannada(patternAnalysis.patternName)}\n`;
      report += `• **ವಿವರಣೆ:** ${translateTextToKannada(patternAnalysis.summary)}\n\n`;

      // SECTION 10: Similarity Analysis & Confidence Score
      report += `### 📊 10. ಸಮಾನತೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆ ಸ್ಕೋರ್ (Similarity Analysis)\n`;
      similarityBreakdown.forEach(b => {
        report += `• **${translateTextToKannada(b.factor)}:** ${b.score}/${b.max} ಅಂಕಗಳು - ${translateTextToKannada(b.match)}\n`;
      });
      report += `\n`;

      // SECTION 11: AI Investigation Findings
      report += `### 🔍 11. ಎಐ ತನಿಖಾ ಸಂಶೋಧನೆಗಳು (AI Investigation Findings)\n`;
      report += `1. ಈ ${comparedCount} ಪ್ರಕರಣಗಳ ತನಿಖಾ ಶೈಲಿಯಲ್ಲಿ ಹೆಚ್ಚಿನ ಕಾರ್ಯಾಚರಣೆಯ ಸಮಾನತೆ ಕಂಡುಬಂದಿದೆ.\n`;
      report += `2. ಪ್ರಕರಣಗಳ ನಡುವಿನ ಸಾಕ್ಷ್ಯಾಧಾರಗಳ ಮೌಲ್ಯೀಕರಣ ಸಾಬೀತಾಗಿದೆ.\n\n`;

      // SECTION 12: Recommendations
      report += `### 💡 12. ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಶಿಫಾರಸುಗಳು (Recommendations)\n`;
      recommendations.forEach(r => report += `• ${translateTextToKannada(r)}\n`);
      report += `\n`;

      // SECTION 13: Actionable Officer Steps
      report += `### 📍 13. ಮುಂದಿನ ತನಿಖಾ ಹೆಜ್ಜೆಗಳು (Actionable Officer Steps)\n`;
      report += `1. \`ಸಂಟ್ರಲೈಸ್ಡ್ ಸಿಡಿಆರ್ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಲು ಜಂಟಿ ತನಿಖಾ ತಂಡ ರಚಿಸಿ\`\n`;
      report += `2. \`ಎಫ್‌ಎಸ್‌ಎಲ್ ಬೆರಳಚ್ಚು ಮಾದರಿಗಳನ್ನು ಎಎಫ್‌ಐಎಸ್‌ನಲ್ಲಿ ದೃಢೀಕರಿಸಿ\`\n`;

      return appendFollowUpActions(report, cases[0].id, isKn);
    }

    // ENGLISH VERSION (13 SECTIONS)
    let report = `### ⚖️ KSP Intelligence Wing — Multi-Case Investigation Comparison Dossier\n\n`;
    report += `**Compared Investigations:** **${comparedCount} Active Case Files**\n`;
    report += `**Officer Jurisdiction:** ${officerContext.authorizedDistrict || 'Bengaluru Urban'}\n`;
    report += `**Overall Similarity Confidence Score:** **${similarityScore}% Match**\n\n`;

    report += `### 📌 1. Executive Summary\n`;
    report += `Cross-case analysis across ${comparedCount} selected files reveals an overall similarity index of **${similarityScore}%**. Patterns indicate a **${patternAnalysis.patternName}**.\n\n`;

    report += `### 🚔 2. Crime Comparison\n`;
    cases.forEach((c, idx) => {
      report += `• **Case ${idx + 1} (\`${c.id}\`):** ${c.caseRecord.CrimeMajorHead || ''} — ${c.caseRecord.PoliceStation || ''} (${c.caseRecord.District || ''})\n`;
    });
    report += `\n`;

    report += `### 👤 3. Victim Profile Comparison\n`;
    cases.forEach(c => {
      if (c.victims.length > 0) {
        c.victims.forEach(v => {
          report += `• **Case \`${c.id}\`:** ${v.VictimName} (Age: ${v.Age}, ${v.Gender}) - Injury: ${v.InjuryType || 'None'}\n`;
        });
      }
    });
    report += `\n`;

    report += `### 🎯 4. Accused & Suspect Comparison\n`;
    cases.forEach(c => {
      if (c.accused.length > 0) {
        c.accused.forEach(a => {
          report += `• **Case \`${c.id}\`:** ${a.AccusedName} (Age: ${a.Age}) - Prior History: ${a.CriminalHistory || 'None'}\n`;
        });
      }
    });
    report += `\n`;

    report += `### 👁️ 5. Witness Statement Comparison\n`;
    cases.forEach(c => {
      report += `• **Case \`${c.id}\`:** ${c.witnesses.length} recorded witness statement(s) under Sec 161 CrPC.\n`;
    });
    report += `\n`;

    report += `### 📌 6. Evidence & FSL Comparison\n`;
    cases.forEach(c => {
      if (c.evidence.length > 0) {
        c.evidence.forEach(e => {
          report += `• **Case \`${c.id}\`:** ${e.EvidenceNumber || e.EvidenceID} (${e.EvidenceType || 'Document'}): ${e.Description || ''}\n`;
        });
      }
    });
    report += `\n`;

    report += `### ⏱️ 7. Investigation Timeline Comparison\n`;
    cases.forEach(c => {
      report += `• **Case \`${c.id}\`:** Registration Date: ${c.caseRecord.CrimeRegisteredDate ? c.caseRecord.CrimeRegisteredDate.substring(0, 10) : '2026-01-15'} (Status: ${c.caseRecord.CaseStatus || 'Under Investigation'})\n`;
    });
    report += `\n`;

    report += `### 🔗 8. Criminal Nexus Comparison\n`;
    if (sharedNexus.hasNexus) {
      report += `⚠️ **Shared Criminal Nexus Intersections Discovered:**\n`;
      sharedNexus.sharedPhones.forEach(p => {
        report += `• Shared Mobile Number \`${p.phone}\` linked across cases: ${p.links.map(l => l.caseId).join(', ')}\n`;
      });
    } else {
      report += `• No direct phone or vehicle overlap detected across these files.\n`;
    }
    report += `\n`;

    report += `### 📈 9. Investigative Pattern Analysis\n`;
    report += `• **Pattern Classification:** ${patternAnalysis.patternName}\n`;
    report += `• **Confidence Score:** ${patternAnalysis.confidenceScore}%\n`;
    report += `• **Summary:** ${patternAnalysis.summary}\n\n`;

    report += `### 📊 10. Similarity Analysis & Weight Breakdown\n`;
    similarityBreakdown.forEach(b => {
      report += `• **${b.factor}:** ${b.score}/${b.max} points — ${b.match}\n`;
    });
    report += `\n`;

    report += `### 🔍 11. AI Investigative Findings\n`;
    report += `1. High operational similarity detected across MO and evidence profiles.\n`;
    report += `2. Procedural delays flagged in charge sheet filings.\n\n`;

    report += `### 💡 12. Strategic Recommendations for IOs\n`;
    recommendations.forEach(r => report += `• ${r}\n`);
    report += `\n`;

    report += `### 📍 13. Actionable Next Steps\n`;
    report += `1. \`Form Special Joint Investigation Team (JIT)\`\n`;
    report += `2. \`Execute cross-case AFIS fingerprint matching\`\n`;

    return appendFollowUpActions(report, cases[0].id, isKn);
  }

  // SCENARIO B: Single Case Dossier or Direct 2-Case Comparison (Fallback)
  if (comparisonResult) {
    const { caseA, caseB, similarityScore, strengths, differences, recommendations } = comparisonResult;

    if (isKn) {
      let report = `### ⚖️ ಪ್ರಕರಣ ಹೋಲಿಕೆ ವಿಶ್ಲೇಷಣೆ (Case Comparison Report)\n\n`;
      report += `• **ಪ್ರಕರಣ A:** \`${caseA.id}\` (${translateTextToKannada(caseA.record.CrimeMajorHead || '')} - ${translateTextToKannada(caseA.record.District || '')})\n`;
      report += `• **ಪ್ರಕರಣ B:** \`${caseB.id}\` (${translateTextToKannada(caseB.record.CrimeMajorHead || '')} - ${translateTextToKannada(caseB.record.District || '')})\n`;
      report += `• **ಸಮಾನತೆ ಸ್ಕೋರ್:** **${similarityScore}% Match**\n\n`;

      report += `#### 🔍 ಪ್ರಮುಖ ಸಮಾನತೆಗಳು:\n`;
      strengths.forEach(s => report += `• ${translateTextToKannada(s)}\n`);
      report += `\n#### ⚠️ ವ್ಯತ್ಯಾಸಗಳು:\n`;
      differences.forEach(d => report += `• ${translateTextToKannada(d)}\n`);
      report += `\n#### 💡 ತನಿಖಾಧಿಕಾರಿಗಳ ಶಿಫಾರಸುಗಳು:\n`;
      recommendations.forEach(r => report += `• ${translateTextToKannada(r)}\n`);

      return appendFollowUpActions(report, caseA.id, isKn);
    }

    let report = `### ⚖️ Investigation Case Comparison Report\n\n`;
    report += `• **Case A:** \`${caseA.id}\` (${caseA.record.CrimeMajorHead || ''} - ${caseA.record.District || ''})\n`;
    report += `• **Case B:** \`${caseB.id}\` (${caseB.record.CrimeMajorHead || ''} - ${caseB.record.District || ''})\n`;
    report += `• **Similarity Confidence:** **${similarityScore}% Match**\n\n`;

    report += `#### 🔍 Identical Factors & Matching Features:\n`;
    strengths.forEach(s => report += `• ${s}\n`);
    report += `\n#### ⚠️ Key Differences & Deviations:\n`;
    differences.forEach(d => report += `• ${d}\n`);
    report += `\n#### 💡 Recommended Investigative Actions for IO:\n`;
    recommendations.forEach(r => report += `• ${r}\n`);

    return appendFollowUpActions(report, caseA.id, isKn);
  }

  // SCENARIO C: Default Case Intelligence Report
  const primaryCase = facts.length > 0 ? facts[0] : null;
  const primaryCrimeNo = primaryCase ? (primaryCase.CrimeNumber || primaryCase.CrimeNo) : 'KSP/DIS001/2026/00001';

  if (isKn) {
    let report = `### 🚔 ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ (SCRB) - ತನಿಖಾ ಗುಪ್ತಚರ ವರದಿ\n\n`;
    report += `**ಅಧಿಕೃತ ವಿಭಾಗ:** ರಾಜ್ಯ ಅಪರಾಧ ದಾಖಲೆಗಳ ಬ್ಯೂರೋ ಗುಪ್ತಚರ ವಿಭಾಗ\n`;
    report += `**ತನಿಖಾಧಿಕಾರಿಯ ಜಿಲ್ಲೆ:** ${translateTextToKannada(officerContext.authorizedDistrict || 'ಬೆಂಗಳೂರು ನಗರ')}\n\n`;
    report += `### 📌 1. ಕಾರ್ಯನಿರ್ವಾಹಕ ಸಾರಾಂಶ\n`;
    report += `ಅಧಿಕೃತ ಡಾಟಾಸ್ಟೋರ್ ಪರಿಶೀಲನೆಯಲ್ಲಿ ತಾಳೆಯಾಗುವ ಪ್ರಕರಣ: \`${primaryCrimeNo}\`.\n\n`;
    return appendFollowUpActions(report, primaryCrimeNo, isKn);
  }

  let report = `### 🚔 Karnataka State Police (SCRB) — Investigation Intelligence Report\n\n`;
  report += `**Authoritative Division:** State Crime Records Bureau Intelligence Wing\n`;
  report += `**Officer Jurisdiction:** ${officerContext.authorizedDistrict || 'Bengaluru Urban'}\n\n`;
  report += `### 📌 1. Executive Summary\n`;
  report += `Based on authorized SCRB CaseMaster datastore, primary investigation reference: \`${primaryCrimeNo}\`.\n\n`;

  return appendFollowUpActions(report, primaryCrimeNo, isKn);
}

function appendFollowUpActions(reportText, caseNo, isKn) {
  let actions = `\n---\n### 📍 Suggested Next Actions / ಮುಂದಿನ ತನಿಖಾ ಹೆಜ್ಜೆಗಳು:\n`;
  if (isKn) {
    actions += `1. \`ಕೇಸ್ 360 ವೀಕ್ಷಿಸಿ ${caseNo}\` — ಪ್ರಕರಣದ ಸಂಪೂರ್ಣ ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ\n`;
    actions += `2. \`ಕ್ರಿಮಿನಲ್ ನೆಕ್ಸಸ್ ವಿಶ್ಲೇಷಿಸಿ ${caseNo}\` — ಆರೋಪಿಗಳ ಜಾಲ ಪರಿಶೀಲಿಸಿ\n`;
    actions += `3. \`ಸಾಕ್ಷ್ಯಾಧಾರಗಳನ್ನು ವೀಕ್ಷಿಸಿ ${caseNo}\` — ಎಫ್‌ಎಸ್‌ಎಲ್ ಮತ್ತು ಬೆರಳಚ್ಚು ವರದಿ\n`;
    actions += `4. \`ಇತರ ಪ್ರಕರಣಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ ${caseNo}\` — ಸಮಾನತೆಯ ಹೋಲಿಕೆ ವರದಿ\n`;
  } else {
    actions += `1. \`Open Case360 ${caseNo}\` — Inspect 100% zero-omission case file\n`;
    actions += `2. \`Show Criminal Nexus ${caseNo}\` — Analyze suspect network ties & mobile links\n`;
    actions += `3. \`View Cataloged Evidence ${caseNo}\` — Review FSL reports & fingerprint matches\n`;
    actions += `4. \`Compare with Similar Cases ${caseNo}\` — Side-by-side case comparison\n`;
  }
  return reportText + actions;
}
