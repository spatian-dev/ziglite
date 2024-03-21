import { RouteDetails } from './Route.types';
import { BooleanOptional, IStringifyOptions } from "qs";
export type RouterConfiguration = {
    absolute: boolean;
    strict: boolean;
    qsConfig: IStringifyOptions<BooleanOptional>;
    base: string;
    defaults: Record<string, string>;
    routes: Record<string, RouteDetails>;
};
