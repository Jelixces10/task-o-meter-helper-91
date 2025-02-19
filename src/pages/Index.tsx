
import { Database, Clock, Eye, CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MetricCard from "@/components/MetricCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock data - in a real app, this would come from an API
  const metrics = [
    {
      title: "Total Projects",
      value: 125,
      icon: Database,
      description: "Total projects in the system",
    },
    {
      title: "Pending",
      value: 42,
      icon: Clock,
      description: "Projects awaiting action",
    },
    {
      title: "To Review",
      value: 15,
      icon: Eye,
      description: "Projects needing review",
    },
    {
      title: "Completed",
      value: 68,
      icon: CheckCircle,
      description: "Successfully completed projects",
    },
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
      
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to logout",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              description={metric.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
