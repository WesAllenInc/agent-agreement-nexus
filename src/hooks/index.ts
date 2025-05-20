// Barrel file for hooks directory
export * from './use-mobile';
export * from './use-toast';
export * from './useAgreement';
export * from './useAgreementAttachments';
export * from './useAgreementSignature';
export * from './useAgreementVersions';
export * from './useAgreements';
export * from './useAsync';
export * from './useAuth';
export * from './useAutoSave';

// Handle ambiguous exports by using named exports
import * as EmailNotifications from './useEmailNotifications';
export { 
  useEmailNotifications,
  // Re-export specific types/interfaces but avoid the ambiguous NotificationType
} from './useEmailNotifications';

export * from './useFormValidation';
export * from './useNotifications';
export * from './useProfile';

// Handle ambiguous exports by using named exports
import * as TrainingCompletions from './useTrainingCompletions';
export { 
  useTrainingCompletions,
  // Re-export specific types/interfaces but avoid the ambiguous TrainingCompletion
} from './useTrainingCompletions';

export * from './useTrainingMaterials';
