document.getElementById("generateBtn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value;
  const style = document.querySelector(".style-btn.selected")?.textContent || "Real";

  // Clear previous image
  const imgEl = document.getElementById("generatedImage");
  imgEl.src = "";
  imgEl.alt = "Generating...";

  try {
    // Send request to backend using full Vercel URL
    const response = await fetch("https://ai-image-site.vercel.app/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt, style })
    });

    const prediction = await response.json();
    const predictionUrl = prediction?.urls?.get;

    if (!predictionUrl) {
      alert("Failed to start image generation.");
      return;
    }

    // Poll the prediction URL until image is ready
    let image;
    while (!image) {
      const res = await fetch(predictionUrl);
      const data = await res.json();

      if (data.status === "succeeded") {
        image = data.output[data.output.length - 1];
      } else if (data.status === "failed") {
        alert("Image generation failed.");
        return;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5 seconds
      }
    }

    imgEl.src = image;
    imgEl.alt = "Generated Image";
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong.");
  }
});
