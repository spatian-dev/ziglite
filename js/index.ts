import type { RouterConfiguration } from "@/types/Router.types";
import type { RouteParameters } from "@/types/Route.types";
import { Router as RouteClass } from "@/classes/Router";

const router = new RouteClass();

/**
 * Set router configuration
 *
 * @param {RouterConfiguration} config Configuration object
 * @returns {RouterConfiguration} The updated configuration of the router
 */
export const configureRouter = (config?: RouterConfiguration): RouterConfiguration => {
    router.config = config;
    return router.config;
}

/**
 * Substitutes the given parameters in the URI corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {string} name Route name
 * @param {RouteParameters} [params] Key-value substitutions Object
 * @returns {string} Compiled URI for the specified name
 */
export const route = (name: string, params: RouteParameters): string => {
    return router.compile(name, params ?? {})
};

export const Router = router;
