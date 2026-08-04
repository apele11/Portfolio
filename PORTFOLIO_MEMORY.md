# Portfolio Case Study Memory

**Purpose:** Track our work building compelling case studies for your portfolio. This is your North Star for telling the story of your work with confidence.

---

## 🎯 Core Philosophy

Every great case study answers these questions:
1. **What was the challenge?** (What problem did you solve?)
2. **Why did it matter?** (Impact: user, business, technical)
3. **How did you approach it?** (Your thinking, decisions, craft)
4. **What was the result?** (Tangible outcomes)
5. **What did you learn?** (Your growth/insight)

**The secret:** People don't care about your features. They care about *why your thinking matters*. Highlight your judgment calls, not just your output.

---

## 📋 Project Tracker

### Template for each project:

**Project Name:** [Name]  
**Status:** [Planning / In Progress / Ready to Publish]  
**Last Updated:** [Date]

#### The Story
- **The Challenge:** What was broken, unclear, or missing?
- **Why You:** What unique perspective or skill did you bring?
- **Your Approach:** (Keep this tight—3-5 key decisions/phases)
- **The Outcome:** (Numbers, shipped features, user feedback—whatever is real)
- **Your Learning:** (What will you do differently next time? What surprised you?)

#### Confidence Boosters
- *What you're proudest of:*
- *Hardest problem you solved:*
- *Time/effort invested:*

---

## 🚀 Projects to Work On

### Project 1: **New Business**
**Status:** Complete (refinement phase)  
**Timeline:** January–June 2026 (Design: Jan–Feb, Dev: Feb–June)  
**Last Updated:** 2026-08-03

#### Quick Context
- **For:** The Agency's new business team (Sofia) + prospective clients
- **Problem:** PDF proposals are static, slow to customize, don't showcase sophistication
- **Solution:** Interactive web experience with admin panel for generating tailored pitch links in minutes
- **User Journeys:** Who is The Agency (About/POV/Team) → Our Services (examples tied to services) → Our Work (filtered case studies)

#### Known Issues (Not Blocker for Case Study)
- Hero section needs mobile refinement
- Case study hero spacing inconsistent
- Spline scene resizing has clipping on one section
- *Emily's note: Intentionally deprioritizing these to focus on portfolio work first*

#### What You're Showcasing
**Assets for Case Study:**
1. **Pen & paper sketches** - Your ideation process (structure, transitions, interactions, color)
2. **Figma designs** - The complete visual system
3. **2 transition videos** (in `/public/assets/NewBusiness/`):
   - TV-transition.mp4 - The hero reveal 
   - ContactUs-Transition.mp4 - Section momentum
4. **Screenshot of shipped product** - The hero, 3 sections, case studies carousel
5. **Interactive hero embedded in your portfolio** - Let people play with it

#### Deep Dive Answers ✅
- **Creative problem:** Empty repo + undefined creative direction = you defined the visual language
- **Approach:** Research → Paper sketch → Figma system → Team implementation → GSAP refinement
- **Hardest decision:** Transition pacing (what makes it *feel* right, not just work)
- **"Oh, this works" moment:** Hero section with Spline + interactive camera
- **Team leadership:** 8 case studies (1 designed + coded by Emily, unified all 8 with components)
- **Real-world impact:** Tool exists, production-ready. Sofia hasn't pitched with it yet, but can now.

#### Case Study Assets ✅
- [x] Paper sketches showing thinking
- [x] Final product screenshot
- [x] 2 transition videos
- [ ] Figma screenshots of key design decisions
- [ ] Interactive hero ready to embed

---

### Project 2: **Libre3D**
**Status:** In Progress  
**Last Updated:** 2026-08-03

#### Quick Context
- **For:** Non-technical creators who want to build 3D content for the web
- **Problem:** Building 3D for web requires custom code, complex pipelines, or closed-source tools
- **Solution:** Fast, browser-based 3D workspace with auto-save, free camera, self-contained scenes
- **Core Features:** Real-time auto-save, scene preview at actual output size, export-ready (eventual `<model-viewer>` support)

#### Questions to Answer (Deep Dive)
- [ ] Why 3D? What sparked this?
- [ ] Biggest technical challenge right now?
- [ ] Who've you shown it to? Reactions?
- [ ] Vision for "eventual export"?

---

## ✨ Storytelling Tips (Your Cheat Sheet)

