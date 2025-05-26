import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CertificateBadgeProps {
  available: boolean;
  url?: string;
}

export const CertificateBadge: React.FC<CertificateBadgeProps> = ({ available, url }) => {
  if (!available) return null;
  return (
    <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
      <CheckCircle className="h-3 w-3 mr-1" />
      Certificate Available
      {url && (
        <Button
          asChild
          size="xs"
          variant="ghost"
          className="ml-2 px-2 py-0 text-xs"
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Download className="h-3 w-3 mr-1 inline" />Download
          </a>
        </Button>
      )}
    </Badge>
  );
};
