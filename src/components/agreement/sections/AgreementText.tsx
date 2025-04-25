
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
        <div className="space-y-4 text-justify">
          <p>
            This Sales Agent Agreement ("Agreement") is made on {month} {day}, {year} ("Effective Date") by and among WLJ Innovations, LLC, 
            a Florida limited liability company d/b/a Ireland Pay with offices at 5000 SW 75th Avenue, Suite 131, Miami, FL 33155 ("Ireland Pay") and,
          </p>

          {/* Agent Information */}
          <div className="flex flex-col space-y-2 border-b border-t border-gray-200 py-4 my-4">
            <p className="text-center">{partner_info.first_name} {partner_info.middle_name} {partner_info.last_name}</p>
            <p className="text-center">with offices at {partner_info.business_address}</p>
            <p className="text-center">{"(\"Sales Agent\")"}</p>
          </div>

          <p>
            and the Guarantor(s) listed on Schedule C. Ireland Pay provides merchant credit and debit card processing, 
            check processing, software and hardware solutions, and related services. Sales Agent desires to solicit and 
            refer merchants to Ireland Pay for those services. Therefore, for adequate consideration, the sufficiency of 
            which is acknowledged, the parties agree as follows:
          </p>
        </div>

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

        {/* Sales Agent's Obligations */}
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

        {/* Names and Trademarks */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Names and Trademarks</h2>
          {namesAndTrademarks.map((section, index) => (
            <div key={index} className="mb-4 text-justify">
              <p className="font-medium mb-2">{section.title}</p>
              <p>{section.content}</p>
            </div>
          ))}
        </section>

        {/* Continue with other sections in a similar manner */}
        
        {/* Signature Section */}
        <section className="mt-8">
          <div className="grid grid-cols-2 gap-8">
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
          </div>
        </section>

        {/* Schedules */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Schedule B - Sales Offices and Sales Agents</h2>
          <div className="space-y-8">
            {/* Sales Offices Table */}
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Sales Office Name</th>
                    <th className="border p-2 text-left">Address</th>
                    <th className="border p-2 text-left">Phone Number</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="border p-2">&nbsp;</td>
                      <td className="border p-2">&nbsp;</td>
                      <td className="border p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sales Agents Table */}
            <div>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left">Sales Agent Name</th>
                    <th className="border p-2 text-left">Address</th>
                    <th className="border p-2 text-left">Social Security Number</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="border p-2">&nbsp;</td>
                      <td className="border p-2">&nbsp;</td>
                      <td className="border p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Schedule C */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Schedule C - Personal Guarantee</h2>
          <div className="space-y-4">
            <p className="text-justify">
              As a primary inducement to Ireland Pay to enter into this Agreement, the Guarantor(s) indicated below
              jointly and severally, unconditionally, and irrevocably, guarantee the continuing full and faithful performance
              and payment by Sales Agent of each if its duties and obligations to Ireland Pay pursuant to the Agreement
              as it now exists or may be amended from time to time, with or without notice.
            </p>
            {/* Guarantor Signature Fields */}
            <div className="space-y-8 mt-8">
              {[1, 2].map((num) => (
                <div key={num} className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Personal Guarantor Printed Name</p>
                    <div className="border-b border-gray-300 h-8"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Personal Guarantor Signature</p>
                    <div className="border-b border-gray-300 h-8"></div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <div className="border-b border-gray-300 h-8"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ScrollArea>
  );
}

// Agreement text data structures
const definitions = [
  {
    term: '"Card Organization"',
    definition: 'means Visa, MasterCard, American Express, Discover, debit networks, and payment networks offered by Ireland Pay and any successor organization.'
  },
  // ... Add all other definitions
];

const obligations = [
  {
    title: 'Responsibilities of Sales Agent',
    content: 'On an exclusive basis, Sales Agent will market the Services and will encourage all prospective Merchants that comply with Ireland Pay\'s credit criteria to become Merchants...'
  },
  // ... Add all other obligations
];

const namesAndTrademarks = [
  {
    title: 'Ireland Pay Name and Trademark',
    content: 'Ireland Pay owns all right, title, and interest in and to the Ireland Pay name and trademark...'
  },
  // ... Add other trademark sections
];
