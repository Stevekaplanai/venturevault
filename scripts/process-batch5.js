// Script to process batch 5 raw ideas through the enhance-idea API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://venturevaultspace.vercel.app/api/enhance-idea';
const RAW_IDEAS_FILE = path.join(__dirname, 'raw-ideas-batch5.json');
const OUTPUT_FILE = path.join(__dirname, 'enhanced-ideas-batch5.json');

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
  console.log('Loading batch 5 raw ideas...');
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
      console.log(`  ✓ Enhanced (${enhanced.category}, Score: ${enhanced.marketScore})`);
    } else {
      failCount++;
      console.log(`  ✗ Failed`);
    }

    if (i < rawIdeas.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Complete! Success: ${successCount}, Failed: ${failCount}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify({ ideas: enhancedIdeas }, null, 2));
  console.log(`Saved to: ${OUTPUT_FILE}`);
}

processAllIdeas().catch(console.error);
