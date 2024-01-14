import { internalMutation } from "./functions";
import { getPermission } from "./permissions";

export const init = internalMutation({
  args: {},
  handler: async (ctx) => {
    if ((await ctx.table("roles").first()) !== null) {
      throw new Error("There's an existing roles setup already.");
    }
    await ctx
      .table("permissions")
      .insertMany([
        { name: "Manage Team" },
        { name: "Delete Team" },
        { name: "Manage Members" },
        { name: "Read Members" },
      ]);

    await ctx.table("roles").insert({
      name: "Admin",
      permissions: [
        await getPermission(ctx, "Manage Team"),
        await getPermission(ctx, "Delete Team"),
        await getPermission(ctx, "Manage Members"),
        await getPermission(ctx, "Read Members"),
      ],
    });
    await ctx.table("roles").insert({
      name: "Member",
      permissions: [await getPermission(ctx, "Read Members")],
    });
  },
});
