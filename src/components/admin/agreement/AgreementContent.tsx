
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import AgreementAttachments from "@/components/agreements/AgreementAttachments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Agreement Content</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content">
            <div className="border rounded-lg p-6 bg-gray-50">
              <div className="prose max-w-none">
                {/* Format and display the document data */}
                <pre className="text-sm whitespace-pre-wrap">
                  {JSON.stringify(agreement.document_data, null, 2)}
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="attachments">
            <AgreementAttachments 
              agreementId={agreement.id} 
              showUploadControls={true} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

