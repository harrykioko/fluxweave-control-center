
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "./types";

interface ResourceSectionProps {
  title: string;
  icon: React.ReactNode;
  resources: Resource[];
  className?: string;
  onResourceClick?: (resource: Resource) => void;
}

export function ResourceSection({ 
  title, 
  icon, 
  resources, 
  className,
  onResourceClick 
}: ResourceSectionProps) {
  return (
    <div className={cn(
      "rounded-2xl border backdrop-blur-md shadow-sm overflow-hidden h-[500px] flex flex-col",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="flex items-center justify-between p-5 border-b">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-semibold text-lg text-slate-800">{title}</h2>
        </div>
        <span className="text-sm text-slate-500 bg-white/50 px-2 py-1 rounded-full">
          {resources.length}
        </span>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {resources.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No {title.toLowerCase()} found</p>
              <p className="text-slate-400 text-sm mt-1">
                Click "Add Resource" to create one
              </p>
            </div>
          ) : (
            resources.map((resource) => (
              <ResourceCard 
                key={resource.id}
                id={resource.id}
                title={resource.title}
                description={resource.description}
                link={resource.link}
                type={resource.type}
                tags={resource.tags}
                createdAt={resource.created_at}
                onClick={() => onResourceClick && onResourceClick(resource)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
