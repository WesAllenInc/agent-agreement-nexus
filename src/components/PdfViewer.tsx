import ModernPdfViewer from './pdf/ModernPdfViewer';

interface PdfViewerProps {
  url: string | Promise<string | null>;
  onDownload?: () => void;
}

export function PdfViewer({ url, onDownload }: PdfViewerProps) {
  const [resolvedUrl, setResolvedUrl] = React.useState<string | null>(typeof url === 'string' ? url : null);
  React.useEffect(() => {
    if (typeof url === 'string') setResolvedUrl(url);
    else url.then(setResolvedUrl);
  }, [url]);

  if (!resolvedUrl) {
    return <div className="w-full h-full flex items-center justify-center text-muted-foreground">Loading PDF...</div>;
  }
  return (
    <ModernPdfViewer url={resolvedUrl} onDownload={onDownload} />
  );
}

