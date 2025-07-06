"use client";

import { useState } from "react";

export default function Home() {
  const [videoFile, setVideoFile] = useState(null);
  const [celebrity, setCelebrity] = useState("kanye west");
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
      setError("Please upload a video file.");
      return;
    }

    setLoading(true);
    setError("");
    setResultUrl("");

    try {
      // 1. Upload to Cloudinary
      const uploadForm = new FormData();
      uploadForm.append("video", videoFile);

      const uploadRes = await fetch("/api/upload-video", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || "Cloudinary upload failed");
      }

      const cloudinaryUrl = uploadData.url;

      // 2. Send to Replicate backend API
      const replicateRes = await fetch("/api/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          video: cloudinaryUrl,
          celebrity: celebrity,
        }),
      });

      const replicateData = await replicateRes.json();

      if (!replicateRes.ok) {
        throw new Error(replicateData.error || "Failed to process video");
      }

      setResultUrl(replicateData.result.output_url || "");
    } catch (err) {
      setError(err.message);
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
      <input
        type="text"
        placeholder="Enter celebrity (e.g. Kanye West)"
        value={celebrity}
        onChange={(e) => setCelebrity(e.target.value)}
        style={{ marginTop: 10, padding: 8, width: "100%" }}
      />
      <br />
      <button onClick={handleProcess} disabled={loading} style={{ marginTop: 20, padding: "10px 20px" }}>
        {loading ? "Processing..." : "Process Video"}
      </button>

      {error && <p style={{ color: "red", marginTop: 20 }}>{error}</p>}

      {resultUrl && (
        <div style={{ marginTop: 30 }}>
          <h2>Result</h2>
          <video src={resultUrl} controls width="100%" />
        </div>
      )}
    </div>
  );
}
