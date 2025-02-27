
export type ResourceType = "tool" | "read" | "influencer";

export interface Resource {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: ResourceType;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  userId?: string;
}
