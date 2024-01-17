import { ConvexError, v } from "convex/values";
import { Resend } from "resend";
import { internal } from "../../../_generated/api";
import { action } from "../../../_generated/server";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "../../../functions";
import { viewerHasPermissionX } from "../../../permissions";

export const list = query({
  args: {
    teamId: v.optional(v.id("teams")),
  },
  async handler(ctx, { teamId }) {
    if (teamId === undefined || ctx.viewer === null) {
      return null;
    }
    await viewerHasPermissionX(ctx, teamId, "Read Members");
    return ctx
      .table("teams")
      .getX(teamId)
      .edge("invites")
      .map(async (invite) => {
        return {
          _id: invite._id,
          email: invite.email,
          role: (await invite.edge("role")).name,
        };
      });
  },
});

export const deleteInvite = mutation({
  args: {
    inviteId: v.id("invites"),
  },
  async handler(ctx, { inviteId }) {
    const invite = await ctx.table("invites").getX(inviteId);
    await viewerHasPermissionX(ctx, invite.teamId, "Manage Members");
    await ctx.table("invites").getX(inviteId).delete();
  },
});

// To enable sending emails, set
// - `RESEND_API_KEY`
// - `HOSTED_URL` to the URL where your site is hosted
// on your Convex dashboard:
// https://dashboard.convex.dev/deployment/settings/environment-variables
// To test emails, override the email address by setting
// `OVERRIDE_INVITE_EMAIL`.
export const send = action({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    roleId: v.id("roles"),
  },
  async handler(ctx, { teamId, email, roleId }) {
    const { inviterEmail, teamName } = await ctx.runQuery(
      internal.users.teams.members.invites.prepare,
      { teamId }
    );
    await sendInviteEmail({ email, inviterEmail, teamName });
    await ctx.runMutation(internal.users.teams.members.invites.create, {
      teamId,
      email,
      roleId,
      inviterEmail,
    });
  },
});

export const prepare = internalQuery({
  args: {
    teamId: v.id("teams"),
  },
  async handler(ctx, { teamId }) {
    await viewerHasPermissionX(ctx, teamId, "Manage Members");
    return {
      inviterEmail: ctx.viewerX().email,
      teamName: (await ctx.table("teams").getX(teamId)).name,
    };
  },
});

export const create = internalMutation({
  args: {
    teamId: v.id("teams"),
    email: v.string(),
    roleId: v.id("roles"),
    inviterEmail: v.string(),
  },
  async handler(ctx, { teamId, email, roleId, inviterEmail }) {
    await ctx.table("invites").insert({
      teamId,
      email,
      roleId,
      inviterEmail,
    });
  },
});

async function sendInviteEmail({
  email,
  inviterEmail,
  teamName,
}: {
  email: string;
  inviterEmail: string;
  teamName: string;
}) {
  if (
    process.env.RESEND_API_KEY === undefined ||
    process.env.HOSTED_URL === undefined
  ) {
    console.error(
      "Set up `RESEND_API_KEY` and `HOSTED_URL` to send invite emails"
    );
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "My App <onboarding@resend.dev>",
    to: [process.env.OVERRIDE_INVITE_EMAIL ?? email],
    subject: `${inviterEmail} invited you to join them in My App`,
    html: `<div><strong>${inviterEmail}</strong> invited
      you to join <strong>${teamName}</strong> in My App.
      Click <a href="${process.env.HOSTED_URL}?showNotifs=1">here to accept</a>
      or log in to My App.`,
  });

  if (error) {
    throw new ConvexError("Could not send invitation email");
  }
}
