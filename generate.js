
async function generateImageFromPrompt(prompt, style) {
  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": "Token r8_0blGCU0s9cY6eWXStta1Z8ajWAJjT483Q82pg",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      version: "db21e45e40df1df7fe9672780f1f5ea1e33e0e052c24e5cfa3c278347b5b8c78",
      input: {
        prompt: `${prompt}, ${style}`,
        width: 512,
        height: 512
      }
    })
  });

  const json = await response.json();
  const predictionId = json.id;

  let result = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(res => setTimeout(res, 2000));
    const resPoll = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: { "Authorization": "Token r8_0blGCU0s9cY6eWXStta1Z8ajWAJjT483Q82pg" }
    });
    const jsonPoll = await resPoll.json();
    if (jsonPoll.status === "succeeded") {
      result = jsonPoll.output[0];
      break;
    }
  }

  if (!result) throw new Error("Image generation failed or timed out.");
  return result;
}
