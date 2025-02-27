
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import type { Resource } from "../types";

interface ResourceDetailHeaderProps {
  resource: Resource;
  isEditing: boolean;
  onEdit: () => void;
}

export function ResourceDetailHeader({ resource, isEditing, onEdit }: ResourceDetailHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold flex items-center justify-between">
        {isEditing ? "Edit Resource" : resource.title}
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="ml-4"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTitle>
      <DialogDescription>
        {!isEditing && 
          `Added ${format(new Date(resource.created_at), "MMMM d, yyyy")}`
        }
      </DialogDescription>
    </DialogHeader>
  );
}
