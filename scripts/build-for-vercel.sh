#!/bin/bash
set -e

echo "🚀 Starting Vercel build process..."

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📦 Building shared package..."
pnpm --filter @prosite/shared build

echo "🎨 Building UI package..."
pnpm --filter @prosite/ui build

echo "🏗️ Building frontend application..."
cd apps/frontend
tsc && vite build

echo "✅ Build completed successfully!"