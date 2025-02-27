
export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "live" | "build" | "paused";
  url: string;
  teamMembers: TeamMember[];
}

