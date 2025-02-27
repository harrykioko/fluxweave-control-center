
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Wrench, BookOpen, Users } from "lucide-react";
import { ResourceSection } from "@/components/resources/ResourceSection";
import type { Resource, ResourceType } from "@/components/resources/types";

// Sample data - would be replaced with actual data from a database
const sampleResources: Resource[] = [
  {
    id: "1",
    title: "Figma",
    description: "Design tool for collaborative interfaces",
    link: "https://figma.com",
    type: "tool",
    tags: ["design", "collaboration", "prototyping"],
    createdAt: "2023-06-15"
  },
  {
    id: "2",
    title: "VS Code",
    description: "Lightweight but powerful source code editor",
    link: "https://code.visualstudio.com",
    type: "tool",
    tags: ["development", "code", "editor"],
    createdAt: "2023-05-20"
  },
  {
    id: "3",
    title: "Atomic Habits",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    link: "https://jamesclear.com/atomic-habits",
    type: "read",
    tags: ["productivity", "habits", "self-improvement"],
    createdAt: "2023-07-10"
  },
  {
    id: "4",
    title: "The Lean Startup",
    description: "How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses",
    link: "https://theleanstartup.com/",
    type: "read",
    tags: ["business", "startup", "innovation"],
    createdAt: "2023-04-25"
  },
  {
    id: "5",
    title: "Paul Graham",
    description: "Entrepreneur, investor, and co-founder of Y Combinator",
    link: "https://paulgraham.com/",
    type: "influencer",
    tags: ["startup", "essays", "venture capital"],
    createdAt: "2023-03-18"
  },
  {
    id: "6",
    title: "Naval Ravikant",
    description: "Entrepreneur, philosopher, and tech investor",
    link: "https://nav.al/",
    type: "influencer",
    tags: ["wisdom", "wealth", "philosophy"],
    createdAt: "2023-08-05"
  }
];

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // Filter resources by type and search query
  const filterResources = (type: ResourceType) => {
    return sampleResources.filter(resource => 
      resource.type === type && 
      (searchQuery === "" || 
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  };
  
  const filteredTools = filterResources("tool");
  const filteredReads = filterResources("read");
  const filteredInfluencers = filterResources("influencer");

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource);
    console.log("Selected resource:", resource);
    // In the future, this would open a dialog with more details
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800">Resources</h1>
            <p className="text-slate-500 mt-2">
              Discover and organize tools, reads, and influencers that help you grow
            </p>
          </header>

          {/* Search and Add Resource */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-9 h-10 w-full sm:w-[300px] rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button className="flex gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Tools Section */}
            <ResourceSection
              title="Tools"
              icon={<Wrench className="h-5 w-5 text-emerald-500" />}
              resources={filteredTools}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100"
              onResourceClick={handleResourceClick}
            />

            {/* Reads Section */}
            <ResourceSection
              title="Reads"
              icon={<BookOpen className="h-5 w-5 text-blue-500" />}
              resources={filteredReads}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100"
              onResourceClick={handleResourceClick}
            />

            {/* Influencers Section */}
            <ResourceSection
              title="Influencers"
              icon={<Users className="h-5 w-5 text-purple-500" />}
              resources={filteredInfluencers}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100"
              onResourceClick={handleResourceClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
