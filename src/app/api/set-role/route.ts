import { StreamChat } from "stream-chat";
import { NextRequest, NextResponse } from "next/server";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");
  const role = searchParams.get("role") || "user"; // fallback role

  if (!userId) {
    return NextResponse.json(
      { error: "Missing user_id" },
      { status: 400 }
    );
  }

  try {
    await serverClient.upsertUser({
      id: userId,
      name: userId.replace("_", " "), // Optional: Friendly name
      role: role,
    });

    return NextResponse.json({
      message: `Role '${role}' set for user '${userId}'`,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}
