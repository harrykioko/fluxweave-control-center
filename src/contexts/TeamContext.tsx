
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define roles as simple string literals
export type TeamRole = 'owner' | 'admin' | 'member';

// Simple base interfaces
interface BaseEntity {
  id: string;
  created_at?: string;
}

interface Team extends BaseEntity {
  name: string;
  description: string | null;
  created_by: string;
}

interface TeamMember extends BaseEntity {
  team_id: string;
  user_id: string;
  role: TeamRole;
}

// Context value interface without complex nesting
interface TeamContextValue {
  currentTeam: Team | null;
  setCurrentTeam: (team: Team | null) => void;
  teams: Team[];
  loadTeams: () => Promise<void>;
  createTeam: (name: string, description?: string) => Promise<Team>;
  teamMembers: TeamMember[];
  loadTeamMembers: (teamId: string) => Promise<void>;
  addTeamMember: (teamId: string, email: string, role: TeamRole) => Promise<void>;
}

// Create context with undefined default value
const TeamContext = createContext<TeamContextValue | undefined>(undefined);

// Helper function to validate roles
const isValidTeamRole = (role: string): role is TeamRole => {
  return ['owner', 'admin', 'member'].includes(role);
};

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const { toast } = useToast();

  const loadTeams = async () => {
    try {
      const { data, error } = await supabase
        .from("teams")
        .select("id, name, description, created_at, created_by");

      if (error) throw error;
      setTeams(data || []);
      
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

  const loadTeamMembers = async (teamId: string): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, user_id, role, created_at, team_id")
        .eq('team_id', teamId);

      if (error) throw error;
      
      const validatedMembers = (data || []).map(member => ({
        ...member,
        role: isValidTeamRole(member.role) ? member.role : 'member'
      }));

      setTeamMembers(validatedMembers);
    } catch (error: any) {
      toast({
        title: "Error loading team members",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addTeamMember = async (teamId: string, email: string, role: TeamRole): Promise<void> => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();
        
      if (profileError) throw profileError;
      if (!profile) throw new Error("User not found");

      const { error: insertError } = await supabase
        .from("team_members")
        .insert({
          team_id: teamId,
          user_id: profile.id,
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
