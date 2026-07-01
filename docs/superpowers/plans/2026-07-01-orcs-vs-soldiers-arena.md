# Orcs vs Soldiers Arena — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a hidden `/arena` route showing an endless pixel-art Orcs-vs-Soldiers brawl, reached by clicking a wiggling Iron Mike figure fixed in the portfolio's bottom-right corner.

**Architecture:** A standalone Astro page (`src/pages/arena.astro`) renders a full-viewport battlefield styled with global CSS and animated by a vanilla-TS engine (`src/scripts/arena.ts`). Sprite frames animate purely in CSS via three shared `steps()` keyframes; the engine only positions units and switches their state. A small `MikeCorner.astro` component (rendered by `Layout.astro`) is the entry point.

**Tech Stack:** Astro 5 (static), vanilla TypeScript, plain CSS sprite animation. No new dependencies.

## Global Constraints

- **Zero JS frameworks.** Vanilla TS + CSS only (project rule).
- **No new npm dependencies.**
- **Respect `prefers-reduced-motion: reduce`** everywhere — static fallback, no frame cycling.
- **Pixel art must not blur:** every sprite element uses `image-rendering: pixelated`, and sheets are served raw from `public/` (never through Astro's image optimizer).
- **JS-created DOM needs global CSS:** elements built with `document.createElement` do NOT receive Astro's scoped `data-*` attribute, so any rule targeting them must be in an `is:global` style block (same lesson as `src/components/Terminal.astro`).
- **Deploy is root** (`site: https://aneskurtovic.com`, no `base`) — root-absolute paths like `/arena` and `/arena/sprites/*.png` are correct as-is.
- **No test runner in this repo.** Verify with `npm run check` (astro check) + `npm run build`, plus the explicit manual dev-server checks in each task. Do not add a test framework.
- **Commit style:** conventional commits (`feat:`, `chore:`, `docs:`).
- **Sprite frame counts (100×100 frames, single row):** idle 6, walk 8, attack(01) 6, hurt 4, death 4 — identical for both factions.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `public/arena/sprites/*.png` | The 10 raw sprite sheets (soldier/orc × idle/walk/attack/hurt/death). |
| `src/scripts/arena.ts` | The brawl engine: spawn, march, attack/hurt/death state machine, reduced-motion tableau. Exports `initArena()`. |
| `src/pages/arena.astro` | Standalone full-viewport battle page (own `<html>`, `noindex`), backdrop + chrome CSS, mounts the engine. |
| `src/components/MikeCorner.astro` | Fixed bottom-right Iron Mike link to `/arena` with idle wiggle. |
| `src/layouts/Layout.astro` | Renders `<MikeCorner />` (so it appears on every portfolio page; `/arena` doesn't use Layout, so it's naturally absent there). |
| `astro.config.mjs` | Exclude `/arena` from the sitemap. |

---

## Task 1: Copy sprite assets into `public/`

**Files:**
- Create: `public/arena/sprites/soldier-idle.png`, `soldier-walk.png`, `soldier-attack.png`, `soldier-hurt.png`, `soldier-death.png`, `orc-idle.png`, `orc-walk.png`, `orc-attack.png`, `orc-hurt.png`, `orc-death.png`

**Interfaces:**
- Produces: 10 PNGs at `/arena/sprites/<side>-<state>.png`, each a single-row strip of 100×100 frames. Consumed by `arena.ts` (`SHEETS` map) and `arena.astro` CSS.

- [ ] **Step 1: Copy the ten sheets, renaming to the engine's convention**

Run from the worktree root:

```bash
SRC="/c/Users/anesk/Downloads/Tiny RPG Character Asset Pack v1.03b -Free Soldier&Orc/Tiny RPG Character Asset Pack v1.03 -Free Soldier&Orc/Characters(100x100)"
DEST="public/arena/sprites"
mkdir -p "$DEST"
cp "$SRC/Soldier/Soldier/Soldier-Idle.png"     "$DEST/soldier-idle.png"
cp "$SRC/Soldier/Soldier/Soldier-Walk.png"     "$DEST/soldier-walk.png"
cp "$SRC/Soldier/Soldier/Soldier-Attack01.png" "$DEST/soldier-attack.png"
cp "$SRC/Soldier/Soldier/Soldier-Hurt.png"     "$DEST/soldier-hurt.png"
cp "$SRC/Soldier/Soldier/Soldier-Death.png"    "$DEST/soldier-death.png"
cp "$SRC/Orc/Orc/Orc-Idle.png"                 "$DEST/orc-idle.png"
cp "$SRC/Orc/Orc/Orc-Walk.png"                 "$DEST/orc-walk.png"
cp "$SRC/Orc/Orc/Orc-Attack01.png"             "$DEST/orc-attack.png"
cp "$SRC/Orc/Orc/Orc-Hurt.png"                 "$DEST/orc-hurt.png"
cp "$SRC/Orc/Orc/Orc-Death.png"                "$DEST/orc-death.png"
```

- [ ] **Step 2: Verify all ten files exist with expected dimensions**

Run:

```bash
ls -1 public/arena/sprites | sort
```

Expected (exactly these 10 names):

```
orc-attack.png
orc-death.png
orc-hurt.png
orc-idle.png
orc-walk.png
soldier-attack.png
soldier-death.png
soldier-hurt.png
soldier-idle.png
soldier-walk.png
```

- [ ] **Step 3: Commit**

```bash
git add public/arena/sprites
git commit -m "chore: add Tiny RPG soldier + orc sprite sheets for arena"
```

---

## Task 2: Iron Mike corner button

**Files:**
- Create: `src/components/MikeCorner.astro`
- Modify: `src/layouts/Layout.astro` (import + render after `<Terminal />`)

**Interfaces:**
- Consumes: `tyson.avatarNeutral` (`'/agents/tyson-neutral.svg'`) from `src/data/agents.ts`.
- Produces: a fixed bottom-right `<a href="/arena">` present on all pages that use `Layout.astro`.

- [ ] **Step 1: Create the component**

Create `src/components/MikeCorner.astro`:

```astro
---
// Floating entry point to the /arena easter egg. Reuses the existing Iron Mike
// avatar (already canon in the site's Terminal gag) so no new art is needed.
import { tyson } from '../data/agents';
---

<a class="mike-corner" href="/arena" aria-label="Enter the arena — Orcs vs Soldiers battle">
  <img src={tyson.avatarNeutral} alt="" width="72" height="72" loading="lazy" />
</a>

<style>
  .mike-corner {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 1500;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--bg-card);
    border: 2px solid var(--accent);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    overflow: hidden;
    animation: mike-wiggle 2.8s ease-in-out infinite;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .mike-corner:hover,
  .mike-corner:focus-visible {
    animation-play-state: paused;
    transform: scale(1.08);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
    outline: none;
  }

  .mike-corner img {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    object-fit: cover;
  }

  @keyframes mike-wiggle {
    0%, 86%, 100% { transform: translateY(0) rotate(0deg); }
    90% { transform: translateY(-4px) rotate(-7deg); }
    94% { transform: translateY(-4px) rotate(7deg); }
    98% { transform: translateY(0) rotate(0deg); }
  }

  @media (max-width: 480px) {
    .mike-corner,
    .mike-corner img { width: 58px; height: 58px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .mike-corner { animation: none; }
  }
</style>
```

- [ ] **Step 2: Wire it into the layout**

In `src/layouts/Layout.astro`, add the import beside the existing `Terminal` import (near line 4):

```astro
import Terminal from '../components/Terminal.astro';
import MikeCorner from '../components/MikeCorner.astro';
```

Then render it right after `<Terminal />` (near line 136):

```astro
    <Terminal />
    <MikeCorner />
```

- [ ] **Step 3: Type-check and build**

Run:

```bash
npm run check && npm run build
```

Expected: both succeed, no errors.

- [ ] **Step 4: Manual check (dev server)**

Run `npm run dev`, open `http://localhost:4321/`. Expected:
- Iron Mike sits in the bottom-right, doing a periodic wiggle.
- Tab key can focus it (focus ring / scale on focus); it pauses wiggling on hover/focus.
- It appears on the home page and on `/blog`.
- Clicking it navigates to `/arena` (404 until Task 3 — that's fine here).

- [ ] **Step 5: Commit**

```bash
git add src/components/MikeCorner.astro src/layouts/Layout.astro
git commit -m "feat(arena): add wiggling Iron Mike corner button linking to /arena"
```

---

## Task 3: Arena page shell (static) + noindex + sitemap exclusion

**Files:**
- Create: `src/pages/arena.astro`
- Modify: `astro.config.mjs` (sitemap `filter`)

**Interfaces:**
- Produces: route `/arena` with an empty `#arena-stage` container, a Back link, a credit line, and page chrome. `initArena` is imported but is a no-op stub until Task 5 — for THIS task, mount nothing yet (the `<script>` is added in Task 5). Renders a full dark viewport.

- [ ] **Step 1: Create the page (chrome + backdrop only, no engine yet)**

Create `src/pages/arena.astro`:

```astro
---
// Standalone easter-egg page — deliberately does NOT use Layout.astro (no nav,
// no Mike button, no portfolio chrome). noindex + excluded from the sitemap so
// it stays a hidden gem. The battle is mounted by src/scripts/arena.ts (Task 5).
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>⚔️ Arena — Orcs vs Soldiers</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <main class="arena">
      <a class="back-btn" href="/">← Back to portfolio</a>
      <h1 class="sr-only">Orcs vs Soldiers — an endless pixel battle</h1>
      <div id="arena-stage" aria-hidden="true"></div>
      <p class="credit">Sprites: “Tiny RPG Character Asset Pack” — used with thanks.</p>
    </main>

    <style is:global>
      @import '../styles/global.css';

      html,
      body {
        margin: 0;
        height: 100%;
        overflow: hidden;
      }

      .arena {
        position: relative;
        width: 100vw;
        height: 100vh;
        background:
          radial-gradient(120% 90% at 50% 0%, #1b2438 0%, #0b0e16 60%, #05060a 100%);
        overflow: hidden;
        font-family: var(--font-mono, monospace);
      }

      /* Ground band the units stand on. */
      .arena::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 26%;
        background: linear-gradient(180deg, #26331f 0%, #17200f 100%);
        box-shadow: inset 0 6px 18px rgba(0, 0, 0, 0.5);
        z-index: 0;
      }

      #arena-stage {
        position: absolute;
        inset: 0;
        z-index: 1;
      }

      .back-btn {
        position: absolute;
        top: 1rem;
        left: 1rem;
        z-index: 10;
        font-family: var(--font-mono, monospace);
        font-size: 0.8rem;
        color: var(--text, #e5e7eb);
        text-decoration: none;
        padding: 0.5rem 0.9rem;
        border: 1px solid var(--accent, #38bdf8);
        border-radius: var(--radius, 8px);
        background: rgba(5, 6, 10, 0.6);
        transition: background 0.2s, transform 0.2s;
      }

      .back-btn:hover,
      .back-btn:focus-visible {
        background: var(--accent, #38bdf8);
        color: #05060a;
        transform: translateX(-2px);
      }

      .credit {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0.5rem;
        z-index: 10;
        margin: 0;
        text-align: center;
        font-size: 0.6rem;
        color: rgba(229, 231, 235, 0.5);
      }

      .reduced-caption {
        position: absolute;
        left: 0;
        right: 0;
        top: 42%;
        z-index: 5;
        margin: 0;
        text-align: center;
        font-size: 1rem;
        color: var(--text, #e5e7eb);
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    </style>
  </body>
</html>
```

- [ ] **Step 2: Exclude `/arena` from the sitemap**

In `astro.config.mjs`, add a `filter` to the `sitemap({ ... })` options (alongside `changefreq`/`priority`/`serialize`, around line 26):

```js
    sitemap({
      filter: (page) => !page.includes('/arena'),
      changefreq: 'monthly',
      priority: 0.7,
      serialize(item) {
```

- [ ] **Step 3: Build and verify the route + sitemap**

Run:

```bash
npm run build
ls dist/arena/index.html
grep -c "arena" dist/sitemap-0.xml || echo "arena not in sitemap (good)"
```

Expected: `dist/arena/index.html` exists; the grep prints `arena not in sitemap (good)` (or `0`).

- [ ] **Step 4: Manual check (dev server)**

`npm run dev`, open `http://localhost:4321/arena`. Expected: full-screen dark scene with a sky→ground gradient, a working "← Back to portfolio" button (top-left, returns to `/`), and the credit line at the bottom. The stage is empty (engine lands in Task 5).

- [ ] **Step 5: Commit**

```bash
git add src/pages/arena.astro astro.config.mjs
git commit -m "feat(arena): add /arena page shell, noindex, and sitemap exclusion"
```

---

## Task 4: Sprite CSS system + static proof units

**Files:**
- Modify: `src/pages/arena.astro` (add unit/sprite CSS to the `is:global` block)
- Create (temporary): a small inline proof script inside `arena.astro`, removed in Task 5

**Interfaces:**
- Produces: global CSS classes `.unit`, `.unit.orc`, `.sprite`, keyframes `play4/6/8`, and state classes `.sprite.st-idle|st-walk|st-attack|st-hurt|st-death`. These are consumed by `arena.ts`. This task proves them with two hardcoded units, then removes the proof in Task 5.

- [ ] **Step 1: Add the sprite CSS**

In `src/pages/arena.astro`, inside the existing `<style is:global>` block (after the `#arena-stage` rule), add:

```css
      /* ---- Sprite units (elements are created in JS, so styles must be global) ---- */
      .unit {
        position: absolute;
        left: 0;
        width: 100px;
        height: 100px;
        transform-origin: bottom center;
        image-rendering: pixelated;
        will-change: transform;
      }

      .sprite {
        width: 100px;
        height: 100px;
        background-repeat: no-repeat;
        background-position: 0 0;
        image-rendering: pixelated;
      }

      /* Orcs face left (sprites ship facing right). */
      .unit.orc .sprite {
        transform: scaleX(-1);
      }

      @keyframes play4 { from { background-position-x: 0; } to { background-position-x: -400px; } }
      @keyframes play6 { from { background-position-x: 0; } to { background-position-x: -600px; } }
      @keyframes play8 { from { background-position-x: 0; } to { background-position-x: -800px; } }

      .sprite.st-idle   { animation: play6 0.9s steps(6) infinite; }
      .sprite.st-walk   { animation: play8 0.7s steps(8) infinite; }
      .sprite.st-attack { animation: play6 0.52s steps(6) 1; }
      .sprite.st-hurt   { animation: play4 0.3s steps(4) 1; }
      .sprite.st-death  { animation: play4 0.6s steps(4) 1 forwards; }

      @media (prefers-reduced-motion: reduce) {
        .sprite {
          animation: none !important;
          background-position-x: 0 !important;
        }
      }
```

- [ ] **Step 2: Add a temporary proof script**

In `src/pages/arena.astro`, add this `<script>` just before the `<style is:global>` block (it will be replaced in Task 5):

```astro
    <script>
      // TEMPORARY proof — replaced by the engine in Task 5.
      const stage = document.getElementById('arena-stage');
      function proof(side, state, x, bottom) {
        const el = document.createElement('div');
        el.className = `unit ${side}`;
        el.style.bottom = `${bottom}px`;
        el.style.transform = `translateX(${x}px) scale(1.8)`;
        const sprite = document.createElement('div');
        sprite.className = `sprite st-${state}`;
        sprite.style.backgroundImage = `url("/arena/sprites/${side}-${state}.png")`;
        el.appendChild(sprite);
        stage.appendChild(el);
      }
      proof('soldier', 'walk', 120, 40);
      proof('soldier', 'attack', 260, 40);
      proof('orc', 'walk', window.innerWidth - 200, 40);
      proof('orc', 'attack', window.innerWidth - 340, 40);
    </script>
```

- [ ] **Step 3: Build**

Run:

```bash
npm run build
```

Expected: succeeds.

- [ ] **Step 4: Manual check (dev server)**

`npm run dev`, open `/arena`. Expected:
- Two soldiers on the left, two orcs on the right, standing on the ground band.
- Sprites are **crisp** (not blurred) and clearly larger than 100px.
- Soldiers face **right**; orcs face **left**.
- Walk sprites cycle their legs; attack sprites swing once and stop.
- Toggle DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" and reload: sprites freeze on their first frame (no cycling).

- [ ] **Step 5: Commit**

```bash
git add src/pages/arena.astro
git commit -m "feat(arena): add pixel sprite CSS system with static proof units"
```

---

## Task 5: Battle engine (endless brawl)

**Files:**
- Create: `src/scripts/arena.ts`
- Modify: `src/pages/arena.astro` (replace the Task-4 proof `<script>` with the engine mount)

**Interfaces:**
- Consumes: `#arena-stage` element; the `.unit/.sprite/.st-*` global CSS from Task 4; sprite PNGs from Task 1.
- Produces: `export function initArena(): void` — mounts and runs the brawl (or a static tableau under reduced motion).

- [ ] **Step 1: Write the engine**

Create `src/scripts/arena.ts`:

```ts
// Endless Orcs-vs-Soldiers brawl. Pure DOM + CSS sprite animation — this module
// only positions units (transform: translateX) and switches their state class;
// CSS does all frame cycling. No framework, no per-frame allocations.

type Side = 'soldier' | 'orc';
type State = 'idle' | 'walk' | 'attack' | 'hurt' | 'death';

interface Unit {
  el: HTMLDivElement;
  sprite: HTMLDivElement;
  side: Side;
  x: number;           // left offset within the stage, in px
  hp: number;
  state: State;
  busyUntil: number;   // ms timestamp — locked in a one-shot (attack/hurt)
  hitAt: number;       // ms timestamp — when an attack's damage lands
  pendingHit: boolean;
  target: Unit | null;
  deathDoneAt: number; // ms timestamp — when a corpse is removed
  remove: boolean;
}

const SHEETS: Record<Side, Record<State, string>> = {
  soldier: {
    idle: '/arena/sprites/soldier-idle.png',
    walk: '/arena/sprites/soldier-walk.png',
    attack: '/arena/sprites/soldier-attack.png',
    hurt: '/arena/sprites/soldier-hurt.png',
    death: '/arena/sprites/soldier-death.png',
  },
  orc: {
    idle: '/arena/sprites/orc-idle.png',
    walk: '/arena/sprites/orc-walk.png',
    attack: '/arena/sprites/orc-attack.png',
    hurt: '/arena/sprites/orc-hurt.png',
    death: '/arena/sprites/orc-death.png',
  },
};

// Tunables (durations in ms match the CSS animation lengths from Task 4).
const SCALE = 1.8;
const SPEED = 55;         // px/s march speed
const REACH = 48;         // px dx at which a unit starts attacking
const MIN_GAP = 34;       // px spacing kept behind a same-side ally
const HP = 100;
const ATTACK_MS = 520;
const HIT_DELAY = 250;
const HURT_MS = 300;
const DEATH_MS = 600;
const CORPSE_MS = 900;    // corpse linger after the death animation
const MAX_PER_SIDE = 9;
const SPAWN_MIN = 700;
const SPAWN_VAR = 900;

const dmg = () => 16 + Math.random() * 16;

export function initArena(): void {
  const stage = document.getElementById('arena-stage');
  if (!stage) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    renderStaticTableau(stage);
    return;
  }

  let units: Unit[] = [];
  let last = performance.now();
  const nextSpawn: Record<Side, number> = { soldier: 0, orc: 0 };
  let raf = 0;

  const stageWidth = () => stage.clientWidth;

  function setState(u: Unit, state: State, restart = false): void {
    if (u.state === state && !restart) return;
    u.sprite.style.backgroundImage = `url("${SHEETS[u.side][state]}")`;
    u.sprite.classList.remove('st-idle', 'st-walk', 'st-attack', 'st-hurt', 'st-death');
    void u.sprite.offsetWidth; // reflow so a re-applied one-shot animation restarts
    u.sprite.classList.add(`st-${state}`);
    u.state = state;
  }

  function render(u: Unit): void {
    u.el.style.transform = `translateX(${u.x}px) scale(${SCALE})`;
  }

  function spawn(side: Side): void {
    const el = document.createElement('div');
    el.className = `unit ${side}`;
    const sprite = document.createElement('div');
    sprite.className = 'sprite';
    el.appendChild(sprite);

    const lane = 8 + Math.floor(Math.random() * 72); // vertical spread, px from ground
    el.style.bottom = `${lane}px`;
    el.style.zIndex = String(200 - lane);            // front (lower) units on top
    stage!.appendChild(el);

    const u: Unit = {
      el,
      sprite,
      side,
      x: side === 'soldier' ? -40 : stageWidth() - 60,
      hp: HP,
      state: 'walk',
      busyUntil: 0,
      hitAt: 0,
      pendingHit: false,
      target: null,
      deathDoneAt: 0,
      remove: false,
    };
    setState(u, 'walk', true);
    render(u);
    units.push(u);
  }

  function livingCount(side: Side): number {
    let n = 0;
    for (const u of units) if (u.side === side && u.state !== 'death') n++;
    return n;
  }

  function nearestEnemy(u: Unit): Unit | null {
    let best: Unit | null = null;
    let bestDx = Infinity;
    for (const o of units) {
      if (o.side === u.side || o.state === 'death') continue;
      const dx = Math.abs(o.x - u.x);
      if (dx < bestDx) {
        bestDx = dx;
        best = o;
      }
    }
    return best;
  }

  function allyAhead(u: Unit): boolean {
    const dir = u.side === 'soldier' ? 1 : -1;
    for (const o of units) {
      if (o === u || o.side !== u.side || o.state === 'death') continue;
      const gap = (o.x - u.x) * dir; // > 0 means o is ahead of u
      if (gap > 0 && gap < MIN_GAP) return true;
    }
    return false;
  }

  function startAttack(u: Unit, enemy: Unit, now: number): void {
    setState(u, 'attack', true);
    u.busyUntil = now + ATTACK_MS;
    u.hitAt = now + HIT_DELAY;
    u.pendingHit = true;
    u.target = enemy;
  }

  function startHurt(u: Unit, now: number): void {
    if (u.state === 'death') return;
    setState(u, 'hurt', true);
    u.busyUntil = now + HURT_MS;
    u.pendingHit = false;
  }

  function startDeath(u: Unit, now: number): void {
    setState(u, 'death', true);
    u.pendingHit = false;
    u.deathDoneAt = now + DEATH_MS + CORPSE_MS;
    u.el.style.zIndex = '1'; // corpses sink behind the living
  }

  function applyHit(u: Unit, now: number): void {
    const e = u.target;
    if (!e || e.state === 'death') return;
    if (Math.abs(e.x - u.x) > REACH + 8) return; // target slipped out of range
    e.hp -= dmg();
    if (e.hp <= 0) startDeath(e, now);
    else if (Math.random() < 0.35) startHurt(e, now);
  }

  function maybeSpawn(side: Side, now: number): void {
    if (now < nextSpawn[side]) return;
    if (livingCount(side) < MAX_PER_SIDE) spawn(side);
    nextSpawn[side] = now + SPAWN_MIN + Math.random() * SPAWN_VAR;
  }

  function tick(now: number): void {
    const dt = Math.min(50, now - last) / 1000;
    last = now;

    maybeSpawn('soldier', now);
    maybeSpawn('orc', now);

    for (const u of units) {
      if (u.state === 'death') {
        if (now >= u.deathDoneAt) u.remove = true;
        continue;
      }
      if (u.pendingHit && now >= u.hitAt) {
        u.pendingHit = false;
        applyHit(u, now);
      }
      if (now < u.busyUntil) continue; // locked in attack/hurt

      const enemy = nearestEnemy(u);
      if (enemy && Math.abs(enemy.x - u.x) <= REACH) {
        startAttack(u, enemy, now);
      } else if (!allyAhead(u)) {
        const dir = u.side === 'soldier' ? 1 : -1;
        u.x += dir * SPEED * dt;
        setState(u, 'walk');
        render(u);
      } else {
        setState(u, 'walk'); // marching in place behind the front line
      }
    }

    units = units.filter((u) => {
      if (u.remove) {
        u.el.remove();
        return false;
      }
      return true;
    });

    raf = requestAnimationFrame(tick);
  }

  // Pause the loop while the tab is hidden.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  });

  raf = requestAnimationFrame(tick);
}

function renderStaticTableau(stage: HTMLElement): void {
  const place = (side: Side, x: number, bottom: number, state: State): void => {
    const el = document.createElement('div');
    el.className = `unit ${side}`;
    el.style.bottom = `${bottom}px`;
    el.style.zIndex = String(200 - bottom);
    el.style.transform = `translateX(${x}px) scale(1.8)`;
    const sprite = document.createElement('div');
    sprite.className = 'sprite';
    sprite.style.backgroundImage = `url("${SHEETS[side][state]}")`; // frame 0, no st- class
    el.appendChild(sprite);
    stage.appendChild(el);
  };

  const mid = stage.clientWidth / 2;
  place('soldier', mid - 190, 52, 'walk');
  place('soldier', mid - 110, 26, 'attack');
  place('orc', mid + 40, 26, 'attack');
  place('orc', mid + 130, 54, 'walk');

  const cap = document.createElement('p');
  cap.className = 'reduced-caption';
  cap.textContent = '⚔️ battle paused — reduced motion is on.';
  stage.appendChild(cap);
}
```

- [ ] **Step 2: Replace the proof script with the engine mount**

In `src/pages/arena.astro`, delete the entire temporary `<script>` from Task 4 and replace it with:

```astro
    <script>
      import { initArena } from '../scripts/arena';
      initArena();
    </script>
```

- [ ] **Step 3: Type-check and build**

Run:

```bash
npm run check && npm run build
```

Expected: both succeed (no TS errors from `arena.ts`).

- [ ] **Step 4: Manual check (dev server)**

`npm run dev`, open `/arena`. Expected:
- Soldiers stream in from the left, orcs from the right; they meet mid-stage and trade attack/hurt/death animations.
- Fallen units disappear and fresh ones keep marching in — the battle never empties or stops.
- Units keep a rough front line (they don't all pile onto the exact same pixel).
- No console errors; watching for ~60s shows steady, smooth motion.
- Switch to another tab and back: the battle resumes cleanly (no giant jump).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/arena.ts src/pages/arena.astro
git commit -m "feat(arena): add endless orcs-vs-soldiers brawl engine"
```

---

## Task 6: Reduced-motion verification pass

**Files:**
- (No new code — `renderStaticTableau` + the CSS `@media` guard already exist. This task is a dedicated verification + any small fix.)

**Interfaces:**
- Consumes: `initArena`'s reduced-motion branch, the `.reduced-caption` style, the `@media (prefers-reduced-motion)` CSS.

- [ ] **Step 1: Verify the reduced-motion fallback (dev server)**

In DevTools → Rendering, set "Emulate CSS media feature prefers-reduced-motion" to **reduce**. Reload `/arena`. Expected:
- No marching, no frame cycling — a frozen mid-clash tableau (two soldiers, two orcs on their first frame).
- The caption "⚔️ battle paused — reduced motion is on." is visible and centered.
- The "← Back to portfolio" button still works.
- On the home page `/`, Iron Mike is visible but no longer wiggling.

- [ ] **Step 2: Verify the normal-motion path is unaffected**

Set the emulation back to "no-preference", reload `/arena`. Expected: the full brawl runs again (regression check).

- [ ] **Step 3: Commit (only if a fix was needed)**

If Step 1 required a change, commit it:

```bash
git add -A
git commit -m "fix(arena): correct reduced-motion static tableau"
```

Otherwise skip — nothing to commit.

---

## Task 7: Final verification & responsive pass

**Files:**
- Possibly modify: `src/pages/arena.astro` or `src/components/MikeCorner.astro` (only if a check below fails)

**Interfaces:** none new — this is the whole-feature acceptance gate from the spec.

- [ ] **Step 1: Full production build**

Run:

```bash
npm run check && npm run build
```

Expected: both pass. Confirm `dist/arena/index.html` and `dist/arena/sprites/*.png` exist:

```bash
ls dist/arena/index.html && ls -1 dist/arena/sprites | wc -l
```

Expected: file exists; count is `10`.

- [ ] **Step 2: Preview the production build**

Run:

```bash
npm run preview
```

Open the previewed `/` and `/arena`. Expected: identical behavior to dev — Mike wiggles, click → brawl runs, Back returns home.

- [ ] **Step 3: Responsive / mobile check**

In DevTools device toolbar, test at 375px and 768px widths on both `/` and `/arena`. Expected:
- Mike (58px on ≤480px) sits in the corner without covering the footer's contact content awkwardly.
- The arena fills the viewport; units stay on the ground band; Back button and credit remain readable.

- [ ] **Step 4: Accessibility spot-check**

- Tab to Mike on `/`; it's focusable with a visible focus state; Enter activates it.
- On `/arena`, Tab reaches the Back link; Enter returns home.
- Confirm the battle stage is `aria-hidden="true"` and the page has the `sr-only` `<h1>`.

- [ ] **Step 5: Console + network check**

With `/arena` open, confirm: no console errors, and all 10 `/arena/sprites/*.png` requests return 200.

- [ ] **Step 6: Final commit (only if fixes were made)**

```bash
git add -A
git commit -m "fix(arena): responsive + a11y polish"
```

---

## Self-Review (completed during planning)

**Spec coverage:**
- Corner Iron Mike, wiggle, links to `/arena` → Task 2. ✅
- Dedicated `/arena` route, full viewport, Back link, credit, `noindex` → Task 3. ✅
- Sprite pack (10 sheets, exact files) copied raw to `public/` → Task 1. ✅
- CSS `play4/6/8` keyframes + state classes, pixelated, orc flip → Task 4. ✅
- RAF state-machine engine, spawner cap, translateX-only motion, visibility pause → Task 5. ✅
- Endless brawl choreography (march → clash → attack/hurt/death → replace) → Task 5. ✅
- Reduced-motion static tableau + caption, Mike wiggle off → Tasks 2, 4, 5, 6. ✅
- Sitemap exclusion + base-path (root, no prefix needed) → Task 3. ✅
- Licensing credit line → Task 3. ✅
- Verification (build, check, manual, mobile, a11y) → Task 7. ✅

**Deviation from spec (intentional, simpler):** the spec proposed a `hideMike` prop on `Layout.astro`; since `/arena` is standalone and does not use `Layout`, Mike is simply rendered unconditionally in `Layout` and is naturally absent from `/arena`. No prop needed (YAGNI).

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `Side`/`State` unions, `SHEETS` keys, and all `Unit` fields are used consistently across `setState`/`spawn`/`tick`/`applyHit`; CSS state classes (`st-idle|walk|attack|hurt|death`) match `SHEETS` state keys and the JS `setState` class list; animation durations in `arena.ts` (520/300/600 ms) match the CSS lengths (0.52s/0.3s/0.6s).
```
