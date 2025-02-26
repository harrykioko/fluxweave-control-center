
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (error) throw error;
        
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/90 via-purple-500/90 to-pink-500/90 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden transition-all duration-200">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="First Name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Last Name"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
              
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              
              <Button
                className="w-full bg-white text-purple-600 hover:bg-white/90"
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "Loading..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
              
              <p className="text-center text-sm text-white/80 mt-4">
                {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
                <button
                  type="button"
                  className="text-white hover:underline font-medium"
                  onClick={() => setIsSignUp(!isSignUp)}
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
