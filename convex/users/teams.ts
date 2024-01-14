import { query } from "../functions";

export const list = query({
  args: {},
  async handler(ctx) {
    return [];
  },
});
