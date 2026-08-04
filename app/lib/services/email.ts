import { Resend } from "resend";
import { logger } from "@/app/lib/logger";
import { buildDriverInviteEmail } from "@/app/lib/templates/driverInviteEmail";
import { buildNotificationEmail, NotificationEmailKind } from "@/app/lib/templates/notificationEmail";
import { buildWeeklyReportEmail, WeeklyReportEmailData } from "@/app/lib/templates/weeklyReportEmail";
import { buildPasswordResetEmail } from "@/app/lib/templates/passwordResetEmail";
import { buildEmailVerificationEmail } from "@/app/lib/templates/emailVerificationEmail";

let resendClient: Resend | null = null;
/**
 * tr-description
 * en-description
 * input ()
 * output (Resend)
 *
 */
function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey)
      throw new Error("RESEND_API_KEY environment variable is not defined");
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
 * tr-Resend kullanarak genel bir e-posta gönderir. RESEND_API_KEY yapılandırılmamışsa e-postayı göndermek yerine günlüğe kaydeder.
 * en-Sends a generic email using Resend. If RESEND_API_KEY isn't configured, logs the email instead of sending it.
 * input (options: SendEmailOptions)
 * output (Promise<void>)
 *
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn(
      `[email] RESEND_API_KEY not set — email to ${options.to}: ${options.subject}`
    );
    return;
  }
  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from:
        options.from ||
        process.env.RESEND_FROM_EMAIL ||
        "LogiTrack <onboarding@resend.dev>",
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
 * tr-Belirtilen dile uygun güzel HTML şablonuyla sürücüye davet e-postası gönderir.
 *    RESEND_API_KEY tanımlı değilse (yerel/dev ortam) e-posta göndermez, sadece günlüğe kaydeder.
 * en-Sends a driver invite email using a rich bilingual HTML template (TR/EN).
 *    If RESEND_API_KEY is not set (local/dev), logs the invite URL instead of sending.
 * input (to: string, inviteUrl: string, companyName: string, lang?: "en" | "tr", expiryDays?: number)
 * output (Promise<void>)
 *
 */
export async function sendDriverInviteEmail(
  to: string,
  inviteUrl: string,
  companyName: string,
  lang: "en" | "tr" = "en",
  expiryDays: number = 7
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.warn(
      `[email] RESEND_API_KEY not set — invite URL for ${to} (lang:${lang}): ${inviteUrl}`
    );
    return;
  }
  try {
    const { subject, html, text } = buildDriverInviteEmail({
      companyName,
      inviteUrl,
      lang,
      expiryDays,
    });

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>",
      to,
      subject,
      html,
      text,
    });

    if (error) {
      // Log the full Resend error object so the terminal shows the real cause
      logger.error("[email] Resend rejected the request:", {
        name: error.name,
        message: error.message,
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev (default)",
        to,
      });
      throw new Error(`[Resend] ${error.name}: ${error.message}`);
    }

    logger.info(`[email] Driver invite sent → ${to} (id: ${data?.id})`);
  } catch (error) {
    // Re-throw with the original message so callers can see the real cause
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("[email] sendDriverInviteEmail failed:", msg);
    throw new Error(msg);
  }
}

/**
 * tr-Şifre sıfırlama bağlantısını gönderir. Diğer gönderim fonksiyonlarının aksine, RESEND_API_KEY
 *    tanımlı değilse sessizce geçmez — hata fırlatır. Sessiz bir başarısızlık, kullanıcının
 *    "bağlantı gönderildi" mesajını görüp hiçbir zaman e-posta almaması demektir.
 * en-Sends the password reset link. Unlike the other senders, this one THROWS when RESEND_API_KEY
 *    is missing instead of silently logging: a silent no-op here means the user is told "link sent"
 *    and is permanently locked out of their account. A hard failure is the safer outcome.
 * input (to: string, resetUrl: string, userName?: string, lang?: "en" | "tr", expiryMinutes?: number)
 * output (Promise<void>)
 */
export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string,
  userName?: string,
  lang: "en" | "tr" = "en",
  expiryMinutes: number = 60
): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    logger.error(
      "[email] RESEND_API_KEY is not set — password reset email cannot be delivered. " +
      "Refusing to report success for an email that was never sent."
    );
    throw new Error("Email delivery is not configured");
  }

  const { subject, html, text } = buildPasswordResetEmail({
    resetUrl,
    ...(userName ? { userName } : {}),
    lang,
    expiryMinutes,
  });

  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>",
    to,
    subject,
    html,
    text,
  });

  if (error) {
    // Never log resetUrl — it is a bearer credential until it is used.
    logger.error("[email] Resend rejected the password reset email:", {
      name: error.name,
      message: error.message,
      to,
    });
    throw new Error(`[Resend] ${error.name}: ${error.message}`);
  }

  logger.info(`[email] Password reset sent → ${to} (id: ${data?.id})`);
}

