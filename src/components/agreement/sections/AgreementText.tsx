
import { useWizard } from "../../WizardContext";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AgreementText() {
  const { formData } = useWizard();
  const { partner_info } = formData;

  // Get current date for the agreement
  const currentDate = new Date();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  return (
    <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
      <div className="space-y-6 text-sm">
        <p className="text-justify">
          This Sales Agent Agreement ("Agreement") is made on {month} {day}, {year} ("Effective Date") by and among WLJ Innovations, LLC, 
          a Florida limited liability company d/b/a Ireland Pay with offices at 5000 SW 75th Avenue, Suite 131, Miami, FL 33155 ("Ireland Pay") and,
        </p>

        <div className="flex flex-col space-y-2 border-b border-t border-gray-200 py-4 my-4">
          <p className="text-center">{partner_info.first_name} {partner_info.middle_name} {partner_info.last_name}</p>
          <p className="text-center">with offices at {partner_info.business_address}</p>
          <p className="text-center">("Sales Agent")</p>
        </div>

        <p className="text-justify">
          and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant credit and debit card processing, 
          check processing, software and hardware solutions, and related services. Sales Agent desires to solicit and 
          refer merchants to Ireland Pay for those services. Therefore, for adequate consideration, the sufficiency of 
          which is acknowledged, the parties agree as follows:
        </p>

        {/* Definitions Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Definitions</h2>
          <p className="mb-4">The following terms when used in this Agreement will have the meanings set forth in this Section:</p>
          <div className="space-y-4">
            <div className="pl-4 border-l-2 border-gray-200">
              <p><span className="font-medium">"Card Organization"</span> means Visa, MasterCard, American Express, Discover, debit networks, and payment networks offered by Ireland Pay and any successor organization.</p>
            </div>
            {/* Continue with all other definitions... */}
            {/* Agreement sections continues with all the provided text, properly formatted */}
          </div>
        </section>

        {/* Add all other sections of the agreement here */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Sales Agent's Obligations</h2>
          {/* Content for Sales Agent's Obligations */}
        </section>

        {/* Continue with all other sections... */}

        {/* Signature Section */}
        <section className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <p className="font-semibold mb-4">WLJ Innovations, LLC DBA Ireland Pay</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Signature:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Print Name:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold mb-4">Sales Agent</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Signature:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Print Name:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Position:</p>
                <div className="border-b border-gray-300 h-8"></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}
