// token/route.ts
import { NextRequest } from "next/server";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing user_id" }), {
      status: 400,
    });
  }

  try {
    const token = serverClient.createToken(userId);
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch (error) {
    console.error(error); // Optional: Log the error for debugging purposes
    return new Response(JSON.stringify({ error: "Failed to generate token" }), {
      status: 500,
    });
  }
}
