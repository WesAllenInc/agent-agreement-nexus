import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { TrainingMaterial, TrainingModule } from './useTrainingMaterials';

export interface TrainingCompletion {
  id?: string;
  user_id: string;
  material_id: string;
  status: 'started' | 'in_progress' | 'completed';
  score?: number | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UserTrainingProgress {
  userId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  totalMaterials: number;
  completedMaterials: number;
  completionPercentage: number;
  lastActivity?: string;
  moduleProgress: {
    moduleId: string;
    moduleTitle: string;
    totalMaterials: number;
    completedMaterials: number;
    completionPercentage: number;
  }[];
}

export function useTrainingCompletions() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch training completions for the current user
  const useUserCompletions = (userId = user?.id) => {
    return useQuery({
      queryKey: ['training-completions', userId],
      queryFn: async () => {
        if (!userId) return [];
        
        const { data, error } = await supabase
          .from('training_completions')
          .select('*')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        return data;
      },
      enabled: !!userId
    });
  };

  // Fetch completion status for a specific material
  const useMaterialCompletion = (materialId: string, userId = user?.id) => {
    return useQuery({
      queryKey: ['material-completion', materialId, userId],
      queryFn: async () => {
        if (!userId || !materialId) return null;
        
        const { data, error } = await supabase
          .from('training_completions')
          .select('*')
          .eq('user_id', userId)
          .eq('material_id', materialId)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
          throw error;
        }
        
        return data || null;
      },
      enabled: !!userId && !!materialId
    });
  };

  // Calculate training progress for a module
  const useModuleProgress = (moduleId: string, userId = user?.id) => {
    return useQuery({
      queryKey: ['module-progress', moduleId, userId],
      queryFn: async () => {
        if (!userId || !moduleId) return null;
        
        // Get all materials in this module
        const { data: moduleMaterials, error: materialsError } = await supabase
          .from('module_materials')
          .select('material_id')
          .eq('module_id', moduleId);
        
        if (materialsError) throw materialsError;
        
        if (!moduleMaterials.length) {
          return { completed: 0, total: 0, percentage: 0 };
        }
        
        const materialIds = moduleMaterials.map(mm => mm.material_id);
        
        // Get completions for these materials
        const { data: completions, error: completionsError } = await supabase
          .from('training_completions')
          .select('*')
          .eq('user_id', userId)
          .in('material_id', materialIds)
          .eq('status', 'completed');
        
        if (completionsError) throw completionsError;
        
        const completed = completions.length;
        const total = materialIds.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percentage };
      },
      enabled: !!userId && !!moduleId
    });
  };

  // Calculate overall training progress
  const useOverallProgress = (userId = user?.id) => {
    return useQuery({
      queryKey: ['overall-training-progress', userId],
      queryFn: async () => {
        if (!userId) return null;
        
        // Get all training materials
        const { data: materials, error: materialsError } = await supabase
          .from('training_materials')
          .select('id')
          .eq('status', 'active')
          .eq('is_required', true);
        
        if (materialsError) throw materialsError;
        
        if (!materials.length) {
          return { completed: 0, total: 0, percentage: 0 };
        }
        
        const materialIds = materials.map(m => m.id);
        
        // Get completions for these materials
        const { data: completions, error: completionsError } = await supabase
          .from('training_completions')
          .select('*')
          .eq('user_id', userId)
          .in('material_id', materialIds)
          .eq('status', 'completed');
        
        if (completionsError) throw completionsError;
        
        const completed = completions.length;
        const total = materialIds.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { completed, total, percentage };
      },
      enabled: !!userId
    });
  };

  // Get training progress for all users (admin only)
  const useAllUsersProgress = () => {
    return useQuery({
      queryKey: ['all-users-training-progress'],
      queryFn: async () => {
        // Get all users with agent roles
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name')
          .in('role', ['sales_agent', 'senior_agent']);
        
        if (usersError) throw usersError;
        
        // Get all modules with their materials
        const { data: modules, error: modulesError } = await supabase
          .from('training_modules')
          .select(`
            id, 
            title,
            module_materials!inner(
              material_id,
              training_materials!inner(
                id,
                is_required
              )
            )
          `)
          .eq('status', 'active');
        
        if (modulesError) throw modulesError;
        
        // Get all completions
        const { data: completions, error: completionsError } = await supabase
          .from('training_completions')
          .select('*')
          .eq('status', 'completed');
        
        if (completionsError) throw completionsError;
        
        // Process the data to calculate progress for each user
        const userProgress: UserTrainingProgress[] = users.map(user => {
          const userCompletions = completions.filter(c => c.user_id === user.id);
          
          // Calculate total required materials across all modules
          const allRequiredMaterials = new Set<string>();
          modules.forEach(module => {
            module.module_materials.forEach((mm: any) => {
              if (mm.training_materials.is_required) {
                allRequiredMaterials.add(mm.material_id);
              }
            });
          });
          
          const totalMaterials = allRequiredMaterials.size;
          const completedMaterials = new Set(
            userCompletions
              .filter(c => allRequiredMaterials.has(c.material_id))
              .map(c => c.material_id)
          ).size;
          
          // Calculate progress for each module
          const moduleProgress = modules.map(module => {
            const moduleMaterials = module.module_materials
              .filter((mm: any) => mm.training_materials.is_required)
              .map((mm: any) => mm.material_id);
            
            const moduleTotal = moduleMaterials.length;
            const moduleCompleted = userCompletions
              .filter(c => moduleMaterials.includes(c.material_id))
              .length;
            
            return {
              moduleId: module.id,
              moduleTitle: module.title,
              totalMaterials: moduleTotal,
              completedMaterials: moduleCompleted,
              completionPercentage: moduleTotal > 0 
                ? Math.round((moduleCompleted / moduleTotal) * 100) 
                : 0
            };
          });
          
          // Find the most recent activity
          const lastActivity = userCompletions.length > 0
            ? userCompletions.sort((a, b) => 
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
              )[0].updated_at
            : undefined;
          
          return {
            userId: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            totalMaterials,
            completedMaterials,
            completionPercentage: totalMaterials > 0 
              ? Math.round((completedMaterials / totalMaterials) * 100) 
              : 0,
            lastActivity,
            moduleProgress
          };
        });
        
        return userProgress;
      }
    });
  };

  // Mark a training material as started
  const startMaterial = useMutation({
    mutationFn: async (materialId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from('training_completions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('material_id', materialId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // If already completed, don't change the status
      if (existing?.status === 'completed') {
        return existing;
      }
      
      // Update or insert the completion record
      if (existing) {
        const { data, error } = await supabase
          .from('training_completions')
          .update({ status: 'started' })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('training_completions')
          .insert({
            user_id: user.id,
            material_id: materialId,
            status: 'started'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['training-completions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['material-completion', data.material_id, user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to mark material as started: ${error.message}`);
    }
  });

  // Mark a training material as in progress
  const updateProgress = useMutation({
    mutationFn: async (materialId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from('training_completions')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('material_id', materialId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      // If already completed, don't change the status
      if (existing?.status === 'completed') {
        return existing;
      }
      
      // Update or insert the completion record
      if (existing) {
        const { data, error } = await supabase
          .from('training_completions')
          .update({ status: 'in_progress' })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('training_completions')
          .insert({
            user_id: user.id,
            material_id: materialId,
            status: 'in_progress'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['training-completions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['material-completion', data.material_id, user?.id] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update progress: ${error.message}`);
    }
  });

  // Mark a training material as completed
  const completeMaterial = useMutation({
    mutationFn: async ({ materialId, score }: { materialId: string; score?: number }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from('training_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', materialId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const completionData = {
        status: 'completed' as const,
        completed_at: new Date().toISOString(),
        ...(score !== undefined ? { score } : {})
      };
      
      // Update or insert the completion record
      if (existing) {
        const { data, error } = await supabase
          .from('training_completions')
          .update(completionData)
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('training_completions')
          .insert({
            user_id: user.id,
            material_id: materialId,
            ...completionData
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['training-completions', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['material-completion', data.material_id, user?.id] });
      queryClient.invalidateQueries({ queryKey: ['module-progress'] });
      queryClient.invalidateQueries({ queryKey: ['overall-training-progress'] });
      queryClient.invalidateQueries({ queryKey: ['all-users-training-progress'] });
      toast.success('Training material completed!');
    },
    onError: (error: any) => {
      toast.error(`Failed to complete material: ${error.message}`);
    }
  });

  return {
    useUserCompletions,
    useMaterialCompletion,
    useModuleProgress,
    useOverallProgress,
    useAllUsersProgress,
    startMaterial,
    updateProgress,
    completeMaterial
  };
}
