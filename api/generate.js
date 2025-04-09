export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');

  const { prompt, style } = req.body;
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${replicateApiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "7be55c3e0db835e5c4c15938a23fcfbc22e2e8587056bfa39fe6d3c65f37d5ed", // Stable Diffusion
        input: {
          prompt: `${prompt}, ${style} style`
        }
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong generating the image." });
  }
}
