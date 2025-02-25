
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Clock, User, Edit, Trash, Plus } from "lucide-react";
import { format } from "date-fns";

interface AuditLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogsDialog({ open, onOpenChange }: AuditLogsDialogProps) {
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data;
    },
  });

  const getOperationIcon = (operation: string) => {
    switch (operation.toLowerCase()) {
      case "insert":
        return <Plus className="h-4 w-4 text-emerald-500" />;
      case "update":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "delete":
        return <Trash className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatChanges = (oldData: any, newData: any) => {
    if (!oldData && newData) {
      return "Created new record";
    }
    if (oldData && !newData) {
      return "Deleted record";
    }
    if (oldData && newData) {
      const changes = [];
      for (const key in newData) {
        if (oldData[key] !== newData[key]) {
          changes.push(`Changed ${key} from "${oldData[key]}" to "${newData[key]}"`);
        }
      }
      return changes.join(", ");
    }
    return "No changes detected";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white/60 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Activity className="h-5 w-5 text-purple-600" />
            Activity Log
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center text-slate-500 py-4">Loading audit logs...</p>
            ) : auditLogs?.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No activity found</p>
            ) : (
              auditLogs?.map((log) => (
                <div
                  key={log.id}
                  className="bg-white/50 backdrop-blur-md rounded-lg p-4 border border-white/20 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getOperationIcon(log.operation)}
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {log.table_name === "teams" ? "Team" : "Team Member"} {log.operation}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatChanges(log.old_data, log.new_data)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(log.changed_at), "MMM d, yyyy HH:mm")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                    <User className="h-3 w-3" />
                    <span>by {log.changed_by}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
