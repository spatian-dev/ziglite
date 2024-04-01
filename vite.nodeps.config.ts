/// <reference types="vitest" />

import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.base.config';

export default defineConfig(configEnv => {
    return mergeConfig(baseConfig(configEnv), {
        build: {
            rollupOptions: {
                external: ['qs', 'zod'],
            },
        },
    });
});
