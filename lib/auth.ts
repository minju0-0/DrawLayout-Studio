import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { db } from "@/lib/db";
import { user, session, account, verification } from "@/db/schema";
import { Resend } from "resend";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
    usePlural: false,
    camelCase: false,
  }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    // sendVerificationEmail receives { user, url }
    sendVerificationEmail: async ({ user: u, url }) => {
      try {
        if (!u || !u.email) {
          console.warn("emailVerification: missing user/email");
          return;
        }
        const to = u.email as string;
        const from = process.env.EMAIL_FROM || "no-reply@example.com";
        const subject = "Verify your DrawLayout account";
        const html = `Please verify your email by clicking <a href="${url}">this link</a>.`;

        if (resend) {
          await resend.emails.send({
            from,
            to,
            subject,
            html,
          });
          return;
        }

        // Fallback: log the verification URL so devs can copy it
        console.log("[emailVerification] Verification URL:", url);
      } catch (err) {
        console.error("[emailVerification] error:", err);
      }
    },
  },
});
