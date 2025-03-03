
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectOption: (option: "project" | "domain" | "social") => void;
}

export function PortfolioSelectionDialog({
  open,
  onOpenChange,
  onSelectOption,
}: PortfolioSelectionDialogProps) {
  const options = [
    {
      id: "project",
      name: "Project",
      description: "Create a new project in your portfolio",
      icon: <Layers className="h-6 w-6" />,
    },
    {
      id: "domain",
      name: "Domain",
      description: "Add a new domain to your collection",
      icon: <Globe className="h-6 w-6" />,
    },
    {
      id: "social",
      name: "Social Media",
      description: "Add a new social media account",
      icon: <Users className="h-6 w-6" />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] bg-white/60 backdrop-blur-xl">
        <DialogTitle className="text-xl font-semibold text-slate-800 mb-4">
          What would you like to add?
        </DialogTitle>
        <div className="grid grid-cols-1 gap-4">
          {options.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              className={cn(
                "flex items-center justify-start gap-4 p-4 h-auto text-left",
                "bg-white/50 hover:bg-slate-100 border border-slate-200"
              )}
              onClick={() => {
                onSelectOption(option.id as "project" | "domain" | "social");
                onOpenChange(false);
              }}
            >
              <div className="p-2 bg-slate-100 rounded-lg">{option.icon}</div>
              <div>
                <div className="font-medium text-slate-800">{option.name}</div>
                <div className="text-sm text-slate-500">{option.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
