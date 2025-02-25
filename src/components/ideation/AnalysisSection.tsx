
import { Brain, PieChart, CheckSquare, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnalysisTab, Analysis } from "./types";

interface AnalysisSectionProps {
  currentTab: AnalysisTab;
  onTabChange: (tab: AnalysisTab) => void;
  analysis: Analysis;
  isLoading: boolean;
}

export function AnalysisSection({
  currentTab,
  onTabChange,
  analysis,
  isLoading,
}: AnalysisSectionProps) {
  const getTabIcon = (tab: AnalysisTab) => {
    switch (tab) {
      case "market":
        return <PieChart className="h-4 w-4" />;
      case "feasibility":
        return <CheckSquare className="h-4 w-4" />;
      case "considerations":
        return <Lightbulb className="h-4 w-4" />;
      case "next-steps":
        return <ArrowRight className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Analysis</h2>
        <div className="flex gap-2">
          {(["market", "feasibility", "considerations", "next-steps"] as AnalysisTab[]).map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className={`${currentTab === tab ? "bg-white/50" : ""} gap-2`}
              onClick={() => onTabChange(tab)}
            >
              {getTabIcon(tab)}
              <span className="capitalize">{tab.replace("-", " ")}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Brain className="h-8 w-8 text-purple-600 animate-pulse" />
          </div>
        ) : analysis[currentTab] ? (
          <div className="prose prose-slate max-w-none">
            <div dangerouslySetInnerHTML={{ __html: analysis[currentTab] || "" }} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Brain className="h-8 w-8 mb-4" />
            <p>Analysis will appear here as you interact with the AI</p>
          </div>
        )}
      </div>
    </div>
  );
}
