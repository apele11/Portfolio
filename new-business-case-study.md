# NEW BUSINESS

Instead of PDF proposals, The Agency sends a curated web experience—one link, tailored to each prospect, ready in minutes.

## ROLE
Concept, Design Direction, Development, Team Leadership

## SKILLS
React, TypeScript, GSAP, Spline, Figma, 3D on Web

## TYPE
Internal Project (Lead)

## TIMELINE
Jan – June 2026

---

## ABOUT

The Agency at UF pitches to prospective clients to win new business. They were losing pitches to digitally-native agencies. The problem wasn't their work—it was how they presented it. Sending a PDF in 2026 signaled something dangerous: *we're not serious about web-first thinking*.

Every pitch also took days to customize. Pull case studies, reorder slides, rebuild the narrative for each prospect. It was unsustainable.

The goal was ambitious: replace PDFs with an interactive web experience. Prospects would click a link instead of opening a file. The presentation would adapt to what *they* care about—their industry, their needs. And it would *feel* like The Agency: premium, interactive, sophisticated. Proof that they understood digital.

The creative direction was undefined. Management knew interactivity had to be central, but the execution was wide open. That's where I came in.

---

## THE OPPORTUNITY

I arrived to an empty repository and a clear deliverable. That meant creative freedom.

I saw an opportunity to bring my passion for 3D and shaders on the web into this project. Instead of a traditional site, what if we built something that felt alive? Interactive. Animated. Something that showcased The Agency's sophistication not just through case studies, but through *how* you experienced them?

---

## THE APPROACH

### Research & Ideation

I started by asking: **What transitions create narrative? How do we build momentum and keep someone engaged as they scroll?**

I researched reference sites The Agency provided, looking for interaction patterns that felt premium without being gimmicky. Then I sketched on paper—defining the structure, the transitions between sections, the interaction model.

The paper sketch mapped it all out: a 3-section journey (Who we are → What we do → Our work), each section connected by intentional transitions. Every animation had a purpose.

### Design in Figma

I moved the sketch to Figma and built a complete visual system. The hero section became the anchor—the showstopper. I pulled from The Agency's brand book: vibrant gradients, dynamic shapes, a sense of motion even before you interact.

The design locked in:
- **Hero:** Full-screen interactive experience with 3D and GSAP animations
- **"What is The Agency":** Story-driven, introducing the team and POV
- **"Our Services":** Tied to relevant work examples
- **"Our Work":** Case studies, filterable by industry and service type in Admin Panel
- **Contact:** A final transition to close the loop

Every section transition was designed to guide the viewer, build momentum, and reinforce that this is not a static proposal—it's an experience.

---

## CREATIVE DECISIONS

**The Hero as Showstopper**  
The hero section needed to be unforgettable. I embedded a full-screen Spline 3D experience—the shape blend tool let me create organic, flowing forms that animated as you interacted with the camera. GSAP orchestrated the reveal: the video scales from a small frame to full-screen as you scroll, the TV overlay fades, and you're left with an immersive moment.

**Interactivity as Core, Not Nice-to-Have**  
Every transition serves a purpose. Scrolling down pushes the hero video to full screen. Moving to the next section reveals new content through choreographed animations. The "Our Work" section—originally a static grid in Figma—became an accordion that opens on hover. More interactivity. More color. More to discover.

**Transition Language**  
I obsessed over pacing. The TV reveal transition, the Contact section animation—these aren't just smooth. They're *intentional*. The timing, the easing, the delay between elements—every millisecond builds the feeling that this experience was crafted, not templated.

---

## EXECUTION

### Leading the Team

I designed the complete system in Figma, then led a team of 8 through implementation. Each team member owned a case study—designing and coding their section.

But distributed teams move at different speeds, and quality dipped. I stepped in: I designed and coded one complete case study myself, then built a universal component system to unify all 8.

