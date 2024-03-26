import { z } from "zod";
import { RouteDetailsSchema, RouteParametersSchema } from "@/types/Route.types";
import type { BooleanOptional, IStringifyOptions } from "qs";

const RouteListSchema = z.record(z.string(), RouteDetailsSchema);

export const RouterConfigurationFromJsonSchema = z.object({
    base: z.string(),
    defaults: RouteParametersSchema,
    routes: RouteListSchema,
});

export type RouterConfigurationFromJson = z.infer<typeof RouterConfigurationFromJsonSchema>;
export type RouterConfiguration = RouterConfigurationFromJson & {
    absolute: boolean,
    strict: boolean,
    qsConfig: IStringifyOptions<BooleanOptional>,
};
