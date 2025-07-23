import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false, // Disable for Vercel build
  clean: true,
  sourcemap: true,
  minify: false,
  splitting: false,
  external: ['react', 'react-dom'],
});