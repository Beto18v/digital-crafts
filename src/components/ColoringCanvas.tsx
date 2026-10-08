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
  currentImage?: ColoringPage;
  currentPage?: ColoringPage;
  currentColor: string;
  tolerance?: number;
  borderThreshold?: number;
  zoomFactor?: number;
  onCanUndoChange?: (canUndo: boolean) => void;
}

const DEFAULT_CANVAS_SIZE = 900;
const MAX_UNDO_STACK = 20;

/**
 * Función centralizada para dibujar la imagen optimizada en el canvas.
 * Aplica comportamiento object-fit: cover y un factor de zoom adicional (zoomFactor)
 * para eliminar completamente cualquier margen o línea blanca perimetral del archivo original.
 */
export function drawOptimizedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  zoomFactor: number = 1.08
): void {
  // Limpieza inicial con fondo blanco limpio
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const canvasRatio = canvasWidth / canvasHeight;

  const imgWidth = img.naturalWidth || img.width;
  const imgHeight = img.naturalHeight || img.height;
  if (!imgWidth || !imgHeight) return;

  const imgRatio = imgWidth / imgHeight;

  // Cálculo de dimensiones de origen aplicando el factor de zoom extra
  let sWidth: number;
  let sHeight: number;

  if (imgRatio > canvasRatio) {
    // La imagen es más ancha que el canvas: recortamos los lados
    sHeight = imgHeight / zoomFactor;
    sWidth = (imgHeight * canvasRatio) / zoomFactor;
  } else {
    // La imagen es más alta que el canvas: recortamos arriba y abajo
    sWidth = imgWidth / zoomFactor;
    sHeight = (imgWidth / canvasRatio) / zoomFactor;
  }

  // Coordenadas de origen (sx, sy) centradas
  const sx = (imgWidth - sWidth) / 2;
  const sy = (imgHeight - sHeight) / 2;

  // Firma completa para estirar de esquina a esquina a sangre sin dejar ningún gap
  ctx.drawImage(
    img,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    canvasWidth,
    canvasHeight
  );
}

