
import { useWizard } from "../WizardContext";
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
    <ScrollArea className="h-[70vh] w-full rounded-md border p-4">
      <div className="space-y-6 text-sm">
        {/* Introduction Section */}
        <div className="space-y-4">
          <p className="text-justify">
            This Sales Agent Agreement ("Agreement") is made on {month} {day}, {year} ("Effective Date") by and among WLJ Innovations, LLC, 
            a Florida limited liability company d/b/a Ireland Pay with offices at 5000 SW 75th Avenue, Suite 131, Miami, FL 33155 ("Ireland Pay") and,
          </p>

          {/* Agent Information */}
          <div className="flex flex-col space-y-2 border-b border-t border-gray-200 py-4 my-4">
            <p className="text-center">{partner_info.first_name} {partner_info.middle_name} {partner_info.last_name}</p>
            <p className="text-center">with offices at {partner_info.business_address}</p>
            <p className="text-center">{"(\"Sales Agent\")"}</p>
          </div>

          <p className="text-justify">
            and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant credit and debit card processing, 
            check processing, software and hardware solutions, and related services. Sales Agent desires to solicit and 
            refer merchants to Ireland Pay for those services. Therefore, for adequate consideration, the sufficiency of 
            which is acknowledged, the parties agree as follows:
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Definitions Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Definitions</h2>
            <p className="mb-4">The following terms when used in this Agreement will have the meanings set forth in this Section:</p>
            <div className="space-y-4">
              {definitions.map((def, index) => (
                <div key={index} className="pl-4 border-l-2 border-gray-200">
                  <p>
                    <span className="font-medium">{def.term}</span> {def.definition}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sales Agent's Obligations Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Sales Agent's Obligations</h2>
            <div className="space-y-4">
              {obligations.map((obligation, index) => (
                <div key={index} className="pl-4">
                  <p className="font-medium mb-2">{obligation.title}</p>
                  <p className="text-justify">{obligation.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Continue with all other sections similarly structured */}
        </div>

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

// Agreement text data
const definitions = [
  {
    term: '"Card Organization"',
    definition: 'means Visa, MasterCard, American Express, Discover, debit networks, and payment networks offered by Ireland Pay and any successor organization.'
  },
  {
    term: '"Confidential Information"',
    definition: 'means information disclosed to Sales Agent by Ireland Pay or gained by Sales Agent in the course of its relationship with Ireland Pay including but not limited to information relating to the business of Ireland Pay (Merchant contact information, Merchant identification numbers, Merchant data, transaction information, cardholder account numbers and information, pricing, the terms of this Agreement, which the parties agree is Ireland Pay\'s Confidential Information), programs, devices, trade secrets, methods, processes, financial data, information identifying other independent sales offices that do business with Ireland Pay, lists of Ireland Pay customers or suppliers, computer access codes, instruction and/or procedural manuals, business and financial plans, and any other data or information which is competitively sensitive and not generally known to the public.'
  },
  // ... Add all other definitions
];

const obligations = [
  {
    title: 'Responsibilities of Sales Agent',
    content: 'On an exclusive basis, Sales Agent will market the Services and will encourage all prospective Merchants that comply with Ireland Pay\'s credit criteria to become Merchants. Agent will assist potential Merchants in completing all documentation required for application to the Merchant Program and will submit completed Merchant Agreements to Ireland Pay...'
  },
  {
    title: 'Site Inspections',
    content: 'Sales Agent will take all action necessary to verify that each prospective Merchant conducts a bona fide business operation, including but not limited to inspecting the Merchant\'s premises to determine whether Merchant has the proper facilities, equipment, inventory and license or permit, if necessary, to conduct its business.'
  },
  // ... Add all other obligations
];

