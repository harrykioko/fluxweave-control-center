import * as React from 'react';
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const PremiumFeatures: FC = () => {
  return (
    <div 
      className="w-full bg-gradient backdrop-blur-xl border-subtle rounded-xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-bold text-primary mb-3">
        Unlock Premium Features
      </h2>
      
      <p className="text-sm text-secondary mb-6">
        Get access to exclusive benefits and expand your freelancing opportunities
      </p>
      
      <Button 
        variant="glass"
        className="w-full flex items-center justify-between"
      >
        <span>Upgrade now</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
