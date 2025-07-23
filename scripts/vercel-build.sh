#!/bin/bash
set -e

echo "Starting Vercel build script..."

# Build shared package
echo "Building @prosite/shared..."
cd packages/shared
npm run build || true
cd ../..

# Build UI package
echo "Building @prosite/ui..."
cd packages/ui
npm run build || true
cd ../..

# Build frontend
echo "Building @prosite/frontend..."
cd apps/frontend
npm run build

echo "Build completed successfully!"