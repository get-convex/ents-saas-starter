import { v } from "convex/values";
import { mutation, query } from "../functions";
import { slugify } from "../utils";
import { QueryCtx } from "../types";
import { getRole } from "../permissions";

export const defaultToAccess = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return null;
    }
    return (
      await ctx.viewer
        .edge("members")
        .map((member) => member.edge("team").doc())
    ).filter((team) => team.isPersonal)[0];
  },
});

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return null;
    }
    return ctx.viewer
      .edge("members")
      .map((member) => member.edge("team").doc());
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  async handler(ctx, { name }) {
    const slug = await getUniqueSlug(ctx, name);
    const teamId = await ctx
      .table("teams")
      .insert({ name, isPersonal: false, slug });
    await ctx.table("members").insert({
      teamId: teamId,
      userId: ctx.viewerX()._id,
      roleId: (await getRole(ctx, "Admin"))._id,
    });
  },
});

export async function getUniqueSlug(ctx: QueryCtx, name: string) {
  const slug = slugify(name);
  let n = 0;
  for (;;) {
    const existing = await ctx.table("teams").get("slug", slug);
    if (existing === null) {
      break;
    }
    n++;
  }
  return n === 0 ? slug : `${slug}-${n}`;
}
