import { NextResponse } from "next/server";

export async function GET() {
  // Example: Fetch tournaments from database
  const tournaments = [
    { id: 1, name: "Tournament 1", date: "2025-07-10" },
    { id: 2, name: "Tournament 2", date: "2025-08-15" },
  ];

  return NextResponse.json(tournaments);
}

export async function POST(req: Request) {
  const newTournament = await req.json();

  // Example: Save tournament to database
  // Save logic here (using Prisma, MongoDB, etc.)

  return NextResponse.json(
    { message: "Tournament added successfully" },
    { status: 201 }
  );
}
