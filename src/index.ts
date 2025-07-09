#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import open from 'open';

const command = process.argv[2];

if (!command) {
  console.log('Please provide a command: `is-useless <file-path>` or `is-useless generate`');
  process.exit(1);
}

if (command === 'generate') {
    const uselessFileName = `useless-file-${Date.now()}.txt`;
    fs.writeFileSync(uselessFileName, '');
    console.log(`✨ Generated a new useless file: ${uselessFileName}`);
    console.log('You can now run `is-useless <your-new-file>` to see its score.');
    process.exit(0);
}

// --- Analysis Logic ---
const filePath = command;
console.log(`Analyzing ${filePath} for uselessness...`);

// Replace __dirname with ES Module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let uselessHtmlPath = path.join(__dirname, '..', 'useless.html');

(async () => { // Wrap in an async IIFE
    try {
        const fileName = path.basename(filePath);
        const content = fs.readFileSync(filePath, 'utf-8');
        const stats = fs.statSync(filePath);

        // AI Check is an instant win
        const aiKeywords = ['openai', 'anthropic', 'gemini', 'llama', 'deepseek'];
        const hasAiInName = fileName.toLowerCase().includes('ai');
        const hasAiInContent = aiKeywords.some(keyword => content.toLowerCase().includes(keyword));

        if (hasAiInName || hasAiInContent) {
            const reasons = encodeURIComponent(JSON.stringify(['Contains AI buzzwords, the ultimate sign of trying too hard.']));
            uselessHtmlPath += `?score=9001&reasons=${reasons}`;
            console.log('🎉 Verdict: Certified Useless. Over 9000! 🎉');
            console.log('Attempting to open HTML...');
            const childProcess = await open(uselessHtmlPath, { app: { name: 'google chrome' } }); // Specify Chrome
            console.log('HTML opened. Child process:', childProcess.pid);
            process.exit(0);
        }

        // Traditional Uselessness Gauntlet
        let score = 0;
        const passedChecks: string[] = [];

        const checks = [
            {
                name: 'File name contains "useless"',
                test: () => filePath.includes('useless'),
            },
            {
                name: 'File is empty or contains only whitespace',
                test: () => stats.size === 0 || content.trim().length === 0,
            },
            {
                name: 'File was created on a weekend',
                test: () => {
                    const day = stats.birthtime.getDay();
                    return day === 0 || day === 6;
                },
            },
            {
                name: 'Filename has no vowels',
                test: () => !/[aeiou]/i.test(fileName),
            },
            {
                name: 'File was created in the last 60 seconds',
                test: () => {
                    const diff = new Date().getTime() - stats.birthtime.getTime();
                    return diff <= 60000;
                },
            },
        ];

        for (const check of checks) {
            if (check.test()) {
                score++;
                passedChecks.push(check.name);
            }
        }

        if (score > 0) {
            console.log(`Uselessness Score: ${score}`);
            const reasons = encodeURIComponent(JSON.stringify(passedChecks));
            uselessHtmlPath += `?score=${score}&reasons=${reasons}`;
            console.log('Attempting to open HTML...');
            const childProcess = await open(uselessHtmlPath, { app: { name: 'google chrome' } }); // Specify Chrome
            console.log('HTML opened. Child process:', childProcess.pid);
        } else {
            console.log('Verdict: This file is disappointingly useful.');
        }

    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string' && (error as { code: string }).code === 'ENOENT') {
            const reasons = encodeURIComponent(JSON.stringify(['So useless it doesn\'t even exist.']));
            uselessHtmlPath += `?score=100&reasons=${reasons}`;
            console.log(`Verdict: So useless it doesn't even exist. Well done.`);
            console.log('Attempting to open HTML...');
            const childProcess = await open(uselessHtmlPath, { app: { name: 'google chrome' } }); // Specify Chrome
            console.log('HTML opened. Child process:', childProcess.pid);
            process.exit(0);
        }
        if (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string') {
            console.log('An error occurred while trying to be useless:', (error as { message: string }).message);
        } else {
            console.log('An unknown error occurred while trying to be useless.');
        }
        process.exit(1);
    }
})(); // End of async IIFE 
