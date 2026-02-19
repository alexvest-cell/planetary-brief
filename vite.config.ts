import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': 'http://localhost:3000',
        '/uploads': 'http://localhost:3000'
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Target modern browsers for better optimization
      target: 'es2020',
      // Minification
      minify: 'esbuild',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      // CSS code splitting
      cssCodeSplit: true,
      // Source maps only for development
      sourcemap: mode !== 'production',
      // Chunk size warnings
      chunkSizeWarningLimit: 500
    },
    // Performance optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react']
    }
  };
});
