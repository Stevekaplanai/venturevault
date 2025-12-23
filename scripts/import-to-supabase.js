// Script to import enhanced ideas to Supabase
// Run with: node scripts/import-to-supabase.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://venturevaultspace.vercel.app/api/import-ideas';
const ENHANCED_IDEAS_FILE = path.join(__dirname, 'enhanced-ideas.json');

// Optional: Set IMPORT_SECRET env var if your API requires auth
const IMPORT_SECRET = process.env.IMPORT_SECRET || '';

async function importIdeas() {
  console.log('Loading enhanced ideas...');
  const data = JSON.parse(fs.readFileSync(ENHANCED_IDEAS_FILE, 'utf-8'));
  const ideas = data.ideas;

  console.log(`Found ${ideas.length} ideas to import`);

  const headers = {
    'Content-Type': 'application/json'
  };

  if (IMPORT_SECRET) {
    headers['Authorization'] = `Bearer ${IMPORT_SECRET}`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ideas })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const result = await response.json();
    console.log('\n✓ Import successful!');
    console.log(`  Imported: ${result.imported} ideas`);
    console.log(`  Message: ${result.message}`);

  } catch (error) {
    console.error('Import failed:', error.message);
    process.exit(1);
  }
}

importIdeas();
