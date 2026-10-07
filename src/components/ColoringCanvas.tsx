import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { ColoringPage } from '../data/pages';
import { floodFill } from '../utils/floodFill';

export interface ColoringCanvasHandle {
  undo: () => void;
  reset: () => void;
  saveImage: () => void;
  canUndo: boolean;
}

interface ColoringCanvasProps {
  currentPage: ColoringPage;
  currentColor: string;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const MAX_UNDO_STACK = 20;

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, ColoringCanvasProps>(
  ({ currentPage, currentColor, onCanUndoChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const historyStack = useRef<ImageData[]>([]);
    const [historyLength, setHistoryLength] = useState<number>(0);

    // Redraw and reset lineart for current page
    const renderBasePage = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Draw the crisp line art template
      currentPage.renderLineArt(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Save initial state as base snapshot
      const baseState = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      historyStack.current = [baseState];
      setHistoryLength(1);
      if (onCanUndoChange) onCanUndoChange(false);
    }, [currentPage, onCanUndoChange]);

    // Re-render when selected page changes
    useEffect(() => {
      renderBasePage();
    }, [renderBasePage]);

    // Handle canvas click / touch for flood fill
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const clickX = Math.floor((e.clientX - rect.left) * scaleX);
      const clickY = Math.floor((e.clientY - rect.top) * scaleY);

      // Save state before modification for undo
      const preFillState = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Execute optimized flood fill
      const filled = floodFill(ctx, clickX, clickY, currentColor, 36);

      if (filled) {
        // Push state to undo stack
        historyStack.current.push(preFillState);
        if (historyStack.current.length > MAX_UNDO_STACK) {
          historyStack.current.shift();
        }
        setHistoryLength(historyStack.current.length);
        if (onCanUndoChange) onCanUndoChange(true);
      }
    };

    // Undo action
    const handleUndo = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || historyStack.current.length <= 1) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const previousState = historyStack.current.pop();
      if (previousState) {
        ctx.putImageData(previousState, 0, 0);
        setHistoryLength(historyStack.current.length);
        if (onCanUndoChange) {
          onCanUndoChange(historyStack.current.length > 1);
        }
      }
    }, [onCanUndoChange]);

    // Reset action
    const handleReset = useCallback(() => {
      renderBasePage();
    }, [renderBasePage]);

    // Save as high-res PNG
    const handleSave = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Create download anchor
      const link = document.createElement('a');
      link.download = `Our-Craft-${currentPage.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, [currentPage.id]);

    // Expose handle methods to parent component
    useImperativeHandle(
      ref,
      () => ({
        undo: handleUndo,
        reset: handleReset,
        saveImage: handleSave,
        canUndo: historyLength > 1,
      }),
      [handleUndo, handleReset, handleSave, historyLength]
    );

    return (
      <div className="relative w-full aspect-square max-w-[620px] mx-auto rounded-3xl bg-white shadow-[0_12px_45px_rgba(40,25,25,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-stone-200/80 dark:border-white/10 p-2 sm:p-4 overflow-hidden flex items-center justify-center select-none">
        {/* Subtle watercolor paper grain texture background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#a8a29e_1px,transparent_1px)] [background-size:12px_12px]"
          aria-hidden="true"
        />

        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain rounded-2xl cursor-crosshair active:scale-[0.998] transition-transform"
          style={{ imageRendering: 'auto' }}
          aria-label={currentPage.title.es}
          role="img"
        />
      </div>
    );
  }
);

ColoringCanvas.displayName = 'ColoringCanvas';
