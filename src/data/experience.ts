export interface Experience {
  company: string;
  project: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  shortBullets: string[];
  tags: string[];
}

export const experiences: Experience[] = [
  {
    company: 'Roko Labs',
    project: 'People 2.0',
    role: 'Software Engineer',
    period: 'Sep 2025 — Present',
    location: 'New York, USA',
    bullets: [
      'Building and maintaining backend services with .NET Web API, supporting a large-scale workforce management platform with complex business logic and external integrations.',
      'Developing and maintaining WPF desktop applications, implementing UI controls and handling ongoing maintenance across multiple client-facing tools.',
      'Working with LLBGen ORM for data access against SQL Server, managing database schemas and optimizing queries for high-volume transactional workflows.',
      'Contributing to the Angular-based web UI and integrating with numerous third-party external systems and services.',
    ],
    shortBullets: [
      'Backend services powering an enterprise workforce-management platform (.NET Web API).',
      'Led modernization of mission-critical WPF desktop tools — reducing technical debt and streamlining UI component delivery for enterprise-scale workforce management.',
      'Tuned SQL Server schemas and high-volume queries via LLBGen ORM.',
      'Angular UI features and integrations with multiple third-party systems.',
    ],
    tags: ['.NET Web API', 'WPF', 'SQL Server', 'LLBGen', 'Angular'],
  },
  {
    company: 'Roko Labs',
    project: 'Kipany',
    role: 'Software Engineer',
    period: 'Jan 2023 — Sep 2025',
    location: 'New York, USA',
    bullets: [
      'Engineered and delivered a full-stack Job Management portal using .NET 8 and React, providing centralized monitoring, reporting, and execution capabilities for critical operational tasks across diverse server environments.',
      'Implemented automated job execution and log aggregation workflows using Jenkins CI/CD, significantly streamlining operational processes and improving observability.',
      'Led the modernization of 25–30 legacy .NET Framework console applications to .NET 6, rewriting them into a modular monolith for improved performance and maintainability.',
      'Architected and developed robust, transactional features for critical workflow segments, incorporating automated cleanup mechanisms to ensure data integrity during failures.',
    ],
    shortBullets: [
      'Built a full-stack Job Management portal (.NET 8 + React) — centralized monitoring, reporting, and execution.',
      'Led migration of 25–30 legacy .NET Framework console apps into a .NET 6 modular monolith.',
      'Designed Jenkins CI/CD workflows that automated job execution and log aggregation, replacing manual ops.',
      'Architected transactional features with automatic cleanup on failure for critical workflows.',
    ],
    tags: ['.NET 8', 'React', 'Jenkins CI/CD', '.NET 6', 'SQL Server'],
  },
  {
    company: 'Roko Labs',
    project: 'FracStream',
    role: 'Backend Software Developer',
    period: 'Jul 2022 — Jan 2023',
    location: 'New York, USA',
    bullets: [
      'Pinpointed and resolved critical API performance bottlenecks within a data-intensive application through comprehensive endpoint analysis and optimization strategies.',
      'Architected and implemented a dedicated .NET microservice leveraging MongoDB for read operations, successfully decoupling it from a legacy Django monolith and significantly boosting query performance and system scalability.',
      'Engineered and deployed multiple .NET microservices, including an Auth0-integrated authentication service utilizing PostgreSQL, enhancing overall system modularity, security, and scalability.',
      'Achieved an 80% reduction in average page load times (from 15s to 3s) by implementing targeted backend optimizations, markedly improving user experience and system responsiveness.',
    ],
    shortBullets: [
      'Cut average page load 80% (15s → 3s) through targeted backend optimization.',
      'Built a .NET + MongoDB read microservice, decoupling read traffic from a legacy Django monolith.',
      'Shipped an Auth0-integrated authentication microservice on PostgreSQL.',
      'Diagnosed and resolved critical API bottlenecks via endpoint analysis.',
    ],
    tags: ['.NET', 'MongoDB', 'Django', 'Auth0', 'PostgreSQL'],
  },
  {
    company: 'Tacta',
    project: 'CoBen',
    role: 'Full Stack Software Engineer',
    period: 'Dec 2020 — Jul 2022',
    location: 'Sarajevo, Bosnia and Herzegovina',
    bullets: [
      'Contributed as a key full-stack developer within an Agile team, developing and maintaining 10+ microservices constituting a large-scale enterprise application using .NET Core, Angular, and various backend technologies.',
      'Applied Domain-Driven Design (DDD) principles and championed Test-Driven Development (TDD) practices, ensuring high code quality and maintainability through comprehensive unit testing across the microservice architecture.',
      'Led the design and development of a complex, event-sourced data processing microservice, architecting for high scalability and data resilience in critical business workflows.',
      'Engineered microservices and REST APIs for an enterprise application managing construction workers in Belgium, handling complex integrations with government platforms and third-party services.',
    ],
    shortBullets: [
      'Full-stack development on a 10+ microservice enterprise app for Belgian construction-worker management.',
      'Designed and built an event-sourced data processing microservice for critical business workflows.',
      'Championed DDD and TDD practices across the microservice architecture.',
      'REST APIs and integrations with Belgian government platforms and third-party services.',
    ],
    tags: ['.NET Core', 'Angular', 'DDD', 'TDD', 'Event Sourcing'],
  },
];
