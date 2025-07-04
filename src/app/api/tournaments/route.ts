// tournaments/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Example: Fetch tournaments from database
  const tournaments = [
    { id: 1, name: "Tournament 1", date: "2025-07-10" },
    { id: 2, name: "Tournament 2", date: "2025-08-15" },
    { id: 2, name: "Tournament 3", date: "2025-08-15" },
    { id: 2, name: "Tournament 4", date: "2025-08-15" },
    { id: 2, name: "Tournament 5", date: "2025-08-15" },
    { id: 2, name: "Tournament 6", date: "2025-08-15" },
    { id: 2, name: "Tournament 7", date: "2025-08-15" },
    { id: 2, name: "Tournament 8", date: "2025-08-15" },
    { id: 2, name: "Tournament 9", date: "2025-08-15" },
    { id: 2, name: "Tournament 10", date: "2025-08-15" },
  ];

  return NextResponse.json(tournaments);
}

// export async function POST(req: Request) {
//   // const newTournament = await req.json();

//   // Save the tournament to a database or handle it in some other way.
//   // Example: You can log it or insert it into a database here:
//   // await db.saveTournament(newTournament);

//   return NextResponse.json(
//     { message: "Tournament added successfully" },
//     { status: 201 }
//   );
// }
