import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, Upload, Image, Video, BarChart3 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import FileUpload from "@/components/FileUpload";
import DetectionResults from "@/components/DetectionResults";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Detection Platform
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/analytics")}
              className="border-primary/50 hover:border-primary"
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-destructive/50 hover:border-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-cyan transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Image className="h-6 w-6 text-primary" />
                <CardTitle>Image Detection</CardTitle>
              </div>
              <CardDescription>
                Upload images to detect AI-generated content with high precision
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/20 bg-card/80 backdrop-blur-sm hover:shadow-glow-purple transition-all">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Video className="h-6 w-6 text-secondary" />
                <CardTitle>Video Detection</CardTitle>
              </div>
              <CardDescription>
                Analyze videos frame-by-frame for AI manipulation detection
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-glow-cyan">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              <CardTitle>Upload File for Detection</CardTitle>
            </div>
            <CardDescription>
              Upload an image or video file to analyze for AI-generated content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload onDetectionComplete={setDetectionResult} userId={user?.id} />
          </CardContent>
        </Card>

        {detectionResult && (
          <div className="mt-6">
            <DetectionResults result={detectionResult} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
