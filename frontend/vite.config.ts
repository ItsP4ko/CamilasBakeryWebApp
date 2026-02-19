/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    // Genera sourcemaps para producción (ayuda en debugging con Sentry/CloudFlare)
    sourcemap: false,
    // Chunking granular: divide el bundle en módulos lógicos para mejor cache
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cambia raramente, cache máximo en CDN
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // TanStack Query — librería de estado de servidor
          'vendor-query': ['@tanstack/react-query'],
          // Charts — grande, solo lo usan las páginas de reportes
          'vendor-charts': ['recharts'],
          // UI utils
          'vendor-ui': [
            'framer-motion',
            'react-select',
            'react-toastify',
            'lucide-react',
          ],
          // Google OAuth
          'vendor-auth': ['@react-oauth/google'],
          // PDF generation — solo se usa al exportar reportes
          'vendor-pdf': ['jspdf'],
        },
      },
    },
    // Advertir si algún chunk supera 500KB
    chunkSizeWarningLimit: 500,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
