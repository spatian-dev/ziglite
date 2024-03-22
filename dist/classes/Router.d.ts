import type { RouteParametersWithQuery } from '../types/Route.types';
import type { RouterConfiguration } from '../types/Router.types';
/**
 * @classdesc Routing helper.
 */
export declare class Router {
    #private;
    constructor(config?: Partial<RouterConfiguration>);
    get config(): RouterConfiguration;
    set config(value: Partial<RouterConfiguration> | undefined);
    get base(): string;
    get origin(): string;
    has(name: string): boolean;
    compile(name: string, params: RouteParametersWithQuery): string;
}
