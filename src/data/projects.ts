export interface Project {
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  highlights?: string[];
}

export const projects: Project[] = [
  {
    name: 'Ludo Nexus',
    subtitle: 'Multiplayer Ludo with Elemental Powers',
    description:
      'A real-time, web-based reinvention of Ludo. Players pick one of 6 elemental affinities — each with a unique passive ability — and draw Chaos Cards mid-game to swing the board.',
    tags: ['.NET 9', 'SignalR', 'React 19', 'TypeScript', 'Tailwind CSS', 'Docker', 'Caddy'],
    live: 'https://ludo-nexus.com',
    featured: true,
    highlights: [
      'Architected a real-time multiplayer game platform for 2–6 players on .NET 9 + SignalR WebSockets — low-latency gameplay with resilient reconnect handling',
      'Designed a modular rules engine: elemental affinities and Chaos Card mechanics expand gameplay without coupling core systems',
      '6 elemental affinities (Fire, Water, Air, Earth, Lightning, Nature) — each with a unique passive ability',
      '4 Chaos Cards drawn mid-game: Reverse, Blockade, Double Down, Swap',
      'Complete multiplayer flow — public lobbies, private rooms with 6-character invite codes, global leaderboard, configurable turn timers, and local pass-and-play',
      'Stack: React 19 + TypeScript + Tailwind frontend, containerized with Docker, served via Caddy for production deployment',
      'Used Claude Code to automate boilerplate generation, freeing focus for complex game logic and WebSocket stability',
    ],
  },
  {
    name: 'Helifilm',
    subtitle: 'Aerial Cinematography Studio — Web',
    description:
      'Marketing website for a drone cinematography production company based in Sarajevo. Full-service studio covering aerial filming, post-production, and delivery for film, TV, tourism, and commercial clients across the Balkans.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com/aneskurtovic/Helifilm',
    live: 'https://aneskurtovic.github.io/Helifilm/',
    highlights: [
      'Cinematic landing page with full-bleed aerial reel and service breakdown',
      'Static-export Next.js build deployed via GitHub Pages — zero hosting cost',
      'Responsive layout tuned for tourism / commercial client pitches',
    ],
  },
  {
    name: 'MMA Klub Ratnik',
    subtitle: 'Martial Arts Club Website — Web',
    description:
      'Website for MMA Club Ratnik in Sarajevo, covering MMA, kickboxing, and BJJ programs for men, women, and children. Features a weekly schedule, FAQ, contact form, and bilingual (BS/EN) content.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/aneskurtovic/MMA-Klub-Ratnik',
    live: 'https://aneskurtovic.github.io/MMA-Klub-Ratnik/',
    highlights: [
      'Bilingual (Bosnian / English) site with persistent language switcher',
      'Weekly training schedule, FAQ, and lead-capture contact form',
      'Vanilla HTML/CSS/JS — no framework overhead, fast page loads',
    ],
  },
  {
    name: 'Apocalypse',
    subtitle: 'Full Stack — Mobile + Desktop + Web',
    description:
      'Virtual electronic music festival application with a .NET 6 Web API backend, Flutter mobile client, WinForms desktop client, and ASP.NET MVC web client.',
    tags: ['.NET 6 Web API', 'Flutter', 'WinForms', 'ASP.NET MVC'],
    github: 'https://github.com/aneskurtovic/Apocalypse',
    highlights: [
      'Single .NET 6 Web API powering three independent clients',
      'Flutter mobile + WinForms desktop + ASP.NET MVC web — one backend, three UX surfaces',
      'University capstone exploring cross-platform client architecture',
    ],
  },
  {
    name: 'Quizzard',
    subtitle: 'Full Stack — Web',
    description:
      'Quiz application with a RESTful API built with .NET Core 3.1 and a Single Page Application frontend built with Angular.',
    tags: ['.NET Core 3.1', 'Angular', 'REST API'],
    github: 'https://github.com/aneskurtovic/Quizard.API',
    highlights: [
      '.NET Core 3.1 REST API consumed by an Angular SPA',
      'Early-career project — first end-to-end SPA + API stack',
    ],
  },
];
