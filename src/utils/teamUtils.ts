
import { TeamRole } from "@/types/team";

export const isValidTeamRole = (role: string): role is TeamRole => {
  return ['owner', 'admin', 'member'].includes(role);
};
