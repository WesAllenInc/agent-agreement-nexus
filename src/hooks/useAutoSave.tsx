
import { useEffect, useRef } from 'react';
import { useWizard } from '@/components/agreement/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export function useAutoSave(formKey: string) {
  const { formData, setFormData } = useWizard();
  const { user } = useAuth();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Load saved data on mount
  useEffect(() => {
    const loadSavedData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('agreement_drafts')
          .select('form_data')
          .eq('user_id', user.id)
          .eq('form_key', formKey)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data?.form_data) {
          setFormData(data.form_data);
          toast.info('Loaded saved progress');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, [user?.id, formKey]);

  // Auto-save when form data changes
  useEffect(() => {
    if (!user?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('agreement_drafts')
          .upsert({
            user_id: user.id,
            form_key: formKey,
            form_data: formData,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 2000); // Save after 2 seconds of no changes

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, user?.id, formKey]);
}
