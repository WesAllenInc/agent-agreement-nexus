import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTrainingCompletions } from '@/hooks/useTrainingCompletions';
import { useTrainingMaterials } from '@/hooks/useTrainingMaterials';
import { CheckCircle2, Clock, BookOpen, FileText, Video, Award, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TrainingProgressProps {
  className?: string;
  showAllModules?: boolean;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  className = '',
  showAllModules = false,
}) => {
  const [activeTab, setActiveTab] = useState('in-progress');
  const { user } = useAuth();
  const { trainingModules, isLoading: isLoadingModules } = useTrainingMaterials();
  const { 
    completions, 
    isLoading: isLoadingCompletions,
    getCompletionPercentage,
    getModuleStatus 
  } = useTrainingCompletions();
  
  const [overallProgress, setOverallProgress] = useState(0);
  const [requiredProgress, setRequiredProgress] = useState(0);
  const [optionalProgress, setOptionalProgress] = useState(0);

  // Calculate progress percentages
  useEffect(() => {
    if (trainingModules && completions) {
      // Overall progress
      const totalModules = trainingModules.length;
      const completedModules = trainingModules.filter(module => 
        getModuleStatus(module.id) === 'completed'
      ).length;
      
      setOverallProgress(totalModules > 0 ? (completedModules / totalModules) * 100 : 0);
      
      // Required modules progress
      const requiredModules = trainingModules.filter(module => module.required);
      const completedRequiredModules = requiredModules.filter(module => 
        getModuleStatus(module.id) === 'completed'
      ).length;
      
      setRequiredProgress(requiredModules.length > 0 
        ? (completedRequiredModules / requiredModules.length) * 100 
        : 0
      );
      
      // Optional modules progress
      const optionalModules = trainingModules.filter(module => !module.required);
      const completedOptionalModules = optionalModules.filter(module => 
        getModuleStatus(module.id) === 'completed'
      ).length;
      
      setOptionalProgress(optionalModules.length > 0 
        ? (completedOptionalModules / optionalModules.length) * 100 
        : 0
      );
    }
  }, [trainingModules, completions, getModuleStatus]);

  // Filter modules based on tab selection
  const getFilteredModules = () => {
    if (!trainingModules) return [];
    
    switch (activeTab) {
      case 'in-progress':
        return trainingModules.filter(module => 
          getModuleStatus(module.id) === 'in-progress'
        );
      case 'completed':
        return trainingModules.filter(module => 
          getModuleStatus(module.id) === 'completed'
        );
      case 'not-started':
        return trainingModules.filter(module => 
          getModuleStatus(module.id) === 'not-started'
        );
      case 'required':
        return trainingModules.filter(module => module.required);
      case 'optional':
        return trainingModules.filter(module => !module.required);
      default:
        return showAllModules ? trainingModules : trainingModules.slice(0, 5);
    }
  };

  // Get icon based on material type
  const getMaterialTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Get status badge
  const getStatusBadge = (moduleId: string) => {
    const status = getModuleStatus(moduleId);
    
    switch (status) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'not-started':
        return (
          <Badge variant="outline">
            Not Started
          </Badge>
        );
      default:
        return null;
    }
  };

  // Handle certificate download
  const handleDownloadCertificate = () => {
    if (requiredProgress < 100) {
      toast.error("You need to complete all required training modules first");
      return;
    }
    
    toast.success("Certificate of completion downloaded");
    // In a real implementation, this would generate and download a PDF certificate
  };

  if (isLoadingModules || isLoadingCompletions) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading training data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
        <CardDescription>
          Track your progress through required and optional training modules
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Overall progress section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          {/* Required and optional progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                  <span className="text-sm font-medium">Required Modules</span>
                </div>
                <span className="text-sm font-medium">{Math.round(requiredProgress)}%</span>
              </div>
              <Progress value={requiredProgress} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1 text-yellow-500" />
                  <span className="text-sm font-medium">Optional Modules</span>
                </div>
                <span className="text-sm font-medium">{Math.round(optionalProgress)}%</span>
              </div>
              <Progress value={optionalProgress} className="h-2" />
            </div>
          </div>
          
          {/* Module list */}
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="not-started">Not Started</TabsTrigger>
              <TabsTrigger value="required">Required</TabsTrigger>
              <TabsTrigger value="optional">Optional</TabsTrigger>
            </TabsList>
            
            {['in-progress', 'completed', 'not-started', 'required', 'optional'].map(tab => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {getFilteredModules().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {tab.replace('-', ' ')} training modules found
                  </div>
                ) : (
                  getFilteredModules().map(module => (
                    <div 
                      key={module.id} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <h4 className="font-medium">{module.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{module.materials?.length || 0} materials</span>
                          <span>•</span>
                          <span>{module.required ? 'Required' : 'Optional'}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                        <div className="w-full sm:w-auto">
                          {getStatusBadge(module.id)}
                        </div>
                        
                        <div className="w-full sm:w-auto flex justify-between sm:justify-start space-x-2">
                          <Progress 
                            value={getCompletionPercentage(module.id)} 
                            className="w-24 h-2 mt-1 mr-2" 
                          />
                          <span className="text-xs">{Math.round(getCompletionPercentage(module.id))}%</span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          asChild
                          className="w-full sm:w-auto"
                        >
                          <Link to={`/agent/training/${module.id}`}>
                            {getModuleStatus(module.id) === 'not-started' ? 'Start' : 'Continue'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                
                {!showAllModules && getFilteredModules().length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="ghost" asChild>
                      <Link to="/agent/training">View All Training Modules</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-sm text-muted-foreground">
          {requiredProgress === 100 ? (
            <span className="flex items-center text-green-500">
              <CheckCircle2 className="h-4 w-4 mr-1" />
              All required training completed
            </span>
          ) : (
            <span>
              Complete all required training to receive your certificate
            </span>
          )}
        </div>
        
        <Button 
          variant="outline"
          onClick={handleDownloadCertificate}
          disabled={requiredProgress < 100}
        >
          <Award className="h-4 w-4 mr-2" />
          Download Certificate
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrainingProgress;
