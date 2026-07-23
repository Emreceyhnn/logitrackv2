import { Resend } from "resend";
import { logger } from "@/app/lib/logger";

let resendClient: Resend | null = null;
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY environment variable is not defined");
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

/**
 * Sends a generic email using Resend.
 * If RESEND_API_KEY isn't configured, logs the email instead of sending it.
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn(`[email] RESEND_API_KEY not set — email to ${options.to}: ${options.subject}`);
    return;
  }
  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: options.from || process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      ...(options.text ? { text: options.text } : {}),
    });

    if (error) {
      logger.error("[email] Resend API error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    logger.error("[email] Failed to send email:", error);
    throw new Error("Failed to send email");
  }
}

/**
 * Sends a driver invite email. If RESEND_API_KEY isn't configured (local/dev),
 * logs the invite URL instead of failing, so testing never requires a real
 * Resend account.
 */
export async function sendDriverInviteEmail(
  to: string,
  inviteUrl: string,
  companyName: string
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn(`[email] RESEND_API_KEY not set — invite URL for ${to}: ${inviteUrl}`);
    return;
  }
  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>",
      to,
      subject: `You've been invited to join ${companyName} on LogiTrack`,
      html: `<p>You've been invited to join <strong>${companyName}</strong> as a driver.</p><p><a href="${inviteUrl}">Accept your invitation</a></p><p>This link expires in 7 days.</p>`,
    });

    if (error) {
      logger.error("[email] Resend API error:", error);
      throw new Error(error.message);
    }
  } catch (error) {
    logger.error("[email] Failed to send driver invite email:", error);
    throw new Error("Failed to send invitation email");
  }
}
