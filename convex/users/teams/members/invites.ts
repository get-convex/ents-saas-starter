import { v } from "convex/values";
import { mutation, query } from "../../../functions";
import { viewerHasPermissionX } from "../../../permissions";

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
      .edge("invites")
      .map(async (invite) => {
        return {
          _id: invite._id,
          email: invite.email,
          role: (await invite.edge("role")).name,
        };
      });
  },
});

export const create = mutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    role: v.id("roles"),
  },
  async handler(ctx, { teamId, email, role }) {
    await viewerHasPermissionX(ctx, teamId, "Manage Members");
    await ctx.table("invites").insert({
      teamId: teamId,
      email: email,
      roleId: role,
    });
  },
});

export const deleteInvite = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    await viewerHasPermissionX(ctx, invite.teamId, "Manage Members");
    await ctx.table("invites").getX(inviteId).delete();
  },
});
