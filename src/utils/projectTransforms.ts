
import type { Database } from "@/integrations/supabase/types";
import type { Project } from "@/types/portfolio";

type DatabaseProject = Database["public"]["Tables"]["projects"]["Row"];

export const transformProject = (dbProject: DatabaseProject): Project => ({
  id: dbProject.id,
  name: dbProject.name,
  logo: dbProject.logo_url || '/placeholder.svg',
  description: dbProject.description || '',
  status: (dbProject.status as "live" | "build" | "paused") || "build",
  url: dbProject.url || '#',
  teamMembers: [],
});
