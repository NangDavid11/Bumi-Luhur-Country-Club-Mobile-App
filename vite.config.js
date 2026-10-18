import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png'],
      manifest: {
        id: '/',
        name: 'Bumi Luhur Country Club',
        short_name: 'Bumi Luhur',
        description: 'Book courts, join classes, invite guests and earn rewards at Bumi Luhur Country Club.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        categories: ['sports', 'lifestyle', 'health'],
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Booking', url: '/booking', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
          { name: 'My Schedule', url: '/schedule', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
          { name: 'Guest Pass', url: '/guest-pass', icons: [{ src: '/pwa-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // remote facility photos (Unsplash) — cached after first view for offline use
            urlPattern: ({ url }) => url.hostname === 'images.unsplash.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'remote-images',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: { target: 'es2020', chunkSizeWarningLimit: 700 },
});
