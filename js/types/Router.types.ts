import type { RouteDetails, RouteParameters } from "@/types/Route.types";
import type { BooleanOptional, IStringifyOptions } from "qs";

type RouteList = Record<string, RouteDetails>;

export type RouterConfiguration = {
    absolute: boolean,
    strict: boolean,
    qsConfig: IStringifyOptions<BooleanOptional>,

    base: string,
    defaults: RouteParameters,
    routes: RouteList,
};
