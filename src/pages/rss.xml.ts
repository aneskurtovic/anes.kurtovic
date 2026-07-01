import { getCollection } from 'astro:content';

// Hand-rolled RSS 2.0 feed for the blog (no @astrojs/rss dependency, in keeping
// with the site's zero-extra-deps ethos). Static endpoint → emitted as /rss.xml.
const SITE = 'https://aneskurtovic.com';

const escapeXml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export async function GET(): Promise<Response> {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );

  const items = posts
    .map((post) => {
      const url = `${SITE}/blog/${post.id}/`;
      const categories = post.data.tags
        .map((t) => `      <category>${escapeXml(t)}</category>`)
        .join('\n');
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
${categories}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anes Kurtovic — Blog</title>
    <link>${SITE}/blog/</link>
    <description>Articles on software engineering, architecture, and developer tooling.</description>
    <language>en</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
