import { mutation } from "./functions";
import { getRole } from "./permissions";
import { defaultToAccessTeamSlug, getUniqueSlug } from "./users/teams";
import { createMember } from "./users/teams/members";

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Called api.users.store without valid auth token");
    }

    const existingUser = await ctx
      .table("users")
      .get("tokenIdentifier", identity.tokenIdentifier);
    if (existingUser !== null) {
      return defaultToAccessTeamSlug(existingUser);
    }
    if (identity.email === undefined) {
      throw new Error("User does not have an email address");
    }
    let user = await ctx.table("users").get("email", identity.email);
    const nameFallback = emailUserName(identity.email);
    const userFields = {
      fullName: identity.name ?? nameFallback,
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email,
      pictureUrl: identity.pictureUrl,
      firstName: identity.givenName,
      lastName: identity.familyName,
    };
    if (user !== null) {
      await user.patch({ ...userFields, deletionTime: undefined });
    } else {
      user = await ctx.table("users").insert(userFields).get();
    }
    const name = `${user.firstName ?? nameFallback}'s Team`;
    const slug = await getUniqueSlug(ctx, identity.nickname ?? name);
    const teamId = await ctx
      .table("teams")
      .insert({ name, slug, isPersonal: true });
    await createMember(ctx, {
      teamId,
      user,
      roleId: (await getRole(ctx, "Admin"))._id,
    });
    return slug;
  },
});

function emailUserName(email: string) {
  return email.split("@")[0];
}
