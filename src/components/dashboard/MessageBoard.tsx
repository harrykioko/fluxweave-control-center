
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MessageBoard() {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden">
      {/* Message Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Message Board
        </h2>
        
        <ScrollArea className="h-[280px]">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((message) => (
              <div key={message} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">JD</span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline">
                    <p className="font-medium text-white">John Doe</p>
                    <span className="text-xs text-slate-400 sm:ml-2">2 hours ago</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">
                    Just finished the wireframes for the new dashboard layout. Let me know what you think!
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <Separator className="my-4 bg-white/20" />
        
        <div className="mt-2">
          <Textarea 
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:ring-1 focus:ring-purple-500"
            placeholder="Type..."
            rows={2}
          />
          <div className="flex justify-end mt-2">
            <Button className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30">Send</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
