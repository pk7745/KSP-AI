import { intelligenceIndex } from './intelligenceIndex.js';
import { computeConceptualSimilarity } from './semanticConceptMatcher.js';

/**
 * Enterprise Multi-Vector Case Similarity Search Engine
 * Returns Top 10 similar case matches with percentage confidence scores
 * and explicit point-by-point explanations of WHY cases were selected.
 */

export function searchSimilarCases(targetCaseOrQuery, limit = 10) {
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
      matchingFactors.push(`Same Crime Major Head (${c.CrimeMajorHead})`);
    } else if (targetCrimeHead.includes(cMinor) || cMinor.includes(targetCrimeHead)) {
      score += 20;
      matchingFactors.push(`Same Crime Sub-Head (${c.CrimeMinorHead})`);
    }

    // 2. Conceptual Semantic Matching (30% Weight)
    const conceptualScore = computeConceptualSimilarity(targetFacts, cFacts);
    if (conceptualScore > 20) {
      const addedScore = Math.min(30, Math.round(conceptualScore * 0.3));
      score += addedScore;
      matchingFactors.push(`Similar Crime Scene Narrative & Modus Operandi (${conceptualScore}% conceptual overlap)`);
    }

    // 3. Weapon / Key Identifier Match (20% Weight)
    const weaponKeywords = ['knife', 'pistol', 'crowbar', 'phishing', 'upi', 'strangled', 'sharp weapon', 'revolver', 'ganja', 'mdma', 'wire', 'poison', 'cyanide'];
    for (const kw of weaponKeywords) {
      if (targetFacts.includes(kw) && cFacts.includes(kw)) {
        score += 20;
        matchingFactors.push(`Same Weapon / Offense Mechanism Key (${kw})`);
        break;
      }
    }

    // 4. District / Police Station Match (10% Weight)
    if (targetCaseOrQuery.District && c.District && targetCaseOrQuery.District.toLowerCase() === c.District.toLowerCase()) {
      score += 10;
      matchingFactors.push(`Same District Jurisdiction (${c.District})`);
    }

    // 5. Case Status & Gravity Match (15% Weight)
    if (targetCaseOrQuery.GravityOffence && c.GravityOffence && targetCaseOrQuery.GravityOffence === c.GravityOffence) {
      score += 15;
      matchingFactors.push(`Same Gravity Level Classification (${c.GravityOffence})`);
    }

    const finalScore = Math.min(98, score);

    if (finalScore >= 25) {
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
