export interface Certification {
  name: string;
  code: string;
  year: number;
  provider: 'aws' | 'azure';
}

export const certifications: Certification[] = [
  {
    name: 'AWS AI Foundations',
    code: 'AWS-AIF',
    year: 2025,
    provider: 'aws',
  },
  {
    name: 'AWS Developer Associate',
    code: 'AWS-DVA',
    year: 2025,
    provider: 'aws',
  },
  {
    name: 'AWS Cloud Practitioner',
    code: 'AWS-CCP',
    year: 2025,
    provider: 'aws',
  },
  {
    name: 'Microsoft Azure Fundamentals',
    code: 'AZ-900',
    year: 2022,
    provider: 'azure',
  },
];
