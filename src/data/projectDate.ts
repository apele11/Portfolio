// Formats a project's `date` field for the hero metadata.
//
// Firestore holds this as free text typed into the admin panel, so it arrives in
// whatever shape it was entered — "7/28/2026", "December 2025", "Aug - Dec, 2025".
// Everything is normalized to a three-character month and a four-digit year, and
// a range renders as "Aug 2025 – Dec 2025".
//
// Anything unparseable is returned untouched rather than blanked: a date the
// formatter does not recognise is still information, and losing it silently is
// worse than showing it in the shape it was typed.

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

/** A month and/or a year — either half can be missing before a range fills it in. */
interface DatePart {
  month?: number;
  year?: number;
}

/** Index for a full or abbreviated month name, or -1. */
function monthIndex(name: string): number {
  const key = name.slice(0, 3).toLowerCase();
  return MONTHS.findIndex((m) => m.toLowerCase() === key);
}

/**
 * A range separator has to be surrounded by whitespace. Without that rule the
 * hyphens inside "7-28-2026" would split it into three pieces.
 */
const RANGE = /\s+(?:-|–|—|to)\s+/i;

function parsePart(raw: string): DatePart | null {
  // Commas are decorative in these entries ("Aug - Dec, 2025"), so drop them.
  const s = raw.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  if (!s) return null;

  // "7/28/2026", "7-28-2026". Parsed by hand rather than through `new Date`,
  // which resolves a bare date string in local time — that rolls a first-of-the
  // month backwards into the previous month once it is read back out as UTC.
  const numeric = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/.exec(s);
  if (numeric) {
    const month = Number(numeric[1]) - 1;
    if (month >= 0 && month <= 11) return { month, year: Number(numeric[3]) };
  }

  // "2026-07-28", "2026-07"
  const iso = /^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/.exec(s);
  if (iso) {
    const month = Number(iso[2]) - 1;
    if (month >= 0 && month <= 11) return { month, year: Number(iso[1]) };
  }

  // "August 2025", "Aug 2025"
  const nameYear = /^([A-Za-z]+)\s+(\d{4})$/.exec(s);
  if (nameYear) {
    const month = monthIndex(nameYear[1]);
    if (month >= 0) return { month, year: Number(nameYear[2]) };
  }

  // A bare month — only meaningful as one end of a range, where the other end
  // supplies the year.
  const bareMonth = /^([A-Za-z]+)$/.exec(s);
  if (bareMonth) {
    const month = monthIndex(bareMonth[1]);
    if (month >= 0) return { month };
  }

  const bareYear = /^(\d{4})$/.exec(s);
  if (bareYear) return { year: Number(bareYear[1]) };

  return null;
}

function render(part: DatePart): string {
  const month = part.month !== undefined ? MONTHS[part.month] : "";
  const year = part.year !== undefined ? String(part.year) : "";
  return [month, year].filter(Boolean).join(" ");
}

/**
 * "Aug 2025 – Dec 2025" for a range, "Dec 2025" for a lone date.
 *
 * A lone date is incomplete by the hero's own convention — the metadata is meant
 * to read as a start and an end — but the start is not recoverable from the
 * document, so the one date that exists is rendered rather than invented.
 */
export function formatProjectDate(raw: string): string {
  const input = (raw ?? "").trim();
  if (!input) return "";

  const halves = input.split(RANGE);
  if (halves.length >= 2) {
    const start = parsePart(halves[0]);
    const end = parsePart(halves[halves.length - 1]);
    if (start && end) {
      // "Aug - Dec, 2025" writes the year once, on the end, but it governs both.
      if (start.year === undefined) start.year = end.year;
      if (end.year === undefined) end.year = start.year;
      const from = render(start);
      const to = render(end);
      if (from && to) return from === to ? from : `${from} – ${to}`;
    }
  }

  const single = parsePart(input);
  return single ? render(single) : input;
}

/** True when the field holds only one date, so the hero cannot show a range. */
export function isSingleDate(raw: string): boolean {
  const input = (raw ?? "").trim();
  return input.length > 0 && input.split(RANGE).length < 2;
}

/**
 * A range-shaped seed for a brand-new document. The hero's convention is a start
 * and an end, so a new project starts life in that shape rather than as a single
 * day that would have to be rewritten to satisfy it.
 */
export function defaultDateRange(now = new Date()): string {
  const stamp = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  return `${stamp} - ${stamp}`;
}
