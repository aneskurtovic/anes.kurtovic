# Agent Avatar Placeholders & Replacement Guide

This directory contains **placeholder SVG avatars** for three characters used in agent conversations. These are flat-vector caricatures intended as temporary standin graphics while you source or generate production-quality portraits.

## How the Site Uses These Files

The Astro site references avatar paths in `src/data/agents.ts`. Each character has two variants:

- `avatarNeutral` — neutral expression (mouth closed)
- `avatarTalking` — talking expression (mouth open)

Current file references (expected paths):
- `/agents/cartman-neutral.svg` & `/agents/cartman-talking.svg`
- `/agents/homer-neutral.svg` & `/agents/homer-talking.svg`
- `/agents/goggins-neutral.svg` & `/agents/goggins-talking.svg`

## Replacing the Placeholders

You have two options:

### Option A: Keep the SVG filenames and replace content
Edit the existing `.svg` files in place with your new artwork. No code changes needed.

### Option B: Use new image files (WebP, PNG, JPEG)
Save your generated images with new names (e.g., `cartman-neutral.webp`, `homer-neutral.png`) and update the path references in `src/data/agents.ts`:

```typescript
{
  name: 'Cartman',
  avatarNeutral: '/agents/cartman-neutral.webp',  // Update this
  avatarTalking: '/agents/cartman-talking.webp',  // Update this
  // ...
}
```

## Image Generation Recommendations

**Output specifications for best results:**
- **Format:** WebP, PNG, or JPEG (WebP recommended for file size)
- **Size:** Square, 512×512 pixels minimum (or keep SVG for vector scalability)
- **Background:** Dark or transparent (the site may add its own background)
- **Framing:** Head-and-shoulders, front-facing
- **Consistency:** The neutral and talking versions must use identical pose/framing — only the mouth should differ (closed → open). This ensures the mouth-swap animation looks natural.

---

## AI Image Generation Prompts

Use these prompts with your preferred image generator (DALL-E, Midjourney, Stable Diffusion, etc.).

### 1. Cartman (Neutral)
**Primary prompt (character name):**
```
Front-facing portrait of Eric Cartman from South Park, flat cartoon vector art style. 
Round pale-peach face, bright blue-teal winter beanie with a yellow pom-pom on top and 
yellow brim band, two small round eyes close together with black pupils, small closed mouth line. 
Red jacket collar visible at bottom of frame. Dark background. Studio lighting, centered head-and-shoulders.
```

**Fallback prompt (feature-based, if character names are refused):**
```
Flat cartoon vector art, front-facing portrait of a chubby cartoon boy with a round pale-peach face, 
bright blue-teal winter beanie with yellow pom-pom and yellow band, two small close-set round eyes 
with black pupils, small red jacket collar at bottom, closed mouth line. Dark background, centered 
head-and-shoulders composition, South Park-style flat shapes with bold outlines.
```

### 2. Cartman (Talking)
**Primary prompt:**
```
Front-facing portrait of Eric Cartman from South Park, flat cartoon vector art style. 
Same as neutral version but with mouth open in an O-shape oval (talking/surprised expression). 
Round pale-peach face, bright blue-teal winter beanie with yellow pom-pom and yellow brim band, 
two small round eyes close together. Red jacket collar visible at bottom. Dark background, 
studio lighting, centered head-and-shoulders.
```

**Fallback prompt:**
```
Flat cartoon vector art, front-facing portrait of a chubby cartoon boy with a round pale-peach face, 
bright blue-teal winter beanie with yellow pom-pom and yellow band, two small close-set round eyes, 
mouth open in a small O shape (talking). Red jacket collar at bottom, dark background. South Park-style 
flat shapes with bold outlines, centered head-and-shoulders.
```

### 3. Homer (Neutral)
**Primary prompt:**
```
Front-facing portrait of Homer Simpson, flat cartoon vector art style from The Simpsons. 
Tall rounded bright yellow head, bald crown with two curved M-shaped hair strokes, one curl 
at each side of the head. Two large white overlapping eye circles with black pupils, 
large rounded nose in center of face, grey stubble dots around lower jaw, small closed mouth line 
under nose, small rounded chin. Dark background, centered head-and-shoulders.
```

