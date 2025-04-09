export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  if (!replicateApiToken) {
    return res.status(500).json({ error: "Missing Replicate API token" });
  }

  const { prompt, style } = req.body;

  const modelVersion = "cjwbw/starryai-v1:cf0e308bfb40b7f4a074dbd749912c808c27f95aa3cb1e41412ff8c310dcf4c0"; // Replace with desired model version

  const stylePromptMap = {
    Real: "photo-realistic, high detail",
    Anime: "anime style, colorful, vibrant",
    AI: "abstract, futuristic, ai-generated"
  };

  const styledPrompt = `${prompt}, ${stylePromptMap[style] || ""}`;

  try {
    const replicateRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${replicateApiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: modelVersion,
        input: { prompt: styledPrompt }
      })
    });

    const replicateData = await replicateRes.json();

    if (replicateData.error) {
      return res.status(500).json({ error: replicateData.error });
    }

    return res.status(200).json(replicateData);
  } catch (error) {
    console.error("Error from Replicate:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
