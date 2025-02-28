
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Activity, ClipboardList, Lightbulb, Briefcase } from "lucide-react";

interface ActivityItem {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  activity_type: string;
  entity_type: string;
  entity_id: string;
  metadata: any;
  created_at: string;
}

export function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recent_user_activities")
        .select("*")
        .limit(20);

      if (error) throw error;
      return data as ActivityItem[];
    }
  });

  const getActivityIcon = (entityType: string) => {
    switch (entityType) {
      case "task":
        return <ClipboardList className="h-4 w-4 text-blue-500" />;
      case "idea":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case "portfolio_project":
        return <Briefcase className="h-4 w-4 text-purple-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatActivityMessage = (activity: ActivityItem) => {
    const activityType = activity.activity_type.replace(/_/g, " ");
    return `${activityType} ${activity.metadata.title || ""}`;
  };

  // Mock data for development when no activities are loaded
  const mockActivities = [
    { id: "1", entity_type: "task", activity_type: "created", metadata: { title: "Project Planning" }, created_at: new Date().toISOString() },
    { id: "2", entity_type: "idea", activity_type: "updated", metadata: { title: "Mobile App Concept" }, created_at: new Date().toISOString() },
    { id: "3", entity_type: "portfolio_project", activity_type: "completed", metadata: { title: "Website Redesign" }, created_at: new Date().toISOString() },
    { id: "4", entity_type: "task", activity_type: "assigned", metadata: { title: "QA Testing" }, created_at: new Date().toISOString() },
    { id: "5", entity_type: "idea", activity_type: "created", metadata: { title: "E-commerce Feature" }, created_at: new Date().toISOString() },
    { id: "6", entity_type: "portfolio_project", activity_type: "updated", metadata: { title: "Client Presentation" }, created_at: new Date().toISOString() },
    { id: "7", entity_type: "task", activity_type: "completed", metadata: { title: "Documentation" }, created_at: new Date().toISOString() },
    { id: "8", entity_type: "idea", activity_type: "archived", metadata: { title: "Social Media Integration" }, created_at: new Date().toISOString() },
  ];

  // Use mock data if no real data is available
  const displayActivities = activities?.length ? activities : mockActivities;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="p-4 text-center text-slate-300">Loading activity...</div>
      ) : (
        <ul className="space-y-3">
          {displayActivities.map((activity) => (
            <li key={activity.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getActivityIcon(activity.entity_type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {formatActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {format(new Date(activity.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
