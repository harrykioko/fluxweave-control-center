
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Team, TeamMember, TeamRole, TeamContextValue, TeamWithMemberActions } from "@/types/team";
import { fetchTeams, createNewTeam, fetchTeamMembers, addNewTeamMember } from "@/services/teamService";

const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  const loadTeams = async () => {
    try {
      const fetchedTeams = await fetchTeams();
      setTeams(fetchedTeams);
      
      if (!currentTeam && fetchedTeams.length > 0) {
        setCurrentTeam(fetchedTeams[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading teams",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createTeam = async (name: string, description?: string): Promise<TeamWithMemberActions> => {
    try {
      const newTeam = await createNewTeam(name, description);
      await loadTeams();
      return newTeam;
    } catch (error: any) {
      toast({
        title: "Error creating team",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const loadTeamMembers = async (teamId: string) => {
    try {
      const members = await fetchTeamMembers(teamId);
      setTeamMembers(members);
    } catch (error: any) {
      toast({
        title: "Error loading team members",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTeamMember = async (teamId: string, email: string, role: TeamRole) => {
    try {
      await addNewTeamMember(teamId, email, role);
      await loadTeamMembers(teamId);
      
      toast({
        title: "Team member added",
        description: `Successfully added ${email} to the team`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding team member",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  useEffect(() => {
    if (currentTeam) {
      loadTeamMembers(currentTeam.id);
    }
  }, [currentTeam]);

  const contextValue: TeamContextValue = {
    currentTeam,
    setCurrentTeam,
    teams,
    loadTeams,
    createTeam,
    teamMembers,
    loadTeamMembers,
    addTeamMember,
  };

  return <TeamContext.Provider value={contextValue}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}

