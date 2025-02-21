
import { Card } from "@/components/ui/card";
import { Database, Users, FileText, Settings } from "lucide-react";

const Admin = () => {
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
      </div>

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
