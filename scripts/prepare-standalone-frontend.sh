#!/bin/bash
set -e

echo "🚀 Preparing standalone frontend for deployment..."

# Create temporary directory
TEMP_DIR="frontend-standalone"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy frontend app
cp -r apps/frontend/* $TEMP_DIR/
cp -r apps/frontend/.* $TEMP_DIR/ 2>/dev/null || true

# Copy shared and UI packages as dependencies
mkdir -p $TEMP_DIR/src/packages
cp -r packages/shared/src $TEMP_DIR/src/packages/shared
cp -r packages/ui/src $TEMP_DIR/src/packages/ui

# Update imports in vite config
cat > $TEMP_DIR/vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prosite/shared': path.resolve(__dirname, './src/packages/shared'),
      '@prosite/ui': path.resolve(__dirname, './src/packages/ui'),
    },
  },
});
EOF

# Create standalone package.json
cat > $TEMP_DIR/package.json << 'EOF'
{
  "name": "prosite-frontend",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@tanstack/react-query": "^5.51.1",
    "axios": "^1.7.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.1",
    "react-router-dom": "^6.24.1",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@hookform/resolvers": "^5.1.1",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.2"
  }
}
EOF

echo "✅ Standalone frontend prepared in $TEMP_DIR/"
echo "📌 You can now deploy this directory to any static hosting service"
echo "📌 Commands:"
echo "   cd $TEMP_DIR"
echo "   npm install"
echo "   npm run build"