
import { TeamRole } from "@/types/team";

const VALID_TEAM_ROLES = ['owner', 'admin', 'member'] as const;

export const isValidTeamRole = (role: string): role is TeamRole => {
  return VALID_TEAM_ROLES.includes(role as TeamRole);
};

