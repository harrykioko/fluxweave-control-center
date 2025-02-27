
export type ResourceType = "tool" | "read" | "influencer";

export interface Resource {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: ResourceType;
  tags?: string[];
  created_at: string;
  updated_at?: string;
  user_id?: string;
}
