
import { useWizard } from "../WizardContext";

export default function AgreementScheduleB() {
  const { formData, setFormData } = useWizard();

  const handleTableChange = (tableType: 'offices' | 'agents', rowIndex: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule_b: {
        ...prev.schedule_b || {},
        [tableType]: {
          ...(prev.schedule_b?.[tableType] || {}),
          [rowIndex]: {
            ...(prev.schedule_b?.[tableType]?.[rowIndex] || {}),
            [field]: value
          }
        }
      }
    }));
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Schedule B - Sales Offices and Sales Agents</h2>
      <div className="space-y-8">
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
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.offices?.[i]?.name || ''}
                    onChange={(e) => handleTableChange('offices', i, 'name', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.offices?.[i]?.address || ''}
                    onChange={(e) => handleTableChange('offices', i, 'address', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="tel"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.offices?.[i]?.phone || ''}
                    onChange={(e) => handleTableChange('offices', i, 'phone', e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

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
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.agents?.[i]?.name || ''}
                    onChange={(e) => handleTableChange('agents', i, 'name', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.agents?.[i]?.address || ''}
                    onChange={(e) => handleTableChange('agents', i, 'address', e.target.value)}
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="text"
                    className="w-full p-1 bg-transparent"
                    value={formData.schedule_b?.agents?.[i]?.ssn || ''}
                    onChange={(e) => handleTableChange('agents', i, 'ssn', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
