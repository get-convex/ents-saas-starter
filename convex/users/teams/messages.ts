import { v } from "convex/values";
import { mutation, query } from "../../functions";
import { viewerHasPermissionX } from "../../permissions";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    teamId: v.id("teams"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { teamId, paginationOpts }) => {
    if (ctx.viewer === null) {
      return {
        page: [],
        isDone: true,
        continueCursor: "",
      };
    }
    await viewerHasPermissionX(ctx, teamId, "Contribute");
    return await ctx
      .table("teams")
      .getX(teamId)
      .edge("messages")
      .order("desc")
      .paginate(paginationOpts)
      .map(async (message) => {
        const user = await message.edge("member").edge("user");
        return {
          _id: message._id,
          _creationTime: message._creationTime,
          text: message.text,
          author: user.firstName ?? user.fullName,
        };
      });
  },
});

export const create = mutation({
  args: {
    teamId: v.id("teams"),
    text: v.string(),
  },
  handler: async (ctx, { teamId, text }) => {
    const member = await viewerHasPermissionX(ctx, teamId, "Contribute");
    await ctx.table("messages").insert({
      text,
      teamId: teamId,
      memberId: member._id,
    });
  },
});
