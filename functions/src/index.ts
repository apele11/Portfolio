import { onRequest } from "firebase-functions/https";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";

/**
 * The contact form's backend. Firebase Hosting rewrites POST /api/contact here
 * (see firebase.json), so the form talks to its own origin and needs no CORS.
 * A valid submission is sent to Emily's inbox through Resend.
 *
 * Set the key once with `firebase functions:secrets:set RESEND_API_KEY`. For
 * the emulator, put RESEND_API_KEY=... in functions/.secret.local (gitignored).
 */
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

const TO = "emilyapel11@gmail.com";
/**
 * Resend's shared test sender. It can only deliver to the address that owns the
 * Resend account. To send from your own domain instead, verify emilyapel.com in
 * Resend and change this to e.g. "Portfolio <contact@emilyapel.com>".
 */
const FROM = "Portfolio Contact <onboarding@resend.dev>";
/** Every subject starts with this. The Gmail filter that files these matches on it. */
const SUBJECT_TAG = "[Portfolio]";

/** Mirrors REASONS in src/projects/case-study/ContactCard.tsx. */
const REASONS = new Set(["Full-time role", "Freelance project", "Collaboration", "Something else"]);

const LIMITS = { name: 100, email: 254, organization: 120, message: 5000 };

/**
 * Per-IP throttle: a handful of messages per window. It lives in memory, so it
 * is per instance, which is why maxInstances is 1 below. A contact form never
 * needs a second instance, and capping it also caps what a flood can cost.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function allow(key: string, now: number): boolean {
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  const allowed = hits.length < MAX_PER_WINDOW;
  if (allowed) hits.push(now);
  recent.set(key, hits);

  if (recent.size > 500) {
    for (const [ip, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(ip);
    }
  }
  return allowed;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Trims, and folds any line breaks out of single-line fields so they cannot reshape the subject. */
const field = (value: unknown, singleLine = true): string => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return singleLine ? trimmed.replace(/[\r\n]+/g, " ") : trimmed;
};

type Submission = { name: string; email: string; organization: string; reason: string; message: string };

/** Returns the cleaned submission, or a sentence the form can show the visitor as is. */
function validate(body: Record<string, unknown>): Submission | string {
  const submission = {
    name: field(body.name),
    email: field(body.email),
    organization: field(body.organization),
    reason: field(body.reason),
    message: field(body.message, false),
  };

  if (!submission.name) return "Please enter your name.";
  if (submission.name.length > LIMITS.name) return "Please shorten your name to 100 characters.";
  if (submission.email.length > LIMITS.email || !EMAIL_PATTERN.test(submission.email)) {
    return "Please enter a valid email address.";
  }
  if (submission.organization.length > LIMITS.organization) {
    return "Please shorten the organization to 120 characters.";
  }
  if (!REASONS.has(submission.reason)) return "Please choose a reason for getting in touch.";
  if (!submission.message) return "Please write a message.";
  if (submission.message.length > LIMITS.message) {
    return "That message is too long. Please keep it under 5,000 characters.";
  }
  return submission;
}

export const contact = onRequest(
  {
    region: "us-central1",
    secrets: [RESEND_API_KEY],
    maxInstances: 1,
    memory: "256MiB",
    timeoutSeconds: 20,
  },
  async (req, res) => {
    res.set("Cache-Control", "no-store");

    if (req.method !== "POST") {
      res.set("Allow", "POST").status(405).json({ error: "Method not allowed." });
      return;
    }

    const body: unknown = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.status(400).json({ error: "Please fill in the form and try again." });
      return;
    }
    const fields = body as Record<string, unknown>;

    // The honeypot. People never see it, so anything in it came from a bot.
    // Answer as if it worked, so the bot has nothing to learn from.
    if (field(fields.website)) {
      logger.info("Dropped a submission that filled the honeypot.");
      res.json({ ok: true });
      return;
    }

    const result = validate(fields);
    if (typeof result === "string") {
      res.status(400).json({ error: result });
      return;
    }

    if (!allow(req.ip ?? "unknown", Date.now())) {
      res.status(429).json({ error: "That's a lot of messages in a short time. Please try again in a few minutes." });
      return;
    }

    const { name, email, organization, reason, message } = result;
    const page = req.get("referer");
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Organization: ${organization || "Not given"}`,
      `Reason: ${reason}`,
      "",
      "Message:",
      message,
      "",
      "Sent from the contact form on emilyapel.com" + (page ? ` (${page})` : "") + ".",
      "Reply to this email to answer them directly.",
    ].join("\n");

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY.value()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM,
          to: [TO],
          reply_to: email,
          subject: `${SUBJECT_TAG} ${reason}: ${name}`,
          text,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      if (!response.ok) {
        logger.error("Resend rejected the message.", { status: response.status, body: await response.text() });
        res.status(502).json({ error: "The message could not be sent." });
        return;
      }
    } catch (error) {
      logger.error("Could not reach Resend.", error);
      res.status(502).json({ error: "The message could not be sent." });
      return;
    }

    res.json({ ok: true });
  }
);
