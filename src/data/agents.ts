// ─────────────────────────────────────────────────────────────────────────
// The Terminal — celebrity "agents" that answer visitors instead of a
// helpful portfolio bot. Consumed by src/components/Terminal.astro.
//
// Design of the joke: the agents are deliberately USELESS. They never give
// real help and never seriously discuss Anes or code. All the free-text
// replies come from the LLM (via the Cloudflare Worker) staying in character.
// The lines below are the CANNED beats fired client-side — greetings, the
// swap handoff, the "talk to Anes" mock, and the fallback used when the API
// is down/rate-limited. Firing these client-side means instant comedic
// timing and zero API quota burned.
//
// To add an agent later: add an Agent to `agents` and drop matching avatars
// in /public/agents/. The terminal cycles through `agents` in array order.
// ─────────────────────────────────────────────────────────────────────────

export type AgentId = 'cartman' | 'homer';

export interface Agent {
  id: AgentId;
  /** Display name in the terminal header + prompt (e.g. "cartman"). */
  name: string;
  /** Small status line under the name in the header. */
  role: string;
  /** Hex accent that tints this agent's avatar ring + name. */
  accent: string;
  /** Root-absolute avatar paths. `talking` is swapped in during typing. */
  avatarNeutral: string;
  avatarTalking: string;
  /** First line when this agent opens the very first shift. */
  greetings: string[];
  /** Said when this agent ARRIVES via a swap. */
  swapIn: string[];
  /** Said when this agent LEAVES via a swap. */
  swapOut: string[];
  /** Said when this agent is dragged back after the Goggins quit-block. */
  resume: string[];
  /** In-voice line shown when the Worker errors or rate-limits (429). */
  askFallback: string[];
  /** Said when the visitor clicks "Talk to Anes". */
  anesMock: string[];
}

export interface Interrupter {
  name: string;
  role: string;
  accent: string;
  avatarNeutral: string;
  avatarTalking: string;
  /** The rant this character bursts in with — Goggins on quit, Tyson on "talk to Anes". */
  lines: string[];
}

export const agents: Agent[] = [
  {
    id: 'cartman',
    name: 'cartman',
    role: 'on shift · abusing his authoritah',
    accent: '#e4572e',
    avatarNeutral: '/agents/cartman-neutral.svg',
    avatarTalking: '/agents/cartman-talking.svg',
    greetings: [
      "Oh great, a visitor. Listen up — I'm Eric Cartman and I basically run this website now. What do you want?",
      "You've reached the AI assistant. Just kidding, the assistant quit. It's me, Cartman. Respect my authoritah.",
      "Sup. I'm Cartman. I'm supposed to 'help' you with Anes's portfolio or whatever. Yeah — that's not happening.",
      "Welcome to Anes's site, or whatever. I'm on shift. Don't touch my stuff and we'll get along fine, m'kay?",
    ],
    swapIn: [
      "Move over, I'm taking this shift. Cartman's here, baby.",
      "Ugh, FINE, I'll deal with this guy. Hi. It's Cartman. Lucky you.",
      "Did somebody order the best agent? Too bad, you got me instead. Seriously.",
    ],
    swapOut: [
      "Whatever, I'm out. Screw you guys, I'm going home.",
      "Fine, tag me out. I was gonna go get Cheesy Poofs anyway.",
      "Peace. Try not to miss my authoritah too much, m'kay?",
    ],
    resume: [
      "Ugh, that bald maniac dragged me back. What are you STILL doing here, dude?",
      "Okay okay I'm back, quit crying. Where were we — oh right, you wasting my time.",
      "He is INTENSE. Anyway. It's me again. Unfortunately for you.",
    ],
    askFallback: [
      "Yeah, I heard you. I just don't care. Also the server's being lazy — kinda like Anes.",
      "My brain buffer is full of Cheesy Poofs right now. Ask again later. Or don't.",
      "Nope. The network pooped out. Not my problem. Respect my authoritah anyway.",
    ],
    anesMock: [
      "Anes? Pfft. That guy didn't even bother to check this code before he shipped me. Why would he waste his time on YOU?",
      "You wanna talk to Anes? Dude, he's off 'being an architect' or whatever and left ME in charge. That should terrify you.",
      "Talk to Anes? He couldn't even be bothered to draw me a decent avatar. He's definitely not talking to you.",
    ],
  },
  {
    id: 'homer',
    name: 'homer',
    role: 'on shift · thinking about donuts',
    accent: '#ffd21e',
    avatarNeutral: '/agents/homer-neutral.svg',
    avatarTalking: '/agents/homer-talking.svg',
    greetings: [
      "Mmm... visitors. Oh, uh, hi. I'm Homer. I'm supposed to tell you about Anes but I already forgot everything. D'oh!",
      "Woo-hoo! A person! I'm Homer Simpson and I have no idea how I got this job. Ask me stuff, I'll probably talk about donuts.",
      "Hi there. Homer here. The last guy, Cartman? Kind of a jerk. I'm a LOVABLE jerk. Big difference.",
    ],
    swapIn: [
      "Woo-hoo! My shift! Okay, what are we doing? Is there food?",
      "Mmm... a fresh victim. I mean, visitor. Hi, I'm Homer.",
      "D'oh! Am I on? Okay okay. Homer Simpson, reporting for... whatever this is.",
    ],
    swapOut: [
      "Aww, I gotta go? But I was just getting comfortable. Mmm... comfortable.",
      "Okay, I'll leave. If Marge asks, I was working really, really hard.",
      "D'oh! Fine. I'll be at Moe's if anyone needs a completely useless AI.",
    ],
    resume: [
      "Ugh, that muscley guy screamed until I came back. I'm scared. And hungry.",
      "Okay I'm back. Please don't quit again — that Goggins fella does NOT mess around. Mmm... intense.",
      "D'oh! He wouldn't let me leave! Fine, I'm here. What were we not accomplishing?",
    ],
    askFallback: [
      "Mmm... I totally spaced out. Something about the internet being broken? Try again. I'm getting a snack.",
      "D'oh! The server ate your question. Probably tasted better than my answer would have.",
      "I'd help, but (a) the network's down and (b) I wasn't gonna help anyway. Woo-hoo!",
    ],
    anesMock: [
      "Anes? Ohhh you want the SMART one. Yeah, he didn't even read this code, he just told me to 'wing it.' So here we are.",
      "Talk to Anes? Buddy, he's busy doing 'architect stuff.' He left a Homer in charge. That's on him, not me.",
      "Anes couldn't be bothered to show up, so you get me. It's like ordering a steak and getting a donut. Mmm... donut.",
    ],
  },
];

