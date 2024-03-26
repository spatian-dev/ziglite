import type { RouterConfiguration } from "@/types/Router.types";
import type { RouteParametersWithQuery } from "@/types/Route.types";
import { Router } from "@/classes/Router";

const router = new Router();

/**
 * Set router configuration
 *
 * @param {string|Partial<RouterConfiguration>|undefined} config Configuration object or JSON string
 * @returns {RouterConfiguration} The updated configuration of the router
 */
export const configureRouter = (config?: string | Partial<RouterConfiguration>): RouterConfiguration => {
    router.config = config ?? {};
    return router.config;
}

/**
 * Substitutes the given parameters in the URL corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParametersWithQuery|undefined} [params] Key-value substitutions Object
 * @returns {string} Compiled URL for the specified name
 */
export const route = (name: string, params?: RouteParametersWithQuery): string => {
    return router.compile(name, params ?? {})
};

/**
 * Substitutes the given parameters in the URL corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParametersWithQuery} [params] Key-value substitutions Object
 * @returns {string} Compiled URL for the specified name
 */
export const hasRoute = (name: string): boolean => {
    return router.has(name);
};

export { Router } from "@/classes/Router";
