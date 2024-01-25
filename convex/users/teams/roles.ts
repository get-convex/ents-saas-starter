import { query } from "../../functions";

export const list = query({
  args: {},
  async handler(ctx) {
    return await ctx.table("roles").map((role) => ({
      _id: role._id,
      name: role.name,
      isDefault: role.isDefault,
    }));
  },
});
