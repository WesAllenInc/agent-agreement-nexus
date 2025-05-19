import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrainingMaterials } from "@/hooks/useTrainingMaterials";
import { useTrainingCompletions } from "@/hooks/useTrainingCompletions";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import { PdfViewer } from "@/components/PdfViewer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Video,
  FileQuestion,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
  ExternalLink,
  Play,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function AgentTraining() {
  const navigate = useNavigate();
  const { moduleId, materialId } = useParams<{ moduleId?: string; materialId?: string }>();
  const { user } = useAuth();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [videoKey, setVideoKey] = useState<number>(0); // For refreshing video player
  
  const {
    useTrainingModules,
    useTrainingModule,
    useTrainingMaterial,
    getFileUrl
  } = useTrainingMaterials();
  
  const {
    useOverallProgress,
    useModuleProgress,
    useMaterialCompletion,
    startMaterial,
    updateProgress,
    completeMaterial
  } = useTrainingCompletions();
  
  const { data: modules, isLoading: isLoadingModules } = useTrainingModules();
  const { data: module, isLoading: isLoadingModule } = useTrainingModule(moduleId);
  const { data: material, isLoading: isLoadingMaterial } = useTrainingMaterial(materialId);
  const { data: overallProgress, isLoading: isLoadingProgress } = useOverallProgress();
  const { data: moduleProgress } = useModuleProgress(moduleId || '');
  const { data: materialCompletion } = useMaterialCompletion(materialId || '');
  
  // Load file URL when material changes
  useEffect(() => {
    const loadFileUrl = async () => {
      if (material?.file_path) {
        const url = await getFileUrl(material.file_path);
        setFileUrl(url);
        
        // Mark material as started if not already completed
        if (materialCompletion?.status !== 'completed') {
          startMaterial.mutate(material.id);
        }
      }
    };
    
    loadFileUrl();
  }, [material, materialCompletion?.status]);
  
  // Handle video progress tracking
  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    const percentWatched = (video.currentTime / video.duration) * 100;
    
    // Mark as in progress at 10%
    if (percentWatched >= 10 && materialCompletion?.status !== 'completed') {
      updateProgress.mutate(material?.id || '');
    }
    
    // Mark as completed at 90%
    if (percentWatched >= 90 && materialCompletion?.status !== 'completed') {
      completeMaterial.mutate({ materialId: material?.id || '' });
    }
  };
  
  // Handle PDF completion
  const handleCompletePdf = () => {
    if (material?.id) {
      completeMaterial.mutate({ materialId: material.id });
    }
  };
  
  // Handle quiz completion
  const handleCompleteQuiz = () => {
    if (material?.id) {
      completeMaterial.mutate({ 
        materialId: material.id,
        score: 100 // In a real implementation, this would be the actual quiz score
      });
    }
  };
  
  // Navigate to next or previous material
  const navigateToMaterial = (direction: 'next' | 'prev') => {
    if (!module?.materials || !materialId) return;
    
    const currentIndex = module.materials.findIndex(m => m.id === materialId);
    if (currentIndex === -1) return;
    
    const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (targetIndex >= 0 && targetIndex < module.materials.length) {
      navigate(`/agent/training/${moduleId}/${module.materials[targetIndex].id}`);
    } else if (direction === 'next') {
      // If we're at the last material, go back to module list
      navigate(`/agent/training`);
    }
  };
  
  const getCompletionStatus = (materialId: string) => {
    if (!user) return 'not-started';
    
    const completion = materialCompletion;
    
    if (!completion) return 'not-started';
    if (completion.status === 'completed') return 'completed';
    if (completion.status === 'in_progress') return 'in-progress';
    return 'started';
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'started':
        return <Play className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'quiz':
        return <FileQuestion className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
  
  // Render material content based on type
  const renderMaterialContent = () => {
    if (!material || !fileUrl) return null;
    
    switch (material.module_type) {
      case 'pdf':
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 min-h-[500px]">
              <PdfViewer url={fileUrl} />
            </div>
            {materialCompletion?.status !== 'completed' && (
              <div className="mt-4 flex justify-center">
                <Button onClick={handleCompletePdf}>
                  Mark as Completed
                </Button>
              </div>
            )}
          </div>
        );
      
      case 'video':
        return (
          <div className="flex flex-col items-center">
            <div className="w-full max-w-3xl bg-black rounded-lg overflow-hidden">
              <video
                key={videoKey}
                className="w-full h-auto"
                controls
                onTimeUpdate={handleVideoTimeUpdate}
                onEnded={() => completeMaterial.mutate({ materialId: material.id })}
              >
                <source src={fileUrl} type={material.mime_type} />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 text-sm text-muted-foreground text-center">
              {materialCompletion?.status === 'completed' ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  You've completed this video
                </div>
              ) : (
                <p>Watch the video to mark it as completed</p>
              )}
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-3xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileQuestion className="h-5 w-5 mr-2" />
                  {material.title} Quiz
                </CardTitle>
                <CardDescription>
                  Complete this quiz to test your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent>
                {material.quiz_link ? (
                  <div className="flex flex-col items-center py-6">
                    <p className="mb-4 text-center">
                      This quiz is hosted on an external platform. Click the button below to take the quiz.
                    </p>
                    <Button
                      onClick={() => window.open(material.quiz_link || '', '_blank')}
                      className="flex items-center"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No quiz link provided. Please contact an administrator.
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-center">
                {materialCompletion?.status !== 'completed' && (
                  <Button onClick={handleCompleteQuiz}>
                    Mark Quiz as Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>Unsupported material type</p>
          </div>
        );
    }
  };
  
  // Render the module list view
  const renderModuleList = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Training Center</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Training Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Overall Completion</span>
                  <span className="text-sm font-medium">
                    {overallProgress?.completed} of {overallProgress?.total} materials
                  </span>
                </div>
                <Progress value={overallProgress?.percentage || 0} className="h-2" />
              </div>
              <div className="md:w-32 flex items-center justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - (overallProgress?.percentage || 0) / 100)}`}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{overallProgress?.percentage || 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          {isLoadingModules ? (
            <div className="flex items-center justify-center h-60">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : modules?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No Training Modules Available</h2>
                <p className="text-muted-foreground text-center">
                  There are no training modules available at this time.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {modules?.map((module) => {
                // Calculate module completion
                const moduleProgress = module.materials?.reduce(
                  (acc, material) => {
                    const status = getCompletionStatus(material.id);
                    return {
                      total: acc.total + (material.is_required ? 1 : 0),
                      completed: acc.completed + (status === 'completed' && material.is_required ? 1 : 0)
                    };
                  },
                  { total: 0, completed: 0 }
                );
                
                const completionPercentage = moduleProgress?.total
                  ? Math.round((moduleProgress.completed / moduleProgress.total) * 100)
                  : 0;
                
                return (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-1 items-center">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-left">{module.title}</h3>
                          {module.description && (
                            <p className="text-sm text-muted-foreground text-left">
                              {module.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex items-center">
                          <Progress 
                            value={completionPercentage} 
                            className="h-2 w-24 mr-2" 
                          />
                          <span className="text-sm">{completionPercentage}%</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        {module.materials?.map((material, index) => {
                          const status = getCompletionStatus(material.id);
                          
                          return (
                            <div 
                              key={material.id}
                              className="flex items-center justify-between p-3 rounded-md hover:bg-muted"
                            >
                              <div className="flex items-center">
                                <div className="mr-3">
                                  {getStatusIcon(status)}
                                </div>
                                <div className="mr-3">
                                  {getMaterialTypeIcon(material.module_type)}
                                </div>
                                <div>
                                  <div className="font-medium">{material.title}</div>
                                  {material.description && (
                                    <div className="text-sm text-muted-foreground">
                                      {material.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center">
                                {material.is_required ? (
                                  <Badge className="mr-3 bg-blue-100 text-blue-800">Required</Badge>
                                ) : (
                                  <Badge className="mr-3 bg-muted text-muted-foreground">Optional</Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/agent/training/${module.id}/${material.id}`)}
                                >
                                  {status === 'completed' ? 'Review' : 'Start'}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </div>
      </div>
    );
  };
  
  // Render the material view
  const renderMaterialView = () => {
    if (isLoadingMaterial || isLoadingModule) {
      return (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      );
    }
    
    if (!material || !module) {
      return (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Material Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The requested training material could not be found.
          </p>
          <Button onClick={() => navigate('/agent/training')}>
            Return to Training Center
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/agent/training')}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Training
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2" />
          <div className="text-sm text-muted-foreground">
            {module.title}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {getMaterialTypeIcon(material.module_type)}
              <span className="ml-2">{material.title}</span>
            </h1>
            {material.description && (
              <p className="text-muted-foreground mt-1">{material.description}</p>
            )}
          </div>
          <div className="flex items-center">
            {materialCompletion?.status === 'completed' ? (
              <Badge className="bg-green-100 text-green-800 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            ) : (
              <Badge className="bg-amber-100 text-amber-800 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                In Progress
              </Badge>
            )}
          </div>
        </div>
        
        <div className="min-h-[600px]">
          {renderMaterialContent()}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() => navigateToMaterial('prev')}
            disabled={!module.materials || module.materials[0].id === material.id}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={() => navigateToMaterial('next')}
            disabled={!module.materials || module.materials[module.materials.length - 1].id === material.id}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        {materialId && moduleId ? renderMaterialView() : renderModuleList()}
      </div>
    </MainLayout>
  );
}
