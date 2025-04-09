// /api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt, style } = req.body;

  if (!prompt || !style) {
    return res.status(400).json({ error: 'Prompt and style are required' });
  }

  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    return res.status(500).json({ error: 'Replicate API token not found' });
  }

  const modelVersion =
    style === 'anime'
      ? 'c9c9c5e6bba7fe1d6c2c5a27e9e6e1e4a5e9e5b0d5e4c4c0b4b8ef7e134fb61b' // anime model version
      : style === 'ai'
      ? '42d5eb4f5f8e4e10a2c9d5c95b1e4f6d2eebadfacd57362c5a6c4d3c4d1e9e2b' // AI abstract model
      : 'db21e45a3f4ffdf651c1bfa0b3d29bfae67f0ed0e8155c721bc37a38833e4d04'; // real style (default)

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: modelVersion,
        input: { prompt },
      }),
    });

    const prediction = await response.json();

    if (response.status !== 201) {
      return res.status(500).json({ error: prediction.detail || 'Failed to generate image' });
    }

    const predictionId = prediction.id;

    // Polling until image is ready
    let imageUrl = null;
    for (let i = 0; i < 20; i++) {
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          Authorization: `Token ${replicateApiToken}`,
        },
      });
      const pollData = await pollRes.json();
      if (pollData.status === 'succeeded') {
        imageUrl = pollData.output[pollData.output.length - 1];
        break;
      } else if (pollData.status === 'failed') {
        return res.status(500).json({ error: 'Image generation failed' });
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Timeout while generating image' });
    }

    return res.status(200).json({ imageUrl });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
                        }
