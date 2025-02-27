
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Task Manager</h1>
        <p className="text-lg text-gray-600">Manage your tasks efficiently</p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
