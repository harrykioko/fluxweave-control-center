
import type { Database } from "@/integrations/supabase/types";

// Raw database types without any transformations
export type RawTeam = {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string | null;
};

export type RawTeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  created_at: string | null;
};

// Database types as they appear in Supabase
export type DbTeamRow = Database['public']['Tables']['teams']['Row']
export type DbTeamInsert = Database['public']['Tables']['teams']['Insert']
export type DbTeamUpdate = Database['public']['Tables']['teams']['Update']

export type DbTeamMemberRow = Database['public']['Tables']['team_members']['Row']
export type DbTeamMemberInsert = Database['public']['Tables']['team_members']['Insert']
export type DbTeamMemberUpdate = Database['public']['Tables']['team_members']['Update']