**Fallback prompt:**
```
Flat cartoon vector art, front-facing portrait of a round-faced yellow cartoon character with 
tall rounded head, bald crown with two curved hair strokes on top (M-shape) and one curl at 
each ear, two large white eye circles with black pupils, large rounded nose, grey stubble 
dots on lower face, small closed mouth line, small rounded chin. Dark background, centered 
head-and-shoulders, classic American animated sitcom style.
```

### 4. Homer (Talking)
**Primary prompt:**
```
Front-facing portrait of Homer Simpson, flat cartoon vector art style from The Simpsons. 
Same as neutral version but with mouth open in a rounded oval (talking/shouting). 
Tall rounded bright yellow head, bald crown with two curved M-shaped hair strokes and 
ear curls, two large white overlapping eye circles with black pupils, large rounded nose, 
grey stubble dots around lower jaw, open oval mouth, small rounded chin. Dark background, 
centered head-and-shoulders.
```

**Fallback prompt:**
```
Flat cartoon vector art, front-facing portrait of a round-faced yellow cartoon character 
with tall rounded head, bald crown with M-shaped hair strokes and ear curls, two large white 
eye circles with black pupils, large rounded nose, grey stubble dots on lower jaw, mouth 
open in a rounded oval (talking), small rounded chin. Dark background, centered head-and-shoulders.
```

### 5. Goggins (Neutral)
**Primary prompt:**
```
Front-facing portrait of David Goggins as an intense motivational figure, realistic but 
slightly caricatured style. Bald head with dark brown skin, stern intense expression, 
thick dark eyebrows angled inward (angry/determined look), narrowed eyes, strong defined jaw, 
small closed firm mouth line. Faint red radial glow or aura behind head suggesting intensity 
and power. Dark background, studio lighting, centered head-and-shoulders.
```

**Fallback prompt:**
```
Front-facing portrait, realistic-caricature style, of a bald man with dark brown skin, 
stern intense expression, thick dark eyebrows angled inward pointing at each other, 
narrowed focused eyes, strong defined jaw, small firm closed mouth, subtle red radial 
glow around head suggesting intensity. Dark background, centered head-and-shoulders composition.
```

### 6. Goggins (Talking)
**Primary prompt:**
```
Front-facing portrait of David Goggins as an intense motivational figure, realistic but 
slightly caricatured style. Bald head with dark brown skin, fierce expression, thick dark 
eyebrows angled inward (angry/determined), narrowed intense eyes, strong jaw, mouth wide 
open in a shout or laugh (rectangular/oval open-mouthed expression). Faint red radial glow 
around head suggesting intensity and motivational energy. Dark background, studio lighting, 
centered head-and-shoulders.
```

**Fallback prompt:**
```
Front-facing portrait, realistic-caricature style, bald man with dark brown skin, fierce 
intense expression, thick dark eyebrows angled inward, narrowed intense eyes, strong jaw, 
mouth wide open in a shout or motivational yell (rectangular or oval open shape). Subtle 
red radial glow around head. Dark background, centered head-and-shoulders composition.
```

---

## Important Warning: Copyrighted Characters

Many free and commercial image generators **refuse to render named copyrighted characters** or well-known public figures to avoid licensing issues. If a generator rejects your prompt with "named character" or similar error:

1. **Use the fallback feature-based prompt** provided above (describes the appearance without the trademarked name)
2. **Try a different generator** — paid/enterprise tiers (DALL-E Plus, Midjourney Pro, Stability AI) often have fewer restrictions
3. **Keep the SVG placeholders** — they're simple, lightweight, and already functional. Replace them later if you source better artwork

**Pro tip:** Some generators accept copyright requests if you're using them for personal/non-commercial purposes (like a portfolio site). Check the generator's terms and mention your use case politely in the prompt.

---

## File Format & Storage

- **Current placeholders:** All SVG (vector, scales infinitely)
- **Replacement options:** WebP (best compression), PNG (best quality), JPEG (compatibility), or keep SVG
- **Storage:** Save generated images in this directory (`public/agents/`) to keep avatar asset organization clean

---

## Next Steps

1. Choose a generator and one of the prompts above
2. Generate all 6 images (3 characters × 2 poses)
3. Either replace the SVGs or save as `.webp`/`.png` and update `src/data/agents.ts`
4. Test the mouth-swap animation in the site to ensure smooth transitions
