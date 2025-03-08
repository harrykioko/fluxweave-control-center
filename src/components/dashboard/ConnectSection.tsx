import * as React from 'react';
import { FC } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

// Mock data for connections
const CONNECTIONS = [
  {
    id: 1,
    name: "Randy Gouse",
    role: "Cybersecurity specialist",
    imageUrl: "https://avatar.vercel.sh/randy",
    level: "Senior",
  },
  {
    id: 2,
    name: "Giana Schleifer",
    role: "UX/UI Designer",
    imageUrl: "https://avatar.vercel.sh/giana",
    level: "Middle",
  }
];

export const ConnectSection: FC = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">Let's Connect</h2>
        <Button variant="link" className="text-primary-600">
          See all
        </Button>
      </div>
      
      <div className="space-y-4">
        {CONNECTIONS.map((connection) => (
          <div 
            key={connection.id}
            className="flex items-center justify-between bg-surface backdrop-blur-sm rounded-full py-2 px-4"
          >
            <div className="flex items-center">
              <Avatar className="h-12 w-12 border-2 border-default">
                <AvatarImage src={connection.imageUrl} alt={connection.name} />
                <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="ml-3">
                <div className="flex items-center">
                  <h3 className="font-medium text-primary">{connection.name}</h3>
                  <Badge 
                    className={`ml-2 ${
                      connection.level === 'Senior' 
                        ? 'bg-warning-500' 
                        : 'bg-info-500'
                    } text-xs`}
                  >
                    {connection.level}
                  </Badge>
                </div>
                <p className="text-xs text-secondary">{connection.role}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