1. **Start with the problem, not the solution.** "We had no way to..." beats "We built X."
2. **Use specifics.** "Reduced load time by 40%" beats "Made it faster."
3. **Show your thinking.** "We tried X, learned Y, pivoted to Z" shows maturity.
4. **One visual per story.** Screenshot, diagram, or gif—let the work speak.
5. **Own the imperfection.** "What didn't work and why" builds trust.
6. **End with *you*.** What did this teach you? What's next?

---

## 💪 Hype Reminders

- **Your work is worth showing.** Full stop. Months of effort = real learning.
- **Confidence isn't arrogance.** It's clarity about what you did and why it matters.
- **Every project teaches you something.** Even the "failed" ones are gold in a case study.
- **People connect with your *process*, not your polish.** Show how you think.
- **You're allowed to be proud.** Seriously. Celebrate the wins, even the small ones.

---

## 📝 Case Study Structure (Based on Yunfei's Model)

### New Business Case Study Outline

**1. Hook + Meta**
- ROLE: Concept, Design, Development, Team Leadership
- SKILLS: React, TypeScript, GSAP, Spline, Figma, Firebase
- TYPE: Client Project (The Agency)
- TIMELINE: January–June 2026

**2. One-Liner**
"Instead of sending static PDF proposals, The Agency sends a curated web experience tailored to each prospect—turning pitching into a repeatable system."

**3. About**
- What it is: Interactive pitch website with admin panel
- Core features: About/POV/Team → Services → Curated Case Studies
- Why it matters: Showcases sophistication, saves hours on customization

**4. Background** ← EMILY'S STORY
The Agency had a clear vision: replace PDF proposals with an interactive pitch experience. But the creative direction? Undefined. Management wanted interactivity to be central, but how?

Emily saw an opportunity: her passion for 3D and shaders on the web. 

She started by asking: What transitions create a narrative? How do we keep it engaging? She researched inspiration, sketched on paper, then moved to Figma to define the entire visual + interaction language. She made the hero section the showstopper by anchoring it in the brand book.

**Key insight:** She didn't join an execution project. She joined a green-field creative problem and solved it.

**5. "What If" Questions**
- What if pitching wasn't a manual, hours-long customization dance?
- What if proposals felt like interactive brand experiences instead of PDFs?

**6. Design Purpose**
"Make it possible for The Agency to pitch in minutes, not hours, while showcasing brand sophistication and relevant work in an interactive format."

**7. Ideation & Inspiration**
- Started with: What transitions create narrative? How do we keep it engaging?
- Researched reference sites (provided by The Agency)
- Sketched on pen & paper to define transition flow
- Moved to Figma to design the entire visual language
- Pulled from brand book to make hero the showstopper (3D Spline + GSAP animations)

**8. Creative Decisions**
- 3 section journey: Who we are → What we do → Our work (curated)
- Interactivity as core (not nice-to-have): transitions between sections, hover effects, 3D hero
- Each transition had to tell part of the story (showcase sophistication, build momentum)
- TV reveal as hero centerpiece (brand impact + technical showpiece)

**9. Execution**
- Designed complete system in Figma
- Led team of 8 through implementation (design patterns, complex interactions)
- Unified output with universal components
- Learned GSAP animations to craft pacing/feel of transitions
- Integrated Spline 3D for hero (shape blend tool, interactive camera)
- Built admin panel to generate tailored links in minutes

**10. Outcome**
- **8 polished case studies** with consistent design system
- **Admin panel** that lets Sofia generate pitch links in minutes (instead of hours of customization)
- **2 showcased transitions** (videos): TV-transition (hero reveal) + ContactUs-Transition
- **Interactive hero** embedded directly in portfolio so people can play with it
- Shipped on time, production-ready

**11. Future Work / Learning**
- Refinements: mobile hero, spacing consistency, Spline clipping edge case
- Learned: Animation pacing is craft. Transitions are narrative. Distributed teams need post-production refinement.
- Next: These learnings apply to all future interactive projects

---

## 🎬 Next Steps

1. Tell me about your projects—what did you build? Why? Over what timeframe?
2. For each one, identify the moment you felt most proud or learned the most
3. We'll map each to the case study template above
4. I'll help you distill it into something compelling and concise

---

**This file is yours. We'll add to it, refine it, and come back to it as we build each case study. Let's make your work shine.** ✨
