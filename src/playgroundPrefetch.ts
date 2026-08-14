import { PLAYGROUND_ITEMS } from "./data/playground";

// The playground embeds live on a different origin (GitHub Pages) and pull their
// own Three.js build, so they cost ~1s to come up cold. Warming them before the
// user navigates hides most of that.

let embedsWarmed = false;
let routeWarmed = false;

/** Respect metered/slow connections — a preview embed is not worth someone's data. */
function shouldSkip(): boolean {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}

/**
 * Loads each embed once in an offscreen iframe to fill the HTTP cache, then
 * removes it.
 *
 * The teardown is the point. An earlier version left these iframes mounted for
 * the lifetime of the home page, which meant a second live WebGL context
 * rendering at 1x1 forever, competing with the hero shader for the GPU. Pulling
 * the iframe once it has loaded keeps everything it fetched in the cache while
 * stopping its render loop.
 */
export function warmPlaygroundEmbeds(): void {
  if (embedsWarmed || shouldSkip()) return;
  embedsWarmed = true;

  const urls = PLAYGROUND_ITEMS.filter(
    (item) => item.type === "iframe" && item.embedUrl
  ).map((item) => item.embedUrl as string);

  for (const url of urls) {
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.setAttribute("tabindex", "-1");
    frame.style.cssText =
      "position:fixed;left:-9999px;top:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none";

    let removed = false;
    const remove = () => {
      if (removed) return;
      removed = true;
      frame.remove();
    };

    // `load` fires once subresources are in. Give it a beat for anything the
    // demo fetches during its own init, then stop it rendering.
    frame.addEventListener("load", () => setTimeout(remove, 1200));
    // Safety net: never leave one of these running if `load` never fires.
    setTimeout(remove, 15000);

    frame.src = url;
    document.body.appendChild(frame);
  }
}

/** Pull the lazily-split /playground route chunk ahead of the click. */
export function prefetchPlaygroundRoute(): void {
  if (routeWarmed) return;
  routeWarmed = true;
  void import("./playground/page");
}

/** Both warms, for use on a real intent signal like hovering the nav link. */
export function prefetchPlayground(): void {
  prefetchPlaygroundRoute();
  warmPlaygroundEmbeds();
}
