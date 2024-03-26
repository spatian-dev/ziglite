import { beforeEach, describe, expect, test, vi } from 'vitest';
import { defaultJson, minimalJson } from 'tests/fixtures/json';
import { route } from '@/index';

beforeEach(() => {
    vi.resetModules();
})
describe('Package Exports', () => {
    describe('configureRouter()', () => {
        test('Correctly parses configuration from a valid JSON string', async () => {
            const { configureRouter } = await import('@/index');
            expect(configureRouter(minimalJson)).toMatchObject({
                base: 'http://localhost:8000',
                defaults: {},
                routes: {
                    home: {
                        uri: '/',
                        domain: null,
                        wheres: {}
                    },
                },
            });
        });
    });

    describe.skip('route()', () => {
        test('Generates a URL with no parameters', async () => {
            const { configureRouter } = await import('@/index');
            configureRouter(defaultJson);

            expect(route('home')).toBe('');
        });
    });
});
