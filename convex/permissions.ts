import { Infer, v } from "convex/values";
import { QueryCtx } from "./types";
import { Id } from "./_generated/dataModel";

export const vPermission = v.union(
  v.literal("Manage Team"),
  v.literal("Delete Team"),
  v.literal("Read Members"),
  v.literal("Manage Members"),
  v.literal("Contribute")
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

export async function viewerHasPermissionX(
  ctx: QueryCtx,
  teamId: Id<"teams">,
  name: Permission
) {
  const member = await ctx
    .table("members", "teamUser", (q) =>
      q.eq("teamId", teamId).eq("userId", ctx.viewerX()._id)
    )
    .uniqueX();
  if (
    !(await member
      .edge("role")
      .edge("permissions")
      .has(await getPermission(ctx, name)))
  ) {
    throw new Error(`Viewer does not have the permission "${name}"`);
  }
  return member;
}
