# Section Components Integration Guide

## Overview

I've built 7 reusable React components for displaying project content sections. Each component is visual-first and responsive.

## File Structure

```
src/components/ProjectSections/
├── ImageComparison.tsx          // Side-by-side image comparison
├── ImageComparison.css
├── FeaturedDualImage.tsx        // Large image + secondary image
├── FeaturedDualImage.css
├── ThreeCardJourney.tsx         // 3-column card layout
├── ThreeCardJourney.css
├── MomentGallery.tsx            // Grid of moments with videos
├── MomentGallery.css
├── TeamAndGallery.tsx           // Text + carousel gallery
├── TeamAndGallery.css
├── ImpactGrid.tsx               // Image + metrics + quote
├── ImpactGrid.css
├── FullScreenHero.tsx           // Full-viewport hero image
├── FullScreenHero.css
├── ProjectSectionRenderer.tsx   // Main router component
├── ProjectSections.css          // Shared & fallback styles
└── index.tsx                    // Exports
```

## How to Use

### Step 1: Import the Renderer

In your project detail page component (e.g., `src/projects/page.tsx`), import:

```typescript
import { ProjectSectionRenderer } from "../components/ProjectSections";
```

### Step 2: Render Sections

Loop through the project's sections and render them:

```typescript
import { ProjectDetail } from "../types/project";
import { ProjectSectionRenderer } from "../components/ProjectSections";

interface ProjectPageProps {
  project: ProjectDetail;
}

export function ProjectPage({ project }: ProjectPageProps) {
  return (
    <div>
      {/* Hero section, etc. */}
      
      <div className="project-sections">
        {project.sections.map((section, index) => (
          <ProjectSectionRenderer key={section.id || index} section={section} />
        ))}
      </div>
    </div>
  );
}
```

### Step 3: Add CSS Import

In your page component, import the shared styles:

```typescript
import "../components/ProjectSections/ProjectSections.css";
```

## Component Reference

### 1. ImageComparison
**For:** Before/after comparisons, side-by-side contrasts

**Required Data:**
```typescript
{
  type: "image-comparison",
  content: {
    leftImage: "url-to-left-image.jpg",
    leftCaption: "Before: Static PDF proposal",
    rightImage: "url-to-right-image.jpg",
    rightCaption: "After: Immersive web experience",
    supportingText: "Optional one-liner explaining the comparison"
  }
}
```

**Layout:** 
- Desktop: 2 columns side-by-side
- Mobile: Stacked vertically

---

### 2. FeaturedDualImage
**For:** Showcasing a primary visual + secondary supporting image

**Required Data:**
```typescript
{
  type: "featured-dual-image",
  content: {
    primaryImage: "url-to-hero-image.jpg",
    primaryVideo: "url-to-video.mp4", // Optional: if provided, plays video with image as fallback
    primaryFallback: "url-to-fallback.jpg", // Shown if video isn't playing
    secondaryImage: "url-to-secondary.jpg",
    secondaryAlt: "Alt text for secondary image",
    caption: "One-liner caption for the whole section"
  }
}
```

**Features:**
- Video playback with click-to-play (shows fallback image until clicked)
- Smooth autoplay loop
- Responsive layout

---

### 3. ThreeCardJourney
**For:** Three equal-weight concepts (e.g., user journeys, features, sections)

**Required Data:**
```typescript
{
  type: "three-card-journey",
  content: {
    cards: [
      {
        title: "Journey 1: Who is The Agency",
        image: "url-to-image-1.jpg",
        description: "About, POV, team — builds trust"
      },
      {
        title: "Journey 2: Our Services",
        image: "url-to-image-2.jpg",
        description: "Service offerings tied to case studies"
      },
      {
        title: "Journey 3: Our Work",
        image: "url-to-image-3.jpg",
        description: "Filtered case study grid"
      }
    ]
  }
}
```

**Layout:**
- Desktop: 3 equal columns
- Tablet: 2 columns
- Mobile: 1 column (stacked)

---

### 4. MomentGallery
**For:** Showcasing interactive moments or key features (up to 4+)

**Required Data:**
```typescript
{
  type: "moment-gallery",
  content: {
    moments: [
      {
        order: 1,
        title: "Interactive Metablobs",
        video: "url-to-video-1.mp4",
        screenshot: "url-to-screenshot-1.jpg", // Fallback before video plays
        caption: "Responsive visual elements that set a sophisticated tone",
        duration: 12 // seconds (optional, informational)
      },
      {
        order: 2,
        title: "Contact Reveal",
        video: "url-to-video-2.mp4",
        screenshot: "url-to-screenshot-2.jpg",
        caption: "Smooth reveal that respects focus on content",
        duration: 7
      }
      // ... more moments
    ]
  }
}
```

**Features:**
- Lazy video loading (plays only when clicked)
- Auto-loop after video ends
- Click to play overlay
- Responsive grid (2 columns desktop, 1 mobile)

---

### 5. TeamAndGallery
**For:** Narrative text + image carousel + tech stack list

**Required Data:**
```typescript
{
  type: "team-and-gallery",
  content: {
    paragraph: "Led a team of 8 designers/developers. Each person created a custom case study page...",
    galleryTitle: "Custom Case Study Designs",
    caseStudies: [
      "url-to-casestudy-1.jpg",
      "url-to-casestudy-2.jpg",
      "url-to-casestudy-3.jpg",
      "url-to-casestudy-4.jpg",
      // ... up to N images
    ],
    techStack: [
      "React (framework already in use)",
      "GSAP (introduced for smooth animation choreography)",
      "Spline (3D sophistication in hero)",
      "Custom admin panel (filtering + link generation)"
    ]
  }
}
```

