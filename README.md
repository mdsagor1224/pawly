# PAWLY: Premium Dog Food Landing Page
Vite + SCSS + vanilla JS + GSAP/ScrollTrigger.

## Setup
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs /dist
npm run preview
```

## Structure
- `index.html`: semantic markup, SEO meta, JSON-LD, SVG sprite (logo paw, arrows, social icons)
- `src/main.js`: preloader, hero intro, navbar, ScrollTrigger effects, counters, FAQ, cursor
- `src/styles/`: `variables` (design tokens), `components` (all sections), `responsive` (breakpoints 1280/1024/768/480)
- `public/favicon.svg`: custom paw favicon

## Images
Photos are hot-linked from Unsplash (free licence). Photo IDs are in `index.html` URLs; replace any `src`/`srcset` with files in `public/images/` for production. Verify every photo loads and fits its `alt` text; swap any that don't. Images that fail to load hide gracefully.

## Notes
- Placeholders to replace: canonical/OG URLs (`example.com`), `#` social/legal links, prices, CTA targets (`#start` → quiz or checkout).
- Reviews and ratings are fictional demo content.
- `prefers-reduced-motion` disables GSAP motion and CSS transitions.
