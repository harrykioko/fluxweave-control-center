import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Calendar, Plus } from "lucide-react";
interface TasksHeaderProps {
  onNewTaskClick: () => void;
}

// Using memo to prevent unnecessary re-renders
export const TasksHeader = memo(function TasksHeader({
  onNewTaskClick
}: TasksHeaderProps) {
  return <div className="flex justify-between items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg">
      <div>
        <h1 className="text-3xl font-bold text-white text-gradient">Tasks</h1>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline" className="bg-white/5 backdrop-blur-md border-white/10 text-white hover:bg-white/10">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule
        </Button>
        <Button className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30" onClick={onNewTaskClick}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>;
});