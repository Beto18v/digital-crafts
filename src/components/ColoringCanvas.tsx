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
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const historyStack = useRef<ImageData[]>([]);
    const [historyLength, setHistoryLength] = useState<number>(0);
    const [paintRevision, setPaintRevision] = useState<number>(0);

    // Estados para Pinch-to-Zoom y Paneo
    const [scale, setScale] = useState<number>(1);
    const [translateX, setTranslateX] = useState<number>(0);
    const [translateY, setTranslateY] = useState<number>(0);

    // Referencias para seguimiento táctil de gestos (pinch & pan)
    const touchStateRef = useRef<{
      initialDistance: number;
      initialScale: number;
      initialTranslateX: number;
      initialTranslateY: number;
      pinchMidX: number;
      pinchMidY: number;
      startTouchX: number;
      startTouchY: number;
      hasMoved: boolean;
    }>({
      initialDistance: 0,
      initialScale: 1,
      initialTranslateX: 0,
      initialTranslateY: 0,
      pinchMidX: 0,
      pinchMidY: 0,
      startTouchX: 0,
      startTouchY: 0,
      hasMoved: false,
    });

    // Mantener referencias actualizadas de transformación para callbacks
    const transformRef = useRef({ scale: 1, translateX: 0, translateY: 0 });
    useEffect(() => {
      transformRef.current = { scale, translateX, translateY };
    }, [scale, translateX, translateY]);

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

            // 3. Cálculo de recorte centrado
            let sWidth: number;
            let sHeight: number;

            if (imgRatio > canvasRatio) {
              sHeight = imgHeight / zoom;
              sWidth = (imgHeight * canvasRatio) / zoom;
            } else {
              sWidth = imgWidth / zoom;
              sHeight = (imgWidth / canvasRatio) / zoom;
            }

            const sx = (imgWidth - sWidth) / 2;
            const sy = (imgHeight - sHeight) / 2;

            // 4. Llena exactamente el 100% del canvas a sangre
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

    // Carga de imagen optimizada: restablece escala y paneo al cambiar de lámina
    useEffect(() => {
      if (!activeImage) return;
      if (loadedPageIdRef.current === activeImage.id) {
        return;
      }
      loadedPageIdRef.current = activeImage.id;
      setPaintRevision(0);
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
      renderBasePage(false);
    }, [activeImage?.id, activeImage?.imagePath, renderBasePage]);

    /**
     * MATEMÁTICA DE COORDENADAS (CRÍTICO):
     * Revierte las transformaciones CSS (scale, translateX, translateY)
     * utilizando las dimensiones del contenedor de referencia.
     * Fórmula:
     *   realX = (touchX - rect.left - translateX) / scale;
     *   realY = (touchY - rect.top - translateY) / scale;
     */
    const executeFillAt = useCallback(
      (touchX: number, touchY: number) => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const rect = container.getBoundingClientRect();
        const currentScale = transformRef.current.scale;
        const currentTx = transformRef.current.translateX;
        const currentTy = transformRef.current.translateY;

        // Reversión de la transformación CSS aplicada
        const realX = (touchX - rect.left - currentTx) / currentScale;
        const realY = (touchY - rect.top - currentTy) / currentScale;

        // Proyección exacta a la resolución nativa interna del canvas
        const clickX = Math.floor((realX / rect.width) * canvas.width);
        const clickY = Math.floor((realY / rect.height) * canvas.height);

        // Protección de límites
        if (
          clickX < 0 ||
          clickX >= canvas.width ||
          clickY < 0 ||
          clickY >= canvas.height
        ) {
          return;
        }

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

    // Clic con ratón (desktop)
    const handleCanvasClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        executeFillAt(e.clientX, e.clientY);
      },
      [executeFillAt]
    );

    // GESTIÓN TÁCTIL: Pinch-to-Zoom y Paneo
    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      if (e.cancelable) {
        e.preventDefault();
      }

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      if (e.touches.length === 2) {
        // Inicio de Pinch-to-Zoom con 2 dedos
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dist = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
        const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

        touchStateRef.current = {
          ...touchStateRef.current,
          initialDistance: dist,
          initialScale: transformRef.current.scale,
          initialTranslateX: transformRef.current.translateX,
          initialTranslateY: transformRef.current.translateY,
          pinchMidX: midX,
          pinchMidY: midY,
          hasMoved: true, // Gesto de 2 dedos nunca colorea en tap
        };
      } else if (e.touches.length === 1) {
        // Inicio de toque individual (posible Tap para pintar o Paneo si scale > 1)
        const touch = e.touches[0];
        touchStateRef.current = {
          ...touchStateRef.current,
          startTouchX: touch.clientX,
          startTouchY: touch.clientY,
          initialTranslateX: transformRef.current.translateX,
          initialTranslateY: transformRef.current.translateY,
          hasMoved: false,
        };
      }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      if (e.cancelable) {
        e.preventDefault();
      }

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      if (e.touches.length === 2) {
        // PINCH-TO-ZOOM con 2 dedos
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDist = Math.hypot(
          touch1.clientX - touch2.clientX,
          touch1.clientY - touch2.clientY
        );

        const {
          initialDistance,
          initialScale,
          initialTranslateX,
          initialTranslateY,
          pinchMidX,
          pinchMidY,
        } = touchStateRef.current;

        if (initialDistance <= 0) return;

        const zoomRatio = currentDist / initialDistance;
        let newScale = Math.min(Math.max(initialScale * zoomRatio, 1), 4);

        if (newScale <= 1.02) {
          // Si regresa a tamaño normal, restablece paneo al centro
          setScale(1);
          setTranslateX(0);
          setTranslateY(0);
        } else {
          // Escala respecto al punto medio del pellizco
          let newTx =
            pinchMidX - ((pinchMidX - initialTranslateX) / initialScale) * newScale;
          let newTy =
            pinchMidY - ((pinchMidY - initialTranslateY) / initialScale) * newScale;

          // Delimita el paneo para mantener el dibujo dentro del contenedor
          const minTx = rect.width * (1 - newScale);
          const minTy = rect.height * (1 - newScale);

          newTx = Math.min(0, Math.max(minTx, newTx));
          newTy = Math.min(0, Math.max(minTy, newTy));

          setScale(newScale);
          setTranslateX(newTx);
          setTranslateY(newTy);
        }
      } else if (e.touches.length === 1) {
        // PANEO con 1 dedo cuando scale > 1
        const touch = e.touches[0];
        const dx = touch.clientX - touchStateRef.current.startTouchX;
        const dy = touch.clientY - touchStateRef.current.startTouchY;

        // Si se mueve más de 6px se considera arrastre y no tap
        if (Math.hypot(dx, dy) > 6) {
          touchStateRef.current.hasMoved = true;
        }

        if (transformRef.current.scale > 1 && touchStateRef.current.hasMoved) {
          const currentScale = transformRef.current.scale;
          let nextTx = touchStateRef.current.initialTranslateX + dx;
          let nextTy = touchStateRef.current.initialTranslateY + dy;

          const minTx = rect.width * (1 - currentScale);
          const minTy = rect.height * (1 - currentScale);

          nextTx = Math.min(0, Math.max(minTx, nextTx));
          nextTy = Math.min(0, Math.max(minTy, nextTy));

          setTranslateX(nextTx);
          setTranslateY(nextTy);
        }
      }
    }, []);

    const handleTouchEnd = useCallback(
      (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.cancelable) {
          e.preventDefault();
        }

        // Si fue un toque rápido y estático (TAP), se ejecuta el relleno
        if (!touchStateRef.current.hasMoved) {
          executeFillAt(
            touchStateRef.current.startTouchX,
            touchStateRef.current.startTouchY
          );
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
     * Limpiar (Clear / Reset): restablece escala, paneo, historial y redibuja la base.
     */
    const handleClear = useCallback(() => {
      if (!activeImage) return;
      try {
        localStorage.removeItem(`coloring-canvas-state-${activeImage.id}`);
      } catch (err) {
        console.warn('Error clearing localStorage on reset:', err);
      }
      setPaintRevision(0);
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);

      historyStack.current = [];
      setHistoryLength(0);
      if (onCanUndoChange) {
        onCanUndoChange(false);
      }

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
      link.download = `Nuestro-Lienzo-${activeImage.id}-${Date.now()}.png`;
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
      <div
        ref={containerRef}
        onClick={handleCanvasClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-square max-w-[620px] mx-auto rounded-3xl bg-white shadow-[0_12px_45px_rgba(40,25,25,0.08)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)] border border-stone-200/80 dark:border-white/10 p-0 overflow-hidden select-none touch-none"
        style={{ touchAction: 'none' }}
      >
        {/* Lienzo Canvas HTML5 con transformación CSS de Paneo y Zoom (transformOrigin: 0 0) */}
        <canvas
          ref={canvasRef}
          className="w-full h-full block rounded-3xl cursor-crosshair pointer-events-none select-none"
          style={{
            imageRendering: 'auto',
            transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
          aria-label={activeImage ? activeImage.title.es : 'Lienzo de dibujo'}
          role="img"
        />
      </div>
    );
  }
);

ColoringCanvas.displayName = 'ColoringCanvas';
