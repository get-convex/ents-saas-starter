import { entsTableFactory, scheduledDeleteFactory } from "convex-ents";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  MutationCtx as BaseMutationCtx,
  QueryCtx as BaseQueryCtx,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
} from "./_generated/server";
import { entDefinitions } from "./schema";

export const query = customQuery(
  baseQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx);
  })
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (baseCtx) => {
    return await queryCtx(baseCtx);
  })
);

export const mutation = customMutation(
  baseMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx);
  })
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (baseCtx) => {
    return await mutationCtx(baseCtx);
  })
);

async function queryCtx(baseCtx: BaseQueryCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const identity = await ctx.auth.getUserIdentity();
  const viewer =
    identity === null
      ? null
      : await ctx
          .table("users")
          .get("tokenIdentifier", identity.tokenIdentifier);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error("Expected authenticated viewer");
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}

async function mutationCtx(baseCtx: BaseMutationCtx) {
  const ctx = {
    ...baseCtx,
    db: undefined,
    table: entsTableFactory(baseCtx, entDefinitions),
  };
  const identity = await ctx.auth.getUserIdentity();
  const viewer =
    identity === null
      ? null
      : await ctx
          .table("users")
          .get("tokenIdentifier", identity.tokenIdentifier);
  const viewerX = () => {
    if (viewer === null) {
      throw new Error("Expected authenticated viewer");
    }
    return viewer;
  };
  return { ...ctx, viewer, viewerX };
}

export const scheduledDelete = scheduledDeleteFactory(entDefinitions);
