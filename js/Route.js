import { ensureNoTrailingSlash, isBlank } from "./utils.js";

/** @typedef {import("./Router.js").Router} Router */

/**
 * @classdesc A class representing a route.
 */
export class Route {
    /** @type {String} */
    name;

    /** @type {Object} */
    details;

    /** @type {Router} */
    router;

    /**
     * @class
     * @param {String} name
     * @param {Object} details
     * @param {Router} router
     */
    constructor(name, details, router) {
        this.name = name;
        this.details = details;
        this.router = router;
    }

    /**
     * Retruns the route's origin
     *
	 * @readonly
     * @returns {String}
	 */
    get origin() {
        const hasDomain = !isBlank(this.details.domain);

        // if route has a domain, always return an absolute origin.
        if (hasDomain) {
            const scheme = this.router.base.match(/^(http|https):\/\//);
            return ensureNoTrailingSlash((scheme[0] ?? '') + this.details.domain);
        }

        if (!this.router.config.absolute)
            return '';

        // no domain, return absolute origin.
        return ensureNoTrailingSlash(this.router.origin);
    }

    /**
	 * Retruns the route's template
     * @readonly
     * @returns {String}
	 */
    get template() {
        const template = ensureNoTrailingSlash(`${this.origin}/${this.details.uri}`);
        return isBlank(template) ? '/' : template;
    }

    /**
	 * Retruns the route's template
     *
     * @readonly
     * @returns {Object}
	 */
    get expects() {
        const tokens = {};
        const matches = this.template.match(/{\w+\??}/g) ?? [];
        for (const m of matches) {
            const name = m.replace(/\W/g, '');
            // if this parameter name appears more than once in the template
            // make sure to mark it as required if it is required any of
            // the template occurences.
            tokens[name] = m.includes('?') || (tokens[name] ?? false);
        }
        return tokens;
    }

    /**
     * Return the compiled URI for this route, along with an array of substituted tokens.
     *
     * @param {Object} params
     * @return {{substituted: Array<String>, template: String}}
     *      The compiled URI and an array of substituted tokens
     */
    compile(params) {
        if (this.expects.length < 1)
            return this.template;

        const substituted = [];
        let template = this.template;

        for (const token of Object.keys(this.expects)) {
            const optional = this.expects[token]
            const repl = params?.[token] ?? this.router.config.defaults?.[token] ?? '';

            if (!optional) {
                if (isBlank(repl)) {
                    throw new Error(
                        `Missing required parameter "${token}" for route "${this.name}"`
                    );
                }

                if (Object.hasOwn(this.details.wheres, token)) {
                    const where = this.details.wheres[token];
                    const matches = new RegExp(`^${where}$`).test(repl);
                    if (!matches) {
                        throw new Error(
                            `Parameter "${token}" for route "${this.name}" ` +
                            `does not match format "${where}"`
                        );
                    }
                }
            }

            const re = new RegExp(`{${token}\\??}`, 'g');
            if (re.test(template)) {
                const encoded = encodeURIComponent(repl);
                template = ensureNoTrailingSlash(template.replace(re, encoded));
                substituted.push(token);

                /**
                 * Not too sure what to do about this.
                 * For now we will encode everything and warn (or error if strict mode),
                 * if a parameter contains slashes.
                 * @see https://github.com/laravel/framework/issues/22125
                 * @see https://github.com/laravel/framework/blob/11.x/src/Illuminate/Routing/RouteUrlGenerator.php#L36
                 * @see https://github.com/tighten/ziggy/pull/662
                 */
                if (/\/|%2F/g.test(encoded)) {
                    const message = `Character "/" or sequence "%2F" in parameter "${token}" for ` +
                        `route "${this.name}" might cause routing issues.`;
                    if (this.router.config.strict) {
                        throw new Error(
                            message +
                            '\n\tAn error was thrown because you enabled strict mode.\n'
                        );
                    }
                }
            }
        }
        return {substituted, template};
    }
}
