export default async function handler(req, res) {
  const { videoURL, imageURL } = req.body;

  const response = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: "Token YOUR_REPLICATE_API_TOKEN",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "YOUR_MODEL_VERSION_ID",
      input: {
        video: videoURL,
        image: imageURL
      },
    }),
  });

  const data = await response.json();
  res.status(200).json({ output: data?.output });
}