/**
 * tr-E-posta doğrulama bağlantısını gönderir. Şifre sıfırlamanın aksine hata FIRLATMAZ:
 *    doğrulama maili kaydın yan etkisidir, kaydın kendisi değil. Gönderim başarısız olursa
 *    hesap yine de oluşmalı ve kullanıcı yeniden gönderim isteyebilmelidir.
 * en-Sends the email verification link. Unlike the password reset sender this one does NOT throw:
 *    verification is a side effect of signup, not the signup itself. If delivery fails the account
 *    must still exist and the user can request a new link — failing registration over a mail
 *    outage would be far worse than an unverified account.
 * input (to: string, verifyUrl: string, userName?: string, lang?: "en" | "tr", expiryHours?: number)
 * output (Promise<boolean>) — true when handed off to Resend, false otherwise
 */
export async function sendEmailVerificationEmail(
  to: string,
  verifyUrl: string,
  userName?: string,
  lang: "en" | "tr" = "en",
  expiryHours: number = 24
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    logger.error(
      `[email] RESEND_API_KEY not set — verification email for ${to} was not sent.`
    );
    return false;
  }

  try {
    const { subject, html, text } = buildEmailVerificationEmail({
      verifyUrl,
      ...(userName ? { userName } : {}),
      lang,
      expiryHours,
    });

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>",
      to,
      subject,
      html,
      text,
    });

    if (error) {
      // Never log verifyUrl — it is a bearer credential until it is used.
      logger.error("[email] Resend rejected the verification email:", {
        name: error.name,
        message: error.message,
        to,
      });
      return false;
    }

    logger.info(`[email] Verification email sent → ${to} (id: ${data?.id})`);
    return true;
  } catch (error) {
    logger.error(
      "[email] sendEmailVerificationEmail failed:",
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

/**
 * tr-Sevkiyat/bakım gibi olay tabanlı bildirimler için toplu e-posta gönderir. Her alıcı e-postası ayrı bir gönderim
 *    olarak işlenir; bir alıcının başarısız olması diğerlerini etkilemez. RESEND_API_KEY tanımlı değilse günlüğe kaydeder.
 * en-Sends event-driven notification emails (shipment/maintenance) to a batch of recipients. Each recipient is sent
 *    independently so one failure doesn't block the rest. If RESEND_API_KEY is not set, logs instead of sending.
 * input (recipients: { email: string; lang?: "en" | "tr" }[], notification: { title: string; message: string; type: NotificationEmailKind; link?: string })
 * output (Promise<void>)
 */
export async function sendNotificationEmail(
  recipients: { email: string; lang?: "en" | "tr" | undefined }[],
  notification: { title: string; message: string; type: NotificationEmailKind; link?: string | undefined }
): Promise<void> {
  if (recipients.length === 0) return;

  if (!process.env.RESEND_API_KEY) {
    logger.warn(
      `[email] RESEND_API_KEY not set — notification email "${notification.title}" not sent to ${recipients.length} recipient(s)`
    );
    return;
  }

  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>";

  await Promise.all(
    recipients.map(async (recipient) => {
      try {
        const { subject, html, text } = buildNotificationEmail({
          title: notification.title,
          message: notification.message,
          type: notification.type,
          link: notification.link,
          lang: recipient.lang,
        });

        const { error } = await resend.emails.send({
          from,
          to: recipient.email,
          subject,
          html,
          text,
        });

        if (error) {
          logger.error("[email] Resend rejected notification email:", {
            name: error.name,
            message: error.message,
            to: recipient.email,
          });
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`[email] sendNotificationEmail failed for ${recipient.email}:`, msg);
      }
    })
  );
}

/**
 * tr-Haftalık özet raporunu bir alıcı grubuna gönderir. Her alıcı e-postası ayrı bir gönderim olarak işlenir;
 *    bir alıcının başarısız olması diğerlerini etkilemez. RESEND_API_KEY tanımlı değilse günlüğe kaydeder.
 * en-Sends the weekly summary report to a batch of recipients. Each recipient is sent independently so one
 *    failure doesn't block the rest. If RESEND_API_KEY is not set, logs instead of sending.
 * input (recipients: { email: string; lang?: "en" | "tr" }[], report: Omit<WeeklyReportEmailData, "lang">)
 * output (Promise<void>)
 */
export async function sendWeeklyReportEmail(
  recipients: { email: string; lang?: "en" | "tr" | undefined }[],
  report: Omit<WeeklyReportEmailData, "lang">
): Promise<void> {
  if (recipients.length === 0) return;

  if (!process.env.RESEND_API_KEY) {
    logger.warn(
      `[email] RESEND_API_KEY not set — weekly report for "${report.companyName}" not sent to ${recipients.length} recipient(s)`
    );
    return;
  }

  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL || "LogiTrack <onboarding@resend.dev>";

  await Promise.all(
    recipients.map(async (recipient) => {
      try {
        const { subject, html, text } = buildWeeklyReportEmail({
          ...report,
          lang: recipient.lang,
        });

        const { error } = await resend.emails.send({
          from,
          to: recipient.email,
          subject,
          html,
          text,
        });

        if (error) {
          logger.error("[email] Resend rejected weekly report email:", {
            name: error.name,
            message: error.message,
            to: recipient.email,
          });
        }
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        logger.error(`[email] sendWeeklyReportEmail failed for ${recipient.email}:`, msg);
      }
    })
  );
}

