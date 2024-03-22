import type { RouterConfiguration } from './types/Router.types';
import type { RouteParametersWithQuery } from './types/Route.types';
import { Router as RouterClass } from './classes/Router';
/**
 * Set router configuration
 *
 * @param {Partial<RouterConfiguration>} config Configuration object
 * @returns {RouterConfiguration} The updated configuration of the router
 */
export declare const configureRouter: (config: Partial<RouterConfiguration>) => RouterConfiguration;
/**
 * Substitutes the given parameters in the URL corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParametersWithQuery} [params] Key-value substitutions Object
 * @returns {string} Compiled URL for the specified name
 */
export declare const route: (name: string, params: RouteParametersWithQuery) => string;
export declare const Router: RouterClass;
