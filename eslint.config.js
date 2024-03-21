// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    {
        ignores: ['**/vendor', '**/dist'],
    },
    {
        languageOptions: {
            globals: {
                console: "readonly",
            }
        }
    },
);
