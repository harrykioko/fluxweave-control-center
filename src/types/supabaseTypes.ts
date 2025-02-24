
import type { Database } from "@/integrations/supabase/types";

// Extract exact types from Supabase generated types
export type DbTeamInsert = Database['public']['Tables']['teams']['Insert']
export type DbTeamRow = Database['public']['Tables']['teams']['Row']
export type DbTeamUpdate = Database['public']['Tables']['teams']['Update']

export type DbTeamMemberInsert = Database['public']['Tables']['team_members']['Insert']
export type DbTeamMemberRow = Database['public']['Tables']['team_members']['Row']
export type DbTeamMemberUpdate = Database['public']['Tables']['team_members']['Update']
