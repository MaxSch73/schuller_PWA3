import { fileURLToPath, URL } from 'url';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import manifest from './manifest';

export default defineConfig({
  server: {
    port: 8080,
  },
  preview: {
    port: 5555,
    proxy: {
      '/employees': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '^/images/portraits/.*': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    vue(),
    VitePWA({
      manifest,
      includeAssets: ['**/*.{js,css,html,jpg,ico,png,ttf,woff2}'],
      workbox: {
        mode: 'development',
        runtimeCaching: [
          {
            urlPattern: '/employees',
            handler: 'CacheFirst',
            options: {
              cacheName: 'max-employees',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 1, // <== 1 day
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: '../server/public',
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
