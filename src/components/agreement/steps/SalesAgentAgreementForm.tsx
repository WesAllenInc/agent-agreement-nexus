
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useWizard } from "../WizardContext";

export default function SalesAgentAgreementForm() {
  const { goToNextStep, goToPreviousStep, formData } = useWizard();
  const { partner_info } = formData;

  // Get current date for the agreement
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToNextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="text-2xl font-semibold mb-6">Sales Agent Agreement</div>

          <div className="space-y-6 text-sm">
            <div className="font-semibold text-lg">SALES AGENT AGREEMENT</div>
            <p>
              This Sales Agent Agreement ("Agreement") is made on {month} {day}, {year} ("Effective Date") by and among WLJ Innovations, LLC d/b/a Ireland Pay ("Ireland Pay") and {partner_info.first_name} {partner_info.last_name} ("Sales Agent") and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant processing services. Sales Agent desires to solicit and refer merchants. The parties agree as follows:
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">I. Definitions</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">II. Sales Agent's Obligations</div>
            <ul className="list-disc pl-8 space-y-2">
              <li>2.1 Responsibilities of Sales Agent</li>
              <li>2.2 Site Inspections</li>
              <li>2.3 Non-Solicitation</li>
              <li>2.5 Background Check</li>
              <li>2.6 Names and Trademarks</li>
            </ul>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">III. Ireland Pay Responsibilities</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">IV. Payments to Sales Agent</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">V. Third Party Requirements</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">VI. Mutual Obligations</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">VII. Confidentiality</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">VIII. Term, Termination, Default</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">IX. Indemnification and Limitation of Liability</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">X. General</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">Schedule B – Sales Offices and Sales Agents</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>

            <div className="border-t border-gray-200 pt-4 font-semibold">Schedule C – Personal Guarantee</div>
            <p className="italic text-gray-600">
              [Full contract text would appear here]
            </p>
          </div>
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
