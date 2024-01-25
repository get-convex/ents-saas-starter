import { v } from "convex/values";
import { mutation, query } from "./functions";
import { Ent, QueryCtx } from "./types";

export const list = query({
  args: {},
  async handler(ctx) {
    if (ctx.viewer === null) {
      return null;
    }
    return await ctx
      .table("invites", "email", (q) => q.eq("email", ctx.viewerX().email))
      .map(async (invite) => ({
        _id: invite._id,
        email: invite.email,
        inviterEmail: invite.inviterEmail,
        team: (await invite.edge("team")).name,
        role: (await invite.edge("role")).name,
      }));
  },
});

export const get = query({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    if (ctx.viewer === null) {
      return null;
    }
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvited(ctx, invite);
    return {
      _id: invite._id,
      email: invite.email,
      inviterEmail: invite.inviterEmail,
      team: (await invite.edge("team")).name,
      role: (await invite.edge("role")).name,
    };
  },
});

export const accept = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvited(ctx, invite);
    const existingMember = await ctx
      .table("members", "teamUser", (q) =>
        q.eq("teamId", invite.teamId).eq("userId", ctx.viewerX()._id)
      )
      .unique();
    if (existingMember !== null) {
      await existingMember.patch({
        deletionTime: undefined,
        roleId: invite.roleId,
      });
    } else {
      await ctx.table("members").insert({
        teamId: invite.teamId,
        userId: ctx.viewerX()._id,
        roleId: invite.roleId,
      });
    }
    await invite.delete();
    return (await invite.edge("team")).slug;
  },
});

export const deleteInvite = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    checkViewerWasInvited(ctx, invite);
    await ctx.table("invites").getX(inviteId).delete();
  },
});

// NOTE: If you want your users to accept invites after signing up
// with a different email, add a cryptographically secure token to
// the invite ent, and use it in place of the ID as INVITE_PARAM.
// Don't use the invite ID, as it shown to all team members.
function checkViewerWasInvited(ctx: QueryCtx, invite: Ent<"invites">) {
  if (invite.email !== ctx.viewerX().email) {
    throw new Error("Invite email does not match viewer email");
  }
}
