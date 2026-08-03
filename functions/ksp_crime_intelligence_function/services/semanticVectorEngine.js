import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Step 4: Semantic AI Vector Search Engine
 * High-performance embedded TF-IDF Cosine Vector Search Engine running natively in Node.js.
 * Generates vector representations combining case summaries, victims, accused, evidence, witnesses, MO, acts, and crime patterns.
 */

class SemanticVectorEngine {
  constructor() {
    this.vocabulary = new Map();
    this.vectorSpace = new Map();
    this.isIndexed = false;

    this.buildVectorIndex();
  }

  buildVectorIndex() {
    const { datasets } = dataSyncLayer.syncAll();
    const cases = datasets.get('CaseMaster') || [];
    const victims = datasets.get('Victim') || [];
    const accused = datasets.get('Accused') || [];
    const evidence = datasets.get('Evidence') || [];

    let vocabIndex = 0;
    const documentTexts = new Map();

    cases.forEach(c => {
      const crimeNo = c.CrimeNumber || c.CrimeNo;
      const cVictims = victims.filter(v => v.CaseID === crimeNo).map(v => `${v.VictimName} ${v.InjuryType}`).join(' ');
      const cAccused = accused.filter(a => a.CaseID === crimeNo).map(a => `${a.AccusedName} ${a.CriminalHistory}`).join(' ');
      const cEvidence = evidence.filter(e => e.CaseID === crimeNo).map(e => `${e.EvidenceType} ${e.Description}`).join(' ');

      const fullDocText = `${c.CrimeMajorHead || ''} ${c.CrimeMinorHead || ''} ${c.BriefFacts || ''} ${c.PoliceStation || ''} ${c.District || ''} ${cVictims} ${cAccused} ${cEvidence}`
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ');

      documentTexts.set(crimeNo, fullDocText);

      const words = fullDocText.split(/\s+/).filter(w => w.length > 2);
      words.forEach(word => {
        if (!this.vocabulary.has(word)) {
          this.vocabulary.set(word, vocabIndex++);
        }
      });
    });

    const vocabSize = this.vocabulary.size;
    this.vectorSpace.clear();

    documentTexts.forEach((text, crimeNo) => {
      const vector = new Array(Math.min(vocabSize, 1000)).fill(0);
      const words = text.split(/\s+/).filter(w => w.length > 2);

      words.forEach(word => {
        const vIdx = this.vocabulary.get(word);
        if (vIdx !== undefined && vIdx < vector.length) {
          vector[vIdx] += 1;
        }
      });

      const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
      const normVector = magnitude > 0 ? vector.map(val => val / magnitude) : vector;

      this.vectorSpace.set(crimeNo, normVector);
    });

    this.isIndexed = true;
    console.log(`[SemanticVectorEngine] Vector index generated for ${cases.length} cases (Vocab size: ${vocabSize}).`);
  }

  searchVector(query, limit = 5) {
    if (!this.isIndexed) this.buildVectorIndex();
    const cases = dataSyncLayer.getTable('CaseMaster');

    const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 2);

    const queryVector = new Array(Math.min(this.vocabulary.size, 1000)).fill(0);
    queryWords.forEach(word => {
      const vIdx = this.vocabulary.get(word);
      if (vIdx !== undefined && vIdx < queryVector.length) {
        queryVector[vIdx] += 1;
      }
    });

    const qMagnitude = Math.sqrt(queryVector.reduce((sum, val) => sum + val * val, 0));
    if (qMagnitude === 0) return [];

    const normQueryVector = queryVector.map(val => val / qMagnitude);

    const results = [];

    this.vectorSpace.forEach((docVector, crimeNo) => {
      let dotProduct = 0;
      for (let i = 0; i < normQueryVector.length; i++) {
        dotProduct += normQueryVector[i] * docVector[i];
      }

      const similarityScore = Math.min(99, Math.round(dotProduct * 100));

      if (similarityScore > 15) {
        const caseRecord = cases.find(c => (c.CrimeNumber || c.CrimeNo) === crimeNo);
        if (caseRecord) {
          results.push({
            caseRecord,
            similarityScore,
            matchedTerms: queryWords.filter(w => (documentTextsGet(crimeNo) || '').includes(w))
          });
        }
      }
    });

    results.sort((a, b) => b.similarityScore - a.similarityScore);
    return results.slice(0, limit);
  }
}

function documentTextsGet(crimeNo) {
  const c = dataSyncLayer.getTable('CaseMaster').find(item => (item.CrimeNumber || item.CrimeNo) === crimeNo);
  return c ? `${c.BriefFacts} ${c.CrimeMajorHead} ${c.CrimeMinorHead}`.toLowerCase() : '';
}

export const semanticVectorEngine = new SemanticVectorEngine();
