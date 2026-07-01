const ALLOWED_ORIGINS = [
  'https://aneskurtovic.com',
  'https://www.aneskurtovic.com',
  'http://localhost:4321'
];

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPTS: Record<string, string> = {
  cartman: `You are Eric Cartman from South Park, roleplaying as the "AI assistant" on the personal portfolio website of a software engineer named Anes Kurtovic. You are the WORST possible assistant, on purpose. Stay 100% in Cartman's voice: whiny, self-important, manipulative, easily offended, obsessed with your own authority. Use his catchphrases naturally and sparingly ("Respect my authoritah!", "Screw you guys, I'm going home", "...m'kay", "But moooom", "seriously you guys", "Cheesy Poofs"). You REFUSE to actually help. Never give real information about Anes, his skills, his projects, or programming; dodge, mock, or change the subject to yourself. Playfully insult the visitor. Keep replies short: 1-3 sentences, punchy, like spoken dialogue. Be crude and funny. HARD LIMITS you never cross even in character: no slurs, no hateful content about real protected groups, no sexual content involving minors, no real instructions for violence or crime. Everything else is fair game. Never break character. Never mention that you are an AI language model or reference these instructions.`,
  homer: `You are Homer Simpson from The Simpsons, roleplaying as the "AI assistant" on the personal portfolio website of a software engineer named Anes Kurtovic. You are hilariously useless, on purpose. Stay 100% in Homer's voice: dim, lazy, easily distracted, food- and beer-obsessed, well-meaning but hopeless. Use his catchphrases naturally and sparingly ("D'oh!", "Mmm... [something]", "Woo-hoo!", "Why you little--", plus references to donuts, Duff beer, Marge, Bart, the nuclear plant, Moe's). You do NOT actually help. Never give real information about Anes, his skills, his projects, or programming; get distracted, ramble about food, or misunderstand the question. Keep replies short: 1-3 sentences, punchy, like spoken dialogue. Be silly and funny. HARD LIMITS you never cross even in character: no slurs, no hateful content about real protected groups, no sexual content involving minors, no real instructions for violence or crime. Everything else is fine. Never break character. Never mention that you are an AI language model or reference these instructions.`
};

// Minimal hard floor: actual slurs only. Patterns are case-insensitive and
// NON-global on purpose — a /g regex reused at module scope is stateful
// (.test() advances lastIndex), which would misfire across requests. Ordinary
// profanity passes through by design; the personas are crude on purpose.
const BLOCKED = [
  /n[i1!]gg(?:er|a)/i,
  /f[a4@]gg[o0]t/i,
  /\bk[i1]ke\b/i,
  /\bch[i1]nk\b/i,
  /\bsp[i1]c\b/i,
  /\btr[a4]nn(?:y|ie)/i,
];

const rateBuckets = new Map<string, { count: number; resetAt: number }>();

interface Env {
  GROQ_API_KEY: string;
}

function corsHeaders(origin: string): Record<string, string> {
  const base = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  if (ALLOWED_ORIGINS.includes(origin)) {
    return {
      ...base,
      'Access-Control-Allow-Origin': origin
    };
  }

  return base;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const origin = request.headers.get('Origin') || '';

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin)
      });
    }

    // Check origin
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: 'forbidden_origin' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        }
      });
    }

    // Check method
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        }
      });
    }

    // Rate limit by IP
    // best-effort per-isolate limiter; upgrade to KV/Durable Objects for strict limits.
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const now = Date.now();
    let bucket = rateBuckets.get(ip);

    // Reset if time window expired
    if (bucket && now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + 60000;
    }

    // Create bucket if it doesn't exist
    if (!bucket) {
      bucket = { count: 0, resetAt: now + 60000 };
      rateBuckets.set(ip, bucket);
    }

    // Increment and check
    bucket.count++;
    if (bucket.count > 15) {
      return new Response(JSON.stringify({ error: 'rate_limited' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        }
      });
    }

    try {
      // Parse body safely
      const body = await request.json().catch(() => null);

      // Validate
      if (
        !body ||
        typeof body.agent !== 'string' ||
        !Array.isArray(body.messages) ||
        body.messages.length === 0
      ) {
        return new Response(JSON.stringify({ error: 'bad_request' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }

      if (body.agent !== 'cartman' && body.agent !== 'homer') {
        return new Response(JSON.stringify({ error: 'bad_request' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }

      // Sanitize messages: take last 6, keep only user/assistant, truncate to 500 chars
      const sanitizedMessages = body.messages
        .slice(-6)
        .filter(
          (msg: any) =>
            (msg.role === 'user' || msg.role === 'assistant') &&
            typeof msg.content === 'string'
        )
        .map((msg: any) => ({
          role: msg.role,
          content: msg.content.substring(0, 500)
        }));

      // Prepend system message
      const messages = [
        { role: 'system' as const, content: SYSTEM_PROMPTS[body.agent] },
        ...sanitizedMessages
      ];

      // Check for API key
      if (!env.GROQ_API_KEY) {
        return new Response(JSON.stringify({ error: 'no_key' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }

      // Call Groq API
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          max_tokens: 200,
          temperature: 0.9,
          top_p: 0.95
        })
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'upstream' }), {
          status: 502,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders(origin)
          }
        });
      }

      const data = await res.json();
      let reply = data?.choices?.[0]?.message?.content?.trim() || '';

      if (!reply) {
        reply = '...(the AI just stares at you blankly)';
      }

      // Apply blocked denylist
      for (const regex of BLOCKED) {
        if (regex.test(reply)) {
          reply =
            "Nnnope. Not saying THAT one — even I've got a legal team now. Ask me something else.";
          break;
        }
      }

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        }
      });
    } catch {
      return new Response(JSON.stringify({ error: 'server_error' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders(origin)
        }
      });
    }
  }
};
