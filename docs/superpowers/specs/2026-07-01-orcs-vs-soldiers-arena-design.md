# Orcs vs Soldiers — Arena Easter Egg

**Date:** 2026-07-01
**Status:** Approved design, pending implementation plan
**Type:** Hidden easter egg / interactive spectacle

## Overview

A hidden full-screen battle scene reachable from the portfolio. A small **Iron Mike**
figure sits in the bottom-right corner of the site doing a subtle idle wiggle to draw
attention. Clicking him opens `/arena` — a full-viewport, endlessly-running
soldiers-vs-orcs pixel-art brawl that the visitor passively watches. The only
interactive element on the arena screen is a **"← BACK TO PORTFOLIO"** button.

This fits the site's existing easter-egg culture (the Terminal overlay, the Goggins
gag, Iron Mike as Anes's bodyguard) and reuses the existing Iron Mike SVG so it needs
**zero new character art** beyond the battle sprite sheets.

## Goals

- Delight: a genuinely fun surprise that rewards curiosity.
- Consistency: looks and feels like it belongs to this site's universe.
- Zero cost to the main page: battle code + sprite assets load **only** on `/arena`.
- Fully accessible: keyboard-navigable, screen-reader-safe, respects reduced motion.
- Robust: an endless brawl with no awkward end state or reset jank.

## Non-goals (v1)

- No player interaction with the battle (watch-only, per the request).
- No winner / score / banner — it is an endless brawl, not a match.
- No ranged combat. Melee only. (Arrow projectile assets exist; ranged volleys are a
  possible fast-follow, explicitly out of scope for v1.)
- No sound.

## User flow

1. Visitor is anywhere on the portfolio. Iron Mike is pinned bottom-right, wiggling.
2. Visitor clicks Mike → browser navigates to `/arena`.
3. `/arena` renders full-viewport: the brawl runs immediately and continuously.
   Soldiers march in from the left (facing right), orcs from the right (facing left);
   they collide mid-screen and trade attack / hurt / death animations. Fallen units are
   replaced by fresh ones marching in from each edge, so the line never empties.
4. A **"← BACK TO PORTFOLIO"** link (top-left) returns to `/`. A tiny asset-credit line
   sits at the bottom.

## Rendering approach — decision record

- **Chosen asset pack:** *Tiny RPG Character Asset Pack v1.03* (Soldier & Orc). It is
  side-view, ships a matching Soldier **and** Orc at identical 100×100 frame size, both
  facing right, as single-row horizontal sprite strips. Ideal for a side-scrolling
  battle.
- **Rejected:** the *Free Top-Down Orc* pack — top-down perspective (front/back/left/
  right facing) and layered body/head/sword parts. Mixing it with the side-view soldier
  would look wrong.
- **Delivery:** a dedicated unlisted route `/arena` (chosen over a Terminal-style
  overlay) so the battle's JS and PNGs never weigh on the main portfolio and it feels
  like a true "new screen." Marked `noindex`.
- **Choreography:** endless brawl (chosen over scripted-winner and escalating-waves) —
  matches watch-only, never hits an awkward end state.

## Sprite inventory (from the Tiny RPG pack)

All frames are 100×100 in a single horizontal row. Frame counts:

| Animation | Soldier | Orc | Shared keyframe |
|-----------|:------:|:---:|:---------------:|
| Idle  | 6 | 6 | `play6` |
| Walk  | 8 | 8 | `play8` |
| Attack (use Attack01) | 6 | 6 | `play6` |
| Hurt  | 4 | 4 | `play4` |
| Death | 4 | 4 | `play4` |

Source (base, un-shadowed) files, from
`Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)/`:

- `Soldier/Soldier/Soldier-Idle.png`, `-Walk.png`, `-Attack01.png`, `-Hurt.png`,
  `-Death.png`
- `Orc/Orc/Orc-Idle.png`, `-Walk.png`, `-Attack01.png`, `-Hurt.png`, `-Death.png`

~10 small PNGs. Copied into `public/arena/sprites/` and served raw (no Astro image
optimization — that would blur the pixel art).

## Architecture

| File | Purpose |
|------|---------|
| `src/pages/arena.astro` | The battle page. Minimal own shell (dark full-viewport bg), scoped `<style>` for the arena + units, imports/holds the engine script, Back link, credit line, `noindex` meta. |
| `src/components/MikeCorner.astro` | Floating bottom-right Iron Mike button — an `<a href="/arena">` styled as a button, subtle wiggle keyframe, `aria-label`. |
| `src/layouts/Layout.astro` | Renders `<MikeCorner />` gated by a new optional prop `hideMike` (default `false`). `arena.astro` opts out; portfolio pages show it. |
| `public/arena/sprites/*.png` | The ~10 copied sprite sheets. |

