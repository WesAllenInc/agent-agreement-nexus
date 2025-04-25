
import { useEffect, useRef } from 'react';
import { useWizard } from '@/components/agreement/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { AgreementData } from '@/types';

type AgreementDraft = {
  id: string;
  user_id: string;
  form_key: string;
  form_data: AgreementData;
  created_at: string;
  updated_at: string;
}

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
          .from<'agreement_drafts', AgreementDraft>('agreement_drafts')
          .select()
          .eq('user_id', user.id)
          .eq('form_key', formKey)
          .maybeSingle();
          
        if (error) {
          console.error('Error loading saved data:', error);
          return;
        }
        
        if (data?.form_data) {
          setFormData(data.form_data);
          toast.info('Loaded saved progress');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    };
    
    loadSavedData();
  }, [user?.id, formKey, setFormData]);

  // Auto-save when form data changes
  useEffect(() => {
    if (!user?.id) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from<'agreement_drafts', AgreementDraft>('agreement_drafts')
          .upsert({
            user_id: user.id,
            form_key: formKey,
            form_data: formData,
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error saving draft:', error);
          return;
        }
      } catch (error) {
        console.error('Error saving draft:', error);
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, user?.id, formKey]);
}
