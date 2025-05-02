import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  FileText, Plus, Pencil, Trash2, Copy, History, 
  ChevronDown, Eye, Download, MoreHorizontal, Search, 
  Check, X, ArrowUpDown, Filter 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
  version: number;
  createdBy: string;
};

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "TPL-001",
      name: "Standard Sales Agreement",
      description: "Default template for standard sales agreements",
      category: "Sales",
      status: "active",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-04-20"),
      version: 2.1,
      createdBy: "Admin User",
    },
    {
      id: "TPL-002",
      name: "Commission Structure",
      description: "Template for commission structure agreements",
      category: "Commission",
      status: "active",
      createdAt: new Date("2025-02-10"),
      updatedAt: new Date("2025-04-15"),
      version: 1.3,
      createdBy: "Admin User",
    },
    {
      id: "TPL-003",
      name: "Territory Assignment",
      description: "Template for territory assignment agreements",
      category: "Territory",
      status: "draft",
      createdAt: new Date("2025-03-05"),
      updatedAt: new Date("2025-03-05"),
      version: 1.0,
      createdBy: "John Manager",
    },
    {
      id: "TPL-004",
      name: "Non-Compete Agreement",
      description: "Legal template for non-compete clauses",
      category: "Legal",
      status: "archived",
      createdAt: new Date("2024-11-20"),
      updatedAt: new Date("2025-01-10"),
      version: 3.2,
      createdBy: "Legal Team",
    },
    {
      id: "TPL-005",
      name: "Performance Bonus Structure",
      description: "Template for performance-based bonus agreements",
      category: "Compensation",
      status: "active",
      createdAt: new Date("2025-04-01"),
      updatedAt: new Date("2025-04-05"),
      version: 1.0,
      createdBy: "HR Department",
    },
  ]);
  
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  
  // Form state for new/edit template
  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    category: "Sales",
    status: "draft",
  });
  
  // Version history mock data
  const versionHistory = [
    { version: 2.1, updatedAt: new Date("2025-04-20"), updatedBy: "Admin User", changes: "Updated commission rates and added new territory section" },
    { version: 2.0, updatedAt: new Date("2025-03-15"), updatedBy: "Admin User", changes: "Major revision with legal compliance updates" },
    { version: 1.2, updatedAt: new Date("2025-02-10"), updatedBy: "Legal Team", changes: "Added compliance clauses" },
    { version: 1.1, updatedAt: new Date("2025-01-25"), updatedBy: "Admin User", changes: "Fixed formatting issues" },
    { version: 1.0, updatedAt: new Date("2025-01-15"), updatedBy: "Admin User", changes: "Initial version" },
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || template.status === filterStatus;
    const matchesCategory = filterCategory === "all" || template.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectAllTemplates = (checked: boolean) => {
    if (checked) {
      setSelectedTemplates(filteredTemplates.map(template => template.id));
    } else {
      setSelectedTemplates([]);
    }
  };

  const handleSelectTemplate = (templateId: string, checked: boolean) => {
    if (checked) {
      setSelectedTemplates(prev => [...prev, templateId]);
    } else {
      setSelectedTemplates(prev => prev.filter(id => id !== templateId));
    }
  };

  const handleCreateTemplate = () => {
    setCurrentTemplate(null);
    setTemplateForm({
      name: "",
      description: "",
      category: "Sales",
      status: "draft",
    });
    setIsEditing(false);
    setShowTemplateDialog(true);
  };

  const handleEditTemplate = (template: Template) => {
    setCurrentTemplate(template);
    setTemplateForm({
      name: template.name,
      description: template.description,
      category: template.category,
      status: template.status,
    });
    setIsEditing(true);
    setShowTemplateDialog(true);
  };

  const handleViewVersionHistory = (template: Template) => {
    setCurrentTemplate(template);
    setShowVersionHistory(true);
  };

  const handleSaveTemplate = () => {
    if (!templateForm.name.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (isEditing && currentTemplate) {
      // Update existing template
      setTemplates(prev => 
        prev.map(template => 
          template.id === currentTemplate.id 
            ? { 
                ...template, 
                name: templateForm.name,
                description: templateForm.description,
                category: templateForm.category,
                status: templateForm.status as "active" | "draft" | "archived",
                updatedAt: new Date(),
                version: template.version + 0.1,
              } 
            : template
        )
      );
      toast.success("Template updated successfully");
    } else {
      // Create new template
      const newTemplate: Template = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        name: templateForm.name,
        description: templateForm.description,
        category: templateForm.category,
        status: templateForm.status as "active" | "draft" | "archived",
        createdAt: new Date(),
        updatedAt: new Date(),
        version: 1.0,
        createdBy: "Current User", // In a real app, this would be the logged-in user
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      toast.success("Template created successfully");
    }
    
    setShowTemplateDialog(false);
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicatedTemplate: Template = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1.0,
      status: "draft",
    };
    
    setTemplates(prev => [...prev, duplicatedTemplate]);
    toast.success("Template duplicated successfully");
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
    toast.success("Template deleted successfully");
  };

  const handleBulkAction = (action: string) => {
    if (selectedTemplates.length === 0) {
      toast.error("No templates selected");
      return;
    }

    switch (action) {
      case "activate":
        setTemplates(prev => 
          prev.map(template => 
            selectedTemplates.includes(template.id) 
              ? { ...template, status: "active", updatedAt: new Date() } 
              : template
          )
        );
        toast.success(`${selectedTemplates.length} templates activated`);
        break;
      case "archive":
        setTemplates(prev => 
          prev.map(template => 
            selectedTemplates.includes(template.id) 
              ? { ...template, status: "archived", updatedAt: new Date() } 
              : template
          )
        );
        toast.success(`${selectedTemplates.length} templates archived`);
        break;
      case "delete":
        setTemplates(prev => 
          prev.filter(template => !selectedTemplates.includes(template.id))
        );
        toast.success(`${selectedTemplates.length} templates deleted`);
        break;
      default:
        break;
    }
    
    setSelectedTemplates([]);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "draft":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "archived":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Agreement Templates</h1>
              <p className="text-muted-foreground">
                Manage and customize agreement templates for your organization
              </p>
            </div>
            <Button onClick={handleCreateTemplate} className="sm:w-auto w-full">
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search templates..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[130px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[130px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Category</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Commission">Commission</SelectItem>
                      <SelectItem value="Territory">Territory</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                      <SelectItem value="Compensation">Compensation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedTemplates.length > 0 && (
                <div className="bg-primary-50 p-3 rounded-md mb-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedTemplates.length} template{selectedTemplates.length > 1 ? 's' : ''} selected
                  </span>
                  <div className="flex-1"></div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Bulk Actions
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleBulkAction("activate")}>
                        <Check className="mr-2 h-4 w-4" />
                        Activate Templates
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBulkAction("archive")}>
                        <History className="mr-2 h-4 w-4" />
                        Archive Templates
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleBulkAction("delete")}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Templates
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedTemplates([])}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear Selection
                  </Button>
                </div>
              )}
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            filteredTemplates.length > 0 &&
                            selectedTemplates.length === filteredTemplates.length
                          }
                          onCheckedChange={handleSelectAllTemplates}
                          aria-label="Select all templates"
                        />
                      </TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden md:table-cell">Version</TableHead>
                      <TableHead className="hidden lg:table-cell">Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.length > 0 ? (
                      filteredTemplates.map((template) => (
                        <TableRow key={template.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTemplates.includes(template.id)}
                              onCheckedChange={(checked) => 
                                handleSelectTemplate(template.id, !!checked)
                              }
                              aria-label={`Select ${template.name}`}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground hidden sm:block">
                              {template.description}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {template.category}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge className={getStatusBadgeColor(template.status)}>
                              {template.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            v{template.version.toFixed(1)}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {format(template.updatedAt, "MMM d, yyyy")}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditTemplate(template)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewVersionHistory(template)}>
                                  <History className="mr-2 h-4 w-4" />
                                  Version History
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteTemplate(template.id)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No templates found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Create/Edit Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Template" : "Create New Template"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the template details below. Changes will be saved as a new version."
                : "Fill in the details to create a new agreement template."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={templateForm.name}
                onChange={(e) => setTemplateForm({ ...templateForm, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm({ ...templateForm, description: e.target.value })}
                placeholder="Enter a description for this template"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={templateForm.category} 
                  onValueChange={(value) => setTemplateForm({ ...templateForm, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Commission">Commission</SelectItem>
                    <SelectItem value="Territory">Territory</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Compensation">Compensation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={templateForm.status} 
                  onValueChange={(value) => setTemplateForm({ ...templateForm, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTemplate}>
              {isEditing ? "Update Template" : "Create Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              {currentTemplate?.name} - Version history and changes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {versionHistory.map((version, index) => (
              <div key={index} className="border-b pb-4 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">v{version.version.toFixed(1)}</Badge>
                    <span className="text-sm font-medium">
                      {index === 0 && "Current"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(version.updatedAt, "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm mb-1">
                  <span className="font-medium">Changes:</span> {version.changes}
                </p>
                <p className="text-sm text-muted-foreground">
                  Updated by {version.updatedBy}
                </p>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
