
export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  commenter_first_name: string;
  commenter_last_name: string;
  commenter_avatar_url: string | null;
}
