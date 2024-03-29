import { z } from "zod";

const RouteTokensSchema = z.record(z.string(), z.boolean());
const RouteParameterValueSchema = z.union([z.string(), z.number(), z.boolean()]);
export const RouteParametersSchema = z.record(
	z.unknown(),
    RouteParameterValueSchema,
);

const RouteQueryParametersSchema = z.object({
    _query: z.record(
        RouteParametersSchema.keySchema,
        RouteParametersSchema.valueSchema.or(z.array(RouteParameterValueSchema)),
    ).optional(),
});

const RouteParametersWithQuerySchema = z.intersection(
    RouteParametersSchema, RouteQueryParametersSchema
);

export const RouteDetailsSchema = z.object({
    uri: z.string(),
    domain: z.string().nullable(),
    wheres: RouteParametersSchema,
});

const RouteCompilationResultSchema = z.object({
    substituted: z.array(z.string()),
    url: z.string(),
});

export type RouteTokens = z.infer<typeof RouteTokensSchema>;
export type RouteParametersWithQuery = z.infer<typeof RouteParametersWithQuerySchema>;
export type RouteDetails = z.infer<typeof RouteDetailsSchema>;
export type RouteCompilationResult = z.infer<typeof RouteCompilationResultSchema>;
