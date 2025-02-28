
import React, { useCallback } from "react";
import { NewTaskDialog } from "@/components/tasks/NewTaskDialog";
import { TaskDetailDialog } from "@/components/tasks/TaskDetailDialog";
import { TasksHeader } from "@/components/tasks/board/TasksHeader";
import { TasksBoard } from "@/components/tasks/board/TasksBoard";
import { useTasks } from "@/hooks/useTasks";

export default function Tasks() {
  const {
    tasks,
    isLoading,
    profiles,
    isNewTaskOpen,
    setIsNewTaskOpen,
    isTaskDetailOpen,
    setIsTaskDetailOpen,
    selectedTaskId,
    handleTaskClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useTasks();

  const handleNewTaskClick = useCallback(() => {
    setIsNewTaskOpen(true);
  }, [setIsNewTaskOpen]);

  return (
    <main className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <TasksHeader onNewTaskClick={handleNewTaskClick} />

        {/* Tasks Board */}
        <TasksBoard
          tasks={tasks}
          isLoading={isLoading}
          onTaskClick={handleTaskClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      </div>

      {/* Dialogs */}
      <NewTaskDialog 
        open={isNewTaskOpen} 
        onOpenChange={setIsNewTaskOpen} 
        profiles={profiles} 
      />

      <TaskDetailDialog
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        taskId={selectedTaskId}
        profiles={profiles}
      />
    </main>
  );
}
