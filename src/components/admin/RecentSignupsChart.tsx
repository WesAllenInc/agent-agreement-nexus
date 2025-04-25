
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function RecentSignupsChart() {
  // Fetch data for new signups by month
  const { data, isLoading, error } = useQuery({
    queryKey: ['recent-signups'],
    queryFn: async () => {
      // In a real app, we would use Supabase to get actual signup data
      // For now, we'll use mock data
      return [
        { month: 'Jan', signups: 10 },
        { month: 'Feb', signups: 15 },
        { month: 'Mar', signups: 12 },
        { month: 'Apr', signups: 18 },
        { month: 'May', signups: 25 },
        { month: 'Jun', signups: 22 },
        { month: 'Jul', signups: 30 },
        { month: 'Aug', signups: 28 },
        { month: 'Sep', signups: 35 },
        { month: 'Oct', signups: 40 },
        { month: 'Nov', signups: 38 },
        { month: 'Dec', signups: 45 },
      ];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>New Agent Signups</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse bg-muted w-full h-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>New Agent Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading signup chart. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Agent Signups</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="signups" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
