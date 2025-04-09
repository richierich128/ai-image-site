
import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { prompt } = req.body;
  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:latest", {
        input: { prompt }
      }
    );
    res.status(200).json({ imageUrl: output[0] });
  } catch (error) {
    res.status(500).json({ error: "Image generation failed" });
  }
}
