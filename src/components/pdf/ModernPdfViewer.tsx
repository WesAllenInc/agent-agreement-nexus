import React, { useRef, useState, useEffect, useCallback } from "react";
// @ts-expect-error: If types for 'react-pdf' are missing, suppress error for now
import { Document, Page, pdfjs } from "react-pdf";
// If you have type errors, run: npm install --save-dev @types/react-pdf (if available)

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Search,
  Highlighter,
  Pencil,
  MessageCircle,
  X,
  Loader2,
  Fullscreen,
} from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useRealtimePresence } from "@/hooks/useRealtimePresence";
import PresenceAvatars from "../collaboration/PresenceAvatars";
import { useAuth } from "@/contexts/AuthContext";
import PdfCommentInput from "./PdfCommentInput";
import { useComments } from "@/hooks/useComments";

interface ModernPdfViewerProps {
  url: string;
  initialPage?: number;
  onDownload?: () => void;
  onPrint?: () => void;
}

export const ModernPdfViewer: React.FC<ModernPdfViewerProps> = ({
  url,
  initialPage = 1,
  onDownload,
  onPrint,
}) => {
  const { user } = useAuth?.() || {};
  // Real-time presence
  const presenceChannel = url ? `agreement-${encodeURIComponent(url)}-presence` : undefined;
  // Get avatar from user_metadata if present
  const avatar_url = user?.user_metadata?.avatar_url || undefined;
  const username = user?.email || "Anonymous";
  const { users: presentUsers, updatePresence } = useRealtimePresence(
    presenceChannel && user
      ? {
          channel: presenceChannel,
          userInfo: {
            user_id: user?.id || "anon",
            username,
            avatar_url,
          },
        }
      : { channel: "", userInfo: { user_id: "anon", username: "Anonymous" } }
  );

  // Cursor tracking (single ref definition)
  const viewerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!updatePresence || !viewerRef.current) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = viewerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setCursor({ x, y });
      updatePresence({ cursor: { x, y } });
    };
    viewerRef.current.addEventListener("mousemove", handleMouseMove);
    return () => {
      viewerRef.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, [updatePresence]);

  // Typing indicator for comments/annotations
  const [isTyping, setIsTyping] = useState(false);
  const handleCommentInput = (typing: boolean) => {
    setIsTyping(typing);
    updatePresence?.({ typing });
  };

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(initialPage);
  const [scale, setScale] = useState<number>(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [annotationMode, setAnnotationMode] = useState<"none" | "highlight" | "draw" | "comment">("none");

  // Derive agreementId from url (assuming url is a file path or signed URL containing id, or pass as prop)
  // For now, extract id from url by splitting on '/' and taking the last segment before file extension
  const agreementId = url?.split('/').slice(-1)[0]?.split('.')[0] || '';
  const { comments, loading: commentsLoading, error: commentsError, addComment } = useComments(agreementId, user);

  // Add comment handler
  const handleAddComment = async (text: string) => {
    await addComment(text);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPageNumber((p) => Math.min(p + 1, numPages));
      if (e.key === "ArrowLeft") setPageNumber((p) => Math.max(p - 1, 1));
      if (e.key === "+" || e.key === "=") setScale((s) => Math.min(s + 0.1, 2));
      if (e.key === "-") setScale((s) => Math.max(s - 0.1, 0.5));
      if (e.key === "f" || e.key === "F") setFullscreen((f) => !f);
      if (e.key === "/") {
        e.preventDefault();
        setTimeout(() => {
          const searchInput = document.getElementById("pdf-search-input");
          if (searchInput) (searchInput as HTMLInputElement).focus();
        }, 0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages]);

  // Touch gestures for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let lastScale = scale;
    let pinchDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastScale = scale;
      } else if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scaleChange = newDist / pinchDist;
        setScale(Math.max(0.5, Math.min(2, lastScale * scaleChange)));
      } else if (e.touches.length === 1 && containerRef.current) {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        containerRef.current.scrollLeft -= dx;
        containerRef.current.scrollTop -= dy;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }
    };
    const ref = viewerRef.current;
    if (ref) {
      ref.addEventListener("touchstart", handleTouchStart, { passive: false });
      ref.addEventListener("touchmove", handleTouchMove, { passive: false });
    }
    return () => {
      if (ref) {
        ref.removeEventListener("touchstart", handleTouchStart);
        ref.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, [scale]);

  // Fullscreen
  useEffect(() => {
    if (fullscreen && viewerRef.current) {
      if (viewerRef.current.requestFullscreen) viewerRef.current.requestFullscreen();
    } else if (!fullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [fullscreen]);

  // PDF Load
  const onDocumentLoadSuccess = useCallback((pdf: any) => {
    setNumPages(pdf.numPages);
    setLoading(false);
  }, []);

  // Search (basic, per page)
  // For demo: highlight search bar and page navigation, not deep text search
  const handleSearch = () => {
    // Placeholder for search logic
    setSearchResults([]);
    setSearchIndex(0);
  };

  // Annotation tool UI (no backend integration)
  const annotationTools = [
    { mode: "highlight", icon: <Highlighter className="w-4 h-4" />, label: "Highlight" },
    { mode: "draw", icon: <Pencil className="w-4 h-4" />, label: "Draw" },
    { mode: "comment", icon: <MessageCircle className="w-4 h-4" />, label: "Comment" },
  ];

  return (
    <Card className="relative w-full h-full flex flex-col shadow-xl rounded-lg overflow-hidden">
      {/* Presence Avatars */}
      {presentUsers.length > 1 && (
        <div className="absolute left-4 top-2 z-20">
          <PresenceAvatars users={presentUsers} currentUserId={user?.id || "anon"} />
        </div>
      )}
      {/* Live cursors of other users */}
      <div className="absolute inset-0 pointer-events-none z-30">
        {presentUsers.filter(u => u.user_id !== (user?.id || "anon") && u.cursor).map(u => (
          <div
            key={u.user_id}
            className="absolute transition-transform duration-75"
            style={{
              left: `${(u.cursor!.x * 100).toFixed(2)}%`,
              top: `${(u.cursor!.y * 100).toFixed(2)}%`,
              transform: "translate(-50%, -50%)"
            }}
            title={u.username}
          >
            <img
              src={u.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${u.user_id}`}
              alt={u.username}
              className="w-7 h-7 rounded-full border-2 border-primary shadow"
            />
            {u.typing && (
              <span className="block text-xs bg-primary text-white rounded px-1 mt-0.5">Typing…</span>
            )}
          </div>
        ))}
      </div>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card z-10">
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreen((f) => !f)}
            aria-label={fullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {fullscreen ? <Minimize2 /> : <Maximize2 />}
          </Button>
          <span className="text-xs min-w-[80px] text-center">
            Page {pageNumber} / {numPages || "-"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber === 1}
            aria-label="Previous page"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber === numPages}
            aria-label="Next page"
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
            disabled={scale <= 0.5}
            aria-label="Zoom out"
          >
            <ZoomOut />
          </Button>
          <span className="text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
            disabled={scale >= 2}
            aria-label="Zoom in"
          >
            <ZoomIn />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFullscreen((f) => !f)}
            aria-label="Fullscreen"
          >
            {fullscreen ? <Fullscreen /> : <Fullscreen />}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Search">
                <Search />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-80 max-w-full">
              <div className="flex flex-col gap-2">
                <Input
                  id="pdf-search-input"
                  placeholder="Search in PDF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleSearch} size="sm">Search</Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={searchResults.length === 0}
                    onClick={() => setSearchIndex((i) => Math.max(0, i - 1))}
                  >Prev</Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={searchResults.length === 0}
                    onClick={() => setSearchIndex((i) => Math.min(searchResults.length - 1, i + 1))}
                  >Next</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {onDownload && (
            <Button variant="ghost" size="icon" onClick={onDownload} aria-label="Download">
              <Download />
            </Button>
          )}
          {onPrint && (
            <Button variant="ghost" size="icon" onClick={onPrint} aria-label="Print">
              <Printer />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-1">
          {annotationTools.map((tool) => (
            <Button
              key={tool.mode}
              variant={annotationMode === tool.mode ? "default" : "ghost"}
              size="icon"
              onClick={() => setAnnotationMode(tool.mode as typeof annotationMode)}
              aria-label={tool.label}
            >
              {tool.icon}
            </Button>
          ))}
        </div>
      </div>
      {/* PDF Viewer */}
      <div
        ref={viewerRef}
        className="flex-1 overflow-auto bg-muted relative touch-pan-x touch-pan-y"
        tabIndex={0}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div ref={containerRef} className="flex items-center justify-center h-full w-full">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                className="absolute inset-0 flex items-center justify-center bg-background/80 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Loader2 className="h-8 w-8 animate-spin" />
              </motion.div>
            )}
            <motion.div
              key={pageNumber}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="w-full flex items-center justify-center"
            >
              <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={null}
                className="w-full h-full"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  width={containerRef.current?.clientWidth || undefined}
                  loading={null}
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  className="mx-auto shadow-lg rounded-lg"
                />
              </Document>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Annotation UI placeholder */}
      {annotationMode !== "none" && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card shadow-lg rounded-lg px-4 py-2 flex items-center gap-2 z-20">
          <span className="text-xs font-medium">{annotationMode.charAt(0).toUpperCase() + annotationMode.slice(1)} mode (UI only)</span>
          <Button size="icon" variant="ghost" onClick={() => setAnnotationMode("none")}> <X /> </Button>
        </div>
      )}
      {/* Comments Section (Optimistic + Typing) */}
      <div className="bg-muted px-4 py-3 border-t">
        <h3 className="text-sm font-semibold mb-2">Comments</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto mb-2">
          {comments.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <img src={c.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${c.user_id}`} alt={c.username} className="w-6 h-6 rounded-full border" />
              <span className="text-xs font-bold">{c.username}</span>
              <span className="text-xs">{c.text}</span>
              {c.optimistic && <span className="text-xs text-muted-foreground">(sending...)</span>}
            </div>
          ))}
          {/* Typing indicator for others */}
          {presentUsers.filter(u => u.user_id !== (user?.id || "anon") && u.typing).map(u => (
            <div key={u.user_id + '-typing'} className="flex items-center gap-2 text-xs text-muted-foreground">
              <img src={u.avatar_url || `https://api.dicebear.com/6.x/identicon/svg?seed=${u.user_id}`} alt={u.username} className="w-5 h-5 rounded-full border" />
              <span>{u.username} is typing…</span>
            </div>
          ))}
        </div>
        <PdfCommentInput
          onSubmit={handleAddComment}
          onTyping={handleCommentInput}
          disabled={annotationMode !== 'comment'}
        />
      </div>
    </Card>
  );
};

export default ModernPdfViewer;
