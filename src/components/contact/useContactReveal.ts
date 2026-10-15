import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollToPosition } from "../../smoothScroll";

/*
 * Geometry of src/svg/ea-monogram.svg, in its viewBox units. The mask is sized
 * and placed in pixels every frame rather than in percentages, because the
 * dive has to aim at a specific stroke and a percentage can only aim at a
 * fraction of the box.
 */
const MARK_W = 1117;
const MARK_H = 1062;

/**
 * The E's upright, the thickest stroke in the mark: solid from its top edge to
 * its bottom edge and 168 units wide. The dive aims here because the zoom only
 * ends with the viewport covered if it lands inside a stroke. Aimed at the
 * centre of the mark, it lands in the gap between the E and the A and fills
 * the screen with paper.
 */
const STEM_X = 84;
const STEM_W = 168;

/** Phases, as fractions of the scroll through the section. */
const GROW = [0, 0.26] as const; // the mark scales up from a speck
const DIVE = [0.34, 0.62] as const; // the camera finds the E and dives through it
// Starts as the dive ends, not before: the scrim laid over paper reads as a grey smudge.
const REVEAL = [0.61, 0.71] as const; // scrim and heading fade in over the shader
const SPLIT = [0.74, 0.9] as const; // the heading parts...
// ...and the card rises into the gap, late enough that the halves have mostly
// cleared it. Any earlier and the text visibly crosses a half-faded card.
const ENTER = [0.84, 0.99] as const;

/** The mark at rest, as a fraction of whichever panel dimension binds first. */
const HOLD_HEIGHT = 0.5;
const HOLD_WIDTH = 0.62;
/** The mark's starting size, relative to its resting size. */
const START_RATIO = 0.18;
/** How far past the panel edges the stem reaches when the dive ends. */
const OVERSCAN = 1.15;
/** Clear space between the card and each half of the heading, px. */
const SPLIT_PAD = 40;
/** Margin the halves need from the panel edge to sit beside the card at all, px. */
const SPLIT_EDGE = 24;
/** How far below its resting place the card starts, px. */
const CARD_RISE = 150;
/**
 * Seconds for the drawn state to catch up to the scroll position. Lenis already
 * eases the wheel, but keyboard and scrollbar scrolling arrive as jumps, and a
 * mask jumping from 9% to full screen in one frame reads as a glitch.
 */
const SMOOTHING = 0.12;

const easeGrow = gsap.parseEase("power2.out");
const easeZoom = gsap.parseEase("power1.in");
const easeGlide = gsap.parseEase("power2.out");
const easeSplit = gsap.parseEase("power2.inOut");
const easeEnter = gsap.parseEase("power2.out");
const clamp01 = gsap.utils.clamp(0, 1);

const segment = (p: number, [from, to]: readonly [number, number]) => clamp01((p - from) / (to - from));

/**
 * Scroll-driven reveal for the contact section: an EA-shaped hole in the paper
 * grows to show the hero shader behind it, dives through the E until the paper
 * is gone, then the heading splits around the form card.
 *
 * The paper's mask is two layers composited with `exclude`: the monogram, and
 * a full-size block. What survives is everything except the letters. Only the
 * first layer is sized and placed here; the block stays at 100%.
 *
 * Progress is read from the section's own bounding rect every frame instead of
 * through ScrollTrigger. ScrollTrigger caches its start and end at refresh, and
 * the page above this section changes height after mount: the project grid is
 * seeded from the build snapshot, then the live Firestore read can add or drop
 * whole screen-high panels. Cached positions would drift; the rect is always
 * current.
 */
