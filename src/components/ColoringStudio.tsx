'use client';

import React, { useRef, useState } from 'react';
import { coloringPages, ColoringPage } from '../data/pages';
import { ColoringCanvas, ColoringCanvasHandle } from './ColoringCanvas';
import { ColorPalette } from './ColorPalette';
import { Toolbar } from './Toolbar';
import { GallerySelector } from './GallerySelector';
import { Language } from '../types';
import { ArrowLeft, Palette } from 'lucide-react';

/**
 * Textos centralizados del estudio de pintura y lienzo interactivo.
 */
const TEXTOS = {
  espacioSubtitulo: 'Lienzo para Colorear Juntos',
  botonVolver: 'Volver a nuestro espacio',
};

interface ColoringStudioProps {
  lang?: Language;
  onBackToHub?: () => void;
}

export const ColoringStudio: React.FC<ColoringStudioProps> = ({
  onBackToHub,
}) => {
  const [currentPage, setCurrentPage] = useState<ColoringPage>(coloringPages[0]);
  const [currentColor, setCurrentColor] = useState<string>('#fda4af');
  const [canUndo, setCanUndo] = useState<boolean>(false);

  const canvasRef = useRef<ColoringCanvasHandle>(null);

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleClear = () => {
    canvasRef.current?.clear();
  };

  const handleSave = () => {
    canvasRef.current?.saveImage();
  };

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
      {/* Barra de cabecera del estudio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-1">
            <Palette className="w-3.5 h-3.5 text-rose-500" />
            <span>{TEXTOS.espacioSubtitulo}</span>
            <span>·</span>
            <span className="text-rose-500 font-semibold">{currentPage.category}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 dark:text-stone-100">
            {currentPage.title.es || currentPage.title.en}
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {currentPage.subtitle.es || currentPage.subtitle.en}
          </p>
        </div>

        {onBackToHub && (
          <button
            type="button"
            onClick={onBackToHub}
            className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-white/10 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{TEXTOS.botonVolver}</span>
          </button>
        )}
      </div>

      {/* Espacio de trabajo del lienzo con barra y paleta */}
      <div className="flex flex-col gap-4">
        {/* Barra superior de herramientas */}
        <Toolbar
          canUndo={canUndo}
          onUndo={handleUndo}
          onReset={handleClear}
          onClear={handleClear}
          onSave={handleSave}
        />

        {/* Lienzo Canvas HTML5 */}
        <ColoringCanvas
          ref={canvasRef}
          currentPage={currentPage}
          currentColor={currentColor}
          onCanUndoChange={setCanUndo}
        />

        {/* Paleta de colores */}
        <ColorPalette
          currentColor={currentColor}
          onSelectColor={setCurrentColor}
        />
      </div>

      {/* Selector en carrusel de láminas */}
      <GallerySelector
        pages={coloringPages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
      />
    </section>
  );
};
