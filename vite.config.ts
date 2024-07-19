import { URL, fileURLToPath } from 'node:url';

import components from 'unplugin-vue-components/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [vue(), tailwindcss(), components({ dts: false })],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
