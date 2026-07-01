# Portfolio Agents Worker

A $0 secure proxy Cloudflare Worker that calls Groq's LLM to make two comedy personas (Eric Cartman and Homer Simpson) reply in character on a portfolio website.

## Setup

### 1. Install dependencies

```bash
cd worker
npm install
```

If `npm install` fails on wrangler version, run:
```bash
npm i -D wrangler@latest
```

### 2. Get a Groq API key

1. Create a free Groq account at https://console.groq.com
2. Generate an API key at https://console.groq.com/keys

### 3. Authenticate with Cloudflare

```bash
npx wrangler login
```

Create a free Cloudflare account if you don't have one.

### 4. Local development

Create a `.dev.vars` file in the `worker/` directory (this file is gitignored):

```
GROQ_API_KEY=your_actual_groq_api_key_here
```

Start the dev server:

```bash
npm run dev
```

The worker runs on `http://localhost:8787`.

### 5. Test locally with curl

```bash
curl -X POST http://localhost:8787 \
  -H "Origin: http://localhost:4321" \
  -H "Content-Type: application/json" \
  -d '{"agent":"cartman","messages":[{"role":"user","content":"who are you"}]}'
```

Expected response:
```json
{"reply":"[Cartman's witty response]"}
```

### 6. Deploy to production

Store your API key securely in Cloudflare:

```bash
npx wrangler secret put GROQ_API_KEY
```

Paste your API key when prompted.

Deploy:

```bash
npm run deploy
```

Cloudflare will print your worker's public URL (e.g., `https://portfolio-agents.your-username.workers.dev`).

### 7. Wire up to your frontend

Copy the worker URL and paste it into your frontend code (e.g., `src/components/Terminal.astro`) as the `WORKER_URL` constant.

## How it works

- **CORS locked**: Only requests from `https://aneskurtovic.com`, `https://www.aneskurtovic.com`, and `http://localhost:4321` are allowed.
- **Rate limiting**: Max 15 requests per minute per IP (best-effort; upgrade to KV/Durable Objects for strict limits).
- **API key secured**: The Groq API key is stored in Cloudflare secrets and never exposed to the client.
- **Groq free tier**: ~14.4k requests/day.
- **Cloudflare Workers free tier**: 100k requests/day.

## Persona configuration

The worker supports two personas: `cartman` (Eric Cartman from South Park) and `homer` (Homer Simpson from The Simpsons).

### Changing the model

Open `src/index.ts` and update the `MODEL` constant. Available options:
- `llama-3.3-70b-versatile` (default)
- `openai/gpt-oss-20b`
- `meta-llama/llama-4-scout-17b-16e-instruct`

Then redeploy:

```bash
npm run deploy
```

## Request format

```json
{
  "agent": "cartman" | "homer",
  "messages": [
    { "role": "user", "content": "your question" },
    { "role": "assistant", "content": "previous response" }
  ]
}
```

The worker will:
1. Keep the last 6 messages (conversation history).
2. Truncate each message to 500 characters.
3. Prepend the system prompt for the chosen persona.
4. Send to Groq API.
5. Filter any responses matching the block list (slurs, hate speech).
6. Return the reply.

## Environment variables

- `GROQ_API_KEY` (required, set via `wrangler secret put` or `.dev.vars`)

## Troubleshooting

### "rate_limited" error
You've exceeded 15 requests per minute from your IP. Wait a minute and try again.

### "forbidden_origin" error
Your frontend's origin is not in the allowed list. Check:
1. Is your site URL one of: `https://aneskurtovic.com`, `https://www.aneskurtovic.com`, `http://localhost:4321`?
2. Are you sending an `Origin` header with your request?
3. Update `ALLOWED_ORIGINS` in `src/index.ts` if your site URL differs, then redeploy.

### "upstream" error
Groq API failed. Check:
1. Is your API key valid?
2. Has Groq's free tier quota been exceeded?
3. Try again in a moment.

### "server_error" error
An unexpected error occurred. Check Cloudflare's Worker logs in the dashboard.

## Security notes

- The Groq API key is never sent to the client; it only lives in Cloudflare secrets.
- CORS is strictly enforced — only whitelisted origins can call the worker.
- Content is validated and sanitized before being sent to Groq.
- Responses are filtered against a block list to prevent harmful output.
