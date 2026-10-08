'use client';

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
  clear: () => void;
  saveImage: () => void;
  canUndo: boolean;
}

interface ColoringCanvasProps {
  currentPage?: ColoringPage;
  currentImage?: ColoringPage;
  currentColor: string;
  tolerance?: number;
  borderThreshold?: number;
  zoomFactor?: number;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
const MAX_UNDO_STACK = 20;

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, ColoringCanvasProps>(
  (
    {
      currentPage,
      currentImage,
      currentColor,
      tolerance = 36,
      borderThreshold = 130,
      zoomFactor = 1.08,
      onCanUndoChange,
    },
    ref
  ) => {
    const activeImage = currentImage || currentPage;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const historyStack = useRef<ImageData[]>([]);
    const [historyLength, setHistoryLength] = useState<number>(0);
    const [paintRevision, setPaintRevision] = useState<number>(0);

    // Rastreo de la última imagen cargada para evitar re-dibujados innecesarios y parpadeos
    const loadedPageIdRef = useRef<string | null>(null);

    // Auto-save: Guarda automáticamente el estado actual del lienzo en localStorage
    useEffect(() => {
      if (paintRevision === 0 || !activeImage) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(`coloring-canvas-state-${activeImage.id}`, dataUrl);
      } catch (err) {
        console.warn('[Auto-Save] Error saving canvas to localStorage:', err);
      }
    }, [paintRevision, activeImage]);

    /**
     * Dibuja la imagen base original en el lienzo con object-fit: cover
     * y recorte extra (zoom = 1.08 por defecto) para eliminar líneas y márgenes blancos perimetrales.
     */
    const drawBaseImage = useCallback(
      (
        targetCtx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        onDone?: () => void
      ) => {
        if (!activeImage) return;
        const hasRealImage =
          Boolean(activeImage.imagePath) &&
          !activeImage.imagePath.startsWith('/images/coloring-');

        if (hasRealImage) {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            if (!canvasRef.current || loadedPageIdRef.current !== activeImage.id) {
              return;
            }
            const currentCtx = canvasRef.current.getContext('2d', {
              willReadFrequently: true,
            });
            if (!currentCtx) return;

            // Limpieza previa con fondo blanco
            currentCtx.clearRect(0, 0, canvas.width, canvas.height);
            currentCtx.fillStyle = '#ffffff';
            currentCtx.fillRect(0, 0, canvas.width, canvas.height);

            // 1. Factor de zoom (recorta un 8% adicional para eliminar márgenes blancos perimetrales)
            const zoom = zoomFactor;

            // 2. Proporciones de aspecto del canvas y de la imagen original
            const canvasRatio = canvas.width / canvas.height;
            const imgWidth = img.naturalWidth || img.width;
            const imgHeight = img.naturalHeight || img.height;
            const imgRatio = imgWidth / imgHeight;

            // 3. Cálculo de sx, sy, sWidth, sHeight según si es más ancha o más alta
            let sWidth: number;
            let sHeight: number;

            if (imgRatio > canvasRatio) {
              // La imagen es más ancha que el canvas: recortamos los lados
              sHeight = imgHeight / zoom;
              sWidth = (imgHeight * canvasRatio) / zoom;
            } else {
              // La imagen es más alta que el canvas: recortamos arriba y abajo
              sWidth = imgWidth / zoom;
              sHeight = (imgWidth / canvasRatio) / zoom;
            }

            // Coordenadas origen centradas
            const sx = (imgWidth - sWidth) / 2;
            const sy = (imgHeight - sHeight) / 2;

            // 4. Firma completa: llena exactamente el 100% del canvas a sangre
            currentCtx.drawImage(
              img,
              sx,
              sy,
              sWidth,
              sHeight,
              0,
              0,
              canvas.width,
              canvas.height
            );

            if (typeof activeImage.renderLineArt === 'function') {
              activeImage.renderLineArt(currentCtx, canvas.width, canvas.height);
            }

            if (onDone) onDone();
          };

          img.onerror = (err) => {
            console.warn('Failed loading imagePath on canvas, falling back', err);
            if (typeof activeImage.renderLineArt === 'function') {
              activeImage.renderLineArt(targetCtx, canvas.width, canvas.height);
            }
            if (onDone) onDone();
          };

          img.src = activeImage.imagePath;
        } else {
          targetCtx.clearRect(0, 0, canvas.width, canvas.height);
          targetCtx.fillStyle = '#ffffff';
          targetCtx.fillRect(0, 0, canvas.width, canvas.height);
          if (typeof activeImage.renderLineArt === 'function') {
            activeImage.renderLineArt(targetCtx, canvas.width, canvas.height);
          }
          if (onDone) onDone();
        }
      },
      [activeImage, zoomFactor]
    );

