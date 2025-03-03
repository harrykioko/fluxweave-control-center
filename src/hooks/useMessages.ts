
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  mentioned_users?: string[];
}

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [profileSuggestions, setProfileSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    fetchMessages();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('public:recent_messages')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchMessages();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('recent_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  // Extract @mentions from message text
  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions = content.match(mentionRegex);
    
    if (!mentions) return [];
    
    return mentions.map(mention => mention.substring(1)); // Remove the @ symbol
  };

  // Fetch user IDs based on usernames
  const getUserIdsByUsernames = async (usernames: string[]): Promise<string[]> => {
    if (usernames.length === 0) return [];
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .in('username', usernames);
        
      if (error) throw error;
      
      return data?.map(user => user.id) || [];
    } catch (error: any) {
      console.error('Error fetching user IDs:', error);
      return [];
    }
  };

  // Notify mentioned users via email
  const notifyMentionedUsers = async (mentionedUserIds: string[], messageContent: string) => {
    if (mentionedUserIds.length === 0) return;
    
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      
      if (!currentUser.user) {
        return;
      }
      
      const { error } = await supabase.functions.invoke('notify-mentioned-users', {
        body: {
          mentionedUserIds,
          messageContent,
          mentionerName: `${currentUser.user.user_metadata.first_name || ''} ${currentUser.user.user_metadata.last_name || ''}`.trim(),
          mentionerId: currentUser.user.id
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error notifying mentioned users:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to send a message');
        return;
      }

      // Extract mentions from the message
      const mentionedUsernames = extractMentions(newMessage);
      const mentionedUserIds = await getUserIdsByUsernames(mentionedUsernames);

      // Insert the message with mentions
      const { data: messageData, error } = await supabase
        .from('messages')
        .insert({
          content: newMessage,
          user_id: user.id,
          mentioned_users: mentionedUserIds.length > 0 ? mentionedUserIds : null
        })
        .select('*')
        .single();
        
      if (error) throw error;
      
      // If we have mentioned users, notify them
      if (mentionedUserIds.length > 0) {
        await notifyMentionedUsers(mentionedUserIds, newMessage);
        toast.success(`Mentioned ${mentionedUsernames.join(', ')}`);
      } else {
        toast.success('Message sent');
      }
      
      setNewMessage("");
      setShowSuggestions(false);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === '@') {
      // Show suggestions when @ is typed
      fetchUserSuggestions("");
      setShowSuggestions(true);
      setCursorPosition((e.target as HTMLTextAreaElement).selectionStart + 1);
    } else if (showSuggestions && e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    
    // Check if we should show user suggestions
    const curPos = e.target.selectionStart;
    setCursorPosition(curPos);
    
    const textBeforeCursor = e.target.value.substring(0, curPos);
    const matches = textBeforeCursor.match(/@(\w*)$/);
    
    if (matches) {
      const query = matches[1];
      fetchUserSuggestions(query);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const fetchUserSuggestions = async (query: string) => {
    try {
      let queryBuilder = supabase
        .from('profiles')
        .select('id, username, first_name, last_name, avatar_url');
      
      if (query) {
        queryBuilder = queryBuilder.ilike('username', `${query}%`);
      }
      
      const { data, error } = await queryBuilder.limit(5);
      
      if (error) throw error;
      
      setProfileSuggestions(data || []);
    } catch (error: any) {
      console.error('Error fetching user suggestions:', error);
    }
  };

  const selectUserSuggestion = (username: string) => {
    // Find the position of the @ symbol that started the current mention
    const textBeforeCursor = newMessage.substring(0, cursorPosition);
    const lastAtPos = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtPos >= 0) {
      // Replace the partial @mention with the full username
      const newText = 
        newMessage.substring(0, lastAtPos) + 
        '@' + username + ' ' + 
        newMessage.substring(cursorPosition);
      
      setNewMessage(newText);
    }
    
    setShowSuggestions(false);
  };

  return {
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
  };
}
