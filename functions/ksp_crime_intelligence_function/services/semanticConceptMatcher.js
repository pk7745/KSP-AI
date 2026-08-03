/**
 * Advanced Semantic Concept Matcher & Conceptual Synonym Engine
 * Enables conceptual semantic matching without requiring exact word overlaps.
 * Example: "businessman poisoned in hotel" matches "industrialist poisoned inside lodge" and "business owner found dead after consuming cyanide".
 */

const CONCEPT_SYNONYMS = {
  // Business / Industrialist
  'businessman': ['industrialist', 'business owner', 'trader', 'entrepreneur', 'merchant', 'proprietor'],
  'poisoned': ['cyanide', 'toxic substance', 'chemical poisoning', 'ingested poison', 'laced drink', 'arsenic'],
  'hotel': ['lodge', 'resort', 'guest house', 'homestay', 'room', 'quarters', 'inn'],
  
  // Murder / Homicide
  'strangled': ['choked', 'asphyxiated', 'wire around neck', 'ligature strangulation', 'throttled', 'smothered'],
  'sharp weapon': ['knife', 'machete', 'dagger', 'cleaver', 'blade', 'sword'],
  
  // Cyber & Fraud
  'upi': ['phishing', 'online payment', 'qcode', 'gpay', 'phonepe', 'digital wallet'],
  'banking fraud': ['unauthorized transaction', 'otp theft', 'cyber fraud', 'bank account drained', 'atm cloning'],

  // Theft & Vehicle
  'motorcycle': ['two wheeler', 'bike', 'scooter', 'vehicle stolen', 'parking theft'],
  'burglary': ['housebreak', 'door lock broken', 'night theft', 'cash stolen']
};

export function expandQueryConcepts(userQuery) {
  const lower = userQuery.toLowerCase();
  const expandedConcepts = new Set([lower]);

  Object.keys(CONCEPT_SYNONYMS).forEach(keyword => {
    if (lower.includes(keyword)) {
      CONCEPT_SYNONYMS[keyword].forEach(syn => expandedConcepts.add(syn));
    } else {
      CONCEPT_SYNONYMS[keyword].forEach(syn => {
        if (lower.includes(syn)) {
          expandedConcepts.add(keyword);
          CONCEPT_SYNONYMS[keyword].forEach(other => expandedConcepts.add(other));
        }
      });
    }
  });

  return Array.from(expandedConcepts);
}

export function computeConceptualSimilarity(query, targetText) {
  const cleanTarget = (targetText || '').toLowerCase();
  const concepts = expandQueryConcepts(query);

  let matchCount = 0;
  concepts.forEach(concept => {
    if (cleanTarget.includes(concept)) {
      matchCount++;
    }
  });

  if (concepts.length === 0) return 0;
  const ratio = matchCount / Math.min(concepts.length, 5);
  return Math.min(98, Math.round(ratio * 100));
}
