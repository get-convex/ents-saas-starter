import { v } from "convex/values";
import { query } from "../../functions";
import { viewerHasPermissionX } from "../../permissions";

export const viewerPermissions = query({
  args: {
    teamId: v.optional(v.id("teams")),
  },
  async handler(ctx, { teamId }) {
    if (teamId === undefined || ctx.viewer === null) {
      return null;
    }
    return await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", teamId).eq("userId", ctx.viewerX()._id)
      )
      .uniqueX()
      .edge("role")
      .edge("permissions")
      .map((permission) => permission.name);
  },
});

export const list = query({
  args: {
    teamId: v.optional(v.id("teams")),
  },
  async handler(ctx, { teamId }) {
    if (teamId === undefined || ctx.viewer === null) {
      return null;
    }
    await viewerHasPermissionX(ctx, teamId, "Read Members");
    return ctx
      .table("teams")
      .getX(teamId)
      .edge("members")
      .map(async (member) => {
        const user = await member.edge("user");
        return {
          id: member._id,
          fullName: user.fullName,
          email: user.email,
          pictureUrl: user.pictureUrl,
          initials: user.firstName[0] + user.lastName[0],
          role: (await member.edge("role"))._id,
        };
      });
  },
});
