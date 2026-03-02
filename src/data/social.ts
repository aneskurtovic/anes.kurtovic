export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/aneskurtovic',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/anes-kurtovic-b50040135',
    icon: 'linkedin',
  },
  {
    name: 'Email',
    url: 'mailto:anes.kurtovic@gmail.com',
    icon: 'mail',
  },
];

export const contactInfo = {
  email: 'anes.kurtovic@gmail.com',
  phone: '+387 61 489 550',
  location: 'Sarajevo, Bosnia and Herzegovina',
};
