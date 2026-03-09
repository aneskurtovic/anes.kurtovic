export interface SkillCategory {
  name: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    name: 'Languages',
    items: ['C#', 'TypeScript', 'JavaScript', 'SQL', 'C++'],
  },
  {
    name: 'Backend',
    items: ['.NET Framework', '.NET Core', 'ASP.NET Web API', 'ASP.NET MVC', 'Python'],
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
