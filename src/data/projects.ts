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
    subtitle: 'Real-time Multiplayer Board Game',
    description:
      'A modern, real-time multiplayer take on the classic Ludo board game with Chaos Cards and elemental themes. Built as a game-client-style web app with immersive visuals and real-time gameplay.',
    tags: ['.NET 9', 'SignalR', 'React 19', 'TypeScript', 'Tailwind CSS', 'Docker', 'Caddy'],
    live: 'https://ludo-nexus.com',
    featured: true,
    highlights: [
      'Real-time multiplayer for 2–6 players via SignalR WebSockets',
      'Room system with public/private lobbies and 6-character codes',
      'Chaos Cards: Reverse, Blockade, Double Down, Swap',
      '6 elemental themes with immersive visual design',
      'Reconnection support and configurable turn timers',
      'Built with AI assistance',
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
