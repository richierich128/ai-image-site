import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, style } = req.body;

  try {
    const prediction = await replicate.predictions.create({
      version: "ac732df8", // SD 2.1
      model: "stability-ai/stable-diffusion",
      input: {
        prompt: `${prompt}, ${style}`,
        width: 512,
        height: 512
      },
    });

    res.status(200).json(prediction);
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ error: "Something went wrong generating the image" });
  }
}
