import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        input: {
          popup: resolve(__dirname, 'src/popup.tsx'),
          content: resolve(__dirname, 'src/content.ts'),
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
      minify: isDev ? false : 'esbuild',
      sourcemap: isDev,
      watch: isDev ? {} : null,
      copyPublicDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@workspace/ui': resolve(__dirname, '../../packages/ui/src'),
      },
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode || 'production'),
    },
    css: {
      postcss: {
        plugins: [],
      },
    },
  };
});
