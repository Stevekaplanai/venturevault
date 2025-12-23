// Reusable batch processor - pass batch number as argument
// Usage: node scripts/process-batch.js 6
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const batchNum = process.argv[2];
if (!batchNum) {
  console.error('Usage: node scripts/process-batch.js <batch_number>');
  process.exit(1);
}

const API_URL = 'https://venturevaultspace.vercel.app/api/enhance-idea';
const IMPORT_URL = 'https://venturevaultspace.vercel.app/api/import-ideas';
const RAW_FILE = path.join(__dirname, `raw-ideas-batch${batchNum}.json`);
const OUTPUT_FILE = path.join(__dirname, `enhanced-ideas-batch${batchNum}.json`);

async function enhanceIdea(rawIdea) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: rawIdea.title,
        description: rawIdea.description,
        source: rawIdea.source
      })
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.idea;
  } catch (error) {
    return null;
  }
}

async function run() {
  console.log(`\n=== Processing Batch ${batchNum} ===\n`);

  const rawData = JSON.parse(fs.readFileSync(RAW_FILE, 'utf-8'));
  const rawIdeas = rawData.ideas;
  console.log(`Found ${rawIdeas.length} raw ideas`);

  const enhanced = [];
  let success = 0, fail = 0;

  for (let i = 0; i < rawIdeas.length; i++) {
    process.stdout.write(`[${i + 1}/${rawIdeas.length}] ${rawIdeas[i].title.substring(0, 40)}... `);
    const result = await enhanceIdea(rawIdeas[i]);
    if (result) {
      enhanced.push(result);
      success++;
      console.log('✓');
    } else {
      fail++;
      console.log('✗');
    }
    if (i < rawIdeas.length - 1) await new Promise(r => setTimeout(r, 1200));
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ ideas: enhanced }, null, 2));
  console.log(`\nEnhanced: ${success}, Failed: ${fail}`);

  // Auto-import
  if (enhanced.length > 0) {
    console.log('Importing to Supabase...');
    const res = await fetch(IMPORT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideas: enhanced })
    });
    const result = await res.json();
    console.log(`Imported: ${result.imported} ideas`);
  }
}

run().catch(console.error);
