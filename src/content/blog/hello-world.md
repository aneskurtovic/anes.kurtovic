---
title: "Hello, World!"
date: 2026-03-09
description: "First post on my new blog — a quick intro and what to expect."
tags: ["meta", "intro"]
draft: false
---

Welcome to my blog. I'm Anes, a software engineer who works primarily with .NET, microservices, and full-stack development. This is where I'll share things I've learned, projects I'm working on, and thoughts on the craft of building software.

## What to expect

I plan to write about:

- **Architecture patterns** — microservices, event-driven design, and when (not) to use them
- **Developer tooling** — things that make the day-to-day better
- **Project deep-dives** — walking through real problems and how I solved them

## A quick code sample

Here's a simple C# example to kick things off:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello, World!");

app.Run();
```

Nothing fancy — just the starting point. More to come.

## Why a blog?

Writing forces clarity. If I can't explain something clearly in a post, I probably don't understand it well enough. This blog is as much for me as it is for anyone reading.

Thanks for stopping by. Stay tuned.
