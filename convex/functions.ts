import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  query as baseQuery,
  mutation as baseMutation,
  internalQuery as baseInternalQuery,
  internalMutation as baseInternalMutation,
} from "./_generated/server";
import { entsTableFactory, entsTableWriterFactory } from "convex-ents";
import { entDefinitions } from "./schema";

export const query = customQuery(
  baseQuery,
  customCtx(async (ctx) => {
    return {
      table: entsTableFactory(ctx, entDefinitions),
      db: undefined,
    };
  })
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (ctx) => {
    return {
      table: entsTableFactory(ctx, entDefinitions),
      db: undefined,
    };
  })
);

export const mutation = customMutation(
  baseMutation,
  customCtx(async (ctx) => {
    return {
      table: entsTableWriterFactory(ctx, entDefinitions),
      db: undefined,
    };
  })
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (ctx) => {
    return {
      table: entsTableWriterFactory(ctx, entDefinitions),
      db: undefined,
    };
  })
);
