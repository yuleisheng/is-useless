#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const filePath = process.argv[2];

if (!filePath) {
  console.log('Please provide a file path to check.');
  process.exit(1);
}

console.log(`Analyzing ${filePath} for uselessness...`);

try {
    const fileName = path.basename(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // New AI Check
    const aiKeywords = ['openai', 'anthropic', 'gemini', 'llama', 'deepseek'];
    const hasAiInName = fileName.toLowerCase().includes('ai');
    const hasAiInContent = aiKeywords.some(keyword => content.toLowerCase().includes(keyword));

    if (hasAiInName || hasAiInContent) {
        console.log('🎉 Verdict: Certified Useless. Contains AI buzzwords, the ultimate sign of trying too hard. 🎉');
        process.exit(0);
    }

    // --- Original Useless Checks ---

    // 1. Check if the file name contains "useless"
    if (!filePath.includes('useless')) {
      console.log('Verdict: Not useless enough. The file name does not contain "useless".');
      process.exit(0);
    }

    const stats = fs.statSync(filePath);

    // 2. Check if the file is empty OR contains only whitespace
    if (stats.size > 0 && content.trim().length > 0) {
        console.log('Verdict: Not useless enough. The file contains actual content.');
        process.exit(0);
    }

    // 3. Check if the file was created on a weekend
    const createdDate = stats.birthtime;
    const day = createdDate.getDay();
    if (day !== 0 && day !== 6) {
        console.log('Verdict: Not useless enough. The file was not created on a weekend.');
        process.exit(0);
    }

    // 4. Check for vowel-less filename
    if (/[aeiou]/i.test(fileName)) {
        console.log('Verdict: Not useless enough. The filename contains vowels, a sign of usefulness.');
        process.exit(0);
    }

    // 5. Check if the file was created in the last 60 seconds
    const now = new Date();
    const diff = now.getTime() - createdDate.getTime();
    if (diff > 60000) {
        console.log('Verdict: Not useless enough. The file is too old to be truly useless.');
        process.exit(0);
    }

    // If all original checks pass...
    console.log('🎉 Congratulations! This file is certifiably useless! 🎉');

} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`Verdict: So useless it doesn't even exist. Well done.`);
        process.exit(0);
    }
    console.log('An error occurred while trying to be useless:', error.message);
    process.exit(1);
}
