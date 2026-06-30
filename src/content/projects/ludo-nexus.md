---
title: Ludo Nexus
subtitle: Real-time multiplayer board game with elemental powers
summary: A web-based reinvention of Ludo for 2–6 players, built on an authoritative .NET 9 + SignalR server. Players pick one of six elemental affinities and draw Chaos Cards mid-game to swing the board — all kept consistent across clients in real time.
year: 2025
role: Solo — architecture, backend, frontend, deployment
stack:
  - .NET 9
  - SignalR (WebSockets)
  - React 19
  - TypeScript
  - Tailwind CSS
  - Docker
  - Caddy
liveUrl: https://ludo-nexus.com
metrics:
  - value: "2–6"
    label: Players per live match
  - value: "6"
    label: Elemental affinities, each with a passive
  - value: "<100ms"
    label: Target server-to-client move latency
order: 1
---

> **Note:** Gameplay screenshots and architecture diagrams are being added.
> The write-up below reflects the system as built.

## The problem

Classic Ludo is turn-based and forgiving — but a *real-time, online* version is not.
The moment several players share one board over the network, three hard problems appear at
once:

1. **Authority.** Whose version of the board is true? If clients compute their own moves,
   they will disagree the instant latency or a refresh enters the picture.
2. **Consistency under churn.** Players drop connection, switch tabs, and rejoin. The game
   must survive that without corrupting state or stalling the other five players.
3. **Extensibility.** Elemental affinities and Chaos Cards change the rules mid-match. Those
   mechanics had to expand the game *without* turning the core engine into a tangle of
   special cases.

## Architecture

### Authoritative server, thin clients

The server is the single source of truth. Clients send **intents** ("roll", "move this
token", "play this Chaos Card"); they never mutate game state directly. The .NET 9 backend
validates each intent against the current state, applies it through the rules engine, and
broadcasts the resulting state diff to every player in the room over SignalR. A tampered or
out-of-order client message is simply rejected — the board can't be desynced from the
outside.

<!-- TODO: architecture diagram — client intents → SignalR hub → game-state engine → broadcast -->

### The game-state engine

Each active match is an in-memory state machine keyed by room. A turn advances through a
small, explicit lifecycle — `AwaitingRoll → Rolled → AwaitingMove → Resolving → NextTurn` —
so every transition is a named, testable step rather than ad-hoc mutation. Keeping the
authoritative state server-side means the rules engine, not the UI, decides what is legal.

### A modular rules engine

Affinities and Chaos Cards are modeled as composable modifiers over the base ruleset rather
than branches inside it. Each affinity contributes a passive effect; each Chaos Card
(Reverse, Blockade, Double Down, Swap) is a discrete effect applied to the state during the
`Resolving` phase. New mechanics plug in as new modifiers — the core movement and capture
rules don't change. That separation is what keeps six distinct affinities from collapsing
into an unmaintainable pile of conditionals.

### Connection lifecycle & reconnection

SignalR connection IDs are ephemeral, so they can't be the player's identity. Players are
bound to a **stable seat** in the room; the connection ID is just the current transport for
that seat. When a socket drops and the player rejoins, they reclaim their seat and receive a
full state snapshot to resync — the match keeps running for everyone else in the meantime.
Configurable turn timers keep a disconnected player from freezing the table.

<!-- TODO: sequence diagram — disconnect → seat retained → rejoin → snapshot resync -->

### Rooms, lobbies & matchmaking

The same room abstraction powers public lobbies, private rooms (joined via a 6-character
invite code), a global leaderboard, and local pass-and-play on a single device. Room
ownership and lifecycle (open → in-progress → finished) are managed server-side.

## Deployment

The React 19 + TypeScript + Tailwind frontend is built as static assets and served by
**Caddy**, which also terminates TLS and reverse-proxies the SignalR/API traffic to the
.NET container. The whole stack runs in Docker, so the production topology
(`browser → Caddy → .NET API/SignalR`) is reproducible from a single compose definition.

## Trade-offs & what I'd improve

- **In-memory match state** keeps latency low and the model simple, but a single instance is
  the scaling ceiling. The next step is a backing store / distributed cache so matches
  survive a process restart and the server can scale horizontally behind sticky routing.
- **AI-assisted, human-owned.** I used Claude Code to generate boilerplate (DTOs, wiring,
  scaffolding) and spent the saved time on the parts that actually decide whether a
  real-time game feels right: the authoritative state engine and reconnection logic.
- **Next up:** automated test coverage for the rules engine's edge cases (simultaneous
  captures, Chaos Card interactions) and observability around socket churn.

## Links

- **Play it:** [ludo-nexus.com](https://ludo-nexus.com)
