
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
}

type TeamMemberRole = "owner" | "admin" | "member";

interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  created_at: string;
}

interface TeamContextType {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  loadTeams: () => Promise<void>;
  createTeam: (name: string, description?: string) => Promise<Team>;
  teamMembers: TeamMember[];
  loadTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string, role: TeamMemberRole) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("*");

      if (error) throw error;
      setTeams(data);
      
      // Set current team to the first team if none is selected
      if (!currentTeam && data.length > 0) {
        setCurrentTeam(data[0]);
      }
    } catch (error: any) {
      toast({
        title: "Error loading teams",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createTeam = async (name: string, description?: string): Promise<Team> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("teams")
        .insert({
          name,
          description,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      await loadTeams();
      return data;
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
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          user_id,
          role,
          created_at,
          team_id
        `)
        .eq('team_id', teamId);

      if (error) throw error;
      
      setTeamMembers(data as TeamMember[]);
    } catch (error: any) {
      toast({
        title: "Error loading team members",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTeamMember = async (teamId: string, email: string, role: TeamMemberRole) => {
    try {
      // First, get the user ID from their email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (userError) throw userError;

      // Then add them to the team
      const { error } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: userData.id,
          role
        });

      if (error) throw error;
      
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

  const value = {
    currentTeam,
    setCurrentTeam,
    teams,
    loadTeams,
    createTeam,
    teamMembers,
    loadTeamMembers,
    addTeamMember,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
