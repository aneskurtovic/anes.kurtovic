export interface SkillCategory {
  name: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    name: 'Languages & Backend',
    items: [
      'C#',
      'TypeScript',
      'JavaScript',
      'SQL',
      'C++',
      'Python',
      '.NET Framework',
      '.NET Core',
      'ASP.NET Web API',
      'ASP.NET MVC',
    ],
  },
  {
    name: 'Frontend',
    items: ['React', 'Angular', 'VueJS', 'Flutter', 'WinForms'],
  },
  {
    name: 'Databases',
    items: ['SQL Server', 'PostgreSQL', 'MongoDB', 'SAP HANA'],
  },
  {
    name: 'Cloud & DevOps',
    items: ['AWS', 'Azure', 'Jenkins', 'Git', 'Docker'],
  },
  {
    name: 'Concepts',
    items: ['REST API', 'Microservices', 'DDD', 'Event Sourcing', 'TDD', 'Ports & Adapters'],
  },
  {
    name: 'AI-Augmented Development',
    items: ['Claude Code', 'Agent Orchestration', 'Custom Skills & Hooks', 'MCP Servers', 'Prompt Engineering'],
  },
];
