
import PartnerApplicationForm from "./steps/PartnerApplicationForm";
import ACHAuthorizationForm from "./steps/ACHAuthorizationForm";
import SalesAgentAgreementForm from "./steps/SalesAgentAgreementForm";
import SignatureStep from "./steps/SignatureStep";
import { useWizard } from "./WizardContext";

export default function WizardSteps() {
  const { currentStep } = useWizard();

  return (
    <div className="wizard-step">
      {currentStep === 1 && <PartnerApplicationForm />}
      {currentStep === 2 && <ACHAuthorizationForm />}
      {currentStep === 3 && <SalesAgentAgreementForm />}
      {currentStep === 4 && <SignatureStep />}
    </div>
  );
}

