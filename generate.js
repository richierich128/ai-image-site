document.getElementById("generate-btn").addEventListener("click", async () => {
  const prompt = document.getElementById("prompt").value.trim();
  const imageContainer = document.getElementById("image-container");
  const statusText = document.getElementById("status");

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  statusText.textContent = "Generating image...";
  imageContainer.innerHTML = "";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const data = await response.json();
    const imageUrl = data.image;

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Generated image";
    img.className = "generated-img";
    imageContainer.appendChild(img);
    statusText.textContent = "";
  } catch (error) {
    console.error("Error:", error);
    statusText.textContent = "Something went wrong!";
  }
});
