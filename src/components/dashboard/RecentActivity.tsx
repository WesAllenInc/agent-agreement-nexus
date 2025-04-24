
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TimelineEvent } from "@/types";
import { format, formatDistanceToNow } from "date-fns";

interface RecentActivityProps {
  events: TimelineEvent[];
}

export default function RecentActivity({ events }: RecentActivityProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "invitation":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-600"
            >
              <rect width="16" height="13" x="4" y="7" rx="2" />
              <path d="m5 7 7 6 7-6" />
            </svg>
          </div>
        );
      case "agreement":
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
              <line x1="9" x2="15" y1="9" y2="9" />
              <line x1="9" x2="15" y1="13" y2="13" />
              <line x1="9" x2="15" y1="17" y2="17" />
            </svg>
          </div>
        );
      case "signature":
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-purple-600"
            >
              <path d="M20 19.5v.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8.5L18 5.5" />
              <path d="M18 12a4.5 4.5 0 0 0-2.1-3.8c-.5-.3-1.2-.4-1.6 0-.7.7-.7 2.1 0 2.8 2 2 3 4 3 6" />
              <line x1="14" x2="14" y1="12" y2="16" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
          </div>
        );
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "invitation":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            Invitation
          </Badge>
        );
      case "agreement":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            Agreement
          </Badge>
        );
      case "signature":
        return (
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
            Signature
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            Activity
          </Badge>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Recent events in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="flex gap-4">
              {getEventIcon(event.type)}
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium leading-none">
                    {event.title}
                  </p>
                  {getEventBadge(event.type)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(event.timestamp))} ago
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
