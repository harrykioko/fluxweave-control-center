
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from "@/types/team";

interface TeamSelectProps {
  currentTeam: Team | null;
  teams: Team[];
  onTeamChange: (team: Team) => void;
  className?: string;
}

export function TeamSelect({ currentTeam, teams, onTeamChange, className }: TeamSelectProps) {
  return (
    <Select
      value={currentTeam?.id}
      onValueChange={(value) => {
        const team = teams.find(t => t.id === value);
        if (team) onTeamChange(team);
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Your Teams</SelectLabel>
          {teams.map(team => (
            <SelectItem key={team.id} value={team.id}>
              {team.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

