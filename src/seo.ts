/**
 * Per-route document metadata.
 *
 * `index.html` ships the home page's tags. That is correct for the first paint
 * and for the URL every non-JS scraper actually fetches — but Firebase rewrites
 * *every* path to that same file, so without this hook `/about` and each case
 * study serve the home page's title, description, and, worst of all, its
 * canonical. `rel="canonical"` is a directive: pointing every project page at
 * `/` tells Google those URLs are duplicates of the home page and should not be
 * indexed on their own.
 *
 * Scope, so this is not mistaken for more than it is: this runs in the browser,
 * so it reaches crawlers that execute JavaScript (Googlebot) and nothing else.
 * LinkedIn, Slack, X and the rest read the raw HTML and will keep seeing the
 * home card for every URL until the site is prerendered. The og: tags are set
 * here anyway because Google reads them from the rendered DOM.
 */
import { useEffect } from "react";

export const SITE_URL = "https://emilyapel.com";

export const SITE_TITLE = "Emily Apel — Experience Designer & Creative Technologist";
export const SITE_DESCRIPTION =
  "Immersive web experiences by Emily Apel — WebGL, React, and design systems. Case studies in product design, front-end engineering, and creative technology.";

const DEFAULT_IMAGE = "/og-image.jpg";

export interface Seo {
  title: string;
  description: string;
  /** Route path, e.g. "/" or "/projects/123". Made absolute for canonical/og. */
  path: string;
  /** Absolute URL or site-relative path. Defaults to the shared social card. */
  image?: string;
}

/** Scrapers do not resolve relative paths against the page they came from. */
const absolute = (pathOrUrl: string) =>
  /^https?:\/\//.test(pathOrUrl)
    ? pathOrUrl
    : `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;

/** Descriptions are truncated on a word boundary; search engines cut ~160 chars. */
export function clampDescription(text: string, limit = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.—-]$/, "")}…`;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attribute, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

export function useSeo({ title, description, path, image = DEFAULT_IMAGE }: Seo) {
  useEffect(() => {
    const url = absolute(path);
    const imageUrl = absolute(image);

    document.title = title;
    setMeta("name", "description", description);
    setCanonical(url);

    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", imageUrl);

    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", imageUrl);
  }, [title, description, path, image]);
}
