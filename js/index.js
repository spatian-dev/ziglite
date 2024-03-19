import { Router as RouterClass } from "./Router.js";

const router = new RouterClass();

/**
 * @param {Object} params Configuration object
 * @returns {Router}
 */
export const configureRouter = (config) => {
    router.config = config;
    return router.config;
}

/**
 * Substitutes the given parameters in the URI corresponding to the given route name,
 * and returns the compiled result
 *
 * @param {String} name Route name
 * @param {Object} [params] key-value substitutions Object
 * @returns {String} compiled URI for the specified name
 */
export const route = (name, params) => {
    return router.compile(name, params ?? {})
};

export const Router = router;
