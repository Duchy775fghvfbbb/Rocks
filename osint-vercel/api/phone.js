// api/phone.js
// Vercel serverless function - proxies phone API (store PHONE_API_KEY & PHONE_API_URL in Vercel env)
export default async function handler(req, res) {
  try {
    const mobile = (req.query.mobile || '').trim();
    if(!/^\d{10}$/.test(mobile)) return res.status(400).json({ error: 'invalid mobile' });

    const REQUIRE_TOKEN = process.env.REQUIRE_TOKEN === 'true';
    if(REQUIRE_TOKEN) {
      const t = req.headers['x-front-token'] || req.query._token;
      if(!t || t !== process.env.FRONTEND_TOKEN) return res.status(401).json({ error: 'unauthorized' });
    }

    const phoneApiUrl = process.env.PHONE_API_URL || 'https://flipcartstore.serv00.net/INFO.php';
    const phoneApiKey = process.env.PHONE_API_KEY || 'chxInfo';
    const target = `${phoneApiUrl}?api_key=${encodeURIComponent(phoneApiKey)}&mobile=${encodeURIComponent(mobile)}`;

    const r = await fetch(target);
    const text = await r.text();
    try { return res.status(200).send(JSON.parse(text)); }
    catch(e){ return res.status(200).send(text); }
  } catch(err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
}
