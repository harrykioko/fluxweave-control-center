
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "./types";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { ResourceDetailDialog } from "./ResourceDetailDialog";

interface ResourceSectionProps {
  title: string;
  icon: React.ReactElement<LucideIcon>;
  resources: Resource[];
  className?: string;
  onResourceClick?: (resource: Resource) => void;
}

export function ResourceSection({ 
  title, 
  icon, 
  resources,
  className 
}: ResourceSectionProps) {
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/50 backdrop-blur-md rounded-lg">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          {title} ({resources.length})
        </h2>
      </div>

      <div className={`p-4 rounded-lg ${className}`}>
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                {...resource}
                onClick={() => handleResourceClick(resource)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">
            No {title.toLowerCase()} added yet
          </p>
        )}
      </div>

      <ResourceDetailDialog
        resource={selectedResource}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onResourceUpdated={() => {
          // Trigger a refresh of the resources list
          window.location.reload();
        }}
      />
    </div>
  );
}
