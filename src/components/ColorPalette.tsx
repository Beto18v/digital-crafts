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

/**
 * Paleta Premium, relajante y sofisticada de 24 colores armónicos:
 * - Neutros & Tierras: Lino, Beige, Arena, Almendra
 * - Rosas Empolvados & Terracota: Pétalo, Rosa Ceniza, Rosa Empolvado, Terracota, Teja
 * - Mostazas Suaves & Ocre: Vainilla, Mostaza Suave, Ocre Atardecer
 * - Botánicos & Salvia: Salvia Clara, Verde Salvia, Eucalipto Mate, Verde Oliva, Bosque
 * - Azul Acero & Lavanda: Bruma Celeste, Azul Acero Suave, Azul Acero, Lavanda Empolvada, Malva
 * - Tonos Profundos: Azul Pizarra, Azul Marino Íntimo
 */
export const PRESET_COLORS = [
  // 1. Neutros Cálidos (Lino, Beige, Arena)
  { hex: '#fcfaf7', name: 'Lino Puro' },
  { hex: '#f5efe6', name: 'Beige Cálido' },
  { hex: '#e8dcce', name: 'Arena del Desierto' },
  { hex: '#d5c4b1', name: 'Almendra Tostada' },

  // 2. Rosas Empolvados & Terracota
  { hex: '#eed5d2', name: 'Pétalo Empolvado' },
  { hex: '#e0aba6', name: 'Rosa Ceniza' },
  { hex: '#c97a7e', name: 'Rosa Empolvado' },
  { hex: '#c26d5c', name: 'Terracota Cálido' },
  { hex: '#a34839', name: 'Teja Profunda' },

  // 3. Mostazas Suaves & Ocre
  { hex: '#ecd69c', name: 'Vainilla Dorada' },
  { hex: '#deb86a', name: 'Mostaza Suave' },
  { hex: '#b98c47', name: 'Ocre Atardecer' },

  // 4. Verdes Relajantes (Salvia, Oliva, Bosque)
  { hex: '#d0ded2', name: 'Salvia Clara' },
  { hex: '#9cb8a3', name: 'Verde Salvia' },
  { hex: '#728f78', name: 'Eucalipto Mate' },
  { hex: '#5e6f54', name: 'Verde Oliva' },
  { hex: '#384936', name: 'Bosque Profundo' },

  // 5. Azul Acero & Lavanda
  { hex: '#cbd5e1', name: 'Bruma Celeste' },
  { hex: '#94a3b8', name: 'Azul Acero Suave' },
  { hex: '#64748b', name: 'Azul Acero' },
  { hex: '#d8d2e8', name: 'Lavanda Empolvada' },
  { hex: '#a89fc4', name: 'Malva Sereno' },

  // 6. Tonos Profundos Íntimos
  { hex: '#334155', name: 'Azul Pizarra' },
  { hex: '#1e293b', name: 'Azul Marino Íntimo' },
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
    <div className="flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-3xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-sm transition-all">
      {/* Indicador de tono seleccionado */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border border-stone-300 dark:border-white/20 shadow-2xs transition-colors"
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

      {/* Contenedor responsivo: swipe horizontal en móviles (scrollbar oculta) y envoltorio flexible en tablet/desktop */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
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
              className={`relative shrink-0 w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border border-black/10 dark:border-white/15 transition-all duration-200 cursor-pointer shadow-2xs ${
                isSelected
                  ? 'scale-115 ring-2 ring-stone-900 dark:ring-stone-100 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 shadow-md z-10'
                  : 'hover:scale-105 opacity-95 hover:opacity-100 active:scale-95'
              }`}
            />
          );
        })}

        {/* Pipeta para color personalizado */}
        <div className="relative shrink-0 flex items-center justify-center">
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
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-white/20 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-all shadow-2xs cursor-pointer ${
              !activeColorObj
                ? 'scale-115 ring-2 ring-stone-900 dark:ring-stone-100 ring-offset-2 ring-offset-white dark:ring-offset-stone-900 shadow-md z-10'
                : 'hover:scale-105 active:scale-95'
            }`}
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
