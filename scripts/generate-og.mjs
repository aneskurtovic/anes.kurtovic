// Generates public/og-image.png (1200x630) — branded social share card.
// Run: node scripts/generate-og.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = resolve(__dirname, '../public/og-image.png');

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="100%" stop-color="#101019"/>
    </linearGradient>
    <radialGradient id="glow" cx="18%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#ffffff" fill-opacity="0.05"/>
    </pattern>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#dots)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="0" width="8" height="${H}" fill="#38bdf8"/>

  <text x="80" y="170" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="26" fill="#38bdf8">// backend &amp; platform engineer</text>

  <text x="78" y="300" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="110" fill="#e4e4e7">Anes Kurtović</text>

  <text x="80" y="385" font-family="Inter, DejaVu Sans, sans-serif" font-weight="500" font-size="40" fill="#a1a1aa">I build &amp; modernize .NET backends, real-time</text>
  <text x="80" y="438" font-family="Inter, DejaVu Sans, sans-serif" font-weight="500" font-size="40" fill="#a1a1aa">systems &amp; cloud-native services.</text>

  <text x="80" y="545" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="28" fill="#38bdf8" letter-spacing="1">.NET · AWS · SignalR · SQL Server · React</text>

  <text x="${W - 80}" y="545" text-anchor="end" font-family="JetBrains Mono, DejaVu Sans Mono, monospace" font-size="26" fill="#52525b">aneskurtovic.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('Wrote', out);
