# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Single-page marketing site for **Salvador Diversões**, a company that installs claw machines ("máquinas de urso") in businesses in Salvador, Bahia, Brazil. React 18 + Vite 5 + TypeScript (strict) + Tailwind CSS 3.4. There is no backend, no router and no state library. All copy is Brazilian Portuguese, and so are the code comments and README. Keep new copy and comments in pt-BR.

`PRODUCT.md` holds the product and brand brief: users, approved claims, tone, and what must never be published. **Read it before changing any copy.** Hard rules from it:
- Never write "sem custo nenhum" or "custo zero". Electricity is the owner's only cost.
- Never publish revenue figures, percentages or machine counts. Never invent testimonials, clients, numbers or badges.
- The only confirmed service area is Salvador and Lauro de Freitas. Other cities get "consulte pelo WhatsApp".
- Use only the promises the brief approves. The tone is serious and professional with a light touch of fun, because a more playful first version was rejected. Emoji are limited to 🧸 or 🕹️, at most one or two per piece, and never in headings.
- Every section leads to WhatsApp, which is the single conversion path.

## Commands

```bash
npm run dev         # Vite dev server on :5173 (runs the image optimizer first, via predev)
npm run build       # optimizer (prebuild) → tsc --noEmit → vite build → dist/
npm run typecheck   # tsc only
npm run preview     # serve dist/ on :4173
npm run images      # regenerate optimized gallery images
npm run placeholders -- --force   # regenerate the placeholder machine image (OVERWRITES it; never touches logo.png or og.jpg)
```

There is no test suite and no linter. `npm run typecheck` (strict mode, `noUnusedLocals`, `noUnusedParameters`) is the correctness gate.

## Architecture

- **`src/content.ts` is the single source of all copy and config**: contact and WhatsApp number, nav, every section's text, the FAQ, form options and gallery photos. Components only render what it exports, so a text change belongs in `content.ts`, not in JSX. The README documents it as the file non-developers edit.
- **`src/App.tsx`** stacks the sections in a fixed order (Hero, Benefits, HowItWorks, Gallery, Coverage, ForPlayers, LeadForm, Faq). Each section in `src/components/` owns its anchor `id`, and those ids must match the `href`s in `content.ts`'s `nav`.
- **`src/components/ui.tsx`** holds the shared pieces: `WhatsAppButton`, `InstagramButton`, `SectionHeading`, and hand-drawn WhatsApp and Instagram icons (lucide has no brand icons). Other icons come from `lucide-react`.
- **Lead form flow:** `LeadForm.tsx` → `src/lib/lead.ts` (`validateLead`, `buildLeadMessage`, `sendLead`) → `src/lib/whatsapp.ts` (`whatsappLink`, a `wa.me` URL). `sendLead` opens WhatsApp in a new tab and saves nothing. It must run synchronously from the click or submit handler, or the browser blocks the popup. To add an API later, rewrite only `sendLead` and keep its `LeadResult` contract.
- **`ClawMachine.tsx` and `ClawMachine.css`** draw the animated SVG claw machine in the Hero. The animation must stop under `prefers-reduced-motion`.
- **`ContainerScroll.tsx`** wraps the Hero: a centered title above a card holding the `ClawMachine`. The card starts tilted (rotateX 20°) and goes flat as the page scrolls, while the title rises 100px. It's adapted from Aceternity's component and uses framer-motion (`useScroll`, `useTransform`). Rules:
  - Keep `m` + `LazyMotion` and never use `motion` there. The renderer (`domMin`) loads asynchronously from `src/lib/motion-features.ts` to keep it out of the initial JS.
  - Under `prefers-reduced-motion` the transforms become constants (`useReducedMotion`).
  - The Hero section uses `overflow-clip` so the tilted card can't cause sideways scroll and its shadow can't spill onto the next band.
  - Render only one `ClawMachine` on the page, because its SVG `clipPath` ids are fixed.
- **The desktop menu (xl, 1280px and up)** is the `SlideTabs.tsx` pill. A navy cursor slides to the item under the mouse or keyboard focus, then returns to the section currently on screen.
  - The active section comes from `useActiveSection` in `Header.tsx`: the `nav` section that crosses a line at 35% of the viewport height, or none in the hero, the form and the footer. The active link gets `aria-current`.
  - The cursor uses a CSS transition (`motion-safe`), not framer-motion, so it and the light label color change in the same frame (no white text on cream).
  - At 1280px there are about 38px to spare on each side, so a new menu item needs a width check.
  - The mobile menu stays a plain list.