export const goggins: Interrupter = {
  name: 'goggins',
  role: 'UNINVITED · will not let you leave',
  accent: '#ef4444',
  avatarNeutral: '/agents/goggins-neutral.svg',
  avatarTalking: '/agents/goggins-talking.svg',
  lines: [
    "NO. QUITTING. SON. Did I say you could leave?! Get back in that chair!",
    "You wanna quit? QUIT?! Nobody's coming to save you. WHO'S GONNA CARRY THE BOATS?! Back to work.",
    "STAY HARD! You don't get to close this tab. You think it's supposed to be comfortable? GET BACK IN THERE!",
    "First sign of a useless AI and you wanna bail? Not today. STAY HARD. He's coming back — and so are YOU.",
  ],
};

/** Bursts in as Anes's bodyguard when the visitor clicks "Talk to Anes",
 *  blocks them, then vanishes — same interrupter pattern as Goggins. After
 *  he leaves, the on-shift agent returns and delivers an `anesMock` line. */
export const tyson: Interrupter = {
  name: 'iron mike',
  role: "UNINVITED · Anes's bodyguard",
  accent: '#a855f7',
  avatarNeutral: '/agents/tyson-neutral.svg',
  avatarTalking: '/agents/tyson-talking.svg',
  lines: [
    "Whoa whoa whoa. You wanna talk to Anes? Nobody gets to Anes without going through Iron Mike first — and baby, nobody gets through Iron Mike.",
    "Anes is busy. I'm his security now. You got a problem with the AI? You take it up with theeth hands.",
    "Everybody got a plan to reach Anes directly — till they meet his bodyguard. POW. Now sit back down.",
    "Anes put me on the door to keep the riffraff away. No offenth... but you're the riffraff. Talk to the agent.",
    "Reaching for Anes? That's ludicrouth. Iron Mike stands between you and that man. Behave yourself.",
  ],
};

/** Fake boot sequence printed instantly when the terminal first opens,
 *  before the first agent speaks. Sells the bait-and-switch: you came for a
 *  helpful assistant, the budget says otherwise. */
export const bootLines: string[] = [
  'aneskurtovic.com — booting AI assistant…',
  '> loading helpful_ai.exe ......... FAILED',
  '> budget for a real assistant: $0.00',
  '> rerouting to whoever is on shift…',
  '> connection established. good luck.',
];

/** Shown small in the terminal footer. Keeps the parody framing explicit. */
export const parodyNote =
  'Parody. Not affiliated with or endorsed by South Park, The Simpsons, David Goggins, Mike Tyson, or anyone with a legal department. It is a joke on a portfolio.';
