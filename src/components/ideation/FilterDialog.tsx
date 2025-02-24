
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: string[];
  setActiveFilters: (filters: string[]) => void;
}

const availableTags = [
  "retail", "digital", "community", "sustainability",
  "logistics", "innovation", "technology", "social"
];

export function FilterDialog({ open, onOpenChange, activeFilters, setActiveFilters }: FilterDialogProps) {
  const toggleFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      setActiveFilters(activeFilters.filter(t => t !== tag));
    } else {
      setActiveFilters([...activeFilters, tag]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/60 backdrop-blur-xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Filter Ideas</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveFilters([])}
              className="text-slate-500 hover:text-slate-700"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.includes(tag)
                    ? "bg-purple-100 text-purple-700"
                    : "bg-white/50 text-slate-600 hover:bg-white/70"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
