import { z } from "zod";
import type { BooleanOptional, IStringifyOptions } from "qs";
export declare const RouterConfigurationFromJsonSchema: z.ZodObject<{
    base: z.ZodString;
    defaults: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    routes: z.ZodRecord<z.ZodString, z.ZodObject<{
        uri: z.ZodString;
        domain: z.ZodNullable<z.ZodString>;
        wheres: z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
    }, "strip", z.ZodTypeAny, {
        uri: string;
        domain: string | null;
        wheres: Record<string, string | number | boolean>;
    }, {
        uri: string;
        domain: string | null;
        wheres: Record<string, string | number | boolean>;
    }>>;
}, "strip", z.ZodTypeAny, {
    base: string;
    defaults: Record<string, string | number | boolean>;
    routes: Record<string, {
        uri: string;
        domain: string | null;
        wheres: Record<string, string | number | boolean>;
    }>;
}, {
    base: string;
    defaults: Record<string, string | number | boolean>;
    routes: Record<string, {
        uri: string;
        domain: string | null;
        wheres: Record<string, string | number | boolean>;
    }>;
}>;
export type RouterConfigurationFromJson = z.infer<typeof RouterConfigurationFromJsonSchema>;
export type RouterConfiguration = RouterConfigurationFromJson & {
    absolute: boolean;
    strict: boolean;
    qsConfig: IStringifyOptions<BooleanOptional>;
};
