
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

// Base resource properties required for insertion
export interface ResourceInsertBase {
  title: string;
  description: string;
  link?: string | null;
  type: ResourceType;
  tags?: string[] | null;
  user_id: string;
}

// Type-specific resource properties
export interface ToolResource extends ResourceInsertBase {
  type: "tool";
  pricing?: string | null;
  category?: string | null;
}

export interface ReadResource extends ResourceInsertBase {
  type: "read";
  author?: string | null;
  category?: string | null;
}

export interface SubscriptionResource extends ResourceInsertBase {
  type: "subscription";
  platform?: string | null;
  frequency?: string | null;
}

// Union type for all resource types
export type ResourceInsert = ToolResource | ReadResource | SubscriptionResource;
