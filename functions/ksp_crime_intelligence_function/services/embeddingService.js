import { dataSyncLayer } from './dataSyncLayer.js';

/**
 * Enterprise Vector Embedding Service
 * Generates TF-IDF Vector Embeddings across 5,500+ case records and maintains an embedding cache.
 */

class EmbeddingService {
  constructor() {
    this.vectorIndex = new Map();
    this.vocabulary = new Map();
    this.idfWeights = new Map();
    this.cache = new Map();
  }

  buildVectorIndex() {
    const { datasets } = dataSyncLayer.syncAll();
    const cases = datasets.get('CaseMaster') || [];

    this.vectorIndex.clear();
    this.vocabulary.clear();
    this.idfWeights.clear();

    const docTokens = [];

    cases.forEach((c, idx) => {
      const cNo = c.CrimeNumber || c.CrimeNo;
      if (!cNo) return;

      const rawText = `${cNo} ${c.CrimeMajorHead || ''} ${c.CrimeMinorHead || ''} ${c.BriefFacts || ''} ${c.District || ''} ${c.PoliceStation || ''}`.toLowerCase();
      const tokens = rawText.match(/\w+/g) || [];
      docTokens.push({ cNo, tokens, record: c });

      tokens.forEach(t => {
        if (t.length > 2) {
          this.vocabulary.set(t, (this.vocabulary.get(t) || 0) + 1);
        }
      });
    });

    const N = cases.length || 1;
    this.vocabulary.forEach((count, token) => {
      this.idfWeights.set(token, Math.log((N + 1) / (count + 1)));
    });

    docTokens.forEach(({ cNo, tokens, record }) => {
      const vec = this.calculateTfidfVector(tokens);
      this.vectorIndex.set(cNo, { id: cNo, record, vector: vec });
    });

    console.log(`[EmbeddingService] Generated vectors for ${this.vectorIndex.size} cases. Vocab size: ${this.vocabulary.size}`);
  }

  calculateTfidfVector(tokens) {
    const tf = new Map();
    tokens.forEach(t => {
      if (t.length > 2) tf.set(t, (tf.get(t) || 0) + 1);
    });

    const vec = new Map();
    tf.forEach((count, token) => {
      const idf = this.idfWeights.get(token) || 0;
      vec.set(token, count * idf);
    });
    return vec;
  }

  searchSemanticVector(query, topK = 5) {
    if (this.vectorIndex.size === 0) this.buildVectorIndex();
    const cacheKey = `QUERY:${query.toLowerCase().trim()}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const qTokens = (query.toLowerCase().match(/\w+/g) || []).filter(t => t.length > 2);
    const qVec = this.calculateTfidfVector(qTokens);

    const scores = [];
    this.vectorIndex.forEach(item => {
      const sim = this.cosineSimilarity(qVec, item.vector);
      if (sim > 0.05) {
        scores.push({ caseRecord: item.record, score: sim });
      }
    });

    scores.sort((a, b) => b.score - a.score);
    const results = scores.slice(0, topK);
    this.cache.set(cacheKey, results);
    return results;
  }

  cosineSimilarity(vecA, vecB) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    vecA.forEach((val, key) => {
      normA += val * val;
      if (vecB.has(key)) {
        dot += val * vecB.get(key);
      }
    });

    vecB.forEach(val => {
      normB += val * val;
    });

    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

export const embeddingService = new EmbeddingService();
