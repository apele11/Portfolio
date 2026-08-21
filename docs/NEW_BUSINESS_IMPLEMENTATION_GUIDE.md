# New Business Case Studies — Implementation Guide

## Overview
This guide walks you through adding the 7 content sections to your New Business Case Studies project page. All sections use placeholders you can replace with actual assets.

---

## Section-by-Section Content Structure

### **SECTION 1: The Problem**
**Type:** Before/After Comparison  
**Layout:** Side-by-side images (desktop) / Stacked (mobile)  
**Time to implement:** ~30 min

#### Content Template
```
Section Title: "The Problem"
Content Type: "image-comparison"

Left Image (Before):
  - File: [PLACEHOLDER: screenshot-pdf-proposal.jpg]
  - Alt: "Traditional PDF proposal deck"
  - Caption: "Static, generic, slow to customize"

Right Image (After):
  - File: [PLACEHOLDER: screenshot-immersive-site.jpg]
  - Alt: "New Business immersive website"
  - Caption: "Tailored, dynamic, brand-aligned"

Supporting Text (one line):
  "Traditional proposals feel static. This one feels alive."
```

#### Placeholder Assets Needed
- `assets/new-business/01-problem-before.jpg` — Screenshot of generic PDF proposal
- `assets/new-business/01-problem-after.jpg` — Screenshot of immersive site hero

---

### **SECTION 2: The Solution**
**Type:** Featured Image + Secondary Image + Caption  
**Layout:** Hero image full-width, secondary image below  
**Time to implement:** ~30 min

#### Content Template
```
Section Title: "The Solution"
Content Type: "featured-dual-image"

Primary Visual (Hero):
  - File: [PLACEHOLDER: video-metablobs-hero.mp4]
  - Type: "video" (if available) OR "image"
  - Duration: 10-15 seconds if video
  - Fallback Image: [PLACEHOLDER: screenshot-hero-metablobs.jpg]

Secondary Visual:
  - File: [PLACEHOLDER: screenshot-admin-panel.jpg]
  - Alt: "Admin panel for filtering and link generation"

Caption (one line):
  "Tailored immersive experiences generated in minutes."
```

#### Placeholder Assets Needed
- `assets/new-business/02-solution-hero.mp4` — Video of metablobs (with fallback image)
- `assets/new-business/02-solution-admin.jpg` — Screenshot of admin panel

---

### **SECTION 3: The Experience**
**Type:** Three-Column Grid with Journey Cards  
**Layout:** 3 equal columns (desktop) / Carousel or stacked (mobile)  
**Time to implement:** ~45 min

#### Content Template
```
Section Title: "The Experience"
Content Type: "three-card-journey"

Card 1:
  - Title: "Who is The Agency"
  - Image: [PLACEHOLDER: screenshot-about-section.jpg]
  - Description: "About, POV, team — builds trust"

Card 2:
  - Title: "Our Services"
  - Image: [PLACEHOLDER: screenshot-services-section.jpg]
  - Description: "Service offerings tied to relevant case studies"

Card 3:
  - Title: "Our Work"
  - Image: [PLACEHOLDER: screenshot-work-grid.jpg]
  - Description: "Filtered case study grid tailored to prospect"
```

#### Placeholder Assets Needed
- `assets/new-business/03-journey-about.jpg` — Screenshot of About section
- `assets/new-business/03-journey-services.jpg` — Screenshot of Services section
- `assets/new-business/03-journey-work.jpg` — Screenshot of Work/case studies grid

---

### **SECTION 4: Key Moments**
**Type:** 4-Part Interactive Moment Showcase  
**Layout:** Grid, carousel, or sequential reveals  
**Time to implement:** ~90 min (includes 4 videos)

#### Content Template
```
Section Title: "Key Moments"
Content Type: "moment-gallery"

Moment 1: Interactive Metablobs
  - Order: 1
  - Title: "Interactive Metablobs"
  - Video: [PLACEHOLDER: video-metablobs-interaction.mp4]
  - Video Duration: 10-15 seconds
  - Screenshot Fallback: [PLACEHOLDER: screenshot-metablobs.jpg]
  - Caption: "Responsive visual elements that set a sophisticated tone immediately"

Moment 2: Contact Reveal
  - Order: 2
  - Title: "Contact Reveal"
  - Video: [PLACEHOLDER: video-contact-reveal.mp4]
  - Video Duration: 5-8 seconds
  - Screenshot Fallback: [PLACEHOLDER: screenshot-contact-reveal.jpg]
  - Caption: "Smooth reveal of contact info that respects focus on case studies"

Moment 3: Animated TV Transition
  - Order: 3
  - Title: "Animated TV Transition"
  - Video: [PLACEHOLDER: video-tv-transition.mp4]
  - Video Duration: 5-8 seconds
  - Screenshot Fallback: [PLACEHOLDER: screenshot-tv-transition.jpg]
  - Caption: "Motion effect between pages that maintains artistic integrity"

Moment 4: Navigation Dial
  - Order: 4
  - Title: "Navigation Dial"
  - Video: [PLACEHOLDER: video-navigation-dial.mp4]
  - Video Duration: 3-5 seconds
  - Screenshot Fallback: [PLACEHOLDER: screenshot-dial.jpg]
  - Caption: "Elegant interface for navigating custom case study pages"
```

