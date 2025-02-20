
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Employee = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const tasks = [
    {
      title: "Active Tasks",
      value: "12",
      icon: Clock,
      description: "Tasks in progress",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed Tasks",
      value: "45",
      icon: CheckCircle,
      description: "Tasks finished this month",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Upcoming Deadlines",
      value: "8",
      icon: Calendar,
      description: "Due this week",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Issues",
      value: "3",
      icon: AlertCircle,
      description: "Needs attention",
      color: "text-red-600",
      bgColor: "bg-red-50",
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {tasks.map((task) => (
          <Card key={task.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${task.bgColor}`}>
                <task.icon className={`w-5 h-5 ${task.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{task.value}</h3>
            <p className="text-sm text-muted-foreground">{task.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employee;
