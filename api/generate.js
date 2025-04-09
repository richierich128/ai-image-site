// File: /api/generate.js

import Replicate from 'replicate';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  // Handle preflight (CORS) requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Allow only POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Set headers again for POST response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const { prompt } = req.body;

  try {
    const output = await replicate.run(
      'stability-ai/stable-diffusion:db21e45', // Stable Diffusion 2.1
      {
        input: { prompt },
      }
    );

    res.status(200).json({ image: output[0] });
  } catch (err) {
    console.error('Error generating image:', err);
    res.status(500).json({ error: 'Image generation failed.' });
  }
}