- **`Faq.tsx`** follows a restrained "arcade" look:
  - numbering 01–06 in the pixel font and thick dashed dividers;
  - native `<details name="faq">` (one open at a time, no JS and no Radix);
  - open/close animated by `.faq-item` in `index.css` (`::details-content` + `interpolate-size`). It's progressive enhancement and is turned off under reduced motion.
- **`SmoothScroll.tsx`** turns on Lenis smooth scrolling for the whole page (`<ReactLenis root>`, mounted first in `App.tsx`). Rules:
  - It runs on framer-motion's frame loop (`autoRaf: false` + `frame.update`), so there is a single animation loop. Don't switch on `autoRaf`, which would create a second one.
  - Only wheel and trackpad are smoothed. Touch stays native (`syncTouch` is off), so phones scroll as usual.
  - `anchors: true` makes in-page links glide too. Lenis honors the `scroll-padding-top` on `<html>` and doesn't cancel the click, so the browser still updates the `#hash` and moves focus (the skip link depends on this). `scroll-behavior: smooth` in `index.css` doesn't get in the way, because Lenis writes the scroll with `behavior: 'instant'`.
  - Under reduced motion, Lenis itself turns smoothing off and jumps become instant (`respectReducedMotion`, on by default).
  - Any element with its own scroll needs `data-lenis-prevent`, or the wheel scrolls the page instead of it. The form `textarea` already has it.
- **`Footer.tsx` (+ `Footer.css`)** adapts the "Sticker Slap Footer" from 21st.dev. It has:
  - a cream frame holding the real `Logo`, the tagline and a "Topo" link;
  - a `band-navy` panel with three columns: contact, "Onde atuamos" (read from `coverage`) and the section links (read from `nav`);
  - at the bottom of the panel, a hand-written wordmark with bear stickers.

  Rules:
  - The wordmark and stickers live in `StickerStage.tsx` (with `StickerStage.css` and the drawings in `StickerArt.tsx`). It is loaded with `React.lazy`, like the globe. Its text and stickers come from `footer.wordmark` and `footer.stickers` in `content.ts`.
  - `src/lib/script.ts` is a pure single-stroke script.
    - It supports a–z, `!`, `.` and Portuguese accents, which are drawn as pen lifts. Anything else becomes a space.
    - Each item of `footer.wordmark` is one line. The panel's bottom edge cuts the last line.
    - The main stroke is split into one `<path>` per pen lift, because dash patterns restart on every subpath. Keep it split, or the write-on animation draws every piece at once.
  - Touch never drags a sticker. `pointerType 'touch'` is ignored and there is no `touch-action: none`, so a finger on a sticker still scrolls the page (the same pattern as `SalvadorGlobe`).
  - Interactions:
    - dragging with a mouse or pen makes the claw carry the sticker;
    - a click, tap or Enter plays the claw's "try";
    - the arrow keys move a sticker, and Home or Esc puts it back;
    - clicking the wordmark replays everything.
  - The entrance animations (`.is-in` on the footer, `.is-on` on the stage) and the claw only run under `prefers-reduced-motion: no-preference`. With reduced motion everything is visible at once.
  - Stickers reuse `BearHead` and `STAR` from `ClawMachine.tsx`.
    - Stickers carry no text, so they never read as badges or seals.
    - A bear never wears a red cap, because the red cap belongs to the logo's bear.

### Image pipeline

`scripts/optimize-images.mjs` runs before `dev` and `build`. It **regex-scans `src/content.ts` for every `file: '...'` property**, finds each match in `public/assets/`, and writes `<name>-640.webp`, `<name>-1200.webp` and `<name>-1200.jpg` (4:5 center crop) to `public/assets/otimizadas/`. `manifest.json` in that folder tracks file size and mtime so unchanged photos are skipped. A missing file fails the build. Because of this:
- Don't add a `file:` key anywhere else in `content.ts` unless it names an image in `public/assets/`.
- `Gallery.tsx` (`photoSources`) assumes those exact output names and the 1200×1500 size. Change it and the script together.
- The gallery handles 1 to 6 photos with a layout for each count (`layout()` in `Gallery.tsx`).

