
import { TaskCommentsContainer } from "./comments/TaskCommentsContainer";

interface TaskCommentsProps {
  taskId: string;
  currentUserId: string;
}

export function TaskComments({ taskId, currentUserId }: TaskCommentsProps) {
  return <TaskCommentsContainer taskId={taskId} currentUserId={currentUserId} />;
}
