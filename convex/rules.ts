import {
  addEntRules,
  entsTableFactory,
  entsTableWriterFactory,
} from "convex-ents";
import { MutationCtx, QueryCtx } from "./_generated/server";
import { entDefinitions } from "./schema";

export async function mutationCtxWithRules(baseCtx: MutationCtx) {
  const { ctx, entDefinitionsWithRules } = await queryCtxWithRules(baseCtx);
  return {
    db: baseCtx.db as unknown as undefined,
    viewer: ctx.viewer,
    viewerX: ctx.viewerX,
    skipRules: { table: entsTableWriterFactory(baseCtx, entDefinitions) },
    table: entsTableWriterFactory(baseCtx, entDefinitionsWithRules),
  };
}

export async function queryCtxWithRules(baseCtx: QueryCtx) {
  const ctx = await queryCtxWithViewer(baseCtx);
  const entDefinitionsWithRules = getEntDefinitionsWithRules(ctx);
  ctx.table = entsTableFactory(baseCtx, entDefinitionsWithRules);
  return { ctx, entDefinitionsWithRules };
}

async function queryCtxWithViewer(baseCtx: QueryCtx) {
  const ctx = queryCtxForLoadingViewer(baseCtx);
  const viewer = await getViewer(ctx);
  return {
    ...ctx,
    viewer,
    viewerX: () => {
      if (viewer === null) {
        throw new Error("Expected authenticated viewer");
      }
      return viewer;
    },
    table: entsTableFactory(baseCtx, entDefinitions),
  };
}

function getEntDefinitionsWithRules(
  _ctx: Awaited<ReturnType<typeof queryCtxWithViewer>>
) {
  return addEntRules(entDefinitions, {});
}

function queryCtxForLoadingViewer(baseCtx: QueryCtx) {
  return {
    ...baseCtx,
    db: baseCtx.db as unknown as undefined,
    skipRules: { table: entsTableFactory(baseCtx, entDefinitions) },
  };
}

async function getViewer(ctx: ReturnType<typeof queryCtxForLoadingViewer>) {
  const user = await ctx.auth.getUserIdentity();
  if (user === null) {
    return null;
  }
  return await ctx.skipRules
    .table("users")
    .get("tokenIdentifier", user.tokenIdentifier);
}
