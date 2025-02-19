
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Employee from "./pages/Employee";

const queryClient = new QueryClient();

// This would typically come from your auth context/provider
const isAuthenticated = true; // Temporarily set to true for testing

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full">
                    <AppSidebar />
                    <main className="flex-1 bg-white p-6">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path="/employee" element={<Employee />} />
                        <Route path="/messages" element={<div className="p-4">Messages Page</div>} />
                        <Route path="/projects" element={<div className="p-4">Projects Page</div>} />
                        <Route path="/clients" element={<div className="p-4">Clients Page</div>} />
                        <Route path="/accounts" element={<div className="p-4">Accounts Page</div>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
