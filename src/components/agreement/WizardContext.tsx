import { ReactNode, createContext, useContext, useState } from "react";
import { AgreementData, PartnerInfo, BankInfo } from "@/types";

interface WizardContextType {
  currentStep: number;
  totalSteps: number;
  formData: AgreementData;
  setFormData: React.Dispatch<React.SetStateAction<AgreementData>>;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isComplete: boolean;
  setIsComplete: (value: boolean) => void;
}

const defaultPartnerInfo: PartnerInfo = {
  first_name: "",
  middle_name: "",
  last_name: "",
  legal_business_name: "",
  business_type: "Corp",
  tax_id: "",
  ss_number: "",
  business_address: "",
  business_city: "",
  business_state: "",
  business_zip: "",
  business_phone: "",
  business_fax: "",
  email: "",
  home_address: "",
  home_city: "",
  home_state: "",
  home_zip: "",
  home_phone: "",
};

const defaultBankInfo: BankInfo = {
  account_type: "Checking",
  bank_name: "",
  account_number: "",
  routing_number: "",
  bank_phone: "",
  bank_contact_name: "",
  account_holder_name: "",
};

const defaultFormData: AgreementData = {
  partner_info: defaultPartnerInfo,
  bank_info: defaultBankInfo,
  schedule_b: {
    offices: {},
    agents: {}
  }
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AgreementData>(defaultFormData);
  const [isComplete, setIsComplete] = useState(false);
  
  const totalSteps = 4;

  const goToNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const value = {
    currentStep,
    totalSteps,
    formData,
    setFormData,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    isComplete,
    setIsComplete,
  };

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}

