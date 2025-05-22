import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface TrainingMaterial {
  id: string;
  module_id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'quiz';
  content_path: string;
  order: number;
  created_at: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  required: boolean;
  expiry_days: number | null;
  order: number;
  created_at: string;
  updated_at: string;
  materials?: TrainingMaterial[];
}

export interface TrainingCompletion {
  id: string;
  user_id: string;
  material_id: string;
  module_id: string;
  completed_at: string;
}

export interface CertificateInfo {
  id: string;
  user_id: string;
  module_id: string;
  issued_at: string;
  expires_at: string | null;
  certificate_path: string;
}

interface TrainingState {
  modules: TrainingModule[];
  materials: TrainingMaterial[];
  completions: TrainingCompletion[];
  certificates: CertificateInfo[];
  currentModule: TrainingModule | null;
  currentMaterial: TrainingMaterial | null;
  isLoading: boolean;
  isLoadingModule: boolean;
  isLoadingMaterial: boolean;
  isSubmitting: boolean;
  error: string | null;
}

interface TrainingActions {
  fetchModules: () => Promise<void>;
  fetchModuleDetails: (moduleId: string) => Promise<void>;
  fetchMaterialDetails: (materialId: string) => Promise<void>;
  fetchCompletions: () => Promise<void>;
  fetchCertificates: () => Promise<void>;
  markMaterialComplete: (materialId: string, moduleId: string) => Promise<void>;
  generateCertificate: (moduleId: string) => Promise<string | null>;
  getCompletionPercentage: (moduleId: string) => number;
  getModuleStatus: (moduleId: string) => 'not-started' | 'in-progress' | 'completed';
  resetCurrentModule: () => void;
  resetCurrentMaterial: () => void;
}

