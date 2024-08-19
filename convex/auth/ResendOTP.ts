import { Email } from "@convex-dev/auth/providers/Email";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";
import { VerificationCodeEmail } from "./VerificationCodeEmail";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: process.env.AUTH_RESEND_KEY,
  maxAge: 60 * 20,
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({
    identifier: email,
    provider,
    token,
    expires,
  }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      // TODO: Update with your app name and email address
      from: process.env.AUTH_EMAIL ?? "My App <onboarding@resend.dev>",
      to: [email],
      // TODO: Update with your app name
      subject: `Sign in to My App`,
      react: VerificationCodeEmail({ code: token, expires }),
    });

    if (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
