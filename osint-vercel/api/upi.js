// api/upi.js
// proxies to https://upi-info.vercel.app/api/upi?upi_id=...
export default async function handler(req, res) {
  try {
    const upi = (req.query.upi_id || '').trim();
    if(!upi) return res.status(400).json({ error: 'missing upi_id' });

    const REQUIRE_TOKEN = process.env.REQUIRE_TOKEN === 'true';
    if(REQUIRE_TOKEN) {
      const t = req.headers['x-front-token'] || req.query._token;
      if(!t || t !== process.env.FRONTEND_TOKEN) return res.status(401).json({ error: 'unauthorized' });
    }

    const target = `https://upi-info.vercel.app/api/upi?upi_id=${encodeURIComponent(upi)}`;
    const r = await fetch(target);
    const text = await r.text();
    try { return res.status(200).send(JSON.parse(text)); }
    catch(e){ return res.status(200).send(text); }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}
