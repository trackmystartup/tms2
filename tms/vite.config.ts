import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      css: {
        postcss: './postcss.config.js',
      },
      base: '/', // Change this to '/your-repo-name/' if deploying to GitHub Pages subdirectory
      server: {
        proxy: {
          '/api': 'http://localhost:3001'
        }
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: ['react', 'react-dom']
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              charts: ['recharts'],
              ui: ['lucide-react'],
              supabase: ['@supabase/supabase-js'],
              // Analytics can be added here if needed
            },
          },
        },
        // Use esbuild (default) for fast builds
        minify: 'esbuild',
        sourcemap: false,
        // Ensure compatibility with modern browsers
        target: 'esnext',
        modulePreload: {
          polyfill: false
        },
        // Add commonjs options for better compatibility
        commonjsOptions: {
          include: [/node_modules/]
        }
      },
    };
});
