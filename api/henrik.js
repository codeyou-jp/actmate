export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: 'path required' });

  // クエリパラメータ（mode, sizeなど）を転送
  const qs = Object.entries(req.query)
    .filter(([k]) => k !== 'path')
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&');

  const url = `https://api.henrikdev.xyz/${path}${qs ? '?' + qs : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': process.env.HENRIK_API_KEY || '',
      },
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
