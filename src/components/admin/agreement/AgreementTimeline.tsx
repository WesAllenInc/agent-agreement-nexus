
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Edit, Check } from "lucide-react";

interface AgreementTimelineProps {
  agreement: any; // We'll type this properly when we have the full schema
}

export default function AgreementTimeline({ agreement }: AgreementTimelineProps) {
  const events = [
    {
      date: new Date(agreement.created_at),
      title: "Agreement Created",
      description: "Agreement was created and saved as draft",
      icon: FileText,
    },
    ...(agreement.updated_at !== agreement.created_at ? [
      {
        date: new Date(agreement.updated_at),
        title: "Agreement Updated",
        description: "Changes were made to the agreement",
        icon: Edit,
      }
    ] : []),
    ...(agreement.signed_at ? [
      {
        date: new Date(agreement.signed_at),
        title: "Agreement Signed",
        description: "Agreement was signed by all parties",
        icon: Check,
      }
    ] : []),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4">
          {events.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-none">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <event.icon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 pt-1.5">
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {format(event.date, "PPp")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
