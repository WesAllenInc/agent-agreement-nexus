
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface AgreementContentProps {
  agreement: any; // We'll type this properly when we have the full schema
}

export default function AgreementContent({ agreement }: AgreementContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Agreement Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border rounded-lg p-6 bg-gray-50">
          <div className="prose max-w-none">
            {/* Format and display the document data */}
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(agreement.document_data, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

