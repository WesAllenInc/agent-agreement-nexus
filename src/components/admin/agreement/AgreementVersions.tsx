import { useState } from 'react';
import { format } from 'date-fns';
import { useAgreementVersions } from '@/hooks/useAgreementVersions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, FileText, History, GitCompare } from 'lucide-react';
import { PdfViewer } from '@/components/PdfViewer';

interface AgreementVersionsProps {
  agreementId: string;
}

export function AgreementVersions({ agreementId }: AgreementVersionsProps) {
  const { versions, isLoading, getVersionDownloadUrl, compareVersions } = useAgreementVersions(agreementId);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [version1, setVersion1] = useState<string | null>(null);
  const [version2, setVersion2] = useState<string | null>(null);
  const [comparisonUrls, setComparisonUrls] = useState<{
    oldVersion: { url: string; versionNumber: number; createdAt: string };
    newVersion: { url: string; versionNumber: number; createdAt: string };
  } | null>(null);

  const handleViewVersion = async (versionId: string) => {
    const version = versions?.find(v => v.id === versionId);
    if (version) {
      const url = await getVersionDownloadUrl(version);
      setSelectedVersion(url || null);
    }
  };

  const handleCompareVersions = async () => {
    if (!version1 || !version2 || !versions) return;

    const v1 = versions.find(v => v.id === version1);
    const v2 = versions.find(v => v.id === version2);

    if (v1 && v2) {
      const comparison = await compareVersions(v1, v2);
      setComparisonUrls(comparison);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Version History</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          View and compare different versions of this agreement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant={compareMode ? "secondary" : "outline"}
              onClick={() => setCompareMode(!compareMode)}
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare Versions
            </Button>
          </div>

          {compareMode ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Version</label>
                  <Select value={version1 || ''} onValueChange={setVersion1}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version..." />
                    </SelectTrigger>
                    <SelectContent>
                      {versions?.map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                          Version {version.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Second Version</label>
                  <Select value={version2 || ''} onValueChange={setVersion2}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select version..." />
                    </SelectTrigger>
                    <SelectContent>
                      {versions?.map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                          Version {version.version_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleCompareVersions}
                disabled={!version1 || !version2}
              >
                Compare
              </Button>
              {comparisonUrls && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Version {comparisonUrls.oldVersion.versionNumber}
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(new Date(comparisonUrls.oldVersion.createdAt), 'PP')}
                      </span>
                    </h4>
                    <div className="h-[600px] border rounded">
                      <PdfViewer url={comparisonUrls.oldVersion.url} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Version {comparisonUrls.newVersion.versionNumber}
                      <span className="text-xs text-muted-foreground ml-2">
                        {format(new Date(comparisonUrls.newVersion.createdAt), 'PP')}
                      </span>
                    </h4>
                    <div className="h-[600px] border rounded">
                      <PdfViewer url={comparisonUrls.newVersion.url} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {versions?.map((version) => (
                <div
                  key={version.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">Version {version.version_number}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(version.created_at), 'PPp')}
                    </p>
                    {version.changes_summary && (
                      <p className="text-sm mt-1">{version.changes_summary}</p>
                    )}
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-[800px]">
                      <DialogHeader>
                        <DialogTitle>
                          Version {version.version_number}
                        </DialogTitle>
                        <DialogDescription>
                          Created on {format(new Date(version.created_at), 'PPp')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex-1 -mx-6 -mb-6">
                        {selectedVersion && <PdfViewer url={selectedVersion} />}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

