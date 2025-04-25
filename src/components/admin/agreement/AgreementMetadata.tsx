
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AgreementMetadataProps {
  agreement: any; // We'll type this properly when we have the full schema
}

export default function AgreementMetadata({ agreement }: AgreementMetadataProps) {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
      submitted: "bg-blue-100 text-blue-800 border-blue-200",
      signed: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || ""}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agreement Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <div className="mt-1">{getStatusBadge(agreement.status)}</div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Created</p>
          <p className="mt-1">{format(new Date(agreement.created_at), "PPP")}</p>
        </div>

        {agreement.signed_at && (
          <div>
            <p className="text-sm font-medium text-gray-500">Signed</p>
            <p className="mt-1">{format(new Date(agreement.signed_at), "PPP")}</p>
          </div>
        )}

        <div>
          <p className="text-sm font-medium text-gray-500">Document Type</p>
          <p className="mt-1">{agreement.document_type}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Agreement ID</p>
          <p className="mt-1 font-mono text-sm">{agreement.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}
