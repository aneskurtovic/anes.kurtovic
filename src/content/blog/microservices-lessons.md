---
title: "5 Lessons from Building Microservices"
date: 2026-03-05
description: "Things I wish I knew before splitting a monolith into microservices — from service boundaries to observability."
tags: ["architecture", "microservices", ".net"]
draft: false
---

After spending the better part of a year migrating a monolithic .NET application into microservices, here are the lessons that stuck with me.

## 1. Start with the domain, not the technology

It's tempting to jump straight into Docker, Kubernetes, and message brokers. Don't. The hardest part of microservices is drawing the right boundaries — and that's a domain modeling problem, not an infrastructure one.

We used event storming sessions to map out bounded contexts before writing a single line of infrastructure code. That upfront investment saved us from painful service splits later.

## 2. Shared databases are a trap

Early on, we had two services reading from the same SQL database. It felt pragmatic. Within weeks, schema changes in one service broke the other. Each service needs to own its data — full stop.

```csharp
// Each service gets its own DbContext with only its tables
public class OrderDbContext : DbContext
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderLine> OrderLines => Set<OrderLine>();
    // No Customer table here — that belongs to the Customer service
}
```

## 3. Async communication is your friend

Synchronous HTTP calls between services create tight coupling and cascading failures. We moved most inter-service communication to an event bus and the system became dramatically more resilient.

The pattern is simple: publish domain events when state changes, let interested services subscribe and react.

## 4. Invest in observability early

With a monolith, you can attach a debugger and step through the code. With microservices, a single user request might touch five services. Without distributed tracing, you're flying blind.

We added OpenTelemetry from day one. Correlated logs, traces, and metrics across services. Worth every minute of setup time.

## 5. Don't microservice everything

Not every piece of your system needs to be its own service. We kept our authentication and authorization logic in a shared library rather than a separate service. Sometimes a well-structured monolith module is the right answer.

The goal isn't maximum decomposition — it's independent deployability where it matters most.
