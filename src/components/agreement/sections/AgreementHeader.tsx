
import { useWizard } from "../WizardContext";

export default function AgreementHeader() {
  const { formData } = useWizard();
  const { partner_info } = formData;

  // Get current date for the agreement
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();
  const formattedDate = `${month} ${day}, ${year}`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Sales Agent Agreement</h1>
      
      <p>
        This Sales Agent Agreement ("Agreement") is made on {formattedDate} ("Effective Date") by and among WLJ Innovations, LLC, a Florida limited liability company d/b/a Ireland Pay with offices at 5000 SW 75th Avenue, Suite 131, Miami, FL 33155 ("Ireland Pay") and,
      </p>

      <div className="text-center my-4">
        <p>{partner_info.first_name} {partner_info.middle_name} {partner_info.last_name}</p>
        <p>with offices at {partner_info.business_address} ("Sales Agent")</p>
      </div>

      <p>
        and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant credit and debit card processing, check processing, software and hardware solutions, and related services. Sales Agent desires to solicit and refer merchants to Ireland Pay for those services. Therefore, for adequate consideration, the sufficiency of which is acknowledged, the parties agree as follows:
      </p>
    </div>
  );
}

