export type RouteDetails = {
    uri: string,
    domain: string|null,
    wheres: Record<string, string>,
};

export type RouteTokens = Record<string, boolean>;

export type RouteParameters = {
    _query?: Record<string, string>,
} & Record<string, string>;

export type RouteCompilationResult = {
    substituted: Array<string>,
    template: string,
}
