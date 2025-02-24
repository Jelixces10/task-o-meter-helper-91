import { Database, Clock, Eye, CheckCircle } from "lucide-react";
import MetricCard from "@/components/MetricCard";

const Index = () => {
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

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
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