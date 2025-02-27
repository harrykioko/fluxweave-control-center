
import { Users } from "lucide-react";
import type { TeamMember } from "@/types/portfolio";

interface ProjectTeamProps {
  teamMembers: TeamMember[];
}

export function ProjectTeam({ teamMembers }: ProjectTeamProps) {
  return (
    <section className="bg-white/50 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Users className="h-4 w-4 text-blue-600" />
        <h3 className="font-medium text-slate-800">Team</h3>
      </div>
      <div className="flex flex-wrap gap-3">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
            <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full" />
            <span className="text-sm text-slate-700">{member.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
