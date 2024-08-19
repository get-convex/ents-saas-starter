import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { mutationCtx } from "./functions";
import { getUniqueSlug } from "./users/teams";
import { createMember } from "./users/teams/members";
import { getRole } from "./permissions";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (params.flow === "signUp") {
          if (String(params.password ?? "").length < 8) {
            throw new ConvexError(
              "Password must be at least 8 characters long",
            );
          }
          return {
            email: params.email as string,
            firstName: params.firstName!,
            lastName: params.lastName!,
            fullName: `${String(params.firstName)} ${String(params.lastName)}`,
          };
        }
        return {
          email: params.email as string,
        } as any;
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx_, args) {
      const ctx = await mutationCtx(ctx_);
      const user = await ctx.table("users").getX(args.userId!);
      const name = `${user.firstName}'s Team`;
      const slug = await getUniqueSlug(ctx, name);
      const teamId = await ctx
        .table("teams")
        .insert({ name, slug, isPersonal: true });
      await createMember(ctx, {
        teamId,
        user,
        roleId: (await getRole(ctx, "Admin"))._id,
      });
    },
  },
});
