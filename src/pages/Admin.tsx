
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Users, FileText, Settings, Plus } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";
import { useQuery } from "@tanstack/react-query";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [employees, setEmployees] = useState<Array<{ id: string; full_name: string }>>([]);

  const { data: tasks, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_employee:profiles!tasks_assigned_to_fkey(full_name),
          created_by_employee:profiles!tasks_created_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    fetchEmployees();

    // Set up realtime subscription for tasks
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          // Invalidate the tasks query to trigger a refresh
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'employee');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch employees",
      });
    }
  };

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
            created_by: user.id,
            assigned_to: selectedEmployee || null
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
      setSelectedEmployee("");
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
              <Label htmlFor="assignedTo">Assign to Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {employees.map((employee) => (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {employee.full_name || 'Unnamed Employee'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
        <div className="space-y-4">
          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <Card key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Assigned to: {task.assigned_employee?.full_name || 'Unassigned'}
                    </p>
                    {task.due_date && (
                      <p className="text-sm text-gray-600">
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {task.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    Created by: {task.created_by_employee?.full_name}
                  </span>
                </div>
              </Card>
            ))
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Admin;
