import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DraftOptions {
  /**
   * Unique identifier for this draft type
   */
  draftType: string;
  
  /**
   * Optional ID for a specific entity (e.g., agreement ID)
   */
  entityId?: string;
  
  /**
   * Auto-save interval in milliseconds (default: 30 seconds)
   */
  autoSaveInterval?: number;
  
  /**
   * Whether to enable auto-saving (default: true)
   */
  enableAutoSave?: boolean;
}

/**
 * Custom hook for managing draft states with auto-save functionality
 */
export function useDraftState<T extends Record<string, any>>(
  initialState: T,
  options: DraftOptions
) {
  const { user } = useAuth();
  const [state, setState] = useState<T>(initialState);
  const [originalState, setOriginalState] = useState<T>(initialState);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [draftId, setDraftId] = useState<string | null>(null);

  const {
    draftType,
    entityId = 'default',
    autoSaveInterval = 30000,
    enableAutoSave = true
  } = options;

  // Generate a unique key for this draft
  const draftKey = `${draftType}:${entityId}`;

  // Load existing draft on initial render
  useEffect(() => {
    const loadDraft = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('drafts')
          .select('*')
          .eq('user_id', user.id)
          .eq('draft_type', draftType)
          .eq('entity_id', entityId)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" error, which is fine
          console.error('Error loading draft:', error);
          toast.error('Failed to load draft');
        }

        if (data) {
          const draftData = data.content as T;
          setState(draftData);
          setOriginalState(draftData);
          setDraftId(data.id);
          setLastSaved(new Date(data.updated_at));
          toast.info('Draft loaded successfully');
        }
      } catch (error) {
        console.error('Error in loadDraft:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDraft();
  }, [user, draftType, entityId]);

  // Save draft to database
  const saveDraft = useCallback(async (dataToSave: T = state): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to save drafts');
      return false;
    }

    setIsSaving(true);

    try {
      const now = new Date();
      
      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('drafts')
          .update({
            content: dataToSave,
            updated_at: now.toISOString()
          })
          .eq('id', draftId);

        if (error) throw error;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('drafts')
          .insert({
            user_id: user.id,
            draft_type: draftType,
            entity_id: entityId,
            content: dataToSave,
            created_at: now.toISOString(),
            updated_at: now.toISOString()
          })
          .select('id')
          .single();

        if (error) throw error;
        setDraftId(data.id);
      }

      setLastSaved(now);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user, draftId, draftType, entityId, state]);

  // Auto-save on interval if enabled and dirty
  useEffect(() => {
    if (!enableAutoSave || !isDirty || isLoading) return;

    const intervalId = setInterval(() => {
      if (isDirty && !isSaving) {
        saveDraft();
      }
    }, autoSaveInterval);

    return () => clearInterval(intervalId);
  }, [enableAutoSave, isDirty, isSaving, isLoading, saveDraft, autoSaveInterval]);

  // Update state and mark as dirty
  const updateDraft = useCallback((updates: Partial<T> | ((prevState: T) => T)) => {
    setState(prev => {
      const newState = typeof updates === 'function' 
        ? updates(prev) 
        : { ...prev, ...updates };
      
      // Check if state has actually changed
      const hasChanged = JSON.stringify(newState) !== JSON.stringify(prev);
      if (hasChanged && !isDirty) {
        setIsDirty(true);
      }
      
      return newState;
    });
  }, [isDirty]);

  // Discard current changes and revert to last saved state
  const discardChanges = useCallback(() => {
    setState(originalState);
    setIsDirty(false);
  }, [originalState]);

  // Delete draft completely
  const deleteDraft = useCallback(async (): Promise<boolean> => {
    if (!draftId || !user) return false;

    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDraftId(null);
      setLastSaved(null);
      setState(initialState);
      setOriginalState(initialState);
      setIsDirty(false);
      toast.success('Draft deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Failed to delete draft');
      return false;
    }
  }, [draftId, user, initialState]);

  return {
    draft: state,
    updateDraft,
    saveDraft,
    discardChanges,
    deleteDraft,
    isDirty,
    isSaving,
    lastSaved,
    isLoading,
    hasDraft: !!draftId
  };
}
