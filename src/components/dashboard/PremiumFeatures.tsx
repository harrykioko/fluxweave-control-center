
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function PremiumFeatures() {
  return (
    <div 
      className="w-full bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-bold text-slate-800 mb-3">
        Unlock Premium Features
      </h2>
      
      <p className="text-sm text-slate-600 mb-6">
        Get access to exclusive benefits and expand your freelancing opportunities
      </p>
      
      <Button 
        className="w-full flex items-center justify-between bg-white text-slate-800 hover:bg-slate-100 border border-slate-200"
      >
        <span>Upgrade now</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
