export const config = { api: { bodyParser: true } };
// v1.1 – force rebuild

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, model = 'gpt-4o-mini' } = req.body;
  const API_KEY = process.env.OPENAI_API_KEY;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model, messages, stream: false }),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return res.status(openaiRes.status).json({ error: err });
    }

    const data = await openaiRes.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
