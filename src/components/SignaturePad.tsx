import React, { useRef, useEffect } from 'react';

interface SignaturePadProps {
  onEnd: (signature: string) => void;
}

export default function SignaturePad({ onEnd }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ctx.current = canvas.getContext('2d');
    if (!ctx.current) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set up drawing style
    const context = ctx.current;
    context.strokeStyle = '#000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas || !ctx.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.current.beginPath();
    ctx.current.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !ctx.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.current.lineTo(x, y);
    ctx.current.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing.current || !canvasRef.current) return;

    isDrawing.current = false;
    onEnd(canvasRef.current.toDataURL());
  };

  const clearSignature = () => {
    if (!ctx.current || !canvasRef.current) return;

    ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onEnd('');
  };

  return (
    <div className="space-y-2">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-40 touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
      </div>
      <button
        type="button"
        onClick={clearSignature}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Effacer la signature
      </button>
    </div>
  );
}