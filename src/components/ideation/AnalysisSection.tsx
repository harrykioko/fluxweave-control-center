
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisTab, Analysis } from "./types";

interface AnalysisSectionProps {
  currentTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
  analysis: Analysis;
  isLoading: boolean;
}

const tabs: { id: AnalysisTab; label: string }[] = [
  { id: "market", label: "Market Size" },
  { id: "feasibility", label: "Feasibility Analysis" },
  { id: "considerations", label: "Key Considerations" },
  { id: "next-steps", label: "Next Steps" },
];

export function AnalysisSection({
  currentTab,
  onTabChange,
  analysis,
  isLoading,
}: AnalysisSectionProps) {
  return (
    <div className="p-6 space-y-4 flex flex-col h-full bg-slate-50/50">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Search className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Analysis</h2>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              currentTab === tab.id
                ? "bg-white text-purple-600 shadow-sm"
                : "text-slate-600 hover:bg-white/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1 -mr-6 pr-6">
        {isLoading ? (
          <div className="p-4 rounded-lg bg-white shadow-sm animate-pulse space-y-3">
            <div className="h-4 bg-slate-100 rounded w-3/4"></div>
            <div className="h-4 bg-slate-100 rounded w-1/2"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
          </div>
        ) : analysis[currentTab] ? (
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <div
              className="prose prose-slate max-w-none prose-headings:text-slate-700 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-700"
              dangerouslySetInnerHTML={{ __html: analysis[currentTab] || "" }}
            />
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-white shadow-sm text-slate-500 text-center">
            No analysis available yet. Submit your query to get started.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
