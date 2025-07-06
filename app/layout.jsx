export const metadata = {
  title: "Celeb Face Swap",
  description: "Upload a video and swap in a celebrity face",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
