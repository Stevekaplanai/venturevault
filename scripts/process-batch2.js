// Script to process batch 2 raw ideas through the enhance-idea API
// Run with: node scripts/process-batch2.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://venturevaultspace.vercel.app/api/enhance-idea';
const RAW_IDEAS_FILE = path.join(__dirname, 'raw-ideas-batch2.json');
const OUTPUT_FILE = path.join(__dirname, 'enhanced-ideas-batch2.json');

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

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data.idea;
  } catch (error) {
    console.error(`Failed to enhance "${rawIdea.title}":`, error.message);
    return null;
  }
}

async function processAllIdeas() {
  console.log('Loading batch 2 raw ideas...');
  const rawData = JSON.parse(fs.readFileSync(RAW_IDEAS_FILE, 'utf-8'));
  const rawIdeas = rawData.ideas;

  console.log(`Found ${rawIdeas.length} raw ideas to process`);

  const enhancedIdeas = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < rawIdeas.length; i++) {
    const rawIdea = rawIdeas[i];
    console.log(`\n[${i + 1}/${rawIdeas.length}] Processing: ${rawIdea.title}`);

    const enhanced = await enhanceIdea(rawIdea);

    if (enhanced) {
      enhancedIdeas.push(enhanced);
      successCount++;
      console.log(`  ✓ Enhanced successfully (Category: ${enhanced.category}, Score: ${enhanced.marketScore})`);
    } else {
      failCount++;
      console.log(`  ✗ Failed to enhance`);
    }

    // Rate limiting - wait 1.5 seconds between requests
    if (i < rawIdeas.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Processing complete!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed: ${failCount}`);

  // Save enhanced ideas
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ ideas: enhancedIdeas }, null, 2));
  console.log(`\nEnhanced ideas saved to: ${OUTPUT_FILE}`);
}

processAllIdeas().catch(console.error);