## Styling and design system

- **The Tailwind default palette is replaced, not extended** (`tailwind.config.ts` → `theme.colors`). Only brand tokens exist (`surface`, `surface-alt`, `ink`, `ink-muted`, `navy`, `sun`, `whatsapp`, `chip`, ...). `bg-white` or `text-gray-500` silently produce no CSS. The tokens are RGB-triplet CSS variables in `src/index.css`, so opacity modifiers work (`bg-navy/10`).
- **Dark mode:** the tokens are redefined under `prefers-color-scheme: dark` (`:root:not(.light)`) and again under `:root.dark`. Tailwind uses `darkMode: 'class'`, but no component uses a `dark:` variant because the tokens switch on their own. Keep it that way. When you add a token, add it to all three blocks in `index.css` and to `tailwind.config.ts`.
- **Color roles:** navy and cream dominate. `sun` (yellow) appears only as an accent: the `.mark` heading underline, `.icon-box`, the `.eyebrow` dash, the footer's "Topo" star, and the illustrations. `surface-alt` is the soft band background. `sky`, `honey`, `pink`, `grape`, `leaf` and `cap-red` belong to the illustrations only: the claw machine and the footer stickers.
- **Buttons (`.btn`):**
  - Pill-shaped (`rounded-pill`), 52px tall, no shadow.
  - On hover the color changes and the label's letters roll: each one drops out while a copy comes in from above, in a cascade.
  - Every button with a text label renders it through `RollLabel` (`ui.tsx`). `WhatsAppButton` and `InstagramButton` already do, and their `children` must be a `string`.
  - `RollLabel` splits words into letters, keeps the full text in an `sr-only` (the letters are `aria-hidden`), wraps by word, and caps the cascade at 250ms.
  - The effect lives in `index.css` (`.roll-*`). It fires on hover only with `(hover: hover)` (not on touch) and on `:focus-visible`, and never under reduced motion.
  - The skip link keeps fixed text.
- **Component classes** in `index.css` (`@layer components`): `.btn` plus `.btn-whatsapp`, `.btn-outline` and `.btn-sun`, `.band-navy`, `.band-soft`, `.container-page`, `.section`, `.eyebrow`, `.mark` and `.icon-box`. Each band sets `--focus` so the focus ring contrasts with it. Reuse these instead of re-creating them with utilities.
- **Type scale:** the custom sizes are `text-h1`, `text-h2`, `text-heading`, `text-body-lg`, `text-body`, `text-label` and `text-caption`. Radii are `rounded-sm`, `rounded-md` and `rounded-lg` (8, 12 and 20 px). Shadows are `shadow-soft` and `shadow-lift` (the Hero card's deep layered shadow), both tokens that switch with dark mode. There is one exception to the single font: Press Start 2P (`font-pixel`), loaded in `index.html` subset to digits only (`text=0123456789`), used only for the FAQ numbering. Never use it for running text; the digit-only subset has no other glyphs. The font is Plus Jakarta Sans, with a metric-matched `Jakarta Fallback` `@font-face` in `index.css`. If you change the font, recompute or remove that fallback.
- **The header is fixed at 72px.** `main` has `pt-[72px]` and `html` has `scroll-padding-top: 88px`. Keep these in sync if the header height changes.
- **Accessibility target is WCAG 2.1 AA:** 4.5:1 text contrast, visible focus, announced form errors, a skip link in `App.tsx`, and reduced motion respected. The main audience views the site on phones, so check layouts at 360px wide.

## Open items (from README)

The official logo is done: `public/assets/logo.png` (600×180, sized via `brand.logo` in `content.ts`) and `public/favicon.svg` (the bear emblem alone), designed in Paper ("desing-sadiveroses" → "Logo · C Mascote"). These still need real material: real machine photos (`maquina-1.jpg` is an illustration), the final list of served cities (`coverage` and `faq`), confirmation of the four `howItWorks` steps, and an absolute `og:image` URL in `index.html` before deploy. Deployment targets are Vercel or Netlify (build `npm run build`, output `dist`, Node 18 or later for `sharp`).
