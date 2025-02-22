
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Users, FileText, Settings, Plus } from "lucide-react";
import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const stats = [
    {
      title: "Total Users",
      value: "2,345",
      icon: Users,
      change: "+12%",
      description: "Active users this month",
    },
    {
      title: "Projects",
      value: "432",
      icon: FileText,
      change: "+8%",
      description: "Total ongoing projects",
    },
    {
      title: "Database Size",
      value: "1.2 GB",
      icon: Database,
      change: "+5%",
      description: "Storage usage",
    },
    {
      title: "System Status",
      value: "98.5%",
      icon: Settings,
      change: "+0.5%",
      description: "System uptime",
    },
  ];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            title: taskTitle,
            description: taskDescription,
            due_date: dueDate ? new Date(dueDate).toISOString() : null,
            created_by: user.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task created successfully",
      });

      // Reset form
      setTaskTitle("");
      setTaskDescription("");
      setDueDate("");
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create task",
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2" />
          Create Task
        </Button>
      </div>

      {isCreating && (
        <Card className="p-6 mb-8">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">Create Task</Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;
