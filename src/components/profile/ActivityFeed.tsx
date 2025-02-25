
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

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
      <div className="bg-white/40 backdrop-blur-xl rounded-lg border border-white/20 shadow-sm">
        {isLoading ? (
          <div className="p-4 text-center text-slate-500">Loading activity...</div>
        ) : !activities?.length ? (
          <div className="p-4 text-center text-slate-500">No recent activity</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <li key={activity.id} className="px-4 py-3">
                <div className="flex items-start gap-3">
                  {getActivityIcon(activity.entity_type)}
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {formatActivityMessage(activity)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {format(new Date(activity.created_at), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
