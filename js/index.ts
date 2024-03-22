import type { RouterConfiguration } from "@/types/Router.types";
import type { RouteParametersWithQuery } from "@/types/Route.types";
import { Router as RouterClass } from "@/classes/Router";

const router = new RouterClass();

/**
 * Set router configuration
 *
 * @param {Partial<RouterConfiguration>} config Configuration object
 * @returns {RouterConfiguration} The updated configuration of the router
 */
export const configureRouter = (config: Partial<RouterConfiguration>): RouterConfiguration => {
    router.config = config;
    return router.config;
}

/**
 * Substitutes the given parameters in the URL corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParametersWithQuery} [params] Key-value substitutions Object
 * @returns {string} Compiled URL for the specified name
 */
export const route = (name: string, params: RouteParametersWithQuery): string => {
    return router.compile(name, params ?? {})
};

export const Router = router;
