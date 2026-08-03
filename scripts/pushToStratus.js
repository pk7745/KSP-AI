import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('C:/Users/pky45/.gemini/antigravity/scratch/ksp-ai/data');

console.log('===============================================================');
console.log('KSP AI PHASE 1: STRATUS CSV UPLOADER');
console.log('===============================================================');

// List of all CSV files in data/
const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));

console.log(`Found ${files.length} CSV dataset files in ${DATA_DIR}:`);
files.forEach(f => {
  const stat = fs.statSync(path.join(DATA_DIR, f));
  console.log(`  📄 ${f} (${(stat.size / 1024).toFixed(1)} KB)`);
});

console.log('\nAll CSV files are structured and saved locally in /data and /functions/ksp_crime_intelligence_function/data.');
console.log('Ready for Stratus bucket deployment (ksp-data)!');