export function useContactReveal(enabled: boolean) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);
  const tailRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current;
    const panel = panelRef.current;
    const mask = maskRef.current;
    const content = contentRef.current;
    const heading = headingRef.current;
    const lead = leadRef.current;
    const tail = tailRef.current;
    const card = cardRef.current;
    if (!section || !panel || !mask || !content || !heading || !lead || !tail || !card) return;

    let vw = 0;
    let vh = 0;
    // Mark scale in px per viewBox unit: at the start, at rest, and at the end of the dive.
    let startScale = 0;
    let holdScale = 0;
    let endScale = 0;
    // Which way the heading parts, and how far each half travels.
    let axis: "x" | "y" = "x";
    let leadTravel = 0;
    let tailTravel = 0;

    const measure = () => {
      vw = panel.clientWidth;
      vh = panel.clientHeight;
      holdScale = Math.min((HOLD_HEIGHT * vh) / MARK_H, (HOLD_WIDTH * vw) / MARK_W);
      startScale = holdScale * START_RATIO;
      endScale = OVERSCAN * Math.max(vw / STEM_W, vh / MARK_H);

      // Side by side when each half fits in the space beside the card,
      // otherwise one above and one below it. Per side rather than in total,
      // because the card is centred and the wider half has to fit in half of
      // what is left. Offsets ignore transforms, so every read here is the
      // resting layout no matter how far the split has run.
      const cardW = card.offsetWidth;
      const cardH = card.offsetHeight;
      const side = (vw - cardW) / 2 - SPLIT_PAD - SPLIT_EDGE;
      const sideBySide = Math.max(lead.offsetWidth, tail.offsetWidth) <= side;
      axis = sideBySide ? "x" : "y";
      heading.dataset.axis = axis;

      if (axis === "x") {
        const leadInner = heading.offsetLeft + lead.offsetLeft + lead.offsetWidth;
        const tailInner = heading.offsetLeft + tail.offsetLeft;
        leadTravel = leadInner - (vw / 2 - cardW / 2 - SPLIT_PAD);
        tailTravel = vw / 2 + cardW / 2 + SPLIT_PAD - tailInner;
      } else {
        const leadInner = heading.offsetTop + lead.offsetTop + lead.offsetHeight;
        const tailInner = heading.offsetTop + tail.offsetTop;
        leadTravel = leadInner - (vh / 2 - cardH / 2 - SPLIT_PAD);
        tailTravel = vh / 2 + cardH / 2 + SPLIT_PAD - tailInner;
      }
    };

    let covered = false;
    let navOverShader = false;
    let cardLive = true;

    const apply = (p: number) => {
      const cx = vw / 2;
      const cy = vh / 2;
      const dive = segment(p, DIVE);

      // The mark's scale and its top-left corner on the panel.
      let scale: number;
      let left: number;
      if (dive <= 0) {
        // Interpolated in log space, so the growth reads as a steady zoom
        // rather than one that rushes at the start and crawls at the end.
        scale = startScale * Math.pow(holdScale / startScale, easeGrow(segment(p, GROW)));
        left = cx - (MARK_W / 2) * scale;
      } else {
        scale = holdScale * Math.pow(endScale / holdScale, easeZoom(dive));
        // The stem glides from where it sits in the resting mark to the centre
        // of the panel, mostly early, so the camera finds the E and then dives.
        const stemFrom = cx + (STEM_X - MARK_W / 2) * holdScale;
        const stemX = stemFrom + (cx - stemFrom) * easeGlide(dive);
        left = stemX - STEM_X * scale;
      }
      const top = cy - (MARK_H / 2) * scale;

      // Once the stem spans the panel there is no paper left on screen, so the
      // paper is hidden outright. The image is identical, and the compositor
      // stops re-rasterising a mask several times the size of the screen on
      // every frame.
      const nowCovered = dive >= 1;
      if (nowCovered !== covered) {
        covered = nowCovered;
        mask.toggleAttribute("data-covered", covered);
      }
      if (!covered) {
        const size = `${MARK_W * scale}px ${MARK_H * scale}px, 100% 100%`;
        const position = `${left}px ${top}px, 0 0`;
        mask.style.setProperty("-webkit-mask-size", size);
        mask.style.setProperty("mask-size", size);
        mask.style.setProperty("-webkit-mask-position", position);
        mask.style.setProperty("mask-position", position);
      }

      // The nav inks itself dark over paper. Once the stem spans the full width
      // there is only shader under it, so the marker comes off.
      const stemLeft = left + (STEM_X - STEM_W / 2) * scale;
      const stemRight = left + (STEM_X + STEM_W / 2) * scale;
      const nowOverShader = dive > 0 && stemLeft <= 0 && stemRight >= vw;
      if (nowOverShader !== navOverShader) {
        navOverShader = nowOverShader;
        if (navOverShader) section.removeAttribute("data-nav-ink");
        else section.setAttribute("data-nav-ink", "dark");
      }

      content.style.opacity = String(segment(p, REVEAL));

      const split = easeSplit(segment(p, SPLIT));
      lead.style.transform =
        axis === "x" ? `translate3d(${-split * leadTravel}px, 0, 0)` : `translate3d(0, ${-split * leadTravel}px, 0)`;
      tail.style.transform =
        axis === "x" ? `translate3d(${split * tailTravel}px, 0, 0)` : `translate3d(0, ${split * tailTravel}px, 0)`;

      const enter = easeEnter(segment(p, ENTER));
      card.style.opacity = String(enter);
      card.style.transform = `translate3d(0, ${(1 - enter) * CARD_RISE}px, 0) scale(${0.8 + 0.2 * enter})`;
      // A half-faded card should not swallow clicks meant for the page.
      const nowLive = enter > 0.5;
      if (nowLive !== cardLive) {
        cardLive = nowLive;
        card.style.pointerEvents = cardLive ? "" : "none";
      }
    };

    let target = 0;
    let current = -1;

    const read = () => {
      const rect = section.getBoundingClientRect();
      const range = rect.height - panel.offsetHeight;
      target = range > 0 ? clamp01(-rect.top / range) : 1;
    };

    const tick = (_time: number, deltaMs: number) => {
      read();
      const previous = current;
      if (current < 0) {
        current = target;
      } else {
        current += (target - current) * (1 - Math.exp(-deltaMs / 1000 / SMOOTHING));
        if (Math.abs(target - current) < 1e-4) current = target;
      }
      if (current !== previous) apply(current);
    };

    // A keyboard user tabbing into the form would otherwise land on fields
    // that are still invisible. Jump to the end of the reveal, where the card
    // is fully in place, and draw that state immediately.
    const onFocusIn = () => {
      if (current >= ENTER[1]) return;
      const end = window.scrollY + section.getBoundingClientRect().top + section.offsetHeight - panel.offsetHeight;
      scrollToPosition(end, false);
      read();
      current = target;
      apply(current);
    };

    const remeasure = () => {
      measure();
      apply(Math.max(current, 0));
    };

    measure();
    read();
    current = target;
    apply(current);

    // Fonts, a resized window, and the card's own status changes all move the
    // geometry the split is computed from.
    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(panel);
    resizeObserver.observe(heading);
    resizeObserver.observe(card);

    // The ticker runs only while the section is near the viewport.
    let ticking = false;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !ticking) gsap.ticker.add(tick);
        else if (!entry.isIntersecting && ticking) gsap.ticker.remove(tick);
        ticking = entry.isIntersecting;
      },
      { rootMargin: "25% 0px" }
    );
    visibility.observe(section);

    section.addEventListener("focusin", onFocusIn);

    return () => {
      gsap.ticker.remove(tick);
      visibility.disconnect();
      resizeObserver.disconnect();
      section.removeEventListener("focusin", onFocusIn);
    };
  }, [enabled]);

  return { sectionRef, panelRef, maskRef, contentRef, headingRef, leadRef, tailRef, cardRef };
}
