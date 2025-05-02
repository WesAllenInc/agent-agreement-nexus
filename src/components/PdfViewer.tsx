import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, 
  RotateCw, Download, Printer, Maximize, Minimize,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfViewerProps {
  pdfUrl: string;
  className?: string;
  onDownload?: () => void;
}

interface ToolbarProps {
  pageNumber: number;
  numPages: number | null;
  sidebarOpen: boolean;
  isFullscreen: boolean;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleRotate: () => void;
  handleDownload: () => void;
  handlePrint: () => void;
  toggleFullscreen: () => void;
  toggleSidebar: () => void;
}

interface ThumbnailProps {
  index: number;
  pageNumber: number;
  pdfUrl: string;
  setPageNumber: (pageNumber: number) => void;
}

interface SidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  numPages: number | null;
  pageNumber: number;
  pdfUrl: string;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

interface MobileNavigationProps {
  isMobile: boolean;
  scale: number;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  numPages: number | null;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}

// Loading indicator component
const PdfLoadingIndicator = memo(() => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
    <p className="text-muted-foreground">Loading PDF...</p>
  </div>
));
PdfLoadingIndicator.displayName = 'PdfLoadingIndicator';

// Toolbar component
const Toolbar = memo(({
  pageNumber, 
  numPages, 
  sidebarOpen, 
  isFullscreen,
  handlePreviousPage, 
  handleNextPage, 
  handleZoomIn, 
  handleZoomOut, 
  handleRotate, 
  handleDownload, 
  handlePrint, 
  toggleFullscreen, 
  toggleSidebar 
}: ToolbarProps) => (
  <div className="flex items-center justify-between p-2 border-b bg-gray-50">
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleSidebar}
        className="hidden md:flex"
      >
        {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </Button>
      
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousPage}
          disabled={pageNumber <= 1}
          className="h-8 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm mx-2">
          {pageNumber} / {numPages || "?"}
        </span>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextPage}
          disabled={numPages === null || pageNumber >= numPages}
          className="h-8 px-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    <div className="hidden md:flex items-center gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={false}>
              <ZoomOut className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom Out</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={false}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Zoom In</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleRotate}>
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Download</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4 mr-2" /> Zoom In
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4 mr-2" /> Zoom Out
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRotate}>
          <RotateCw className="h-4 w-4 mr-2" /> Rotate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" /> Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" /> Print
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleFullscreen}>
          {isFullscreen ? (
            <>
              <Minimize className="h-4 w-4 mr-2" /> Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize className="h-4 w-4 mr-2" /> Fullscreen
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleSidebar} className="md:hidden">
          {sidebarOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4 mr-2" /> Hide Sidebar
            </>
          ) : (
            <>
              <PanelLeftOpen className="h-4 w-4 mr-2" /> Show Sidebar
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
));
Toolbar.displayName = 'Toolbar';

// Thumbnail component
const Thumbnail = memo(({ 
  index, 
  pageNumber, 
  pdfUrl, 
  setPageNumber 
}: ThumbnailProps) => (
  <button
    key={`thumb-${index}`}
    onClick={() => setPageNumber(index + 1)}
    className={cn(
      "p-2 w-full transition-colors",
      pageNumber === index + 1 ? "bg-primary-50 border-l-2 border-primary" : "hover:bg-gray-100"
    )}
  >
    <div className="aspect-[3/4] bg-white rounded border shadow-sm overflow-hidden">
      <Document file={pdfUrl} loading={null}>
        <Page
          pageNumber={index + 1}
          width={100}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
    <div className="text-xs mt-1 text-center">Page {index + 1}</div>
  </button>
));
Thumbnail.displayName = 'Thumbnail';

// Sidebar component
const Sidebar = memo(({ 
  sidebarOpen, 
  isMobile, 
  numPages, 
  pageNumber, 
  pdfUrl, 
  setPageNumber 
}: SidebarProps) => {
  if (!sidebarOpen || isMobile) return null;
  
  return (
    <div className="w-[120px] border-r overflow-y-auto bg-gray-50 flex-shrink-0">
      {numPages && Array.from(new Array(numPages)).map((_, index) => (
        <Thumbnail 
          key={index}
          index={index}
          pageNumber={pageNumber}
          pdfUrl={pdfUrl}
          setPageNumber={setPageNumber}
        />
      ))}
    </div>
  );
});
Sidebar.displayName = 'Sidebar';

// Mobile navigation component
const MobileNavigation = memo(({ 
  isMobile, 
  scale, 
  handleZoomOut, 
  handleZoomIn, 
  pageNumber, 
  setPageNumber, 
  numPages, 
  handlePreviousPage, 
  handleNextPage 
}: MobileNavigationProps) => {
  if (!isMobile) return null;
  
  return (
    <div className="p-2 border-t bg-gray-50 flex items-center justify-between">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomOut}
        disabled={scale <= 0.5}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPageNumber(1)}
          disabled={pageNumber <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={pageNumber <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm mx-2">
          {pageNumber} / {numPages || "?"}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={numPages === null || pageNumber >= numPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => numPages && setPageNumber(numPages)}
          disabled={numPages === null || pageNumber >= numPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleZoomIn}
        disabled={scale >= 3}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
    </div>
  );
});
MobileNavigation.displayName = 'MobileNavigation';

// Main PDF viewer component
const PdfViewer = memo(({ pdfUrl, className, onDownload }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isSmallScreen = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setPageNumber((prevPageNumber) => Math.max(prevPageNumber - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPageNumber((prevPageNumber) => 
      numPages ? Math.min(prevPageNumber + 1, numPages) : prevPageNumber
    );
  }, [numPages]);

  const handleZoomIn = useCallback(() => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  }, []);

  const handleRotate = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  }, []);

  const handleDownload = useCallback(() => {
    if (onDownload) {
      onDownload();
    } else {
      window.open(pdfUrl, "_blank");
    }
  }, [onDownload, pdfUrl]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open(pdfUrl);
    if (printWindow) {
      printWindow.addEventListener("load", () => {
        printWindow.print();
      });
    }
  }, [pdfUrl]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, [isFullscreen]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={cn(
        "flex flex-col h-full border rounded-lg bg-white overflow-hidden",
        isFullscreen && "fixed inset-0 z-50",
        className
      )}
    >
      <Toolbar 
        pageNumber={pageNumber}
        numPages={numPages}
        sidebarOpen={sidebarOpen}
        isFullscreen={isFullscreen}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        handleZoomIn={handleZoomIn}
        handleZoomOut={handleZoomOut}
        handleRotate={handleRotate}
        handleDownload={handleDownload}
        handlePrint={handlePrint}
        toggleFullscreen={toggleFullscreen}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
          numPages={numPages}
          pageNumber={pageNumber}
          pdfUrl={pdfUrl}
          setPageNumber={setPageNumber}
        />
        
        <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
          {loading && <PdfLoadingIndicator />}
          
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={null}
            className="max-w-full"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
      
      <MobileNavigation 
        isMobile={isMobile}
        scale={scale}
        handleZoomOut={handleZoomOut}
        handleZoomIn={handleZoomIn}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        numPages={numPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
});

PdfViewer.displayName = 'PdfViewer';

export default PdfViewer;
