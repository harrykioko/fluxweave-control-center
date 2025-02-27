
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
  const filteredSubscriptions = filterResources("subscription");

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8 bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90">
      <main className="max-w-7xl mx-auto">
        <div className="glass-panel p-6 rounded-xl mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Resources</h1>
              <p className="text-slate-300">Manage your tools, reads, and subscriptions</p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-9 h-10 w-full sm:w-[260px] rounded-lg glass-button bg-white/5 border-white/10 focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                className="flex gap-2 bg-purple-600 hover:bg-purple-700 border border-purple-500/30 transition-all"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Resource
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="glass-panel rounded-xl p-10 flex justify-center items-center">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tools Section */}
            <ResourceSection
              title="Tools"
              icon={<Wrench className="h-5 w-5 text-emerald-500" />}
              resources={filteredTools}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-500/20"
              onResourceClick={setSelectedResource}
            />

            {/* Reads Section */}
            <ResourceSection
              title="Reads"
              icon={<BookOpen className="h-5 w-5 text-blue-500" />}
              resources={filteredReads}
              className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-500/20"
              onResourceClick={setSelectedResource}
            />

            {/* Subscriptions Section */}
            <ResourceSection
              title="Subscriptions"
              icon={<Users className="h-5 w-5 text-purple-500" />}
              resources={filteredSubscriptions}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border-purple-500/20"
              onResourceClick={setSelectedResource}
            />
          </div>
        )}
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
