export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, style } = req.body;

  const fullPrompt = `${style} style: ${prompt}`;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "YOUR_REPLICATE_MODEL_VERSION",
        input: {
          prompt: fullPrompt
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(500).json({ error: "Failed to create prediction", details: error });
    }

    const prediction = await response.json();
    res.status(200).json(prediction);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}
