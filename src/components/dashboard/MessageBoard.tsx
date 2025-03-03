
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { format, formatDistanceToNow } from "date-fns";

export function MessageBoard() {
  const { 
    messages, 
    isLoading, 
    newMessage, 
    setNewMessage, 
    sendMessage, 
    handleKeyDown 
  } = useMessages();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg overflow-hidden">
      {/* Message Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Message Board
        </h2>
        
        <ScrollArea className="h-[280px]">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-white/20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/20 rounded w-32"></div>
                    <div className="h-3 bg-white/10 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-white">
                      {getInitials(message.first_name, message.last_name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline">
                      <p className="font-medium text-white">
                        {message.first_name} {message.last_name}
                      </p>
                      <span className="text-xs text-slate-400 sm:ml-2">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1 whitespace-pre-line">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-slate-400 text-sm">No messages yet. Be the first to post!</p>
            </div>
          )}
        </ScrollArea>
        
        <Separator className="my-4 bg-white/20" />
        
        <div className="mt-2">
          <Textarea 
            className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-sm text-white placeholder:text-slate-400 focus:ring-1 focus:ring-purple-500"
            placeholder="Type a message..."
            rows={2}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-end mt-2">
            <Button 
              className="bg-purple-600/90 hover:bg-purple-700/90 text-white border border-purple-500/30"
              onClick={sendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
