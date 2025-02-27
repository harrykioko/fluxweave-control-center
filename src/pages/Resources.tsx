
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Wrench, BookOpen, Users } from "lucide-react";
import { ResourceSection } from "@/components/resources/ResourceSection";
import type { Resource, ResourceType } from "@/components/resources/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AddResourceDialog } from "@/components/resources/AddResourceDialog";

export default function Resources() {
  const [searchQuery, setSearchQuery] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch resources from Supabase
  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Ensure the data conforms to the Resource type
      const typedResources: Resource[] = data?.map(item => ({
        ...item,
        type: item.type as ResourceType,
        link: item.link || null,
        tags: item.tags || null
      })) || [];
      
      setResources(typedResources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast({
        title: "Failed to load resources",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);
  
  // Filter resources by type and search query
  const filterResources = (type: ResourceType) => {
    return resources.filter(resource => 
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
            <Button 
              className="flex gap-2 bg-purple-600 hover:bg-purple-700"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Resource
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-purple-500 rounded-full border-t-transparent"></div>
            </div>
          ) : (
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
          )}
        </div>
      </main>

      {/* Add Resource Dialog */}
      <AddResourceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onResourceAdded={fetchResources}
      />
    </div>
  );
}
