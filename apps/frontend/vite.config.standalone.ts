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
      '@prosite/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@prosite/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
});