export const useTrainingStore = create<TrainingState & TrainingActions>((set, get) => ({
  // State
  modules: [],
  materials: [],
  completions: [],
  certificates: [],
  currentModule: null,
  currentMaterial: null,
  isLoading: false,
  isLoadingModule: false,
  isLoadingMaterial: false,
  isSubmitting: false,
  error: null,

  // Actions
  fetchModules: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch training modules
      const { data: modules, error: modulesError } = await supabase
        .from('training_modules')
        .select('*')
        .order('order', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch materials for each module
      const { data: materials, error: materialsError } = await supabase
        .from('training_materials')
        .select('*')
        .order('order', { ascending: true });

      if (materialsError) throw materialsError;

      // Group materials by module
      const modulesWithMaterials = modules.map(module => ({
        ...module,
        materials: materials.filter(material => material.module_id === module.id)
      }));

      set({ 
        modules: modulesWithMaterials, 
        materials, 
        isLoading: false 
      });
    } catch (error: any) {
      console.error('Error fetching training modules:', error.message);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to load training modules: ${error.message}`);
    }
  },

  fetchModuleDetails: async (moduleId: string) => {
    set({ isLoadingModule: true, error: null });
    try {
      // Fetch module details
      const { data: module, error: moduleError } = await supabase
        .from('training_modules')
        .select('*')
        .eq('id', moduleId)
        .single();

      if (moduleError) throw moduleError;

      // Fetch materials for this module
      const { data: materials, error: materialsError } = await supabase
        .from('training_materials')
        .select('*')
        .eq('module_id', moduleId)
        .order('order', { ascending: true });

      if (materialsError) throw materialsError;

      // Combine module with its materials
      const moduleWithMaterials = {
        ...module,
        materials
      };

      set({ 
        currentModule: moduleWithMaterials, 
        isLoadingModule: false 
      });
      
      return moduleWithMaterials;
    } catch (error: any) {
      console.error('Error fetching module details:', error.message);
      set({ error: error.message, isLoadingModule: false });
      toast.error(`Failed to load module details: ${error.message}`);
      return null;
    }
  },

  fetchMaterialDetails: async (materialId: string) => {
    set({ isLoadingMaterial: true, error: null });
    try {
      // Fetch material details
      const { data: material, error } = await supabase
        .from('training_materials')
        .select('*')
        .eq('id', materialId)
        .single();

      if (error) throw error;

      set({ currentMaterial: material, isLoadingMaterial: false });
      return material;
    } catch (error: any) {
      console.error('Error fetching material details:', error.message);
      set({ error: error.message, isLoadingMaterial: false });
      toast.error(`Failed to load material details: ${error.message}`);
      return null;
    }
  },

  fetchCompletions: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('training_completions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;

      set({ completions: data, isLoading: false });
      return data;
    } catch (error: any) {
      console.error('Error fetching completions:', error.message);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to load training completions: ${error.message}`);
      return [];
    }
  },

  fetchCertificates: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('training_certificates')
        .select('*')
        .order('issued_at', { ascending: false });

      if (error) throw error;

      set({ certificates: data, isLoading: false });
      return data;
    } catch (error: any) {
      console.error('Error fetching certificates:', error.message);
      set({ error: error.message, isLoading: false });
      toast.error(`Failed to load certificates: ${error.message}`);
      return [];
    }
  },

  markMaterialComplete: async (materialId: string, moduleId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      // Get user ID from auth
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        throw new Error('You must be logged in to complete training materials');
      }

      // Check if already completed
      const { data: existingCompletion } = await supabase
        .from('training_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('material_id', materialId)
        .single();

      if (existingCompletion) {
        // Already completed, just return success
        set({ isSubmitting: false });
        return;
      }

      // Insert new completion record
      const { error } = await supabase
        .from('training_completions')
        .insert({
          user_id: user.id,
          material_id: materialId,
          module_id: moduleId,
        });

      if (error) throw error;

      // Refresh completions
      await get().fetchCompletions();

      // Check if module is now complete
      const moduleStatus = get().getModuleStatus(moduleId);
      
      if (moduleStatus === 'completed') {
        toast.success('Module completed! You can now download your certificate.');
        
        // Generate certificate if all required modules are complete
        const allRequiredModulesComplete = get().modules
          .filter(m => m.required)
          .every(m => get().getModuleStatus(m.id) === 'completed');
          
        if (allRequiredModulesComplete) {
          toast.success('All required training completed! Certificate is available.');
        }
      } else {
        toast.success('Material completed successfully!');
      }

      set({ isSubmitting: false });
    } catch (error: any) {
      console.error('Error marking material complete:', error.message);
      set({ error: error.message, isSubmitting: false });
      toast.error(`Failed to mark material as complete: ${error.message}`);
    }
  },

  generateCertificate: async (moduleId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      // Get user ID from auth
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      
      if (!user) {
        throw new Error('You must be logged in to generate certificates');
      }

      // Check if module is complete
      const moduleStatus = get().getModuleStatus(moduleId);
      if (moduleStatus !== 'completed') {
        throw new Error('You must complete all materials in this module first');
      }

      // Check if certificate already exists
      const { data: existingCert } = await supabase
        .from('training_certificates')
        .select('*')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();

      if (existingCert) {
        // Return existing certificate path
        set({ isSubmitting: false });
        return existingCert.certificate_path;
      }

      // Get module details for expiry calculation
      const module = get().modules.find(m => m.id === moduleId);
      if (!module) {
        throw new Error('Module not found');
      }

      // Calculate expiry date if applicable
      let expiryDate = null;
      if (module.expiry_days) {
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + module.expiry_days);
      }

      // Generate certificate file name
      const certificatePath = `certificates/${user.id}/${moduleId}_${Date.now()}.pdf`;
      
      // In a real implementation, we would generate a PDF certificate here
      // For now, we'll just create a placeholder record
      
      // Insert certificate record
      const { data, error } = await supabase
        .from('training_certificates')
        .insert({
          user_id: user.id,
          module_id: moduleId,
          expires_at: expiryDate?.toISOString() || null,
          certificate_path: certificatePath
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh certificates
      await get().fetchCertificates();

      toast.success('Certificate generated successfully!');
      set({ isSubmitting: false });
      
      // Return the certificate path
      return certificatePath;
    } catch (error: any) {
      console.error('Error generating certificate:', error.message);
      set({ error: error.message, isSubmitting: false });
      toast.error(`Failed to generate certificate: ${error.message}`);
      return null;
    }
  },

  getCompletionPercentage: (moduleId: string) => {
    const { completions, materials } = get();
    
    // In a real implementation, we would get this from the auth store
    // For now, we'll use a synchronous approach with localStorage
    let userId = 'guest';
    try {
      const session = JSON.parse(localStorage.getItem('supabase.auth.token') || '{}');
      userId = session?.currentSession?.user?.id || 'guest';
    } catch (e) {
      console.error('Error parsing auth session:', e);
    }
    
    if (userId === 'guest') return 0;
    
    // Get materials for this module
    const moduleMaterials = materials.filter(m => m.module_id === moduleId);
    if (moduleMaterials.length === 0) return 0;
    
    // Count completed materials
    const completedMaterials = completions.filter(
      c => c.module_id === moduleId && c.user_id === userId
    );
    
    // Calculate percentage
    return (completedMaterials.length / moduleMaterials.length) * 100;
  },

  getModuleStatus: (moduleId: string) => {
    const completionPercentage = get().getCompletionPercentage(moduleId);
    
    if (completionPercentage === 0) {
      return 'not-started';
    } else if (completionPercentage === 100) {
      return 'completed';
    } else {
      return 'in-progress';
    }
  },

  resetCurrentModule: () => {
    set({ currentModule: null });
  },

  resetCurrentMaterial: () => {
    set({ currentMaterial: null });
  }
}));
