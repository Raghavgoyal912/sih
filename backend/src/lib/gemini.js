import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBED_MODEL = 'gemini-embedding-001'; // current model (text-embedding-004 was retired Jan 14, 2026)

/**
 * Embeds a text string via the Google AI Studio (Gemini) embedding API.
 * Returns a plain array of floats, sized to match documents.embedding
 * (vector(768) — see supabase/migrations/006_fix_embedding_dim.sql).
 *
 * gemini-embedding-001 defaults to 3072 dimensions, so we explicitly
 * request 768 via outputDimensionality to match the DB column.
 */
export async function embedText(text) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini embedding request failed: ${res.status} ${errBody}`);
  }

  const data = await res.json();
  return data.embedding.values; // array of 768 floats
}

/**
 * Asks Gemini for a short natural-language answer / summary.
 * Used for the optional "AI Insight" box on the search page.
 */
export async function generateInsight(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env');
  }

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini generateContent request failed: ${res.status} ${errBody}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}