The system works like this: base components (`CaseStudyHeader`, `CaseStudyContent`, `CaseStudyHero`, etc.) that accept props for color, content, animations, and layout. A centralized config (`CASE_STUDY_COLORS`) drives colors per case study. Each team member's design—different layouts, different color palettes, different image treatments—could be wired into the same components using props. No rewrites. Just configuration.

This meant: Team A's bold, minimalist design and Team B's image-heavy layout could both use the same spacing, animation timing, and interactive patterns. Consistency at scale.

### Learning GSAP

The animations are built on GSAP—specifically, scroll-driven timelines with scrub. Learning animation libraries felt intimidating at first, but I invested time in understanding not just *how* to make things move, but *why* the pacing matters. An animation that feels slow kills momentum. One that feels jerky breaks immersion.

I spent weeks tuning the transitions, testing scroll velocity, experimenting with easing curves. The TV hero reveal, the Contact section flow—these feel polished because I refused to settle for "it works."

### Integrating Spline

Learning Spline felt less daunting because of my prior experience in Maya and Figma. The shape blend tool opened up possibilities: organic, flowing 3D forms that animate smoothly. The hero camera interaction—free movement, responsive—required Spline expertise plus React integration.

### Shipping the Admin Tool

Sofia (new business lead) needed a way to generate tailored links in minutes, not hours of manual work. The admin panel lets her:
- Filter case studies by industry and service type
- Select which sections to include
- Generate a shareable link instantly

The admin panel was coded by my lead developer; I designed the UX and information architecture.

---

## THE OUTCOME

**8 polished case studies** with a unified design system.

**A production-ready admin tool** that reduced pitch creation time from hours (or days) to **minutes**. Sofia can now generate a tailored pitch link in under 5 minutes. What used to require customizing slides, pulling case studies, and rebuilding the narrative now takes a few clicks and a link share.

**An interactive web experience** that doesn't feel like a proposal. It feels like proof. Prospects click a link and immediately see: premium interactions, sophisticated design, 3D, thoughtful transitions. Before they read a single case study, they *know* The Agency understands digital-first thinking.

**[Experience the site →](https://new-biz-case-studies.vercel.app/presentation)**

The two transitions that best showcase this craftsmanship:
- **TV Transition:** The hero reveal—video scales from a small frame to full-screen, the overlay fades, you're immersed in an interactive 3D moment
- **Contact Transition:** Momentum building—each section flows into the next, reinforcing that this is an experience, not a deck

*(Videos embedded here)*

---

## WHAT CHANGED

The case studies section evolved during development. In Figma, it was a static grid—straightforward, clean. But when we started building, something felt off. A grid of case studies is expected. Boring. 

I redesigned it as an accordion that opens on hover: progressive disclosure, more interactivity, more color revealed as you explore. It matched the energy of the hero and reinforced the theme—interactivity isn't a luxury, it's how you engage someone.

*(Video: Accordion reveal on hover)*

---

## LEARNING

**Animation pacing is craft.** Every millisecond matters. The difference between a transition feeling premium and feeling jarring is often 100ms of easing or a delayed stagger.

**Leading distributed teams requires post-production refinement.** You can't expect perfect execution on the first pass. But you *can* unify the output with smart systems (universal components, design tokens).

**3D on web isn't scary—it's an opportunity.** Spline + React + GSAP opened doors. The hero interaction wouldn't be possible without 3D, and it's what makes people stop and engage.

**Interactivity is emotional.** The accordion reveal, the TV scale, the hover states—these aren't decorative. They tell people "something alive is happening here." That matters in a pitch.

---

## NEXT

Sofia can now pitch in minutes. The tool is production-ready, waiting whenever she needs it.

Refinements for next time: mobile optimization on the hero, case study spacing consistency, one Spline scene clipping issue. These are known, manageable—and intentionally deprioritized in favor of focusing on the portfolio.

Because here's what matters: The Agency now has a pitch system that feels like them.
