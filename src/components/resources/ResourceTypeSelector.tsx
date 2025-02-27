
import { Button } from "@/components/ui/button";
import { Wrench, BookOpen, Users } from "lucide-react";
import { ResourceType } from "./types";

interface ResourceTypeSelectorProps {
  selectedType: ResourceType;
  onTypeChange: (type: ResourceType) => void;
}

export function ResourceTypeSelector({ 
  selectedType, 
  onTypeChange 
}: ResourceTypeSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        type="button"
        variant={selectedType === "tool" ? "default" : "outline"}
        className={selectedType === "tool" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
        onClick={() => onTypeChange("tool")}
      >
        <Wrench className="mr-2 h-4 w-4" />
        Tool
      </Button>
      
      <Button
        type="button"
        variant={selectedType === "read" ? "default" : "outline"}
        className={selectedType === "read" ? "bg-blue-500 hover:bg-blue-600" : ""}
        onClick={() => onTypeChange("read")}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Read
      </Button>
      
      <Button
        type="button"
        variant={selectedType === "subscription" ? "default" : "outline"}
        className={selectedType === "subscription" ? "bg-purple-500 hover:bg-purple-600" : ""}
        onClick={() => onTypeChange("subscription")}
      >
        <Users className="mr-2 h-4 w-4" />
        Subscription
      </Button>
    </div>
  );
}
