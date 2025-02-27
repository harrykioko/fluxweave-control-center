
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { ResourceType } from "./types";
import { formatDistanceToNow } from "date-fns";
import * as Icons from "lucide-react";

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  link?: string;
  type: ResourceType;
  tags?: string[];
  createdAt?: string;
  onClick?: () => void;
  className?: string;
}

// Function to extract domain from URL
const extractDomain = (url?: string): string => {
  if (!url) return "";
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch {
    return "";
  }
};

// Function to get icon based on domain
const getIconForDomain = (domain: string): keyof typeof Icons => {
  // Map common domains to their corresponding icons
  const domainIconMap: Record<string, keyof typeof Icons> = {
    "github.com": "Github",
    "gitlab.com": "Gitlab",
    "slack.com": "Slack",
    "trello.com": "Trello",
    "figma.com": "Figma",
    "youtube.com": "Youtube",
    "twitch.tv": "Twitch",
    "linkedin.com": "Linkedin",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "twitter.com": "Twitter",
  };

  // Check for partial matches if exact match isn't found
  for (const [domainKey, iconName] of Object.entries(domainIconMap)) {
    if (domain.includes(domainKey.replace(".com", "").replace(".tv", ""))) {
      return iconName;
    }
  }

  // Default icon for unknown domains
  return "Globe";
};

export function ResourceCard({ 
  title, 
  description, 
  link, 
  type, 
  tags,
  createdAt,
  onClick, 
  className 
}: ResourceCardProps) {
  const getLinkText = () => {
    switch (type) {
      case "tool": return "Visit website";
      case "read": return "Read more";
      case "subscription": return "View subscription";
      default: return "Learn more";
    }
  };

  // Format the date if available
  const formattedDate = createdAt 
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) 
    : "";

  // Different styling based on resource type
  const isSubscription = type === "subscription";

  // Get domain and corresponding icon for subscriptions
  const domain = isSubscription ? extractDomain(link) : "";
  const iconName = getIconForDomain(domain);
  
  // Correctly render the icon component by accessing it from Icons
  const IconComponent = Icons[iconName];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl p-4 border transition-all duration-300 cursor-pointer",
        isSubscription 
          ? "bg-white/10 backdrop-blur-2xl border-white/15 hover:bg-white/15 hover:shadow-xl" 
          : "bg-white/10 backdrop-blur-md border-white/10 hover:bg-white/15 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-start gap-3">
        {isSubscription && (
          <div className="flex-shrink-0 p-2 bg-white/10 backdrop-blur-md rounded-lg mt-0.5">
            <IconComponent className="h-4 w-4 text-purple-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-sm text-slate-300 mt-1 line-clamp-2">{description}</p>
          
          {link && (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:text-purple-300 mt-2 inline-flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              {getLinkText()}
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          
          <div className="flex justify-between items-end mt-3">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 bg-white/5 text-slate-300 border border-white/10 rounded-full">
                    +{tags.length - 3}
                  </span>
                )}
              </div>
            )}
            
            {formattedDate && (
              <span className="text-xs text-slate-400 ml-auto">
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
