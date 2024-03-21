export type RouteDetails = {
    uri: string,
    domain: string,
    wheres: Record<string, string>,
};

/**
 * Describes an expected parameter in the route's template.
 * The key is the parameter name, and the value is a boolean
 * indicating if the parameter is required or not.
 */
export type RouteTokens = Record<string, boolean>;

export type RouteParameters = Record<string, string>;

export type RouteCompilationResult = {
    substituted: Array<string>,
    template: string,
}
