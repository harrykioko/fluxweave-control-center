
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed";
  priority: string;
  due_date?: string;
  assigned_to?: string;
  project_id?: string;
  created_by: string;
  // Additional fields for display
  project_name?: string;
  assignee_first_name?: string;
  assignee_last_name?: string;
  assignee_avatar_url?: string;
  comment_count?: number;
}

export const TASK_STATUSES = [
  { id: "pending", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Done" }
];
