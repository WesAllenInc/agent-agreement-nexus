import { useRef, useState, useEffect, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";

interface SignatureCanvasProps {
  onSave: (signatureData: string) => void;
  existingSignature?: string;
}

const SignatureCanvas = memo(({ onSave, existingSignature }: SignatureCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!existingSignature);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
  // Initialize canvas once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get and store the context
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    
    contextRef.current = ctx;

    // Set white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw existing signature if available
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
      img.src = existingSignature;
    }
    
    // Cleanup function
    return () => {
      contextRef.current = null;
    };
  }, [existingSignature]);

  // Memoize event handlers to prevent unnecessary re-renders
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    setIsDrawing(true);
    
    // Get correct coordinates for both mouse and touch events
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    // Get correct coordinates for both mouse and touch events
    let clientX, clientY;
    
    if ('touches' in e) {
      e.preventDefault(); // Prevent scrolling on touch devices
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setHasSignature(true);
  }, [isDrawing]);

  const endDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    setHasSignature(false);
  }, []);

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const signatureData = canvas.toDataURL("image/png");
    onSave(signatureData);
  }, [onSave]);

  // Passive event listeners for better touch performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const options = { passive: false };
    
    const touchMoveHandler = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    canvas.addEventListener('touchmove', touchMoveHandler, options);
    
    return () => {
      canvas.removeEventListener('touchmove', touchMoveHandler);
    };
  }, []);

  return (
    <div className="signature-container">
      <div className="border border-gray-300 rounded-md bg-white mb-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
          className="w-full touch-none"
        />
      </div>
      <div className="flex justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
        >
          Clear
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={!hasSignature}
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
});

SignatureCanvas.displayName = 'SignatureCanvas';

export default SignatureCanvas;