#### Placeholder Assets Needed
- 4 videos (5-15 sec each) + 4 screenshot fallbacks
- See "Media Assets to Record" section below

---

### **SECTION 5: How We Built It**
**Type:** Text + Gallery + Tech Stack  
**Layout:** Paragraph, then 4-6 image gallery, then tech bullet points  
**Time to implement:** ~60 min

#### Content Template
```
Section Title: "How We Built It"
Content Type: "team-and-gallery"

Paragraph (Team Context):
  "Led a team of 8 designers/developers. You designed the presentation 
  page and navigation dial. Each team member created a custom case study 
  page (8 unique designs in parallel). First GSAP project—timeline 
  coordination and HTML/Spline overlay were the trickiest parts."

Gallery (Case Study Pages):
  - Title: "Custom Case Study Designs"
  - Type: "carousel" or "grid"
  - Images (4-6):
    1. [PLACEHOLDER: casestudy-01.jpg]
    2. [PLACEHOLDER: casestudy-02.jpg]
    3. [PLACEHOLDER: casestudy-03.jpg]
    4. [PLACEHOLDER: casestudy-04.jpg]
    5. [PLACEHOLDER: casestudy-05.jpg]
    6. [PLACEHOLDER: casestudy-06.jpg]

Tech Stack (Bullet List):
  - React (framework already in use)
  - GSAP (introduced for smooth animation choreography)
  - Spline (3D sophistication in hero)
  - Custom admin panel (filtering + link generation)
```

#### Placeholder Assets Needed
- `assets/new-business/05-casestudy-01.jpg` through `05-casestudy-06.jpg`
- Exported from Figma (see Media Assets section)

---

### **SECTION 6: Impact & Results**
**Type:** Image + Metrics Grid + Quote Card + Learnings  
**Layout:** Admin panel image (full-width or 60%), stats/quote beside it (40%)  
**Time to implement:** ~45 min

#### Content Template
```
Section Title: "Impact & Results"
Content Type: "impact-grid"

Primary Image:
  - File: [PLACEHOLDER: screenshot-admin-in-use.jpg]
  - Alt: "Admin panel generating tailored links"
  - Width: 60% (desktop) / 100% (mobile)

Metrics Section (Right side):
  Metric 1:
    - Label: "Time to Generate"
    - Value: "[PLACEHOLDER: X minutes]"
    - Context: "(vs. hours/days of manual design)"

  Metric 2:
    - Label: "Proposals Created"
    - Value: "[PLACEHOLDER: X+ prospects pitched]"

  Metric 3:
    - Label: "Reduction in Setup Time"
    - Value: "[PLACEHOLDER: 80%+ faster]"

Quote Card:
  - Author: "Sofia [Last Name]"
  - Role: "New Business Lead, The Agency"
  - Quote: "[PLACEHOLDER: Sofia's feedback on system impact]"
    Example: "Used to take me hours to generate tailored decks. 
    Now I can send a link in minutes. Prospects are impressed."

Learnings (Bullet List):
  - "[PLACEHOLDER: Learning 1 about GSAP]"
  - "[PLACEHOLDER: Learning 2 about HTML/Spline overlay]"
  - "[PLACEHOLDER: What you'd approach differently next time]"
```

#### Placeholder Assets Needed
- `assets/new-business/06-admin-screenshot.jpg`
- Real metrics from Sofia or usage data (replace placeholders)

---

### **SECTION 7: Closing**
**Type:** Full-screen Image + One-liner  
**Layout:** Hero image centered, caption below  
**Time to implement:** ~15 min

#### Content Template
```
Section Title: [OPTIONAL - might be no title for closing]
Content Type: "full-screen-hero"

Image:
  - File: [PLACEHOLDER: casestudy-hero-beautiful.jpg]
  - Alt: "One of the custom case study pages"
  - Size: Full viewport height (or 80vh)

Closing Statement (one line):
  "A repeatable system that impresses before the conversation even starts."
```

#### Placeholder Assets Needed
- `assets/new-business/07-closing-hero.jpg` — One beautiful case study page screenshot

---

## Media Assets Checklist

### **Images to Capture/Export** (~9 images)
- [ ] 01-problem-before.jpg — PDF proposal screenshot
- [ ] 01-problem-after.jpg — Immersive site hero screenshot
- [ ] 02-solution-hero.jpg — Hero with metablobs (fallback for video)
- [ ] 02-solution-admin.jpg — Admin panel screenshot
- [ ] 03-journey-about.jpg — About section
- [ ] 03-journey-services.jpg — Services section
- [ ] 03-journey-work.jpg — Work/case studies grid
- [ ] 06-admin-screenshot.jpg — Admin in use
- [ ] 07-closing-hero.jpg — Beautiful case study page

### **Case Study Page Images to Export from Figma** (~4-6 images)
- [ ] casestudy-01.jpg
- [ ] casestudy-02.jpg
- [ ] casestudy-03.jpg
- [ ] casestudy-04.jpg
- [ ] casestudy-05.jpg
- [ ] casestudy-06.jpg

