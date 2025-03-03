
import { useState, useEffect, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, FolderKanban, ClipboardList, Clock } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "processing" | "completed";
  remarks: string | null;
  due_date: string | null;
  created_at: string;
  assigned_to: string | null;
  created_by: string;
  priority: string;
  updated_at: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  deadline: string;
  budget: number;
}

export default function Client() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await supabase
          .from("tasks")
          .select("*")
          .eq("created_by", user?.id);

        if (tasksError) throw tasksError;
        setTasks(tasksData || []);

        // Fetch projects for this client
        const { data: projectsData, error: projectsError } = await supabase
          .from("projects")
          .select("*")
          .eq("client_email", user?.email)
          .order("deadline", { ascending: true });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const getStatusBadgeColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "processing":
        return "bg-blue-500 hover:bg-blue-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getProjectStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("complete")) return "bg-green-500";
    if (lowerStatus.includes("progress") || lowerStatus.includes("ongoing")) return "bg-blue-500";
    if (lowerStatus.includes("plan")) return "bg-purple-500";
    if (lowerStatus.includes("hold")) return "bg-amber-500";
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-700">Loading your dashboard...</span>
      </div>
    );
  }

  // Calculate upcoming deadlines - projects due in the next 7 days
  const today = new Date();
  const inOneWeek = new Date();
  inOneWeek.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = projects.filter(project => {
    const deadlineDate = new Date(project.deadline);
    return deadlineDate >= today && deadlineDate <= inOneWeek;
  });

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your project management dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <h3 className="text-2xl font-bold">{projects.length}</h3>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <h3 className="text-2xl font-bold">{tasks.filter(t => t.status !== "completed").length}</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-full">
                <ClipboardList className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</p>
                <h3 className="text-2xl font-bold">{upcomingDeadlines.length}</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-full">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        {projects.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Budget</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge className={getProjectStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(project.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>${project.budget.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 bg-muted rounded-md">
            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-muted-foreground mt-1">
              You don't have any projects yet.
            </p>
          </div>
        )}
      </div>

      {/* Tasks Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {tasks.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.description || "—"}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(task.status)}>
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.priority === "high" ? "destructive" : "outline"}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 bg-muted rounded-md">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No tasks found</h3>
            <p className="text-muted-foreground mt-1">
              There are currently no tasks created for your projects.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
