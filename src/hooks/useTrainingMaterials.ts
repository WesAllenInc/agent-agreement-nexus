import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TrainingMaterial {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  module_type: 'video' | 'pdf' | 'quiz';
  quiz_link: string | null;
  order_index: number;
  is_required: boolean;
  status: 'active' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
  moduleId?: string; // Optional property for material upload/association
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  status: 'active' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
  materials?: TrainingMaterial[];
}

export interface TrainingCompletion {
  id: string;
  user_id: string;
  material_id: string;
  status: 'started' | 'in_progress' | 'completed';
  score: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useTrainingMaterials() {
  const queryClient = useQueryClient();
  const [fileUploadProgress, setFileUploadProgress] = useState<number>(0);

  // Fetch all training modules with their materials
  const useTrainingModules = (options = { includeArchived: false }) => {
    return useQuery({
      queryKey: ['training-modules', options],
      queryFn: async () => {
        // Fetch modules
        const statusFilter = options.includeArchived ? ['active', 'archived'] : ['active'];
        
        const { data: modules, error: modulesError } = await supabase
          .from('training_modules')
          .select('*')
          .in('status', statusFilter)
          .order('order_index');
        
        if (modulesError) throw modulesError;
        
        // For each module, fetch its materials
        const modulesWithMaterials = await Promise.all(
          modules.map(async (module) => {
            const { data: moduleMaterials, error: materialsError } = await supabase
              .from('module_materials')
              .select(`
                material_id,
                order_index,
                training_materials(*)
              `)
              .eq('module_id', module.id)
              .order('order_index');
            
            if (materialsError) throw materialsError;
            
            // Extract materials from the join query and sort by order_index
            const materials = moduleMaterials
              .map(mm => ({
                ...mm.training_materials,
                order_index: mm.order_index
              }))
              .sort((a, b) => a.order_index - b.order_index);
            
            return {
              ...module,
              materials
            };
          })
        );
        
        return modulesWithMaterials;
      }
    });
  };

  // Fetch a single training module with its materials
  const useTrainingModule = (moduleId: string | undefined) => {
    return useQuery({
      queryKey: ['training-module', moduleId],
      queryFn: async () => {
        if (!moduleId) return null;
        
        // Fetch module
        const { data: module, error: moduleError } = await supabase
          .from('training_modules')
          .select('*')
          .eq('id', moduleId)
          .single();
        
        if (moduleError) throw moduleError;
        
        // Fetch module materials
        const { data: moduleMaterials, error: materialsError } = await supabase
          .from('module_materials')
          .select(`
            material_id,
            order_index,
            training_materials(*)
          `)
          .eq('module_id', moduleId)
          .order('order_index');
        
        if (materialsError) throw materialsError;
        
        // Extract materials from the join query
        const materials = moduleMaterials
          .map(mm => ({
            ...mm.training_materials,
            order_index: mm.order_index
          }))
          .sort((a, b) => a.order_index - b.order_index);
        
        return {
          ...module,
          materials
        };
      },
      enabled: !!moduleId
    });
  };

  // Fetch a single training material
  const useTrainingMaterial = (materialId: string | undefined) => {
    return useQuery({
      queryKey: ['training-material', materialId],
      queryFn: async () => {
        if (!materialId) return null;
        
        const { data, error } = await supabase
          .from('training_materials')
          .select('*')
          .eq('id', materialId)
          .single();
        
        if (error) throw error;
        
        return data;
      },
      enabled: !!materialId
    });
  };

  // Get a signed URL for a training material file
  const getFileUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('training')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error: any) {
      console.error('Error getting training material URL:', error.message);
      return null;
    }
  };

  // Create a new training module
  const createModule = useMutation({
    mutationFn: async (module: {
      title: string;
      description: string | null;
      order_index: number;
      status: 'active' | 'archived';
    }) => {
      const { data, error } = await supabase
        .from('training_modules')
        .insert(module)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      toast.success('Training module created successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to create module: ${error.message}`);
    }
  });

  // Update a training module
  const updateModule = useMutation({
    mutationFn: async ({ id, ...module }: Partial<TrainingModule> & { id: string }) => {
      const { data, error } = await supabase
        .from('training_modules')
        .update(module)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      queryClient.invalidateQueries({ queryKey: ['training-module', data.id] });
      toast.success('Training module updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update module: ${error.message}`);
    }
  });

  // Delete a training module
  const deleteModule = useMutation({
    mutationFn: async (moduleId: string) => {
      const { error } = await supabase
        .from('training_modules')
        .delete()
        .eq('id', moduleId);
      
      if (error) throw error;
      
      return moduleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      toast.success('Training module deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete module: ${error.message}`);
    }
  });

  // Upload a training material file and create a record
  const uploadMaterial = async (
    file: File,
    materialData: {
      title: string;
      description: string;
      module_type: 'video' | 'pdf' | 'quiz';
      quiz_link?: string;
      order_index: number;
      is_required: boolean;
      moduleId?: string;
      status: 'active' | 'archived';
      file_name?: string;
    }
  ) => {
    try {
      setFileUploadProgress(0);
      
      // Generate a unique file path
      const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      // Upload the file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('training')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (uploadError) throw uploadError;
      
      // Create the training material record
      const { data: materialRecord, error: materialError } = await supabase
        .from('training_materials')
        .insert({
          ...materialData,
          file_path: uploadData.path,
          file_size: file.size,
          mime_type: file.type
        })
        .select()
        .single();
      
      if (materialError) {
        // If material creation fails, delete the uploaded file
        await supabase.storage.from('training').remove([uploadData.path]);
        throw materialError;
      }
      
      // If this material belongs to a module, create the association
      if (materialData.moduleId) {
        const { error: associationError } = await supabase
          .from('module_materials')
          .insert({
            module_id: materialData.moduleId,
            material_id: materialRecord.id,
            order_index: materialData.order_index || 0
          });
        
        if (associationError) throw associationError;
      }
      
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      queryClient.invalidateQueries({ queryKey: ['training-module', materialData.moduleId] });
      
      setFileUploadProgress(100);
      toast.success('Training material uploaded successfully');
      
      return materialRecord;
    } catch (error: any) {
      console.error('Error uploading training material:', error);
      toast.error(`Failed to upload material: ${error.message}`);
      setFileUploadProgress(0);
      return null;
    }
  };

  // Delete a training material
  const deleteMaterial = useMutation({
    mutationFn: async (materialId: string) => {
      // First get the material to find the file path
      const { data: material, error: getMaterialError } = await supabase
        .from('training_materials')
        .select('file_path')
        .eq('id', materialId)
        .single();
      
      if (getMaterialError) throw getMaterialError;
      
      // Delete the material record
      const { error: deleteMaterialError } = await supabase
        .from('training_materials')
        .delete()
        .eq('id', materialId);
      
      if (deleteMaterialError) throw deleteMaterialError;
      
      // Delete the file from storage
      if (material?.file_path) {
        await supabase.storage
          .from('training')
          .remove([material.file_path]);
      }
      
      return materialId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-modules'] });
      toast.success('Training material deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete material: ${error.message}`);
    }
  });

  return {
    useTrainingModules,
    useTrainingModule,
    useTrainingMaterial,
    getFileUrl,
    createModule,
    updateModule,
    deleteModule,
    uploadMaterial,
    deleteMaterial,
    fileUploadProgress
  };
}
