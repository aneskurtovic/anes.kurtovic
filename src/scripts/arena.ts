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
  lane: number;        // vertical band (px from ground) — for lane-aware spacing
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
const SCALE = 2.4;        // sprite zoom — big enough to read as a real battle
const SPEED = 55;         // px/s march speed
const REACH = 48;         // px dx at which a unit starts attacking
const MIN_GAP = 28;       // px spacing kept behind a same-side ally
const HP = 100;
const ATTACK_MS = 520;
const HIT_DELAY = 250;
const HURT_MS = 300;
const DEATH_MS = 600;
const CORPSE_MS = 900;    // corpse linger after the death animation
const MAX_PER_SIDE = 22;  // packed front line + reinforcements
const SPAWN_MIN = 220;    // reinforcements arrive fast to keep the field full
const SPAWN_VAR = 300;
const SEED_PER_SIDE = 13; // pre-placed army so the brawl reads full instantly
const SEED_SPACING = 26;  // horizontal gap between seeded ranks
const LANE_BAND = 24;     // only allies within this vertical band block advance

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

    // Keep ranks inside the visible ground band (26% of stage height), so units
    // never float above the dirt on short/landscape viewports.
    const laneMax = Math.max(48, Math.min(130, stage!.clientHeight * 0.26 - 24));
    const lane = 6 + Math.floor(Math.random() * laneMax); // vertical spread → deep ranks
    el.style.bottom = `${lane}px`;
    el.style.zIndex = String(200 - lane);             // front (lower) units on top
    stage!.appendChild(el);

    const u: Unit = {
      el,
      sprite,
      side,
      x: side === 'soldier' ? -40 : stageWidth() - 60,
      lane,
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
      if (Math.abs(o.lane - u.lane) > LANE_BAND) continue; // only same-row allies block
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

    let anyRemoved = false;
    for (const u of units) {
      if (u.state === 'death') {
        if (now >= u.deathDoneAt) {
          u.remove = true;
          anyRemoved = true;
        }
        continue;
      }
      if (u.pendingHit && now >= u.hitAt) {
        u.pendingHit = false;
        applyHit(u, now);
      }
      if (now < u.busyUntil) continue; // locked in attack/hurt

      // Cull anyone who broke through the line and marched off the field, so a
      // runaway never permanently consumes a living slot on this endless screen.
      // Spawn points (-40 / width-60) sit safely inside this margin.
      if (u.x < -160 || u.x > stageWidth() + 160) {
        u.remove = true;
        anyRemoved = true;
        continue;
      }

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

    // Only rebuild the array on frames where a corpse actually expired — most
    // frames allocate nothing (honours the "no per-frame allocation" constraint).
    if (anyRemoved) {
      units = units.filter((u) => {
        if (u.remove) {
          u.el.remove();
          return false;
        }
        return true;
      });
    }

    raf = requestAnimationFrame(tick);
  }

  // Seed a starting army on each side, spread across its own half, so the
  // battlefield is crowded the instant the page loads (the spawner then tops
  // each side up to MAX_PER_SIDE as fighters fall).
  const w = stageWidth();
  // Fit the seeded ranks inside each half so they never overlap in the middle
  // on narrow (phone) viewports.
  const seedCount = Math.max(4, Math.min(SEED_PER_SIDE, Math.floor((w / 2 - 50) / SEED_SPACING)));
  for (let i = 0; i < seedCount; i++) {
    spawn('soldier');
    const s = units[units.length - 1];
    s.x = 20 + i * SEED_SPACING; // ranks across the left
    render(s);

    spawn('orc');
    const o = units[units.length - 1];
    o.x = w - 60 - i * SEED_SPACING; // ranks across the right
    render(o);
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
    el.style.transform = `translateX(${x}px) scale(${SCALE})`;
    const sprite = document.createElement('div');
    sprite.className = 'sprite';
    sprite.style.backgroundImage = `url("${SHEETS[side][state]}")`; // frame 0, no st- class
    el.appendChild(sprite);
    stage.appendChild(el);
  };

  const mid = stage.clientWidth / 2;
  const step = Math.min(80, (mid - 40) / 3); // fits within the viewport on mobile
  const groundPx = stage.clientHeight * 0.26;
  const b = (v: number) => Math.min(v, Math.max(24, groundPx - 24)); // keep on the dirt
  place('soldier', mid - step * 2.6, b(60), 'walk');
  place('soldier', mid - step * 1.6, b(30), 'attack');
  place('soldier', mid - step * 0.7, b(96), 'walk');
  place('orc', mid + step * 0.3, b(30), 'attack');
  place('orc', mid + step * 1.3, b(64), 'walk');
  place('orc', mid + step * 2.2, b(100), 'walk');

  const cap = document.createElement('p');
  cap.className = 'reduced-caption';
  cap.textContent = '⚔️ battle paused — reduced motion is on.';
  stage.appendChild(cap);
}
