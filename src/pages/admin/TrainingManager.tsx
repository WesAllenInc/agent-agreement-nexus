import { useState } from "react";
import { useTrainingMaterials, TrainingModule, TrainingMaterial } from "@/hooks/useTrainingMaterials";
import { useTrainingCompletions } from "@/hooks/useTrainingCompletions";
import { AssignTrainingForm } from "@/components/admin/AssignTrainingForm";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Video,
  FileQuestion,
  Upload,
  GraduationCap,
  Users,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function TrainingManager() {
  const [activeTab, setActiveTab] = useState("modules");
  const [isModuleDialogOpen, setIsModuleDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<TrainingModule | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  
  const {
    useTrainingModules,
    createModule,
    updateModule,
    deleteModule,
    uploadMaterial,
    deleteMaterial,
    fileUploadProgress
  } = useTrainingMaterials();
  
  const { useAllUsersProgress } = useTrainingCompletions();
  
  const { data: modules, isLoading: isLoadingModules } = useTrainingModules({ includeArchived: true });
  const { data: usersProgress, isLoading: isLoadingProgress } = useAllUsersProgress();
  
  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    order_index: 0,
    status: "active" as "active" | "archived"
  });
  
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    module_type: "pdf" as "pdf" | "video" | "quiz",
    quiz_link: "",
    order_index: 0,
    is_required: true,
    moduleId: "",
    file: null as File | null
  });
  
  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  const handleCreateModule = async () => {
    await createModule.mutateAsync(moduleForm);
    setIsModuleDialogOpen(false);
    resetModuleForm();
  };
  
  const handleUpdateModule = async () => {
    if (!selectedModule) return;
    
    await updateModule.mutateAsync({
      id: selectedModule.id,
      ...moduleForm
    });
    
    setIsModuleDialogOpen(false);
    setSelectedModule(null);
    resetModuleForm();
  };
  
  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Are you sure you want to delete this module? This will also delete all associated materials.")) {
      await deleteModule.mutateAsync(moduleId);
    }
  };
  
  const handleEditModule = (module: TrainingModule) => {
    setSelectedModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || "",
      order_index: module.order_index,
      status: module.status as "active" | "archived"
    });
    setIsModuleDialogOpen(true);
  };
  
  const handleUploadMaterial = async () => {
    if (!materialForm.file) {
      toast.error("Please select a file to upload");
      return;
    }
    
    await uploadMaterial(materialForm.file, {
      title: materialForm.title,
      description: materialForm.description,
      module_type: materialForm.module_type,
      quiz_link: materialForm.quiz_link,
      order_index: materialForm.order_index,
      is_required: materialForm.is_required,
      moduleId: materialForm.moduleId,
      status: "active"
    });
    
    setIsMaterialDialogOpen(false);
    resetMaterialForm();
  };
  
  const handleDeleteMaterial = async (materialId: string) => {
    if (confirm("Are you sure you want to delete this material?")) {
      await deleteMaterial.mutateAsync(materialId);
    }
  };
  
  const resetModuleForm = () => {
    setModuleForm({
      title: "",
      description: "",
      order_index: 0,
      status: "active"
    });
  };
  
  const resetMaterialForm = () => {
    setMaterialForm({
      title: "",
      description: "",
      module_type: "pdf",
      quiz_link: "",
      order_index: 0,
      is_required: true,
      moduleId: "",
      file: null
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMaterialForm({
        ...materialForm,
        file: e.target.files[0]
      });
    }
  };
  
  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <FileQuestion className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <MainLayout isAdmin>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Training Manager</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="modules">
              <GraduationCap className="h-4 w-4 mr-2" />
              Training Modules
            </TabsTrigger>
            <TabsTrigger value="progress">
              <Users className="h-4 w-4 mr-2" />
              Agent Progress
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="modules" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isModuleDialogOpen} onOpenChange={setIsModuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedModule(null);
                    resetModuleForm();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Training Module
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {selectedModule ? "Edit Training Module" : "Add Training Module"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedModule
                        ? "Update the details of this training module."
                        : "Create a new training module for agents."}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Module Title</Label>
                      <Input
                        id="title"
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        placeholder="e.g., Onboarding Basics"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        placeholder="Describe what agents will learn in this module"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                          id="order"
                          type="number"
                          value={moduleForm.order_index}
                          onChange={(e) => setModuleForm({ ...moduleForm, order_index: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={moduleForm.status}
                          onValueChange={(value: "active" | "archived") => 
                            setModuleForm({ ...moduleForm, status: value })
                          }
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModuleDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={selectedModule ? handleUpdateModule : handleCreateModule}
                      disabled={!moduleForm.title}
                    >
                      {selectedModule ? "Update Module" : "Create Module"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={isMaterialDialogOpen} onOpenChange={setIsMaterialDialogOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Upload Training Material</DialogTitle>
                    <DialogDescription>
                      Add a new training material to a module. Supported formats: PDF, MP4, etc.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="material-title">Material Title</Label>
                      <Input
                        id="material-title"
                        value={materialForm.title}
                        onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                        placeholder="e.g., Introduction to Sales Process"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="material-description">Description</Label>
                      <Textarea
                        id="material-description"
                        value={materialForm.description}
                        onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                        placeholder="Briefly describe this training material"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material-type">Material Type</Label>
                        <Select
                          value={materialForm.module_type}
                          onValueChange={(value: "pdf" | "video" | "quiz") => 
                            setMaterialForm({ ...materialForm, module_type: value })
                          }
                        >
                          <SelectTrigger id="material-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF Document</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="quiz">Quiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="material-module">Module</Label>
                        <Select
                          value={materialForm.moduleId}
                          onValueChange={(value) => 
                            setMaterialForm({ ...materialForm, moduleId: value })
                          }
                        >
                          <SelectTrigger id="material-module">
                            <SelectValue placeholder="Select module" />
                          </SelectTrigger>
                          <SelectContent>
                            {modules?.filter(m => m.status === 'active').map((module) => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {materialForm.module_type === 'quiz' && (
                      <div className="space-y-2">
                        <Label htmlFor="quiz-link">Quiz Link</Label>
                        <Input
                          id="quiz-link"
                          value={materialForm.quiz_link || ''}
                          onChange={(e) => setMaterialForm({ ...materialForm, quiz_link: e.target.value })}
                          placeholder="https://forms.example.com/quiz"
                        />
                        <p className="text-sm text-muted-foreground">
                          Enter a link to an external quiz (Google Forms, Typeform, etc.)
                        </p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material-order">Display Order</Label>
                        <Input
                          id="material-order"
                          type="number"
                          value={materialForm.order_index}
                          onChange={(e) => setMaterialForm({ ...materialForm, order_index: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      
                      <div className="space-y-2 flex items-center pt-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="required"
                            checked={materialForm.is_required}
                            onCheckedChange={(checked) => 
                              setMaterialForm({ ...materialForm, is_required: checked })
                            }
                          />
                          <Label htmlFor="required">Required for completion</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="material-file">Upload File</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Drag and drop your file here, or click to browse
                        </p>
                        <Input
                          id="material-file"
                          type="file"
                          className="max-w-sm"
                          onChange={handleFileChange}
                        />
                        {materialForm.file && (
                          <p className="text-sm mt-2">
                            Selected: {materialForm.file.name} ({Math.round(materialForm.file.size / 1024)} KB)
                          </p>
                        )}
                        {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                          <div className="w-full mt-4">
                            <Progress value={fileUploadProgress} className="h-2" />
                            <p className="text-xs text-center mt-1">{fileUploadProgress}% uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMaterialDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleUploadMaterial}
                      disabled={!materialForm.title || !materialForm.moduleId || !materialForm.file}
                    >
                      Upload Material
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {isLoadingModules ? (
              <div className="flex items-center justify-center h-60">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : modules?.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No Training Modules</h2>
                  <p className="text-muted-foreground text-center mb-6">
                    You haven't created any training modules yet. Click the button above to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {modules?.map((module) => (
                  <Card key={module.id} className={module.status === 'archived' ? 'opacity-70' : ''}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-8 w-8 mr-2"
                            onClick={() => toggleModuleExpanded(module.id)}
                          >
                            {expandedModules[module.id] ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </Button>
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              {module.title}
                              {module.status === 'archived' && (
                                <span className="ml-2 text-xs bg-muted px-2 py-1 rounded-full">
                                  Archived
                                </span>
                              )}
                            </CardTitle>
                            {module.description && (
                              <CardDescription>{module.description}</CardDescription>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModule(module)}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteModule(module.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setMaterialForm({
                                ...materialForm,
                                moduleId: module.id,
                                order_index: module.materials?.length || 0
                              });
                              setIsMaterialDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Material
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedModules[module.id] && (
                      <CardContent>
                        {module.materials && module.materials.length > 0 ? (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Required</TableHead>
                                <TableHead>Added</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {module.materials.map((material) => (
                                <TableRow key={material.id}>
                                  <TableCell>
                                    <div className="font-medium">{material.title}</div>
                                    {material.description && (
                                      <div className="text-sm text-muted-foreground">
                                        {material.description}
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      {getMaterialTypeIcon(material.module_type)}
                                      <span className="ml-2 capitalize">{material.module_type}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {material.is_required ? (
                                      <span className="text-green-600">Required</span>
                                    ) : (
                                      <span className="text-muted-foreground">Optional</span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {format(new Date(material.created_at), 'PP')}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteMaterial(material.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No materials added to this module yet
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Training Progress</CardTitle>
                <CardDescription>
                  Track completion rates across all training modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProgress ? (
                  <div className="flex items-center justify-center h-60">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : usersProgress?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p>No agent training data available</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Agent</TableHead>
                        <TableHead>
                          <div className="flex items-center">
                            <ArrowUpDown className="h-4 w-4 mr-1" />
                            Completion Rate
                          </div>
                        </TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersProgress?.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-4">
                              <Progress 
                                value={user.completionPercentage} 
                                className="h-2 w-40" 
                              />
                              <span className="text-sm font-medium">
                                {user.completionPercentage}%
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {user.completedMaterials} of {user.totalMaterials} materials
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.lastActivity ? (
                              format(new Date(user.lastActivity), 'PPp')
                            ) : (
                              <span className="text-muted-foreground">No activity</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.completionPercentage === 100 ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completed
                              </div>
                            ) : user.completionPercentage > 0 ? (
                              <div className="flex items-center text-amber-600">
                                <Clock className="h-4 w-4 mr-1" />
                                In Progress
                              </div>
                            ) : (
                              <div className="flex items-center text-muted-foreground">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Not Started
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
              </div>
              <div className="md:col-span-1">
                <AssignTrainingForm />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
