import Replicate from 'replicate';

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Change to specific domain if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const { prompt, style } = req.body;

  let modelVersion;
  if (style === 'anime') {
    modelVersion = 'cjwbw/stable-diffusion-anime:latest';
  } else {
    modelVersion = 'stability-ai/stable-diffusion:db21e45'; // Stable Diffusion 2.1
  }

  try {
    const output = await replicate.run(modelVersion, {
      input: { prompt },
    });

    res.status(200).json({ image: output[0] });
  } catch (error) {
    console.error('Replicate Error:', error);
    res.status(500).json({ error: 'Something went wrong generating the image.' });
  }
}
