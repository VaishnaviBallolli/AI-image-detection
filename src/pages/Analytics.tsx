import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Users, Activity } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

const Analytics = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Fetch user activity for the last 7 days
      const { data: activityData, error: activityError } = await supabase
        .from("user_activity")
        .select("activity_date, user_id")
        .gte("activity_date", format(subDays(new Date(), 6), "yyyy-MM-dd"))
        .order("activity_date", { ascending: true });

      if (activityError) throw activityError;

      // Fetch total unique users
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id", { count: "exact" });

      if (profilesError) throw profilesError;

      setTotalUsers(profilesData?.length || 0);

      // Process activity data for chart
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return format(date, "yyyy-MM-dd");
      });

      const chartDataProcessed = last7Days.map((date) => {
        const uniqueUsers = new Set(
          activityData
            ?.filter((item) => item.activity_date === date)
            .map((item) => item.user_id)
        ).size;

        return {
          date: format(new Date(date), "MMM dd"),
          users: uniqueUsers,
        };
      });

      setChartData(chartDataProcessed);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
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
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:text-primary/80"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Analytics
          </h1>
          <div className="w-32" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-glow-cyan">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Total Users</CardTitle>
              </div>
              <CardDescription>Registered on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">{totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-card/80 backdrop-blur-sm shadow-glow-purple">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-secondary" />
                <CardTitle>Today's Active Users</CardTitle>
              </div>
              <CardDescription>Users active in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-secondary">
                {chartData.length > 0 ? chartData[chartData.length - 1]?.users || 0 : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/50 bg-card/95 backdrop-blur-sm shadow-glow-cyan">
          <CardHeader>
            <CardTitle>Daily Active Users (Last 7 Days)</CardTitle>
            <CardDescription>Track user engagement over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                  activeDot={{ r: 8, fill: "hsl(var(--secondary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Analytics;
