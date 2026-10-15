import { useEffect, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";

/** Mirrors REASONS in functions/src/index.ts. The server rejects anything else. */
const REASONS = ["Full-time role", "Freelance project", "Collaboration", "Something else"] as const;

/** Rewritten to the `contact` Cloud Function by firebase.json, and proxied to its emulator in dev. */
const ENDPOINT = "/api/contact";
const FALLBACK_EMAIL = "emilyapel11@gmail.com";
const TIMEOUT_MS = 15000;

const EMPTY = { name: "", email: "", organization: "", reason: "", message: "", website: "" };
type Fields = typeof EMPTY;

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  /** `message` is the server's own wording for a problem the visitor can fix. */
  | { state: "error"; message: string };

async function readServerMessage(res: Response): Promise<string> {
  try {
    const body: unknown = await res.json();
    if (body && typeof body === "object" && "error" in body && typeof body.error === "string") return body.error;
  } catch {
    // Not JSON, e.g. an HTML error page from a proxy. The generic message covers it.
  }
  return "";
}

function Chevron() {
  return (
    <svg className="contact-card__chevron" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ContactCard() {
  const id = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const cardRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  // The confirmation is a third the height of the form. Holding the card at
  // the form's height keeps it from collapsing under the visitor's eye, and
  // keeps the split heading, which is measured against the card, where it is.
  const [heldHeight, setHeldHeight] = useState<number>();
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const resetRequested = useRef(false);

  // The submit button disappears with the form, which would drop focus to the
  // body. Hand it to the confirmation instead, and back to the first field when
  // the visitor asks to write another.
  useEffect(() => {
    if (status.state === "sent") doneRef.current?.focus();
    if (status.state === "idle" && resetRequested.current) {
      resetRequested.current = false;
      firstFieldRef.current?.focus();
    }
  }, [status.state]);

  const update =
    (key: keyof Fields) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((current) => ({ ...current, [key]: event.target.value }));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "sending") return;
    setStatus({ state: "sending" });

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
        signal: controller.signal,
      });
      if (!res.ok) {
        // 400 and 429 carry a sentence written for the visitor. Anything else is
        // on the server's side, and the generic message with the fallback
        // address is more use to them than a status code.
        const fixable = res.status === 400 || res.status === 429;
        setStatus({ state: "error", message: fixable ? await readServerMessage(res) : "" });
        return;
      }
      setHeldHeight(cardRef.current?.offsetHeight);
      setFields(EMPTY);
      setStatus({ state: "sent" });
    } catch (error) {
      console.error("Contact form failed:", error);
      setStatus({ state: "error", message: "" });
    } finally {
      window.clearTimeout(timer);
    }
  };

  if (status.state === "sent") {
    return (
      <div ref={cardRef} className="contact-card" style={{ minHeight: heldHeight }}>
        <div ref={doneRef} className="contact-card__done" role="status" tabIndex={-1}>
          <h3 className="contact-card__title">Thank you.</h3>
          <p>Your message is on its way, and I'll get back to you soon.</p>
          <button
            type="button"
            className="contact-card__button"
            onClick={() => {
              resetRequested.current = true;
              setHeldHeight(undefined);
              setStatus({ state: "idle" });
            }}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  const sending = status.state === "sending";

  return (
    <div ref={cardRef} className="contact-card">
      <h3 className="contact-card__title">Get in touch</h3>

      <form className="contact-card__form" onSubmit={handleSubmit}>
        <div className="contact-card__field">
          <label htmlFor={`${id}-name`}>Name</label>
          <input
            ref={firstFieldRef}
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            maxLength={100}
            required
            value={fields.name}
            onChange={update("name")}
          />
        </div>

        <div className="contact-card__field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            maxLength={254}
            required
            value={fields.email}
            onChange={update("email")}
          />
        </div>

        <div className="contact-card__field">
          <label htmlFor={`${id}-organization`}>
            Organization <span className="contact-card__optional">(optional)</span>
          </label>
          <input
            id={`${id}-organization`}
            name="organization"
            type="text"
            autoComplete="organization"
            placeholder="Company or studio"
            maxLength={120}
            value={fields.organization}
            onChange={update("organization")}
          />
        </div>

        <div className="contact-card__field contact-card__field--select">
          <label htmlFor={`${id}-reason`}>Reason</label>
          <select
            id={`${id}-reason`}
            name="reason"
            required
            value={fields.reason}
            onChange={update("reason")}
            data-empty={fields.reason === "" || undefined}
          >
            <option value="" disabled>
              Select one
            </option>
            {REASONS.map((reason) => (
              <option key={reason}>{reason}</option>
            ))}
          </select>
          <Chevron />
        </div>

        <div className="contact-card__field">
          <label htmlFor={`${id}-message`}>Message</label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={3}
            placeholder="What are you working on?"
            maxLength={5000}
            required
            value={fields.message}
            onChange={update("message")}
          />
        </div>

        {/* Honeypot. Hidden from people and assistive tech, but a form-filling
            bot fills every field it finds, and the server drops anything that
            arrives with this one set. */}
        <div className="contact-card__trap" aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={fields.website}
            onChange={update("website")}
          />
        </div>

        <div className="contact-card__actions">
          <button type="submit" className="contact-card__button" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
        </div>

        {status.state === "error" && (
          <p className="contact-card__error" role="alert">
            {status.message || (
              <>
                Your message didn't send. Please try again, or email me at{" "}
                <a href={`mailto:${FALLBACK_EMAIL}`}>{FALLBACK_EMAIL}</a>.
              </>
            )}
          </p>
        )}
      </form>
    </div>
  );
}
