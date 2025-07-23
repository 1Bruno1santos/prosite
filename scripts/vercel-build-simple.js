#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Vercel build...');

try {
  // Install dependencies if needed
  console.log('📦 Installing dependencies...');
  execSync('pnpm install', { stdio: 'inherit' });

  // Build frontend directly
  console.log('🔨 Building frontend...');
  const frontendPath = path.join(process.cwd(), 'apps/frontend');
  process.chdir(frontendPath);
  
  // Use the standalone config
  execSync('npx vite build --config vite.config.standalone.ts', { stdio: 'inherit' });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}