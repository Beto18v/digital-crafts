import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
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
  tolerance?: number;
  borderThreshold?: number;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const MAX_UNDO_STACK = 20;

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, ColoringCanvasProps>(
  (
    {
      currentPage,
      currentColor,
      tolerance = 36,
      borderThreshold = 130,
      onCanUndoChange,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const historyStack = useRef<ImageData[]>([]);
    const [historyLength, setHistoryLength] = useState<number>(0);
    const [paintRevision, setPaintRevision] = useState<number>(0);

    // Auto-save: Guarda automáticamente el estado actual del lienzo en localStorage
    useEffect(() => {
      if (paintRevision === 0) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(`coloring-canvas-state-${currentPage.id}`, dataUrl);
      } catch (err) {
        console.warn('[Auto-Save] Error saving canvas to localStorage:', err);
      }
    }, [paintRevision, currentPage.id]);

    // Redraw and reset lineart or restore saved state from localStorage
    const renderBasePage = useCallback(
      (forceOriginal: boolean = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        // Base pure white canvas background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const commitSnapshot = () => {
          if (!canvasRef.current) return;
          const currentCtx = canvasRef.current.getContext('2d', {
            willReadFrequently: true,
          });
          if (!currentCtx) return;
          const baseState = currentCtx.getImageData(
            0,
            0,
            CANVAS_WIDTH,
            CANVAS_HEIGHT
          );
          historyStack.current = [baseState];
          setHistoryLength(1);
          if (onCanUndoChange) onCanUndoChange(false);
        };

        const drawOriginalTemplate = () => {
          const hasRealImage =
            Boolean(currentPage.imagePath) &&
            !currentPage.imagePath.startsWith('/images/coloring-');

          if (hasRealImage) {
            const img = new Image();
            // Prevent canvas tainting for getImageData and flood fill reading
            img.crossOrigin = 'anonymous';

            img.onload = () => {
              if (!canvasRef.current) return;
              const currentCtx = canvasRef.current.getContext('2d', {
                willReadFrequently: true,
              });
              if (!currentCtx) return;

              currentCtx.fillStyle = '#ffffff';
              currentCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

              // Calculate scaling to preserve aspect ratio centered with small margin
              const padding = 16;
              const maxW = CANVAS_WIDTH - padding * 2;
              const maxH = CANVAS_HEIGHT - padding * 2;
              const scale = Math.min(
                maxW / img.naturalWidth,
                maxH / img.naturalHeight
              );
              const drawW = Math.round(img.naturalWidth * scale);
              const drawH = Math.round(img.naturalHeight * scale);
              const offsetX = Math.round((CANVAS_WIDTH - drawW) / 2);
              const offsetY = Math.round((CANVAS_HEIGHT - drawH) / 2);

              currentCtx.drawImage(img, offsetX, offsetY, drawW, drawH);

              if (typeof currentPage.renderLineArt === 'function') {
                currentPage.renderLineArt(currentCtx, CANVAS_WIDTH, CANVAS_HEIGHT);
              }

              commitSnapshot();
            };

            img.onerror = (err) => {
              console.warn('Failed loading imagePath on canvas, falling back', err);
              if (typeof currentPage.renderLineArt === 'function') {
                currentPage.renderLineArt(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
              }
              commitSnapshot();
            };

            img.src = currentPage.imagePath;
          } else {
            if (typeof currentPage.renderLineArt === 'function') {
              currentPage.renderLineArt(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);
            }
            commitSnapshot();
          }
        };

        // Verifica si hay un estado guardado en localStorage para esta lámina
        const savedDataUrl = !forceOriginal
          ? localStorage.getItem(`coloring-canvas-state-${currentPage.id}`)
          : null;

        if (savedDataUrl) {
          const savedImg = new Image();
          savedImg.onload = () => {
            if (!canvasRef.current) return;
            const currentCtx = canvasRef.current.getContext('2d', {
              willReadFrequently: true,
            });
            if (!currentCtx) return;

            currentCtx.fillStyle = '#ffffff';
            currentCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            currentCtx.drawImage(savedImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            commitSnapshot();
          };

          savedImg.onerror = () => {
            console.warn(
              'Failed to load saved state from localStorage, rendering original'
            );
            localStorage.removeItem(`coloring-canvas-state-${currentPage.id}`);
            drawOriginalTemplate();
          };

          savedImg.src = savedDataUrl;
        } else {
          drawOriginalTemplate();
        }
      },
      [currentPage, onCanUndoChange]
    );

    // Re-render / restaurar estado cuando cambia la lámina seleccionada
    useEffect(() => {
      setPaintRevision(0);
      renderBasePage(false);
    }, [renderBasePage]);

    // Handle canvas click / touch for flood fill
    const executeFillAt = (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const clickX = Math.floor((clientX - rect.left) * scaleX);
      const clickY = Math.floor((clientY - rect.top) * scaleY);

      // Save state before modification for undo
      const preFillState = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Execute optimized flood fill con tolerancia y muros anti-aliasing
      const filled = floodFill(
        ctx,
        clickX,
        clickY,
        currentColor,
        tolerance,
        borderThreshold
      );

      if (filled) {
        // Push state to undo stack
        historyStack.current.push(preFillState);
        if (historyStack.current.length > MAX_UNDO_STACK) {
          historyStack.current.shift();
        }
        setHistoryLength(historyStack.current.length);
        if (onCanUndoChange) onCanUndoChange(true);
        // Disparar auto-save en localStorage
        setPaintRevision((prev) => prev + 1);
      }
    };

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
      executeFillAt(e.clientX, e.clientY);
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
      if (e.touches.length > 0) {
        executeFillAt(e.touches[0].clientX, e.touches[0].clientY);
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
        // Actualiza el auto-save con el estado revertido
        setPaintRevision((prev) => prev + 1);
      }
    }, [onCanUndoChange]);

    // Reset action: limpia el localStorage y re-renderiza la plantilla original
    const handleReset = useCallback(() => {
      try {
        localStorage.removeItem(`coloring-canvas-state-${currentPage.id}`);
      } catch (err) {
        console.warn('Error clearing localStorage on reset:', err);
      }
      setPaintRevision(0);
      renderBasePage(true);
    }, [currentPage.id, renderBasePage]);

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
          onTouchStart={handleTouchStart}
          className="w-full h-full object-contain rounded-2xl cursor-crosshair active:scale-[0.998] transition-transform touch-none"
          style={{ imageRendering: 'auto' }}
          aria-label={currentPage.title.es}
          role="img"
        />
      </div>
    );
  }
);

ColoringCanvas.displayName = 'ColoringCanvas';
