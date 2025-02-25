
// Define exact database table types that match Supabase schema
export type DbTeam = {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string | null;
}

export type DbTeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  created_at: string | null;
}
