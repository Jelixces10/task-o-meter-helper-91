
import { useState, useEffect, useContext } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase, getRoleAsString } from "@/integrations/supabase/client";
import { UserCircle } from "lucide-react";
import { AuthContext } from "@/App";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Client {
  id: string;
  full_name: string | null;
  created_at: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userRole } = useContext(AuthContext);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', getRoleAsString('client'));

      if (error) throw error;

      setClients(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch clients",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">Loading clients...</h2>
          <p className="text-sm text-gray-500 mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="text-muted-foreground">View and manage client accounts</p>
      </div>

      {clients.length > 0 ? (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <UserCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-medium">{client.full_name || "Unnamed Client"}</span>
                  </TableCell>
                  <TableCell>{new Date(client.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{client.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <UserCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No clients found</h3>
          <p className="text-muted-foreground">There are currently no client accounts in the system.</p>
        </div>
      )}
    </div>
  );
};

export default Clients;
