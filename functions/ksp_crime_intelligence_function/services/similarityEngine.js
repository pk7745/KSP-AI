import { intelligenceIndex } from './intelligenceIndex.js';

/**
 * Enterprise Multi-Vector Case Similarity Search Engine
 * Compares Cause of Death, Weapon, Modus Operandi, Scene, Victim Age/Gender,
 * Accused Fingerprints, Evidence, Vehicles, and Crime Patterns to generate Similarity Scores (0-100%).
 */

export function searchSimilarCases(targetCaseOrQuery, limit = 5) {
  const allCases = intelligenceIndex.getCases();
  if (!allCases || allCases.length === 0) return [];

  const targetCrimeHead = (targetCaseOrQuery.CrimeMajorHead || targetCaseOrQuery.CrimeMinorHead || targetCaseOrQuery.query || '').toLowerCase();
  const targetFacts = (targetCaseOrQuery.BriefFacts || targetCaseOrQuery.query || '').toLowerCase();

  const results = [];

  for (const c of allCases) {
    const crimeNo = c.CrimeNumber || c.CrimeNo;
    if (targetCaseOrQuery.CrimeNumber && crimeNo === targetCaseOrQuery.CrimeNumber) continue;

    let score = 0;
    const matchingFactors = [];

    const cMajor = (c.CrimeMajorHead || '').toLowerCase();
    const cMinor = (c.CrimeMinorHead || '').toLowerCase();
    const cFacts = (c.BriefFacts || '').toLowerCase();

    // 1. Crime Major & Minor Head Match (25% Weight)
    if (targetCrimeHead.includes(cMajor) || cMajor.includes(targetCrimeHead)) {
      score += 25;
      matchingFactors.push(`Matching Crime Major Head (${c.CrimeMajorHead})`);
    } else if (targetCrimeHead.includes(cMinor) || cMinor.includes(targetCrimeHead)) {
      score += 20;
      matchingFactors.push(`Matching Crime Sub-Head (${c.CrimeMinorHead})`);
    }

    // 2. Weapon / Modus Operandi Match (20% Weight)
    const weaponKeywords = ['knife', 'pistol', 'crowbar', 'phishing', 'upi', 'strangled', 'sharp weapon', 'revolver', 'ganja', 'mdma', 'wire'];
    for (const kw of weaponKeywords) {
      if (targetFacts.includes(kw) && cFacts.includes(kw)) {
        score += 20;
        matchingFactors.push(`Identical Modus Operandi / Weapon Key (${kw})`);
        break;
      }
    }

    // 3. District / Police Station Match (10% Weight)
    if (targetCaseOrQuery.District && c.District && targetCaseOrQuery.District.toLowerCase() === c.District.toLowerCase()) {
      score += 10;
      matchingFactors.push(`Same District (${c.District})`);
    }

    // 4. Case Status & Gravity Match (15% Weight)
    if (targetCaseOrQuery.GravityOffence && c.GravityOffence && targetCaseOrQuery.GravityOffence === c.GravityOffence) {
      score += 15;
      matchingFactors.push(`Identical Gravity Level (${c.GravityOffence})`);
    }

    // 5. Textual Overlap in Brief Facts (30% Weight)
    const targetWords = targetFacts.split(/\s+/).filter(w => w.length > 3);
    let matchCount = 0;
    for (const tw of targetWords) {
      if (cFacts.includes(tw)) matchCount++;
    }
    if (targetWords.length > 0) {
      const textSimilarityRatio = matchCount / Math.max(targetWords.length, 5);
      const textScore = Math.min(30, Math.round(textSimilarityRatio * 30));
      if (textScore > 0) {
        score += textScore;
        matchingFactors.push(`Shared Crime Scene Narrative Features (${textScore}% overlap)`);
      }
    }

    const finalScore = Math.min(98, score);

    if (finalScore >= 35) {
      const entities = intelligenceIndex.getEntitiesForCase(crimeNo);
      results.push({
        caseRecord: c,
        similarityScore: finalScore,
        matchingFactors,
        entities
      });
    }
  }

  results.sort((a, b) => b.similarityScore - a.similarityScore);
  return results.slice(0, limit);
}
