
export default function AgreementSignatures() {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Signatures</h2>
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
  );
}

