
import { Brain, MessageSquare, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Analysis } from "./types";
import { useEffect, useRef, useState } from "react";

interface WorkspaceSectionProps {
  initialIdea: string;
  analysis: Analysis;
  message: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSubmitMessage: () => void;
  onSaveIdea: () => void;
}

export function WorkspaceSection({
  initialIdea,
  analysis,
  message,
  isLoading,
  onMessageChange,
  onSubmitMessage,
  onSaveIdea,
}: WorkspaceSectionProps) {
  const [displayedAnalysis, setDisplayedAnalysis] = useState<Analysis>({
    market: null,
    feasibility: null,
    considerations: null,
    "next-steps": null
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingSpeedRef = useRef<number>(30); // ms per character

  // Effect to smoothly reveal new analysis content
  useEffect(() => {
    Object.entries(analysis).forEach(([key, value]) => {
      if (value !== displayedAnalysis[key as keyof Analysis] && value !== null) {
        let currentText = "";
        const fullText = value;
        let currentIndex = 0;

        const typeNextCharacter = () => {
          if (currentIndex < fullText.length) {
            currentText += fullText[currentIndex];
            setDisplayedAnalysis(prev => ({
              ...prev,
              [key]: currentText
            }));
            currentIndex++;
            setTimeout(typeNextCharacter, typingSpeedRef.current);
          }
        };

        typeNextCharacter();
      }
    });
  }, [analysis]);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [displayedAnalysis]);

  return (
    <div className="p-6 space-y-4 flex flex-col h-full bg-white/80 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">Workspace</h2>
      </div>

      <ScrollArea className="flex-1 -mr-6 pr-6">
        <div className="space-y-4" ref={scrollRef}>
          <div className="p-4 rounded-lg bg-white shadow-sm border border-slate-100">
            <h3 className="font-medium text-slate-700 mb-2">Initial Idea</h3>
            <p className="text-slate-600 whitespace-pre-wrap">{initialIdea}</p>
          </div>

          <div className="space-y-4">
            {Object.entries(displayedAnalysis).map(([key, value]) => 
              value && (
                <div key={key} className="p-4 rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                  <h3 className="font-medium text-slate-700 mb-2 capitalize">{key.replace("-", " ")}</h3>
                  <div 
                    className="prose prose-slate max-w-none prose-headings:text-slate-700 prose-p:text-slate-600 prose-li:text-slate-600 prose-strong:text-slate-700" 
                    dangerouslySetInnerHTML={{ __html: value }} 
                  />
                </div>
              )
            )}
          </div>
        </div>
      </ScrollArea>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Ask a question or provide more details..."
            className="w-full h-32 p-4 rounded-lg bg-white shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-700 resize-none"
          />
          <MessageSquare className="absolute top-4 right-4 text-slate-400 h-5 w-5 pointer-events-none" />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={onSubmitMessage}
            disabled={!message.trim() || isLoading}
            className="flex-1 bg-purple-600 text-white hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Processing..." : "Submit"}
          </Button>

          <Button 
            onClick={onSaveIdea}
            variant="outline"
            className="bg-white hover:bg-slate-50 transition-colors"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Idea
          </Button>
        </div>
      </div>
    </div>
  );
}
