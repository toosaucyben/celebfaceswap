import Replicate from "replicate";

export async function POST(req) {
  try {
    const { video, celebrity } = await req.json();

    console.log("Video URL:", video);
    console.log("Celebrity:", celebrity);

    if (!video || !celebrity) {
      return Response.json({ error: "Missing video or celebrity" }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "xrunda/hello:ff74ff3ca2f4e4f49b3288e1c28fa1eb9e8b232d6c2aa8b9a2ce7266e104d7b5",
      {
        input: {
          video: video,
          target_face: celebrity,
        },
      }
    );

    return Response.json({ result: output });
  } catch (error) {
    console.error("Replicate Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
