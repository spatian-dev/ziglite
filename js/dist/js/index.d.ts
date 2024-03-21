import type { RouterConfiguration } from './types/Router.types';
import type { RouteParameters } from './types/Route.types';
import { Router as RouteClass } from './classes/Router';
/**
 * Set router configuration
 *
 * @param {RouterConfiguration} config Configuration object
 * @returns {RouterConfiguration} The updated configuration of the router
 */
export declare const configureRouter: (config?: RouterConfiguration) => RouterConfiguration;
/**
 * Substitutes the given parameters in the URI corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParameters} [params] Key-value substitutions Object
 * @returns {string} Compiled URI for the specified name
 */
export declare const route: (name: string, params: RouteParameters) => string;
export declare const Router: RouteClass;
