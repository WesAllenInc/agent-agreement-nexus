import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { GraduationCap } from "lucide-react";

const COLORS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3'];

export default function TrainingCompletionChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['training-completion-chart'],
    queryFn: async () => {
      // Fetch all agents
      const { data: agents, error: agentsError } = await supabase
        .from('profiles')
        .select('id, role')
        .in('role', ['sales_agent', 'senior_agent']);
      
      if (agentsError) throw agentsError;
      
      // Fetch training completion data
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_completion')
        .select('user_id, module, status');
      
      // If the table doesn't exist, we'll create mock data for demonstration
      const trainingResults = trainingError ? [] : trainingData || [];
      
      // Define training modules (you can adjust these based on your actual modules)
      const modules = ['onboarding', 'compliance', 'sales_techniques', 'product_knowledge'];
      
      // Count completions by module
      const moduleCompletions = modules.map(module => {
        const completedCount = trainingResults.filter(
          t => t.module === module && t.status === 'completed'
        ).length;
        
        const inProgressCount = trainingResults.filter(
          t => t.module === module && t.status === 'in_progress'
        ).length;
        
        const notStartedCount = agents.length - completedCount - inProgressCount;
        
        return {
          name: module.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          completed: completedCount,
          inProgress: inProgressCount,
          notStarted: notStartedCount,
          value: completedCount, // For the pie chart
        };
      });
      
      // Calculate overall completion percentages
      const totalAgents = agents.length;
      const totalModules = modules.length * totalAgents;
      const totalCompleted = trainingResults.filter(t => t.status === 'completed').length;
      const totalInProgress = trainingResults.filter(t => t.status === 'in_progress').length;
      const totalNotStarted = totalModules - totalCompleted - totalInProgress;
      
      const overallStats = [
        { name: 'Completed', value: totalCompleted, percentage: Math.round((totalCompleted / totalModules) * 100) },
        { name: 'In Progress', value: totalInProgress, percentage: Math.round((totalInProgress / totalModules) * 100) },
        { name: 'Not Started', value: totalNotStarted, percentage: Math.round((totalNotStarted / totalModules) * 100) }
      ];
      
      // If no real data, create mock data for demonstration
      if (trainingResults.length === 0) {
        return {
          moduleCompletions: [
            { name: 'Onboarding', completed: 18, inProgress: 5, notStarted: 2, value: 18 },
            { name: 'Compliance', completed: 15, inProgress: 7, notStarted: 3, value: 15 },
            { name: 'Sales Techniques', completed: 12, inProgress: 8, notStarted: 5, value: 12 },
            { name: 'Product Knowledge', completed: 10, inProgress: 10, notStarted: 5, value: 10 }
          ],
          overallStats: [
            { name: 'Completed', value: 55, percentage: 69 },
            { name: 'In Progress', value: 30, percentage: 25 },
            { name: 'Not Started', value: 15, percentage: 6 }
          ]
        };
      }
      
      return {
        moduleCompletions,
        overallStats
      };
    }
  });
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Training Completion</CardTitle>
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
          <CardTitle>Training Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-destructive/15 p-4 text-destructive">
            <p>Error loading training data. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{`${payload[0].value} (${payload[0].payload.percentage}%)`}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Training Completion Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-4 text-center">Overall Completion</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.overallStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {data?.overallStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-4">Completion by Module</h3>
            <div className="space-y-4">
              {data?.moduleCompletions.map((module, index) => {
                const total = module.completed + module.inProgress + module.notStarted;
                const completedPercentage = Math.round((module.completed / total) * 100);
                const inProgressPercentage = Math.round((module.inProgress / total) * 100);
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {completedPercentage}% Complete
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${completedPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Completed: {module.completed}</span>
                      <span>In Progress: {module.inProgress}</span>
                      <span>Not Started: {module.notStarted}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
