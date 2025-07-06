export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Celebrity Face Swap</h1>
      <p>Upload a video and choose a celebrity to swap into it.</p>

      <input type="file" accept="video/*" />
      <br /><br />
      <button style={{ padding: "10px 20px", fontSize: "16px" }}>
        Process Video
      </button>
    </div>
  );
}
