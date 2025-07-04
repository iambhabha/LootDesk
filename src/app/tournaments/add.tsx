import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/router";
import { useState } from "react";

const AddTournamentPage = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save tournament data (API call or database save logic)

    // Redirect to tournaments list page after save
    router.push("/tournaments");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Add Tournament</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="block mb-2">
            Tournament Name
          </Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="date" className="block mb-2">
            Tournament Date
          </Label>
          <Input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Save Tournament
        </Button>
      </form>
    </div>
  );
};

export default AddTournamentPage;
