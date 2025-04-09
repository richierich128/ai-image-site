import Replicate from 'replicate';

export default async function handler(req, res) {
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const { prompt, style } = req.body;

  let modelVersion;
  if (style.toLowerCase() === 'anime') {
    modelVersion = 'cjwbw/stable-diffusion-anime:latest';
  } else if (style.toLowerCase() === 'ai') {
    modelVersion = 'stability-ai/stable-diffusion:db21e45';
  } else {
    modelVersion = 'stability-ai/stable-diffusion:db21e45';
  }

  try {
    const prediction = await replicate.predictions.create({
      version: modelVersion,
      input: { prompt },
    });

    res.status(200).json({ urls: { get: prediction.urls.get } });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Something went wrong during image generation.' });
  }
}
