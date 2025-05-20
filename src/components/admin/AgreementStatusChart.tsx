
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
import { useState, useMemo, useCallback } from "react";

export default function AgreementStatusChart() {
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  // Memoize the time frame change handler
  const handleTimeFrameChange = useCallback((newTimeFrame: string) => {
    setTimeFrame(newTimeFrame);
  }, []);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['agreement-status-chart', timeFrame],
    queryFn: async () => {
      // Get current date and calculate date ranges based on timeFrame
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Fetch agreements data
      const { data: agreementsData, error: agreementsError } = await supabase
        .from('agreements')
        .select('id, status, created_at');
      
      if (agreementsError) throw agreementsError;
      
      // Fetch agreement signatures data
      const { data: signaturesData, error: signaturesError } = await supabase
        .from('agreement_signatures')
        .select('id, agreement_id, signed_at');
      
      if (signaturesError) throw signaturesError;
      
      // Create a map of agreement IDs to their signature status
      const signatureMap = new Map();
      signaturesData?.forEach(signature => {
        signatureMap.set(signature.agreement_id, signature);
      });
      
      // Process data based on timeFrame
      let chartData = [];
      
      if (timeFrame === 'monthly') {
        // Create monthly data for the past 12 months
        chartData = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
          return { name: months[monthIndex], draft: 0, submitted: 0, signed: 0 };
        });
        
        agreementsData?.forEach(agreement => {
          const agreementDate = new Date(agreement.created_at);
          const monthDiff = (now.getMonth() - agreementDate.getMonth() + 12) % 12;
          
          if (monthDiff < 12) {
            const monthIndex = 11 - monthDiff;
            
            if (signatureMap.has(agreement.id)) {
              chartData[monthIndex].signed++;
            } else if (agreement.status === 'submitted') {
              chartData[monthIndex].submitted++;
            } else {
              chartData[monthIndex].draft++;
            }
          }
        });
      } else {
        // Default to last 12 months
        chartData = Array.from({ length: 12 }, (_, i) => {
          const monthIndex = (now.getMonth() - 11 + i + 12) % 12;
          return { name: months[monthIndex], draft: 0, submitted: 0, signed: 0 };
        });
        
        agreementsData?.forEach(agreement => {
          const agreementDate = new Date(agreement.created_at);
          const monthDiff = (now.getMonth() - agreementDate.getMonth() + 12) % 12;
          
          if (monthDiff < 12) {
            const monthIndex = 11 - monthDiff;
            
            if (signatureMap.has(agreement.id)) {
              chartData[monthIndex].signed++;
            } else if (agreement.status === 'submitted') {
              chartData[monthIndex].submitted++;
            } else {
              chartData[monthIndex].draft++;
            }
          }
        });
      }
      
      return chartData;
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

  // Memoize the chart component to prevent unnecessary re-renders
  const chartComponent = useMemo(() => {
    if (!data) return null;
    
    return (
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
    );
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Agreement Status Trend</CardTitle>
        <div className="flex space-x-2">
          <button
            onClick={() => handleTimeFrameChange("monthly")}
            className={`px-3 py-1 text-sm rounded-md ${timeFrame === "monthly" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => handleTimeFrameChange("quarterly")}
            className={`px-3 py-1 text-sm rounded-md ${timeFrame === "quarterly" ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            Quarterly
          </button>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {chartComponent}
      </CardContent>
    </Card>
  );
}

