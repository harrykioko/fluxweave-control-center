
// Define exact database table types that match Supabase schema
export type DbTeamBase = {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string | null;
}

export type DbTeamMemberBase = {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  created_at: string | null;
}

// Type guards to ensure data conforms to our expected shapes
export const isDbTeam = (data: unknown): data is DbTeamBase => {
  const team = data as DbTeamBase;
  return (
    typeof team === 'object' &&
    team !== null &&
    typeof team.id === 'string' &&
    typeof team.name === 'string' &&
    typeof team.created_by === 'string' &&
    (team.description === null || typeof team.description === 'string') &&
    (team.created_at === null || typeof team.created_at === 'string')
  );
};

export const isDbTeamMember = (data: unknown): data is DbTeamMemberBase => {
  const member = data as DbTeamMemberBase;
  return (
    typeof member === 'object' &&
    member !== null &&
    typeof member.id === 'string' &&
    typeof member.team_id === 'string' &&
    typeof member.user_id === 'string' &&
    typeof member.role === 'string' &&
    (member.created_at === null || typeof member.created_at === 'string')
  );
};
