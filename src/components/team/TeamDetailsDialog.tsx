
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Team, TeamMemberWithProfile, TeamRole } from "@/types/team";
import { Globe, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TeamDetailsDialogProps {
  team: Team | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamDetailsDialog({ team, open, onOpenChange }: TeamDetailsDialogProps) {
  const [members, setMembers] = useState<TeamMemberWithProfile[]>([]);

  useEffect(() => {
    async function loadTeamMembers() {
      if (!team) return;

      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles!inner(
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('team_id', team.id);

      if (error) {
        console.error('Error loading team members:', error);
        return;
      }

      // Transform the data to match our expected type
      const typedData = data.map(member => ({
        ...member,
        role: member.role as TeamRole,
        profiles: {
          first_name: member.profiles.first_name,
          last_name: member.profiles.last_name,
          avatar_url: member.profiles.avatar_url
        }
      })) as TeamMemberWithProfile[];

      setMembers(typedData);
    }

    if (open && team) {
      loadTeamMembers();
    }
  }, [team, open]);

  if (!team) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{team.name}</DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            {team.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {team.website && (
            <div className="flex items-center gap-2 text-slate-600">
              <Globe className="h-4 w-4" />
              <a
                href={team.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                {team.website}
              </a>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-600" />
              <h3 className="font-medium">Team Members</h3>
            </div>
            <div className="grid gap-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {member.profiles.avatar_url ? (
                        <AvatarImage src={member.profiles.avatar_url} />
                      ) : null}
                      <AvatarFallback>
                        {member.profiles.first_name[0]}
                        {member.profiles.last_name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {member.profiles.first_name} {member.profiles.last_name}
                      </p>
                      <p className="text-sm text-slate-500 capitalize">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
