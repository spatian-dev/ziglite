//import { ziglite } from 'tests/fixtures/default';
import { beforeEach, describe, expect, test } from 'vitest';

import { RouterConfiguration } from '@/types/Router.types';
import { configureRouter, route } from '@/index';

describe.concurrent('Index', () => {
    //beforeEach(configureRouter(ziglite));
    describe.concurrent('route()', () => {
        test('Correctly compiles a route with no expected parameters', async () => {
            //expect(isString('abcd')).toBe(true);
        });
    });
});
