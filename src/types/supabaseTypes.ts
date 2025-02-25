
// Define minimal database types that match exactly what we need from Supabase
export interface DbTeam {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string | null;
}

export interface DbTeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  created_at: string | null;
}
