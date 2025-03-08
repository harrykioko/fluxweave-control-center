import * as React from 'react';
import { FC } from 'react';
import { MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMessages } from "@/hooks/useMessages";
import { format, formatDistanceToNow } from "date-fns";

export const MessageBoard: FC = () => {
  const { 
    messages, 
    isLoading, 
    newMessage, 
    setNewMessage, 
    sendMessage, 
    handleKeyDown,
    handleChange,
    showSuggestions,
    profileSuggestions,
    selectUserSuggestion
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

  // Format message content to highlight @mentions
  const formatMessageWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g;
    
    // Split the content by @mentions and render them with different styling
    const parts = content.split(mentionRegex);
    
    if (parts.length <= 1) {
      return <span>{content}</span>;
    }
    
    const mentions = content.match(mentionRegex) || [];
    const result: React.ReactNode[] = [];
    
    parts.forEach((part, index) => {
      // Add the regular text part
      if (part) {
        result.push(<span key={`text-${index}`}>{part}</span>);
      }
      
      // Add the mention if there is one for this position
      if (index < mentions.length) {
        result.push(
          <span 
            key={`mention-${index}`} 
            className="bg-primary-100 text-primary-800 px-1 rounded font-medium"
          >
            {mentions[index]}
          </span>
        );
      }
    });
    
    return <>{result}</>;
  };

  return (
    <div className="glass-panel overflow-hidden">
      {/* Message Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-xl font-bold text-primary mb-4 flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Message Board
        </h2>
        
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full glass-sm"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-elevated rounded w-32"></div>
                    <div className="h-3 bg-surface-hover rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3 group">
                  <Avatar className="h-10 w-10 border-2 border-primary-500/30 glass-sm">
                    <AvatarImage src={message.avatar_url || ""} alt={`${message.first_name} ${message.last_name}`} />
                    <AvatarFallback className="bg-primary-600/30 text-white">
                      {getInitials(message.first_name, message.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="glass-md p-3 rounded-xl rounded-tl-none">
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="font-medium text-primary-300">
                          {message.first_name} {message.last_name}
                        </p>
                        <span className="text-xs text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatMessageTime(message.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-secondary whitespace-pre-line">
                        {formatMessageWithMentions(message.content)}
                      </p>
                    </div>
                    <div className="mt-1 ml-2">
                      <span className="text-xs text-tertiary">
                        {formatMessageTime(message.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <User className="h-12 w-12 text-primary-400/60 mx-auto mb-2" />
                <p className="text-secondary text-sm">No messages yet. Be the first to post!</p>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <Separator className="my-4 bg-border-default" />
        
        <div className="mt-2 relative">
          <Textarea 
            className="glass-input w-full p-3 text-sm"
            placeholder="Type a message... Use @username to mention someone"
            rows={2}
            value={newMessage}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          
          {/* User suggestions dropdown */}
          {showSuggestions && profileSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-64 glass-tooltip">
              <div className="max-h-48 overflow-y-auto">
                {profileSuggestions.map((profile) => (
                  <div 
                    key={profile.id} 
                    className="flex items-center gap-2 p-2 hover:bg-primary-500/20 cursor-pointer transition-colors"
                    onClick={() => selectUserSuggestion(profile.username || `${profile.first_name}${profile.last_name}`.toLowerCase())}
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={profile.avatar_url || ""} />
                      <AvatarFallback className="bg-primary-600/30 text-white text-xs">
                        {getInitials(profile.first_name, profile.last_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-primary">{profile.first_name} {profile.last_name}</p>
                      {profile.username && (
                        <p className="text-xs text-tertiary">@{profile.username}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-2">
            <Button 
              variant="gradient"
              className="glass-hover glass-active"
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
};
