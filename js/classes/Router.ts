import type { RouteParameters } from "@/types/Route.types";
import type { RouterConfiguration } from "@/types/Router.types";

import { ensureNoTrailingSlash } from "@/helpers/utils";
import { Route } from "@/classes/Route";
import { stringify } from "qs";

const defaultQsConfig = {
    addQueryPrefix: true,
    encoder: (value: unknown, defaultEncoder: CallableFunction, _charset: string, type: string) => {
        if ((type === 'value') && typeof value === 'boolean')
            return value ? 1 : 0;

        return defaultEncoder(value);
    },
    encodeValuesOnly: true,
    skipNulls: true,
};

const defaultConfig: RouterConfiguration = {
    absolute: false,
    strict: false,
    qsConfig: defaultQsConfig,

    base: '/',
    defaults: {},
    routes: {},
};

/**
 * @classdesc Routing helper.
 */
export class Router {
    #config = defaultConfig;

    constructor(config?: RouterConfiguration) {
        this.config = config;
    }

    get config(): RouterConfiguration {
        return this.#config;
    }

    set config(value: RouterConfiguration | undefined) {
        this.#config = {
            ...this.#config,
            ...value,

            qsConfig: {
                ...defaultQsConfig,
                ... (value?.qsConfig ?? {}),
            },
        };
    }

    get base(): string {
        return ensureNoTrailingSlash(this.#config.base);
    }

    get origin(): string {
        return this.#config.absolute ? this.base : '';
    }

    has(name: string): boolean {
        return Object.hasOwn(this.#config.routes, name);
    }

    compile(name: string, params: RouteParameters) {
        const route = this.#getRoute(name);
        const { substituted, template } = route.compile(params);

        const query = ((params._query as unknown) as RouteParameters) ?? {};
        delete params._query;

        for (const key of Object.keys(params)) {
            if (Object.hasOwn(query, key))
                console.warn(`Duplicate "${key}" in params and params.query may cause issues`);

            if (substituted.includes(key))
                continue;

            query[key] = params[key];
        }

        return template + stringify(query, this.#config.qsConfig);
    }

    #getRoute(name: string): Route {
        if (!this.has(name))
            throw new Error(`No such route "${name}" in the route list`);
        return new Route(name, this.#config.routes[name], this)
    }
}
