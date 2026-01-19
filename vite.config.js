import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync } from 'fs';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    // Proxy all /api requests to your local backend during development.
    // This ensures fetch('/api/...') calls go to https://stacksapp-backend-main.onrender.com without CORS issues.
    proxy: {
      '/api': {
        target: 'https://stacksapp-backend-main.onrender.com',
        changeOrigin: true,
        secure: false,
        // preserve path (no rewrite needed) but shown here for clarity if you want to strip prefix:
        // rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
  build: {
    outDir: 'dist',
  },

  // Copy _redirects into dist after build (for Netlify/Cloudflare SPA routing)
  closeBundle() {
    const redirectsPath = resolve(__dirname, '_redirects');
    const distPath = resolve(__dirname, 'dist/_redirects');

    if (existsSync(redirectsPath)) {
      try {
        copyFileSync(redirectsPath, distPath);
        console.log('✅ _redirects file copied to dist/');
      } catch (err) {
        console.error('❌ Failed to copy _redirects file:', err);
      }
    } else {
      console.warn('⚠️ No _redirects file found at project root.');
    }
  },
});
