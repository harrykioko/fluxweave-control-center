
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MapPin, Clock } from "lucide-react";

// Mock data for the recent projects
const RECENT_PROJECTS = [
  {
    id: 1,
    title: "Web Development Project",
    icon: "🔶",
    hourlyRate: "$10/hour",
    isPaid: true,
    tags: ["Remote", "Part-time"],
    description: "This project involves implementing both frontend and backend functionalities, as well as integrating with third-party APIs.",
    location: "Germany",
    timeAgo: "2h ago",
  },
  {
    id: 2,
    title: "Copyright Project",
    icon: "📘",
    hourlyRate: "$10/hour",
    isPaid: false,
    tags: [],
    description: "Creating and managing copyright documentation for digital assets and intellectual property.",
    location: "United States",
    timeAgo: "5h ago",
  },
  {
    id: 3,
    title: "Web Design Project",
    icon: "🎨",
    hourlyRate: "$10/hour",
    isPaid: true,
    tags: ["Remote", "Contract"],
    description: "Designing responsive and user-friendly interfaces for web applications with focus on accessibility.",
    location: "Canada",
    timeAgo: "1d ago",
  }
];

interface ProjectCardProps {
  project: typeof RECENT_PROJECTS[0];
  isExpanded: boolean;
  toggleExpand: () => void;
}

function ProjectCard({ project, isExpanded, toggleExpand }: ProjectCardProps) {
  return (
    <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center text-xl">
            {project.icon}
          </div>
          <div className="ml-3">
            <div className="flex items-center">
              <h3 className="font-semibold text-slate-800">{project.title}</h3>
              <Badge className={`ml-3 ${project.isPaid ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                {project.isPaid ? 'Paid' : 'Not Paid'}
              </Badge>
            </div>
            <p className="text-sm text-slate-500">{project.hourlyRate}</p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Expandable content */}
      {isExpanded && (
        <div className="mt-4 animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-3">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-slate-100">
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-slate-600 mb-3">
            {project.description}
          </p>
          
          <div className="flex items-center text-xs text-slate-500">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="mr-4">{project.location}</span>
            <Clock className="h-3 w-3 mr-1" />
            <span>{project.timeAgo}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function RecentProjects() {
  const [expandedId, setExpandedId] = useState<number | null>(1);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Your Recent Projects</h2>
        <Button variant="link" className="text-blue-600">
          See all Project
        </Button>
      </div>
      
      <div className="space-y-4">
        {RECENT_PROJECTS.map((project) => (
          <ProjectCard 
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            toggleExpand={() => setExpandedId(expandedId === project.id ? null : project.id)}
          />
        ))}
      </div>
    </div>
  );
}