export const ColoringCanvas = forwardRef<ColoringCanvasHandle, ColoringCanvasProps>(
  (
    {
      currentImage,
      currentPage,
      currentColor,
      tolerance = 36,
      borderThreshold = 130,
      zoomFactor = 1.08,
      onCanUndoChange,
    },
    ref
  ) => {
    // Admite tanto currentImage como currentPage para máxima compatibilidad
    const activeImage = currentImage || currentPage;

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const historyStack = useRef<ImageData[]>([]);
    const [historyLength, setHistoryLength] = useState<number>(0);
    const [paintRevision, setPaintRevision] = useState<number>(0);

    /**
     * Sincroniza la resolución nativa del canvas (width/height) con las dimensiones DOM reales (offsetWidth/offsetHeight)
     */
    const syncCanvasResolution = useCallback((canvas: HTMLCanvasElement) => {
      const targetW = canvas.offsetWidth > 0 ? canvas.offsetWidth : DEFAULT_CANVAS_SIZE;
      const targetH = canvas.offsetHeight > 0 ? canvas.offsetHeight : DEFAULT_CANVAS_SIZE;

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }, []);

    // Auto-save: Guarda automáticamente el estado actual del lienzo en localStorage bajo clave dinámica por dibujo
    useEffect(() => {
      if (paintRevision === 0 || !activeImage) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(`coloring-state-${activeImage.id}`, dataUrl);
      } catch (err) {
        console.warn('[Auto-Save] Error saving canvas to localStorage:', err);
      }
    }, [paintRevision, activeImage?.id]);

    /**
     * Ciclo de vida principal del Canvas:
     * 1. Dependencia estricta en [activeImage?.id]: se dispara inmediatamente cuando cambia la miniatura seleccionada.
     * 2. Limpieza previa inmediata con ctx.clearRect para borrar cualquier trazo anterior.
     * 3. Carga asíncrona de imagen con img.onload ejecutando drawOptimizedImage (o restauración desde localStorage dinámico).
     */
    useEffect(() => {
      if (!activeImage) return;

      let isCancelled = false;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // 1. Sincronizar dimensiones nativas con el contenedor
      syncCanvasResolution(canvas);

      // 2. Limpieza Previa (Clear): Borrar el lienzo completo al instante al cambiar de imagen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Reiniciar estado de deshacer y revisiones para el nuevo dibujo
      setPaintRevision(0);
      historyStack.current = [];
      setHistoryLength(0);
      if (onCanUndoChange) onCanUndoChange(false);

      const commitSnapshot = () => {
        if (isCancelled || !canvasRef.current) return;
        const currentCtx = canvasRef.current.getContext('2d', {
          willReadFrequently: true,
        });
        if (!currentCtx) return;

        const baseState = currentCtx.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        historyStack.current = [baseState];
        setHistoryLength(1);
        if (onCanUndoChange) onCanUndoChange(false);
      };

      const loadOriginalImage = () => {
        if (activeImage.imagePath) {
          const img = new Image();
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            if (isCancelled || !canvasRef.current) return;
            const activeCtx = canvasRef.current.getContext('2d', {
              willReadFrequently: true,
            });
            if (!activeCtx) return;

            // Sincronizar resolución antes de pintar
            syncCanvasResolution(canvasRef.current);

            // Dibuja la imagen optimizada con recorte y zoom
            drawOptimizedImage(activeCtx, img, canvasRef.current, zoomFactor);

            if (typeof activeImage.renderLineArt === 'function') {
              activeImage.renderLineArt(
                activeCtx,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }

            commitSnapshot();
          };

          img.onerror = (err) => {
            if (isCancelled) return;
            console.warn('Error al cargar la imagen del lienzo:', err);

            if (!canvasRef.current) return;
            const activeCtx = canvasRef.current.getContext('2d', {
              willReadFrequently: true,
            });
            if (activeCtx) {
              activeCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
              activeCtx.fillStyle = '#ffffff';
              activeCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

              if (typeof activeImage.renderLineArt === 'function') {
                activeImage.renderLineArt(
                  activeCtx,
                  canvasRef.current.width,
                  canvasRef.current.height
                );
              }
            }
            commitSnapshot();
          };

          img.src = activeImage.imagePath;
        } else if (typeof activeImage.renderLineArt === 'function') {
          activeImage.renderLineArt(ctx, canvas.width, canvas.height);
          commitSnapshot();
        }
      };

      // 3. Revisar si existe estado previo guardado bajo la clave dinámica específica de este dibujo
      let savedDataUrl: string | null = null;
      try {
        savedDataUrl =
          localStorage.getItem(`coloring-state-${activeImage.id}`) ||
          localStorage.getItem(`coloring-canvas-state-${activeImage.id}`);
      } catch (err) {
        console.warn('Error al acceder a localStorage:', err);
      }

      if (savedDataUrl) {
        const savedImg = new Image();
        savedImg.onload = () => {
          if (isCancelled || !canvasRef.current) return;
          const activeCtx = canvasRef.current.getContext('2d', {
            willReadFrequently: true,
          });
          if (!activeCtx) return;

          syncCanvasResolution(canvasRef.current);
          activeCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          activeCtx.fillStyle = '#ffffff';
          activeCtx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          activeCtx.drawImage(
            savedImg,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          commitSnapshot();
        };

        savedImg.onerror = () => {
          if (isCancelled) return;
          console.warn('Estado en localStorage corrupto, redibujando imagen base original');
          try {
            localStorage.removeItem(`coloring-state-${activeImage.id}`);
            localStorage.removeItem(`coloring-canvas-state-${activeImage.id}`);
          } catch (_) {}
          loadOriginalImage();
        };

        savedImg.src = savedDataUrl;
      } else {
        // Carga fresca de la imagen original
        loadOriginalImage();
      }

      return () => {
        isCancelled = true;
      };
    }, [activeImage?.id, activeImage?.imagePath, zoomFactor, onCanUndoChange, syncCanvasResolution]);

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
     * Limpiar (Clear): Ejecuta estrictamente los 4 pasos en orden:
     * 1. Borrar el LocalStorage específico del dibujo activo
     * 2. Limpiar el Historial de Deshacer
     * 3. Limpiar el Lienzo (ctx.clearRect)
     * 4. Redibujar la Imagen Base original usando exactamente drawOptimizedImage dentro de onload
     */
    const handleClear = useCallback(() => {
      if (!activeImage) return;

      // 1. Borrar el LocalStorage
      try {
        localStorage.removeItem(`coloring-state-${activeImage.id}`);
        localStorage.removeItem(`coloring-canvas-state-${activeImage.id}`);
      } catch (err) {
        console.warn('Error al limpiar localStorage:', err);
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

      syncCanvasResolution(canvas);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 4. Redibujar la Imagen Base original usando la función unificada drawOptimizedImage
      if (activeImage.imagePath) {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          if (!canvasRef.current) return;
          const activeCtx = canvasRef.current.getContext('2d', {
            willReadFrequently: true,
          });
          if (!activeCtx) return;

          syncCanvasResolution(canvasRef.current);
          drawOptimizedImage(activeCtx, img, canvasRef.current, zoomFactor);

          if (typeof activeImage.renderLineArt === 'function') {
            activeImage.renderLineArt(
              activeCtx,
              canvasRef.current.width,
              canvasRef.current.height
            );
          }

          const baseState = activeCtx.getImageData(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          historyStack.current = [baseState];
          setHistoryLength(1);
          if (onCanUndoChange) onCanUndoChange(false);
        };

        img.src = activeImage.imagePath;
      } else if (typeof activeImage.renderLineArt === 'function') {
        activeImage.renderLineArt(ctx, canvas.width, canvas.height);
        const baseState = ctx.getImageData(0, 0, canvas.width, canvas.height);
        historyStack.current = [baseState];
        setHistoryLength(1);
        if (onCanUndoChange) onCanUndoChange(false);
      }
    }, [activeImage, zoomFactor, onCanUndoChange, syncCanvasResolution]);

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
