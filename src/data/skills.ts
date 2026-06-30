export interface SkillCategory {
  name: string;
  items: string[];
  featured?: boolean;
}

export const skills: SkillCategory[] = [
  {
    name: 'Core',
    featured: true,
    items: [
      'C#',
      '.NET (Core / 8 / 9)',
      'ASP.NET Web API',
      'SQL Server',
      'REST & Microservices',
      'SignalR / Real-Time',
      'AWS',
      'Domain-Driven Design',
      'Event Sourcing',
    ],
  },
  {
    name: 'Languages & Frameworks',
    items: [
      'TypeScript',
      'JavaScript',
      'SQL',
      'C++',
      'Python',
      'React',
      'Angular',
      'Vue.js',
      'Flutter',
    ],
  },
  {
    name: 'Databases',
    items: ['SQL Server', 'PostgreSQL', 'MongoDB', 'SAP HANA'],
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'Docker', 'Jenkins CI/CD', 'Git'],
  },
  {
    name: 'Practices',
    items: ['Clean Architecture', 'TDD', 'Ports & Adapters', 'ASP.NET MVC', 'WPF / WinForms'],
  },
  {
    name: 'AI-Augmented Development',
    items: ['Claude Code', 'Agent Orchestration', 'Custom Skills & Hooks', 'MCP Servers', 'Prompt Engineering'],
  },
];
