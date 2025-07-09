#!/usr/bin/env node

import * as fs from 'fs';

const filePath = process.argv[2];

if (!filePath) {
  console.log('Please provide a file path to check.');
  process.exit(1);
}

console.log(`Analyzing ${filePath} for uselessness...`);

// --- Useless Checks ---

// 1. Check if the file name contains "useless"
if (!filePath.includes('useless')) {
  console.log('Verdict: Not useless enough. The file name does not contain "useless".');
  process.exit(0);
}

// 2. Check if the file is empty
try {
    const stats = fs.statSync(filePath);
    if (stats.size > 0) {
        console.log('Verdict: Not useless enough. The file is not empty.');
        process.exit(0);
    }
    // 3. Check if the file was created on a weekend
    const createdDate = stats.birthtime;
    const day = createdDate.getDay();
    if (day !== 0 && day !== 6) {
        console.log('Verdict: Not useless enough. The file was not created on a weekend.');
        process.exit(0);
    }
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(`Verdict: So useless it doesn't even exist. Well done.`);
        process.exit(0);
    }
    console.log('An error occurred while trying to be useless:', error.message);
    process.exit(1);
}



// If all checks pass...
console.log('🎉 Congratulations! This file is certifiably useless! 🎉');
