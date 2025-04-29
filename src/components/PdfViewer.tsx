import { useEffect, useRef, useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PdfViewerProps {
  url: string | Promise<string | null>;
  onDownload?: () => void;
}

export function PdfViewer({ url, onDownload }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const resolveUrl = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = typeof url === 'string' ? url : await url;
        if (!result) {
          throw new Error('Failed to load PDF URL');
        }
        setResolvedUrl(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
        setLoading(false);
      }
    };

    resolveUrl();
  }, [url]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => setLoading(false);
    }
  }, [resolvedUrl]);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  
  const nextPage = () => setPageNumber(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));

  if (error) {
    return (
      <Card className="w-full h-full flex items-center justify-center">
        <div className="text-destructive text-center p-4">
          <p className="font-semibold">Error loading PDF</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <div className="p-2 border-b flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevPage}
            disabled={pageNumber === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={nextPage}
            disabled={pageNumber === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={scale <= 0.5}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 2}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {onDownload && (
            <Button
              variant="outline"
              size="icon"
              onClick={onDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 relative overflow-auto"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
        {resolvedUrl && (
          <iframe
            ref={iframeRef}
            src={`${resolvedUrl}#page=${pageNumber}`}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        )}
      </div>
    </Card>
  );
}
