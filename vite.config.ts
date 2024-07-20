import { URL, fileURLToPath } from 'node:url';

import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import TailwindCSS from '@tailwindcss/vite';
import Vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        Vue(),
        TailwindCSS(),
        Components({ dts: false, resolvers: [IconsResolver()] }),
        Icons({
            iconCustomizer(_, __, props) {
                props['aria-hidden'] = 'true';
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Freedom Calculator',
                short_name: 'Freedom Calculator',
                description: 'What\'s your runway?',
                theme_color: '#bae6fd',
                icons: [
                    {
                        src: 'android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            workbox: {
                additionalManifestEntries: [
                    '/apple-touch-icon.png',
                    '/favicon-32x32.png',
                    '/favicon-16x16.png',
                    '/safari-pinned-tab.svg',
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
