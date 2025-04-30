
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";
import AgreementText from "../sections/AgreementText";

export default function SalesAgentAgreementForm() {
  const { goToNextStep, goToPreviousStep } = useWizard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-semibold mb-6">Sales Agent Agreement</div>
          <AgreementText />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={goToPreviousStep}>
            Back
          </Button>
          <Button type="submit">Continue to Sign</Button>
        </CardFooter>
      </Card>
    </form>
  );
}

