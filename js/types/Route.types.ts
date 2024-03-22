export type RouteTokens = Record<string, boolean>;

type RouteParameterValue = string | number | boolean;

export type RouteParameters = Record<string, RouteParameterValue>;

type RouteQueryParameters = {
    _query?: RouteParameters,
};

export type RouteParametersWithQuery = RouteParameters & RouteQueryParameters;

export interface RouteDetails {
    uri: string,
    domain: string|null,
    wheres: RouteParameters,
};

export type RouteCompilationResult = {
    substituted: Array<string>,
    url: string,
}