### Sprite animation system (CSS-driven, JS-orchestrated)

- Each unit is a `<div class="unit">` containing a `.sprite` element that is 100×100
  with the current sheet as `background-image`. The unit is scaled up (~1.6×) with
  `image-rendering: pixelated`. Orcs get `transform: scaleX(-1)` to face left.
- **Three reusable keyframes** — `play4`, `play6`, `play8` — each animates
  `background-position-x` from `0` to `-(N×100)px` with `steps(N)`. Because the two
  factions differ only by frame *count*, these three keyframes cover every animation;
  the *image* is swapped by the state class, not the keyframe.
- State classes (`.state-idle`, `.state-walk`, `.state-attack`, `.state-hurt`,
  `.state-death`) each set `background-image` + the matching `play*` animation +
  duration. Looping states (`idle`, `walk`) repeat infinitely; one-shot states
  (`attack`, `hurt`, `death`) run once. `death` holds its final frame via
  `animation-fill-mode: forwards`.

### Battle engine (`arena.ts` / inline script)

- A single `requestAnimationFrame` loop drives all units.
- Each unit is a JS object: `{ el, side, x, hp, state, cooldown, target }`.
- State machine per unit:
  - `march`: move `translateX` toward center until an enemy is within strike range.
  - `attack`: on cooldown, play the attack animation; deal damage to `target`.
  - `hurt`: brief stagger when taking damage.
  - `death`: play death animation, then remove the element after it completes.
- A spawner adds units at each edge on a randomized timer, capped at ~8–12 per side,
  so the front line stays populated.
- Motion uses `transform: translateX()` only (never `left`) to stay on the GPU
  compositor. Light randomness in spawn timing and duel outcomes keeps each viewing
  different.
- Perf guard: cap total units; pause the RAF loop when the tab is hidden
  (`visibilitychange`).

## Accessibility & fallbacks

- **`prefers-reduced-motion: reduce`**: no marching and no frame cycling. Render a
  frozen mid-clash tableau — a handful of units on their idle frame 0 — with a caption
  such as *"⚔️ battle paused — reduced motion is on."* The Back link stays prominent.
  Mike's corner wiggle is also disabled (he stays visible, just still). This mirrors the
  Terminal component, which disables all its keyframes under the same query.
- Corner Mike is a real focusable `<a href="/arena">` with a descriptive `aria-label`;
  Back is a real link. Keyboard and screen-reader safe.
- Battle sprites are decorative (`aria-hidden="true"`). The arena page carries a visually
  present or screen-reader heading for context.
- If a sprite image fails to load the frame simply shows empty — acceptable for a
  decorative easter egg; no error UI needed.

## Asset licensing

These are third-party free assets. Before shipping publicly, confirm the pack's license
permits this use — many free itch.io / CraftPix packs allow use but require attribution
and forbid redistributing the raw assets. Mitigation: include a small credit line in the
arena footer (e.g. *"Sprites: Tiny RPG Character Asset Pack"* with the author/source).
Copying only the ~10 sheets we use into `public/` (rather than the whole pack) keeps the
footprint minimal.

## Verification

- **Base path:** check `astro.config` for a `base` / `site` setting before hardcoding
  `/arena` and sprite URLs. If a non-root base is configured (e.g. project GitHub Pages),
  links and `background-image` URLs must include `import.meta.env.BASE_URL`. Current
  deploy appears to be root (custom domain), but verify before wiring paths.
- `npm run build` passes and emits `dist/arena/index.html`.
- Manual checks:
  - On `/`, Iron Mike wiggles in the bottom-right and is keyboard-focusable.
  - Clicking / activating Mike navigates to `/arena`.
  - The brawl runs continuously: soldiers face right, orcs face left, they clash
    mid-screen, fall, and are replaced. Sprites are crisp (pixelated, not blurred).
  - "← BACK TO PORTFOLIO" returns to `/`.
  - With reduced motion enabled (DevTools rendering emulation), the arena shows the
    static tableau + caption and Mike stops wiggling.
  - Mobile (≤480px and ≤768px): Mike does not cover page content; the battle scales/fits
    the viewport.
  - No console errors; all sprite requests return 200.

## Resolved open decisions

- Mike appears site-wide across the portfolio, hidden only on `/arena` (via `hideMike`).
- Use plain (un-shadowed) sprites plus a CSS ellipse ground shadow, not the pack's
  separate shadow sheets.
- Melee only for v1; arrows are a documented fast-follow.
