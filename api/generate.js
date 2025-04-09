export default async function handler(req, res) {
  const { prompt, style } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "db21e45e4c76e6d7e59dfc7d2f6cc1e1bfdd32e01b6a1b5f6b3f2c81af15490b",
      input: {
        prompt: `${prompt}, style: ${style}`,
      }
    }),
  });

  const data = await response.json();

  if (response.ok) {
    res.status(200).json({ image: data.output[0] });
  } else {
    res.status(500).json({ error: "Failed to generate image" });
  }
}
