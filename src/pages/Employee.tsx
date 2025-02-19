
import { Card } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

const Employee = () => {
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
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
