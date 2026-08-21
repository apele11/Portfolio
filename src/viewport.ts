import { useEffect, useState } from "react";

/**
 * `100svh` — the *small* viewport height, i.e. the height with a mobile URL bar
 * showing.
 *
 * Full-screen panels measured in `vh` get cut off on a phone, because `vh`
 * resolves to the *largest* viewport (bar hidden) and the bar is showing when
 * the page loads. `dvh` fits but retargets as the bar slides away, reflowing
 * every panel on the page mid-scroll. `svh` fits and never changes; the strip
 * the bar later vacates is left to the fixed shader canvas behind everything.
 */
export const VIEWPORT_HEIGHT =
  typeof CSS !== "undefined" && CSS.supports?.("height", "100svh") ? "100svh" : "100vh";

const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Tracks the mobile breakpoint from React.
 *
 * The home page's hero and project panels build their styles as inline objects,
 * which no CSS media query can override — inline wins on specificity — so the
 * breakpoint has to be a value the components can read rather than a stylesheet.
 */
export function useIsMobile(query: string = MOBILE_QUERY): boolean {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setIsMobile(mql.matches);
    onChange();

    // `resize` as well as the query's own event: the two are redundant in a
    // normal browser, but a viewport changed out from under the page — devtools
    // device emulation, a remote debugging session — can move the breakpoint
    // without delivering a change event, and then the layout is simply stuck.
    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [query]);

  return isMobile;
}
