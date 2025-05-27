import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTrainingMaterials } from "@/hooks/useTrainingMaterials";
import { useTrainingCompletions } from "@/hooks/useTrainingCompletions";
import { useAuth } from "@/contexts/AuthContext";
// Add Module type import if it exists
// import type { Module } from '@/types/Module';
import MainLayout from "@/components/layout/MainLayout";
import { TrainingModuleList } from '@/components/training/TrainingModuleList';
import { CertificateBadge } from '@/components/training/CertificateBadge';
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
                <source src={fileUrl || ''} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        );
    }
  };
  
  // Render material view
  const renderMaterialView = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <Button onClick={() => navigate('/agent/training')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Training Center
          </Button>
          <Separator orientation="vertical" className="h-6 mx-4" />
          <div className="text-sm text-muted-foreground">{module.title}</div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {material ? getMaterialTypeIcon(material.module_type) : null}
              <span className="ml-2">{material?.title}</span>
            </h1>
            {material?.description && (
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
        <div className="min-h-[600px] mt-6">{renderMaterialContent && renderMaterialContent()}</div>
        <div className="flex justify-between pt-4">
          <Button
            </CardContent>
          </Card>
        </div>
      );
    default:
      return (
        <div className="flex flex-col items-center py-6">
          <p className="text-center text-muted-foreground">
            The requested training material could not be found.
          </p>
          <Button onClick={() => navigate('/agent/training')}>
            Return to Training Center
          </Button>
        </div>
      );
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

// Render material view
// (removed duplicate definition, only one renderMaterialView should exist)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <Button onClick={() => navigate('/agent/training')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Training Center
        </Button>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <div className="text-sm text-muted-foreground">{module.title}</div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            {material ? getMaterialTypeIcon(material.module_type) : null}
            <span className="ml-2">{material?.title}</span>
          </h1>
          {material?.description && (
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
      <div className="min-h-[600px] mt-6">{renderMaterialContent && renderMaterialContent()}</div>
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigateToMaterial && navigateToMaterial('prev')}
            disabled={!module?.materials || module.materials[0]?.id === material?.id}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => navigateToMaterial && navigateToMaterial('next')}
            disabled={!module?.materials || module.materials[module.materials.length - 1]?.id === material?.id}
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// ... (rest of the code remains the same)
return (
  <MainLayout>
    <div className="container max-w-6xl py-6">
      {materialId && moduleId ? 
        <div>
          {renderMaterialView()}
        </div> 
      : 
        <div>
          {renderModuleList()}
        </div>}
    </div>
  </MainLayout>
);
