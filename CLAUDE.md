# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (default port 4321)
npm run build        # Production build to dist/
npm run preview      # Preview production build locally
```

## Architecture

Single-page Astro 5 portfolio site. Static output, no SSR. Zero JS frameworks — pure Astro components + vanilla CSS + one inline script.

**Page flow:** `Layout.astro` (root shell + global styles + all client JS) → `index.astro` (imports all section components in order) → individual section components.

**Data layer:** Each `src/data/*.ts` file exports a TypeScript interface and a `const` array. Components import and `.map()` over these arrays. To update content (jobs, projects, skills, certs, socials), edit the data files — no component changes needed.

**Interactivity:** A single `<script is:inline>` block in `Layout.astro` handles everything: mobile nav toggle, navbar glassmorphism on scroll, active nav link tracking, and IntersectionObserver for scroll-reveal animations.

**Animation system:** Two patterns coexist:
- `.hero-animate` — CSS keyframe stagger on page load (nth-child delays)
- `.reveal` / `.reveal-stagger` — IntersectionObserver adds `.visible` class on scroll, triggering CSS transitions defined in `animations.css`

**Reusable components:** `SectionHeading.astro` (title + accent line, used by 6 sections) and `Icon.astro` (inline SVG lookup by name string, used by 4 components).

## Key Patterns

- All styles are scoped `<style>` blocks inside each `.astro` file. They reference CSS custom properties from `src/styles/global.css` (e.g. `var(--accent)`, `var(--bg-card)`).
- Dark theme only. Accent color is `--accent: #38bdf8` (cyan). Fonts: Inter (sans) + JetBrains Mono (mono).
- Responsive breakpoints: 768px (tablet/mobile), 480px (small mobile).
- The `Icon.astro` component uses a `Record<string, string>` mapping icon names to SVG path strings, rendered via `set:html`.
- The resume PDF (`Anes_Kurtovic_2025.pdf`) lives in the repo root and is served from `public/` would need to be moved there if linked from the site (currently linked as `/Anes_Kurtovic_2025.pdf`).
