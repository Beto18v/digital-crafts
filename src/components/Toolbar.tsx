'use client';

import React from 'react';
import { Undo2, RotateCcw, Download, Sparkles, PaintBucket } from 'lucide-react';

interface ToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  onReset?: () => void;
  onClear?: () => void;
  onSave: () => void;
  lang: 'es' | 'en';
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  onUndo,
  onReset,
  onClear,
  onSave,
  lang,
}) => {
  const isEs = lang === 'es';
  const handleClearAction = onClear || onReset;

  return (
    <div className="flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-xs">
      {/* Left tool indication */}
      <div className="flex items-center gap-2 pl-2 text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:flex">
        <PaintBucket className="w-4 h-4 text-rose-500" />
        <span>{isEs ? 'Bote de Pintura Activo' : 'Flood Fill Active'}</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-auto w-full sm:w-auto justify-end">
        {/* Undo Button */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title={isEs ? 'Deshacer último trazo (Ctrl+Z)' : 'Undo last fill (Ctrl+Z)'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
            canUndo
              ? 'text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer active:scale-95'
              : 'text-stone-300 dark:text-stone-600 bg-stone-50 dark:bg-stone-900/40 cursor-not-allowed opacity-60'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>{isEs ? 'Deshacer' : 'Undo'}</span>
        </button>

        {/* Reset / Clear Button */}
        <button
          type="button"
          onClick={handleClearAction}
          title={isEs ? 'Limpiar lienzo en blanco' : 'Clear canvas'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 bg-stone-100 dark:bg-stone-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isEs ? 'Limpiar' : 'Clear'}</span>
        </button>

        {/* Save / Export PNG Button */}
        <button
          type="button"
          onClick={onSave}
          title={isEs ? 'Guardar como imagen PNG' : 'Save as PNG image'}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-stone-900 dark:bg-rose-900/90 hover:bg-rose-950 dark:hover:bg-rose-800 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isEs ? 'Guardar Recuerdo' : 'Save Memory'}</span>
        </button>
      </div>
    </div>
  );
};
