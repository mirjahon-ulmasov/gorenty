import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        // https: true,
        host: true,
        port: 3000
    },
    // plugins: [react(), basicSsl()],
    plugins: [react()],
    resolve: {
        alias: {
            hooks: '/src/hooks',
            pages: '/src/pages',
            utils: '/src/utils',
            types: '/src/types',
            store: '/src/store',
            assets: '/src/assets',
            services: '/src/services',
            components: '/src/components',
        },
    },
});
