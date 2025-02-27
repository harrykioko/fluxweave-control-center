
export type ResourceType = "tool" | "read" | "subscription";

export interface Resource {
  id: string;
  title: string;
  description: string;
  link?: string | null;
  type: ResourceType;
  tags?: string[] | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  
  // Fields specific to each resource type
  author?: string | null;
  pricing?: string | null;
  platform?: string | null; 
  category?: string | null;
  frequency?: string | null;
}
