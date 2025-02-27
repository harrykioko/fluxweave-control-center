
import { Brain, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ProjectAIWorkspace() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([]);

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return;

    try {
      setIsLoading(true);
      // Add user message to chat
      setMessages(prev => [...prev, { role: "user", content: message }]);
      
      // TODO: Implement AI integration
      // For now, just echo the message
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "assistant", 
          content: "This AI chat feature will be implemented soon. Your message was: " + message 
        }]);
        setIsLoading(false);
      }, 1000);

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">AI Assistant</h2>
      </div>

      <ScrollArea className="flex-1 pr-4 mb-6">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                msg.role === "assistant"
                  ? "bg-white border border-slate-200"
                  : "bg-purple-50 border border-purple-100"
              }`}
            >
              <p className="text-sm text-slate-600">{msg.content}</p>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="text-center p-6">
              <p className="text-sm text-slate-500">
                Start a conversation with the AI assistant to get insights and help with your project.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your project or request assistance..."
            className="w-full h-32 p-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-slate-700 resize-none placeholder:text-slate-400"
          />
          <MessageSquare className="absolute top-4 right-4 text-slate-400 h-5 w-5 pointer-events-none" />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          className="w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors"
        >
          {isLoading ? "Processing..." : "Send Message"}
        </Button>
      </div>
    </div>
  );
}
