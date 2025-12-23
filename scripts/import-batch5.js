import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://venturevaultspace.vercel.app/api/import-ideas';
const ENHANCED_IDEAS_FILE = path.join(__dirname, 'enhanced-ideas-batch5.json');

async function importIdeas() {
  console.log('Loading batch 5 enhanced ideas...');
  const data = JSON.parse(fs.readFileSync(ENHANCED_IDEAS_FILE, 'utf-8'));
  const ideas = data.ideas;

  console.log(`Found ${ideas.length} ideas to import`);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideas })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    console.log('\n✓ Import successful!');
    console.log(`  Imported: ${result.imported} ideas`);

  } catch (error) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
}

importIdeas();