    // Redraw y restauración de estado con localStorage o imagen original
    const renderBasePage = useCallback(
      (forceOriginal: boolean = false) => {
        if (!activeImage) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const targetPageId = activeImage.id;

        const commitSnapshot = () => {
          if (!canvasRef.current || loadedPageIdRef.current !== targetPageId) return;
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

        const savedDataUrl = !forceOriginal
          ? localStorage.getItem(`coloring-canvas-state-${activeImage.id}`)
          : null;

        if (savedDataUrl) {
          const savedImg = new Image();
          savedImg.onload = () => {
            if (!canvasRef.current || loadedPageIdRef.current !== targetPageId) {
              return;
            }
            const currentCtx = canvasRef.current.getContext('2d', {
              willReadFrequently: true,
            });
            if (!currentCtx) return;

            currentCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            currentCtx.fillStyle = '#ffffff';
            currentCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            currentCtx.drawImage(savedImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

            commitSnapshot();
          };

          savedImg.onerror = () => {
            console.warn(
              'Failed to load saved state from localStorage, rendering original'
            );
            localStorage.removeItem(`coloring-canvas-state-${activeImage.id}`);
            drawBaseImage(ctx, canvas, commitSnapshot);
          };

          savedImg.src = savedDataUrl;
        } else {
          drawBaseImage(ctx, canvas, commitSnapshot);
        }
      },
      [activeImage, drawBaseImage, onCanUndoChange]
    );

    // Carga de imagen optimizada: no parpadea ni redibuja si la imagen actual no ha cambiado
    useEffect(() => {
      if (!activeImage) return;
      if (loadedPageIdRef.current === activeImage.id) {
        return;
      }
      loadedPageIdRef.current = activeImage.id;
      setPaintRevision(0);
      renderBasePage(false);
    }, [activeImage?.id, activeImage?.imagePath, renderBasePage]);

    // Función que ejecuta el flood fill envuelta en useCallback
    const executeFillAt = useCallback(
      (clientX: number, clientY: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clickX = Math.floor((clientX - rect.left) * scaleX);
        const clickY = Math.floor((clientY - rect.top) * scaleY);

        const preFillState = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const filled = floodFill(
          ctx,
          clickX,
          clickY,
          currentColor,
          tolerance,
          borderThreshold
        );

        if (filled) {
          historyStack.current.push(preFillState);
          if (historyStack.current.length > MAX_UNDO_STACK) {
            historyStack.current.shift();
          }
          setHistoryLength(historyStack.current.length);
          if (onCanUndoChange) onCanUndoChange(true);
          setPaintRevision((prev) => prev + 1);
        }
      },
      [currentColor, tolerance, borderThreshold, onCanUndoChange]
    );

    const handleCanvasClick = useCallback(
      (e: React.MouseEvent<HTMLCanvasElement>) => {
        executeFillAt(e.clientX, e.clientY);
      },
      [executeFillAt]
    );

    const handleTouchStart = useCallback(
      (e: React.TouchEvent<HTMLCanvasElement>) => {
        if (e.touches.length > 0) {
          executeFillAt(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      [executeFillAt]
    );

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
        setPaintRevision((prev) => prev + 1);
      }
    }, [onCanUndoChange]);

    /**
     * Limpiar (Clear / Reset) ejecutando los 4 pasos obligatorios en orden:
     * 1. Borrar el LocalStorage específico de esta imagen
     * 2. Limpiar el Historial de Deshacer (setHistory([]) / vaciar pila)
     * 3. Limpiar el Lienzo (ctx.clearRect)
     * 4. Redibujar la Imagen Base original con matemática de recorte/zoom
     */
    const handleClear = useCallback(() => {
      if (!activeImage) return;
      // 1. Borrar el LocalStorage
      try {
        localStorage.removeItem(`coloring-canvas-state-${activeImage.id}`);
      } catch (err) {
        console.warn('Error clearing localStorage on reset:', err);
      }
      setPaintRevision(0);

      // 2. Limpiar el Historial de Deshacer
      historyStack.current = [];
      setHistoryLength(0);
      if (onCanUndoChange) {
        onCanUndoChange(false);
      }

      // 3. Limpiar el Lienzo
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Redibujar la Imagen Base con matemática de recorte/zoom y restablecer el snapshot inicial
      drawBaseImage(ctx, canvas, () => {
        if (!canvasRef.current) return;
        const currentCtx = canvasRef.current.getContext('2d', {
          willReadFrequently: true,
        });
        if (!currentCtx) return;

        const baseState = currentCtx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        historyStack.current = [baseState];
        setHistoryLength(1);
        if (onCanUndoChange) onCanUndoChange(false);
      });
    }, [activeImage, drawBaseImage, onCanUndoChange]);

    const handleSave = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas || !activeImage) return;

      const link = document.createElement('a');
      link.download = `Our-Craft-${activeImage.id}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, [activeImage]);

    useImperativeHandle(
      ref,
      () => ({
        undo: handleUndo,
        reset: handleClear,
        clear: handleClear,
        saveImage: handleSave,
        canUndo: historyLength > 1,
      }),
      [handleUndo, handleClear, handleSave, historyLength]
    );

    return (
      <div className="relative w-full aspect-square max-w-[620px] mx-auto rounded-3xl bg-white shadow-[0_12px_45px_rgba(40,25,25,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-stone-200/80 dark:border-white/10 p-0 overflow-hidden flex items-center justify-center select-none">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          className="w-full h-full block rounded-3xl cursor-crosshair active:scale-[0.999] transition-transform touch-none"
          style={{ imageRendering: 'auto' }}
          aria-label={activeImage ? activeImage.title.es : 'Lienzo de dibujo'}
          role="img"
        />
      </div>
    );
  }
);

ColoringCanvas.displayName = 'ColoringCanvas';
