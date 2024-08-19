import { v } from "convex/values";
import { mutation, query } from "../functions";
import { getRole, viewerHasPermissionX } from "../permissions";
import { QueryCtx } from "../types";
import { slugify } from "../utils";
import { createMember } from "./teams/members";

export const defaultTeamSlug = query({
  args: {},
  async handler(ctx) {
    const viewer = ctx.viewerX();
    return (
      await viewer.edge("members").map((member) => member.edge("team").doc())
    ).filter((team) => team.deletionTime === undefined && team.isPersonal)[0]
      .slug;
  },
});

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return null;
    }
    return await ctx.viewer
      .edge("members")
      .map(async (member) => {
        const team = await member.edge("team");
        return {
          _id: team._id,
          name: team.name,
          slug: team.slug,
          isPersonal: team.isPersonal,
          pictureUrl: team.isPersonal ? ctx.viewer!.pictureUrl : null,
          isDeleted:
            member.deletionTime !== undefined ||
            team.deletionTime !== undefined,
        };
      })
      .filter((member) => !member.isDeleted);
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
    await createMember(ctx, {
      teamId,
      user: ctx.viewerX(),
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return slug;
  },
});

export const deleteTeam = mutation({
  args: {
    teamId: v.id("teams"),
  },
  async handler(ctx, { teamId }) {
    await viewerHasPermissionX(ctx, teamId, "Delete Team");
    const team = await ctx.table("teams").getX(teamId);
    await team.delete();
    if (team.isPersonal) {
      await ctx.viewerX().delete();
    }
  },
});

export async function getUniqueSlug(ctx: QueryCtx, name: string) {
  const base = slugify(name);
  let slug;
  let n = 0;
  for (;;) {
    slug = n === 0 ? base : `${base}-${n}`;
    const existing = await ctx.table("teams").get("slug", slug);
    if (existing === null) {
      break;
    }
    n++;
  }
  return slug;
}
