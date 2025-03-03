
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/App";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserRound, Mail, Building, Calendar, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Profile {
  id: string;
  full_name: string | null;
  role: 'admin' | 'employee' | 'client';
  created_at: string;
}

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [fullName, setFullName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
        setFullName(data.full_name || '');
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user, toast]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <UserRound className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{profile?.full_name || "Client"}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="mt-4 w-full">
              <div className="flex justify-between text-sm py-2">
                <span className="text-muted-foreground flex items-center">
                  <Shield className="h-4 w-4 mr-2" />Role
                </span>
                <span className="font-medium capitalize">{profile?.role || 'Client'}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-sm py-2">
                <span className="text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />Joined
                </span>
                <span className="font-medium">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString() 
                    : new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center">
                <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                Account Type
              </Label>
              <Input
                id="role"
                value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Client'}
                disabled
                className="bg-muted capitalize"
              />
            </div>

            <Button 
              onClick={handleUpdateProfile} 
              disabled={updating}
              className="w-full"
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
