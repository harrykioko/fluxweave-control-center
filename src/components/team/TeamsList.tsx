
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Team } from "@/types/team";
import { CreateTeamDialog } from "@/components/team/CreateTeamDialog";
import { useState } from "react";

interface TeamsListProps {
  teams: Team[];
}

export function TeamsList({ teams }: TeamsListProps) {
  const [createTeamOpen, setCreateTeamOpen] = useState(false);

  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Teams</h2>
          <p className="text-slate-500">Teams you're a member of</p>
        </div>
        <Button onClick={() => setCreateTeamOpen(true)} className="bg-purple-600 hover:bg-purple-700">
          <Users className="h-4 w-4 mr-2" />
          New Team
        </Button>
      </div>

      <div className="space-y-4">
        {teams.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            You haven't joined any teams yet. Create one to get started!
          </p>
        ) : (
          <div className="grid gap-4">
            {teams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 bg-white/50 backdrop-blur-md rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-slate-800">{team.name}</h3>
                  {team.description && (
                    <p className="text-sm text-slate-500">{team.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateTeamDialog
        open={createTeamOpen}
        onOpenChange={setCreateTeamOpen}
      />
    </div>
  );
}
