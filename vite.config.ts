/// <reference types="vitest" />

import path from "path";
import { defineConfig } from "vite";
import dts from 'vite-plugin-dts';

const root_path = (p?: string): string => path.join(__dirname, p ?? '');
const js_path = (p?: string): string => path.join(root_path('js'), p ?? '');

const common_exclude = [
    'node_modules/**',
    'vendor/**',
    'dist/**',
];

export default defineConfig({
    plugins: [
        dts({
            entryRoot: js_path(),
            strictOutput: true,
            exclude: [],
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@': js_path(''),
            'tests': root_path('test'),
        },
    },
    build: {
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: js_path('index.ts'),
            name: "ziglite",
            fileName: "index",
            formats: ["es", "cjs"],
        },
    },
    test: {
        include: [
            '**/tests/js/**/*.test.ts',
        ],
        exclude: common_exclude,
        typecheck: {
            enabled: true,
            include: [
                '**/tests/js/**/*.test-d.ts',
            ],
            exclude: common_exclude,
        },
    },
});
