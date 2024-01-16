import { ConvexError, v } from "convex/values";
import { mutation, query } from "../../functions";
import { getRole, viewerHasPermissionX } from "../../permissions";

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
          _id: member._id,
          fullName: user.fullName,
          email: user.email,
          pictureUrl: user.pictureUrl,
          initials:
            user.firstName === undefined || user.lastName === undefined
              ? user.fullName[0]
              : user.firstName[0] + user.lastName[0],
          roleId: member.roleId,
        };
      });
  },
});

export const deleteMember = mutation({
  args: {
    memberId: v.id("members"),
  },
  async handler(ctx, { memberId }) {
    const member = await ctx.table("members").getX(memberId);
    const adminRole = await getRole(ctx, "Admin");
    const otherAdmin = await ctx
      .table("teams")
      .getX(member.teamId)
      .edge("members")
      .filter((q) =>
        q.and(
          q.eq(q.field("roleId"), adminRole._id),
          q.neq(q.field("_id"), memberId)
        )
      )
      .first();
    if (otherAdmin === null) {
      throw new ConvexError(
        "There must be at least one admin left on the team"
      );
    }
    await viewerHasPermissionX(ctx, member.teamId, "Manage Members");
    await ctx.table("members").getX(memberId).delete();
  },
});