**Features:**
- Multi-line paragraph text
- Image carousel with prev/next buttons
- Indicator dots for jumping to specific slide
- Tech stack bullet list at bottom
- Mobile-friendly carousel controls

---

### 6. ImpactGrid
**For:** Showcase impact with image + metrics + quote + learnings

**Required Data:**
```typescript
{
  type: "impact-grid",
  content: {
    image: "url-to-admin-screenshot.jpg",
    metrics: [
      {
        label: "Time to Generate",
        value: "Minutes",
        context: "vs. hours/days of manual design"
      },
      {
        label: "Proposals Created",
        value: "10+",
        context: "prospects pitched"
      },
      {
        label: "Reduction in Setup Time",
        value: "80%",
        context: "faster turnaround"
      },
      {
        label: "Repeat Use",
        value: "✓",
        context: "repeatable system"
      }
    ],
    quote: {
      author: "Sofia",
      role: "New Business Lead, The Agency",
      quote: "Used to take me hours to generate tailored decks. Now I can send a link in minutes."
    },
    learnings: [
      "GSAP timeline coordination was complex but worth it for polish",
      "HTML/Spline overlay required careful event handling",
      "Would start with this architecture in mind next time"
    ]
  }
}
```

**Layout:**
- Desktop: Image left (60%), content right (40%)
- Mobile: Stacked vertically
- Metrics in 2-column grid on desktop

---

### 7. FullScreenHero
**For:** Impactful closing images or hero moments

**Required Data:**
```typescript
{
  type: "full-screen-hero",
  content: {
    image: "url-to-hero-image.jpg",
    caption: "A repeatable system that impresses before the conversation even starts.",
    alt: "Beautiful case study page screenshot"
  }
}
```

**Layout:**
- Full-width, height-constrained to 80vh
- Responsive to mobile (50vh max)
- Caption centered below

---

## How to Add Sections via Admin Panel

1. Navigate to `/admin` on your dev server
2. Find "New Business Case Studies" project
3. Click "Edit"
4. Scroll to "Content Sections"
5. Click "Add Section"
6. Fill in:
   - **Title:** Section name (optional, used for reference)
   - **Type:** Choose from dropdown (e.g., "image-comparison", "featured-dual-image", etc.)
   - **Content:** JSON object matching the schema above

### Example Admin Panel Entry for Section 1:

```
Title: The Problem
Type: image-comparison
Content (as JSON):
{
  "leftImage": "https://example.com/pdf-proposal.jpg",
  "leftCaption": "Static, generic, slow to customize",
  "rightImage": "https://example.com/immersive-site.jpg",
  "rightCaption": "Tailored, dynamic, brand-aligned",
  "supportingText": "Traditional proposals feel static. This one feels alive."
}
```

7. Click "Save Project"

## Data Types (TypeScript)

All section data types are defined in `src/types/project.ts`:

```typescript
// Section types
export interface ImageComparisonSection extends ProjectSection { ... }
export interface FeaturedDualImageSection extends ProjectSection { ... }
export interface ThreeCardJourneySection extends ProjectSection { ... }
export interface MomentGallerySection extends ProjectSection { ... }
export interface TeamAndGallerySection extends ProjectSection { ... }
export interface ImpactGridSection extends ProjectSection { ... }
export interface FullScreenHeroSection extends ProjectSection { ... }

// Nested types
export interface CardJourney { ... }
export interface Moment { ... }
export interface ImpactMetric { ... }
export interface ImpactQuote { ... }
```

## Styling & Customization

Each component imports its own CSS file. Shared styles are in `ProjectSections.css`.

### Color Palette
Components use CSS variables and inherit from your global color scheme:
- Text: `rgba(255, 255, 255, 0.85)` for body, `#fff` for headings
- Accents: Adapt to your Agency brand colors
- Backgrounds: Subtle overlays `rgba(255, 255, 255, 0.05)` to `0.1`

### Modifying Styles
To customize a specific component:
1. Edit its `.css` file (e.g., `ImpactGrid.css`)
2. Update colors, spacing, fonts as needed
3. Components use `rem` units for scalability

### Responsive Breakpoints
- **Desktop:** 1024px+
- **Tablet:** 641px – 1024px
- **Mobile:** 640px and below

---

## What's Next

1. **Export Figma assets** — Get the 4-6 case study page screenshots
2. **Record videos** — Capture the 4 key moments (metablobs, contact reveal, TV transition, dial)
3. **Gather data** — Collect metrics, quote from Sofia, learnings
4. **Test components** — Verify rendering and responsiveness
5. **Add sections** — Go through admin panel and create each section

---

## Troubleshooting

### Video won't play
- Check video URL is accessible
- Ensure MP4 format (H.264 codec recommended)
- Max size: 20MB per video for good performance

### Images not loading
- Verify image URLs are publicly accessible
- Check image format (JPG, PNG supported)
- Images should be optimized for web (< 5MB)

### Section not rendering
- Check section `type` matches exactly (case-sensitive)
- Verify `content` object matches the required schema
- Check browser console for errors

### Need to debug a section?
Add this to `ProjectSectionRenderer.tsx` temporarily:
```typescript
console.log("Rendering section:", section);
```

---

## Summary

You now have 7 production-ready components. Use `ProjectSectionRenderer` to render them, and add content via the admin panel. All components are responsive, visual-first, and follow your design system.

Ready to add content! 🎨
