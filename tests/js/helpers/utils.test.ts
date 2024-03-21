import { describe, expect, test } from 'vitest';
import { ensureNoTrailingSlash, ensureTrailingSlash, isBlank, isString } from '@/helpers/utils';

describe.concurrent('Utilities', () => {
    describe.concurrent('isString()', () => {
        test('Returns true when provided with a native string', async () => {
            expect(isString('abcd')).toBe(true);
            expect(isString(String('abcd'))).toBe(true);
        });

        test('Returns false when provided with something other than a string', async () => {
            expect(isString(123)).toBe(false);
            expect(isString([])).toBe(false);
            expect(isString({})).toBe(false);
        });
    });

    describe.concurrent('isBlank()', () => {
        test('Returns true when provided with a blank-ish value', async () => {
            expect(isBlank('')).toBe(true);
            expect(isBlank('    ')).toBe(true);
            expect(isBlank(String(''))).toBe(true);
            expect(isBlank([])).toBe(true);
            expect(isBlank(undefined)).toBe(true);
            expect(isBlank(null)).toBe(true);
        });

        test('Returns false when provided with something other than a blank-ish value', async () => {
            expect(isBlank(123)).toBe(false);
            expect(isBlank(' s')).toBe(false);
            expect(isBlank(String(' s'))).toBe(false);
            expect(isBlank({})).toBe(false);
            expect(isBlank('undefined')).toBe(false);
            expect(isBlank('null')).toBe(false);
        });
    });

    describe.concurrent('ensureTrailingSlash()', () => {
        test('Adds a trailing slash when it is missing', async () => {
            expect(ensureTrailingSlash('')).toBe('/');
            expect(ensureTrailingSlash('test.url')).toBe('test.url/');
            expect(ensureTrailingSlash(String('test.url'))).toBe('test.url/');
        });

        test('Returns the same value when a trailing slash is present', async () => {
            expect(ensureTrailingSlash('/')).toBe('/');
            expect(ensureTrailingSlash('test.url/')).toBe('test.url/');
            expect(ensureTrailingSlash(String('test.url/'))).toBe('test.url/');
        });
    });

    describe.concurrent('ensureNoTrailingSlash()', () => {
        test('Removes a trailing slash when it is present', async () => {
            expect(ensureNoTrailingSlash('/')).toBe('');
            expect(ensureNoTrailingSlash('test.url/')).toBe('test.url');
            expect(ensureNoTrailingSlash(String('test.url/'))).toBe('test.url');
        });

        test('Returns the same value when a trailing slash is missing', async () => {
            expect(ensureNoTrailingSlash('')).toBe('');
            expect(ensureNoTrailingSlash('test.url')).toBe('test.url');
            expect(ensureNoTrailingSlash(String('test.url'))).toBe('test.url');
        });
    });
});
