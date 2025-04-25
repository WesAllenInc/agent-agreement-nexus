
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { useState } from "react";

export default function AgreementStatusChart() {
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['agreement-status-chart', timeFrame],
    queryFn: async () => {
      // In a real app, we would fetch this data from the database
      // For now, we'll use mock data
      const mockData = [
        { name: "Jan", draft: 4, submitted: 5, signed: 2 },
        { name: "Feb", draft: 3, submitted: 7, signed: 4 },
        { name: "Mar", draft: 5, submitted: 4, signed: 8 },
        { name: "Apr", draft: 6, submitted: 3, signed: 10 },
        { name: "May", draft: 7, submitted: 7, signed: 12 },
        { name: "Jun", draft: 8, submitted: 9, signed: 15 },
        { name: "Jul", draft: 10, submitted: 11, signed: 17 },
        { name: "Aug", draft: 12, submitted: 8, signed: 19 },
        { name: "Sep", draft: 11, submitted: 10, signed: 21 },
        { name: "Oct", draft: 9, submitted: 12, signed: 24 },
        { name: "Nov", draft: 8, submitted: 14, signed: 26 },
        { name: "Dec", draft: 7, submitted: 15, signed: 29 }
      ];
      
      return mockData;
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agreement Status Trend</CardTitle>
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
          <CardTitle>Agreement Status Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading agreement status chart. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agreement Status Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="draft"
              stroke="#FFC107"
              activeDot={{ r: 8 }}
            />
            <Line 
              type="monotone" 
              dataKey="submitted" 
              stroke="#2196F3" 
            />
            <Line 
              type="monotone" 
              dataKey="signed" 
              stroke="#4CAF50" 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
