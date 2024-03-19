import { Route } from './Route.js';
import { stringify } from 'qs';
import { ensureNoTrailingSlash } from './utils.js';

const defaultQsConfig = {
    addQueryPrefix: true,
    encoder: (value, defaultEncoder, charset, type) => {
        if ((type === 'value') && typeof value === 'boolean')
            return value ? 1 : 0;

        return defaultEncoder(value);
    },
    encodeValuesOnly: true,
    skipNulls: true,
};

const defaultConfig = {
    base: '/',
    absolute: false,
    strict: false,
    qsConfig: defaultQsConfig,

    defaults: [],
    routes: [],
};

/**
 * @classdesc Routing helper.
 */
export class Router {
    /** @type {Object} */
    #config = defaultConfig;

    /**
     * @class
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @readonly
     * @returns {Object}
     */
    get config() {
        return this.#config;
    }

    /**
     * @param {Object} value
     */
    set config(value) {
        this.#config = {
            ...this.#config,
            ...value,

            qsConfig: {
                ...defaultQsConfig,
                ... (value?.qsConfig ?? {}),
            },
        };
    }

    /**
     * @readonly
     * @returns {String}
     */
    get base() {
        return ensureNoTrailingSlash(this.#config.base);
    }

    /**
     * @readonly
     * @returns {String}
     */
    get origin() {
        return this.#config.absolute ? this.base : '';
    }

    /**
     * @param {String} name
     * @returns {Boolean}
     */
    has(name) {
        return Object.hasOwn(this.#config.routes, name);
    }

    /**
     * @param {String} name
     * @param {Object} params
     * @returns {String}
     */
    compile(name, params) {
        const route = this.#getRoute(name);
        const { substituted, template } = route.compile(params);

        const query = params._query ?? {};
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

    /**
     * @param {String} name
     * @returns {Route}
     */
    #getRoute(name) {
        if (!this.has(name))
            throw new Error(`No such route "${name}" in the route list`);
        return new Route(name, this.#config.routes[name], this)
    }
}
