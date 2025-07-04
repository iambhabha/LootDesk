import { Button } from "@/components/ui/button";
import Link from "next/link";

const TournamentsPage = () => {
  // Example data (replace with actual fetch from API or DB)
  const tournaments = [
    { id: 1, name: "Tournament 1", date: "2025-07-10" },
    { id: 2, name: "Tournament 2", date: "2025-08-15" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tournaments</h1>
      <Link href="/tournaments/add">
        <Button className="mb-4">Add Tournament</Button>
      </Link>
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{tournament.name}</h2>
            <p>{tournament.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentsPage;
