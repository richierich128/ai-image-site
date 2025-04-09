export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, style } = req.body;

  if (!prompt || !style) {
    return res.status(400).json({ error: 'Prompt and style are required' });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "db21e45e40c1a44c28c78b0b0dfbd8b1bf1fc4034c52df90245d4c4624c122c3",
        input: {
          prompt: `${prompt} in ${style} style`
        }
      })
    });

    const data = await response.json();
    if (data?.urls?.get) {
      // Wait for the image to be generated
      let result;
      while (true) {
        const resPoll = await fetch(data.urls.get, {
          headers: {
            "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`
          }
        });
        result = await resPoll.json();
        if (result.status === 'succeeded') break;
        if (result.status === 'failed') throw new Error('Image generation failed');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      res.status(200).json({ imageUrl: result.output[0] });
    } else {
      res.status(500).json({ error: 'No output URL found' });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
