'use client';

import React, { useRef } from 'react';
import { Pipette } from 'lucide-react';

/**
 * Textos centralizados de la paleta de colores.
 */
const TEXTOS = {
  colorPersonalizado: 'Tono personalizado',
  elegirColorPersonalizado: 'Elegir color personalizado',
  colorPersonalizadoTitulo: 'Paleta personalizada',
};

export const PRESET_COLORS = [
  // Rosas & Románticos
  { hex: '#f43f5e', name: 'Rosa Romántico' },
  { hex: '#fda4af', name: 'Pétalo Suave' },
  { hex: '#fecdd3', name: 'Rosa Pastel' },
  { hex: '#e11d48', name: 'Cereza Enamorada' },

  // Cálidos & Atardecer
  { hex: '#fb923c', name: 'Melocotón Cálido' },
  { hex: '#f97316', name: 'Terracota' },
  { hex: '#ea580c', name: 'Atardecer Juntos' },
  { hex: '#fef08a', name: 'Vainilla Suave' },
  { hex: '#facc15', name: 'Miel Dorada' },

  // Botánicos & Calma
  { hex: '#86efac', name: 'Menta Fresca' },
  { hex: '#4ade80', name: 'Verde Salvia' },
  { hex: '#16a34a', name: 'Eucalipto' },
  { hex: '#14532d', name: 'Pino Bosque' },

  // Celestes & Lavanda
  { hex: '#a5f3fc', name: 'Brisa Serena' },
  { hex: '#38bdf8', name: 'Azul Agua' },
  { hex: '#0284c7', name: 'Azul Noche' },
  { hex: '#c084fc', name: 'Lavanda Dulce' },
  { hex: '#7c3aed', name: 'Violeta Profundo' },

  // Tierras & Neutros
  { hex: '#d6d3d1', name: 'Gris Perla' },
  { hex: '#a8a29e', name: 'Piedra Cálida' },
  { hex: '#78716c', name: 'Café Tostado' },
  { hex: '#292524', name: 'Tinta Suave' },
  { hex: '#ffffff', name: 'Lienzo Blanco' },
];

interface ColorPaletteProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
  lang?: 'es' | 'en';
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  currentColor,
  onSelectColor,
}) => {
  const colorInputRef = useRef<HTMLInputElement>(null);

  const activeColorObj = PRESET_COLORS.find(
    (c) => c.hex.toLowerCase() === currentColor.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-2 p-3 sm:p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-stone-300 dark:border-white/20 shadow-2xs"
            style={{ backgroundColor: currentColor }}
          />
          <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
            {activeColorObj ? activeColorObj.name : TEXTOS.colorPersonalizado}
          </span>
        </div>

        <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 uppercase">
          {currentColor}
        </span>
      </div>

      {/* Matriz de tonalidades */}
      <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 sm:gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = currentColor.toLowerCase() === color.hex.toLowerCase();
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onSelectColor(color.hex)}
              title={color.name}
              aria-label={color.name}
              style={{ backgroundColor: color.hex }}
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 dark:border-white/10 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'scale-115 ring-2 ring-stone-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-stone-900 shadow-sm z-10'
                  : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
            />
          );
        })}

        {/* Pipeta para color libre */}
        <div className="relative flex items-center justify-center">
          <input
            ref={colorInputRef}
            type="color"
            value={currentColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="sr-only"
            id="custom-color-picker"
            aria-label={TEXTOS.elegirColorPersonalizado}
          />
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            title={TEXTOS.colorPersonalizadoTitulo}
            aria-label={TEXTOS.elegirColorPersonalizado}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-white/20 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:scale-105 transition-all shadow-2xs cursor-pointer"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
