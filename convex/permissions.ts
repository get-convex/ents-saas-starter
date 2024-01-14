import { Infer, v } from "convex/values";
import { QueryCtx } from "./types";

export const vPermission = v.union(
  v.literal("Manage Team"),
  v.literal("Delete Team"),
  v.literal("Read Members"),
  v.literal("Manage Members")
);
export type Permission = Infer<typeof vPermission>;

export const vRole = v.union(v.literal("Admin"), v.literal("Member"));
export type Role = Infer<typeof vRole>;

export async function getPermission(ctx: QueryCtx, name: Permission) {
  return (await ctx.table("permissions").getX("name", name))._id;
}

export async function getRole(ctx: QueryCtx, name: Role) {
  return await ctx.table("roles").getX("name", name);
}
