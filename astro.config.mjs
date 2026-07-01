import { defineConfig } from 'astro/config';
import { readdirSync, readFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';

// Map blog post URLs -> real publish date (from frontmatter) so the sitemap
// reports accurate <lastmod> instead of "now" on every build.
const blogDir = new URL('./src/content/blog/', import.meta.url);
const blogDates = {};
try {
  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.md')) continue;
    const raw = readFileSync(new URL(file, blogDir), 'utf-8');
    const match = raw.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
    if (match) {
      blogDates[`https://aneskurtovic.com/blog/${file.replace(/\.md$/, '')}/`] = match[1];
    }
  }
} catch {
  // content dir not readable at config time — sitemap simply omits lastmod
}

export default defineConfig({
  site: 'https://aneskurtovic.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/arena'),
      changefreq: 'monthly',
      priority: 0.7,
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
          if (blogDates[url]) item.lastmod = blogDates[url];
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
