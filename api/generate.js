export default async function handler(request, context) {
  const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

  const { prompt, style } = await request.json();

  const modelMap = {
    real: {
      model: "stability-ai/sdxl",
      version: "a9758cb4d7"
    },
    anime: {
      model: "cjwbw/animeart",
      version: "cc9b9b7e6e1c5a9c9c5b9b9b9b9b9b9b"
    },
    ai: {
      model: "stability-ai/stable-diffusion",
      version: "db21e45a3d"
    }
  };

  const selectedModel = modelMap[style] || modelMap["real"];

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: selectedModel.version,
      input: { prompt }
    })
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to generate image" }), { status: 500 });
  }

  const prediction = await response.json();

  return new Response(JSON.stringify({ image: prediction.urls.get }), {
    headers: { "Content-Type": "application/json" }
  });
}
