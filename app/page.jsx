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
      // Upload to Cloudinary
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

      // Send to Replicate
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
        throw new Error(replicateData.error || "Replicate processing failed");
      }

      setResultUrl(replicateData.result.output_url || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "40px", textAlign: "center", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>Celebrity Face Swap</h1>
      <p style={{ marginBottom: "20px" }}>Upload a video and choose a celebrity to swap into it.</p>

      <input type="file" accept="video/*" onChange={handleFileChange} />
      <br />
      <input
        type="text"
        placeholder="Enter celebrity (e.g. Kanye West)"
        value={celebrity}
        onChange={(e) => setCelebrity(e.target.value)}
        style={{
          marginTop: 12,
          padding: 8,
          width: "100%",
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />
      <br />
      <button
        onClick={handleProcess}
        disabled={loading}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          backgroundColor: "#222",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
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
