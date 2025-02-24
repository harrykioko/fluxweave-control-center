
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define base types with minimal required fields
interface UserBase {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
}

// Define team member roles as a union type
type TeamMemberRole = "owner" | "admin" | "member";

// Define focused interfaces for different contexts
interface TeamBase {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
}

interface TeamMemberBase {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamMemberRole;
  created_at: string;
}

// Define context value interface separately
interface TeamContextValue {
  currentTeam: TeamBase | null;
  setCurrentTeam: (team: TeamBase | null) => void;
  teams: TeamBase[];
  loadTeams: () => Promise<void>;
  createTeam: (name: string, description?: string) => Promise<TeamBase>;
  teamMembers: TeamMemberBase[];
  loadTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string, role: TeamMemberRole) => Promise<void>;
}

// Create context with explicit type
const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<TeamBase | null>(null);
  const [teams, setTeams] = useState<TeamBase[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberBase[]>([]);
  const { toast } = useToast();

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, description, created_at, created_by");

      if (error) throw error;
      setTeams(data || []);
      
      // Set current team to the first team if none is selected
      if (!currentTeam && data && data.length > 0) {
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

  const createTeam = async (name: string, description?: string): Promise<TeamBase> => {
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

  const loadTeamMembers = async (teamId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, user_id, role, created_at, team_id")
        .eq('team_id', teamId);

      if (error) throw error;
      
      setTeamMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading team members",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTeamMember = async (teamId: string, email: string, role: TeamMemberRole): Promise<void> => {
    try {
      // First query to get the user ID based on email
      const profileQuery = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .limit(1)
        .single();
        
      if (profileQuery.error) throw profileQuery.error;
      if (!profileQuery.data) throw new Error("User not found");

      // Insert the team member with the found user ID
      const { error: insertError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: profileQuery.data.id,
          role
        });

      if (insertError) throw insertError;
      
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