**How to export:**
1. Open Figma file for each case study
2. Select the frame
3. Right-click → Export → Choose high resolution (2x or 3x)
4. Save with naming convention: `casestudy-[number].jpg`

### **Videos to Record** (~4 videos, ~30-45 min total)
- [ ] video-metablobs-interaction.mp4 (10-15 sec)
- [ ] video-contact-reveal.mp4 (5-8 sec)
- [ ] video-tv-transition.mp4 (5-8 sec)
- [ ] video-navigation-dial.mp4 (3-5 sec)

**How to record:**
1. Use screen recording tool (OBS, ScreenFlow, Loom, Chrome DevTools)
2. Record interactions on live site
3. Trim to exact duration
4. Export as MP4, max 20MB per video
5. Save with naming convention above

---

## How to Add Sections to Admin Panel

### **Step 1: Navigate to Admin**
1. Go to `http://localhost:5173/admin`
2. Find the "New Business Case Studies" project
3. Click "Edit"

### **Step 2: Scroll to "Content Sections"**
You'll see an "Add Section" button

### **Step 3: Click "Add Section"**
This opens a form where you define:
- **Section Type** — Choose from: "image-comparison", "featured-dual-image", "three-card-journey", "moment-gallery", "team-and-gallery", "impact-grid", "full-screen-hero"
- **Title** — e.g., "The Problem", "The Solution"
- **Content** — JSON or individual fields (depends on implementation)

### **Step 4: Fill in Content**
For each section, you'll fill in:
- Image URLs or upload files
- Video URLs
- Text/captions
- Metadata (alt text, descriptions)

**Example for Section 1 (The Problem):**
```
Title: "The Problem"
Type: "image-comparison"

Left Image URL: [paste URL or upload file]
Left Caption: "Static, generic, slow to customize"

Right Image URL: [paste URL or upload file]
Right Caption: "Tailored, dynamic, brand-aligned"

Supporting Text: "Traditional proposals feel static. This one feels alive."
```

### **Step 5: Save**
Click "Save Project" at the bottom of the form

---

## Content Type Reference

### **image-comparison**
Best for: Before/after, side-by-side comparisons
- Left image + caption
- Right image + caption
- Optional supporting text below
- Responsive: side-by-side (desktop), stacked (mobile)

### **featured-dual-image**
Best for: Main image + supporting image showcase
- Primary image (large, full-width)
- Secondary image (medium, below)
- Caption for each
- Optional: Video instead of primary image

### **three-card-journey**
Best for: Three equal-weight sections or journeys
- 3 card components
- Each: image + title + description
- Responsive: 3 columns (desktop), carousel/stacked (mobile)

### **moment-gallery**
Best for: Showcasing 4+ interactive moments
- Multiple "moment" cards
- Each: video + screenshot fallback + title + caption
- Layout: Grid or carousel
- Auto-plays videos on hover (optional)

### **team-and-gallery**
Best for: Narrative + image gallery combination
- Opening paragraph (text)
- Image gallery (4-6 images)
- Bullet point list below
- Gallery layout: Carousel or grid

### **impact-grid**
Best for: Image + metrics + quote combination
- Primary image (left/top)
- Metrics section (right/bottom) — stat boxes
- Quote card
- Learnings bullets
- Responsive: side-by-side (desktop), stacked (mobile)

### **full-screen-hero**
Best for: Impactful closing or opening images
- Full-viewport image
- Caption/text overlay or below
- Minimal, powerful layout

---

## File Organization

Recommended asset folder structure:
```
Portfolio/
├── public/
│   └── assets/
│       └── new-business/
│           ├── 01-problem-before.jpg
│           ├── 01-problem-after.jpg
│           ├── 02-solution-hero.jpg
│           ├── 02-solution-admin.jpg
│           ├── 03-journey-about.jpg
│           ├── 03-journey-services.jpg
│           ├── 03-journey-work.jpg
│           ├── 04-moment-metablobs.mp4
│           ├── 04-moment-contact.mp4
│           ├── 04-moment-transition.mp4
│           ├── 04-moment-dial.mp4
│           ├── 04-screenshot-metablobs.jpg
│           ├── 04-screenshot-contact.jpg
│           ├── 04-screenshot-transition.jpg
│           ├── 04-screenshot-dial.jpg
│           ├── 05-casestudy-01.jpg
│           ├── 05-casestudy-02.jpg
│           ├── ... (up to 06)
│           ├── 06-admin-screenshot.jpg
│           └── 07-closing-hero.jpg
```

---

## Next Steps

1. **Export Figma files** — Get the 4-6 case study page screenshots
2. **Record videos** — Screen capture the 4 key moments
3. **Create placeholders** — Use the templates above to structure each section
4. **Add to admin** — Go through each section and enter content
5. **Review & refine** — Check mobile responsiveness, video loading, image quality
6. **Deploy** — Run `npm run build` and test in production

---

## Questions?

If you need to add a new content type or modify the structure, update the project schema in `src/types/project.ts` and add the corresponding component in `src/components/ProjectSections/`.
