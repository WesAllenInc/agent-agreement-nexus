
import MainLayout from "@/components/layout/MainLayout";
import { WizardProvider } from "@/components/agreement/WizardContext";
import WizardStepper from "@/components/agreement/WizardStepper";
import WizardSteps from "@/components/agreement/WizardSteps";

export default function Agreement() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sales Agent Agreement</h1>
        <WizardProvider>
          <WizardStepper />
          <WizardSteps />
        </WizardProvider>
      </div>
    </MainLayout>
  );
}
