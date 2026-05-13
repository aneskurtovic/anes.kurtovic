import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aneskurtovic.com',
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        const url = item.url;
        if (url === 'https://aneskurtovic.com/') {
          item.priority = 1.0;
          item.changefreq = 'monthly';
        } else if (url === 'https://aneskurtovic.com/blog/') {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (url.startsWith('https://aneskurtovic.com/blog/')) {
          item.priority = 0.6;
          item.changefreq = 'yearly';
        }
        return item;
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-default',
    },
  },
});
