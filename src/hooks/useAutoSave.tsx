import { useEffect, useRef } from 'react';
import { useWizard } from '@/components/agreement/WizardContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { AgreementData, PartnerInfo, BankInfo } from '@/types';
import { Json } from '@/integrations/supabase/types';
import { PostgrestError } from '@supabase/supabase-js';

// Define the draft table structure based on Supabase's generated types
type AgreementDraft = {
  id: string;
  user_id: string;
  form_key: string;
  form_data: Json;
  created_at: string;
  updated_at: string;
}

// Helper function to validate saved form data
function isValidAgreementData(data: unknown): data is AgreementData {
  if (!data || typeof data !== 'object') return false;
  
  const d = data as Partial<AgreementData>;
  if (!d.partner_info || !d.bank_info) return false;

  // Validate partner_info has required fields
  const p = d.partner_info as Partial<PartnerInfo>;
  if (!p.first_name || !p.last_name || !p.legal_business_name) return false;

  // Validate bank_info has required fields
  const b = d.bank_info as Partial<BankInfo>;
  if (!b.account_type || !b.bank_name || !b.account_number) return false;

  return true;
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
          .from('agreement_drafts')
          .select()
          .eq('user_id', user.id)
          .eq('form_key', formKey)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data?.form_data) {
          const savedData = data.form_data;
          
          // Validate the saved data structure
          if (isValidAgreementData(savedData)) {
            setFormData(savedData);
            toast.info('Loaded saved progress');
          } else {
            toast.error('Could not load saved data: Invalid data structure');
          }
        }
      } catch (error) {
        if (error instanceof PostgrestError) {
          toast.error('Error loading saved data: ' + error.message);
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
          toast.error('Error loading saved data: ' + errorMessage);
        }
      }
    };
    
    loadSavedData();
  }, [user?.id, formKey, setFormData]);

  // Auto-save when form data changes
  useEffect(() => {
    if (!user?.id || !formData) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        // Ensure formData is a plain object before saving
        const formDataToSave = {
          ...formData,
          partner_info: { ...formData.partner_info },
          bank_info: { ...formData.bank_info },
          schedule_b: formData.schedule_b ? { ...formData.schedule_b } : undefined,
        };

        const { error } = await supabase
          .from('agreement_drafts')
          .upsert({
            user_id: user.id,
            form_key: formKey,
            form_data: formDataToSave as unknown as Json,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
        
        // Optionally show success toast
        // toast.success('Progress saved');
      } catch (error) {
        if (error instanceof PostgrestError) {
          toast.error('Error saving progress: ' + error.message);
        } else {
          const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
          toast.error('Error saving progress: ' + errorMessage);
        }
      }
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, user?.id, formKey]);
}
