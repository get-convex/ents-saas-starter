import { v } from "convex/values";
import { mutation, query } from "./functions";

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

export const accept = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    if (invite.email !== ctx.viewerX().email) {
      throw new Error("Invite email does not match viewer email");
    }
    await ctx.table("members").insert({
      teamId: invite.teamId,
      userId: ctx.viewerX()._id,
      roleId: invite.roleId,
    });
    await invite.delete();
    return (await invite.edge("team")).slug;
  },
});
