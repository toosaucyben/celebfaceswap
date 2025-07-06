"use client";

import { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
    setResultUrl("");
    setError("");
  };

  const handleProcess = async () => {
    if (!videoFile) {
      setError("Please upload a video file first.");
      return;
    }

    setLoading(true);
    setError("");
    setResultUrl("");

    const formData = new FormData();
    formData.append("video", videoFile);

    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        // Assuming the API returns a URL to the processed video
        setResultUrl(data.result.output_url || "");
      }
    } catch (err) {
      setError("Failed to process video. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, textAlign: "center" }}>
      <h1>Celebrity Face Swap</h1>
      <p>Upload a video and choose a celebrity to swap into it.</p>

      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleProcess} disabled={loading} style={{ marginTop: 20, padding: "10px 20px" }}>
        {loading ? "Processing..." : "Process Video"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {resultUrl && (
        <div style={{ marginTop: 20 }}>
          <h2>Processed Video:</h2>
          <video src={resultUrl} controls width="100%" />
        </div>
      )}
    </div>
  );
}
