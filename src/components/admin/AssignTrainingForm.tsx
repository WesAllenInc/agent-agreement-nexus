import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import { useTrainingMaterials } from '@/hooks/useTrainingMaterials';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CalendarIcon, CheckCircle2, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  email: string;
  full_name: string;
}

export function AssignTrainingForm() {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { useTrainingModules } = useTrainingMaterials();
  const { sendTrainingAssignedNotification } = useEmailNotifications();
  
  // Fetch training modules
  const { data: modules, isLoading: isLoadingModules } = useTrainingModules();
  
  // Fetch agents
  const { data: agents, isLoading: isLoadingAgents } = useQuery({
    queryKey: ['agents-for-training'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('role', 'sales_agent');
      
      if (error) throw error;
      return data as Agent[];
    }
  });
  
  // Get selected module details
  const selectedModule = modules?.find(m => m.id === selectedModuleId);
  
  // Handle select all agents
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedAgents([]);
    } else if (agents) {
      setSelectedAgents(agents.map(agent => agent.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Handle individual agent selection
  const handleAgentSelection = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
      setSelectAll(false);
    } else {
      setSelectedAgents([...selectedAgents, agentId]);
      if (agents && selectedAgents.length + 1 === agents.length) {
        setSelectAll(true);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedModuleId) {
      toast.error('Please select a training module');
      return;
    }
    
    if (selectedAgents.length === 0) {
      toast.error('Please select at least one agent');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get the selected module details
      const module = modules?.find(m => m.id === selectedModuleId);
      if (!module) {
        throw new Error('Selected module not found');
      }
      
      // Get the selected agents' emails
      const selectedAgentDetails = agents?.filter(agent => 
        selectedAgents.includes(agent.id)
      );
      
      if (!selectedAgentDetails || selectedAgentDetails.length === 0) {
        throw new Error('Selected agents not found');
      }
      
      // Create training assignments in the database
      const assignments = selectedAgents.map(agentId => ({
        user_id: agentId,
        module_id: selectedModuleId,
        assigned_at: new Date().toISOString(),
        due_date: dueDate ? dueDate.toISOString() : null,
        status: 'assigned'
      }));
      
      const { error: assignmentError } = await supabase
        .from('training_assignments')
        .upsert(assignments, { onConflict: 'user_id,module_id' });
      
      if (assignmentError) throw assignmentError;
      
      // Send email notifications to each agent
      const trainingUrl = `${window.location.origin}/agent/training`;
      
      for (const agent of selectedAgentDetails) {
        try {
          await sendTrainingAssignedNotification(
            agent.email,
            module.title,
            module.description || '',
            dueDate ? format(dueDate, 'PPP') : null,
            trainingUrl
          );
        } catch (error) {
          console.error(`Failed to send notification to ${agent.email}:`, error);
          // Continue with other notifications even if one fails
        }
      }
      
      toast.success(`Training assigned to ${selectedAgents.length} agent(s)`);
      
      // Reset form
      setSelectedModuleId('');
      setSelectedAgents([]);
      setSelectAll(false);
      setDueDate(undefined);
      
    } catch (error: any) {
      console.error('Error assigning training:', error);
      toast.error(`Failed to assign training: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Training</CardTitle>
        <CardDescription>
          Assign training modules to agents and send email notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Module Selection */}
          <div className="space-y-2">
            <Label htmlFor="module">Training Module</Label>
            <Select
              value={selectedModuleId}
              onValueChange={setSelectedModuleId}
            >
              <SelectTrigger id="module">
                <SelectValue placeholder="Select a training module" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingModules ? (
                  <div className="p-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full mt-2" />
                  </div>
                ) : modules && modules.length > 0 ? (
                  modules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No training modules available
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Due Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select a due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Agent Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Select Agents</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="select-all" 
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm cursor-pointer">
                  Select All
                </Label>
              </div>
            </div>
            
            <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
              {isLoadingAgents ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 flex items-center space-x-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))
              ) : agents && agents.length > 0 ? (
                agents.map(agent => (
                  <div key={agent.id} className="p-3 flex items-center space-x-3">
                    <Checkbox 
                      id={`agent-${agent.id}`}
                      checked={selectedAgents.includes(agent.id)}
                      onCheckedChange={() => handleAgentSelection(agent.id)}
                    />
                    <Label 
                      htmlFor={`agent-${agent.id}`}
                      className="flex flex-col cursor-pointer"
                    >
                      <span>{agent.full_name || 'Unnamed Agent'}</span>
                      <span className="text-xs text-muted-foreground">
                        {agent.email}
                      </span>
                    </Label>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No agents available
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      
      {selectedModule && (
        <div className="px-6 pb-2">
          <div className="bg-muted p-3 rounded-md">
            <h4 className="font-medium text-sm mb-2">Module Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{selectedModule.materials?.length || 0} materials</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{selectedAgents.length} agents selected</span>
              </div>
              {dueDate && (
                <div className="flex items-center gap-1 col-span-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Due by {format(dueDate, "PPP")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <CardFooter>
        <Button 
          type="submit" 
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedModuleId || selectedAgents.length === 0}
          className="w-full"
        >
          {isSubmitting ? 'Assigning...' : 'Assign Training'}
        </Button>
      </CardFooter>
    </Card>
  );
}
