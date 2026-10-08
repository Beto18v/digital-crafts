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
 * Paleta Premium de 40 colores armónicos y sofisticados:
 * - Tonos de Piel (progresión completa desde porcelana hasta ébano profundo)
 * - Tonos de Cabello, Madera y Tierra
 * - Rosas Empolvados, Terracota y Mostazas
 * - Botánicos, Verde Salvia y Oliva
 * - Azul Acero, Cielos y Lavanda
 * - Acentos Vibrantes y Tonos Profundos
 */
export const PRESET_COLORS = [
  // 1. Progresión Completa de Tonos de Piel (10 tonos de claro a oscuro)
  { hex: '#fff6ed', name: 'Piel Porcelana' },
  { hex: '#fce7d2', name: 'Piel Marfil' },
  { hex: '#f7d5b8', name: 'Piel Beige Cálido' },
  { hex: '#ebbe9b', name: 'Piel Arena Dorada' },
  { hex: '#dba07b', name: 'Piel Melocotón Bronce' },
  { hex: '#c6845d', name: 'Piel Caramelo Miel' },
  { hex: '#a8653e', name: 'Piel Canela Tostada' },
  { hex: '#834927', name: 'Piel Café Avellana' },
  { hex: '#5c3016', name: 'Piel Cacao Profundo' },
  { hex: '#381d0f', name: 'Piel Ébano Oscuro' },

  // 2. Cabello, Madera y Elementos Tierra (6 tonos)
  { hex: '#dcc7aa', name: 'Trigo Rubio' },
  { hex: '#bfa07d', name: 'Roble Claro' },
  { hex: '#8d6748', name: 'Castaño Cálido' },
  { hex: '#5d4029', name: 'Nogal Oscuro' },
  { hex: '#442d1d', name: 'Madera Caoba' },
  { hex: '#6e5d53', name: 'Ceniza Suave' },

  // 3. Rosas Empolvados, Terracota & Mostazas (8 tonos)
  { hex: '#fcebe6', name: 'Pétalo Blush' },
  { hex: '#e8b4b8', name: 'Rosa Ceniza' },
  { hex: '#cf7a86', name: 'Rosa Empolvado' },
  { hex: '#c55f52', name: 'Terracota Cálido' },
  { hex: '#9e3d31', name: 'Teja Quemada' },
  { hex: '#fae4b5', name: 'Vainilla Seda' },
  { hex: '#deb76c', name: 'Mostaza Suave' },
  { hex: '#b5823c', name: 'Ocre Atardecer' },

  // 4. Botánicos, Salvia & Oliva (5 tonos)
  { hex: '#dbe6dc', name: 'Menta Serena' },
  { hex: '#a6c4ad', name: 'Verde Salvia' },
  { hex: '#769880', name: 'Eucalipto Mate' },
  { hex: '#5f7553', name: 'Verde Oliva' },
  { hex: '#394d36', name: 'Bosque Verde' },

  // 5. Cielos, Azul Acero & Lavandas (6 tonos)
  { hex: '#d5deeb', name: 'Bruma Celeste' },
  { hex: '#9cb4cc', name: 'Azul Acero Suave' },
  { hex: '#5f7d98', name: 'Azul Acero' },
  { hex: '#e2daf0', name: 'Lavanda Suave' },
  { hex: '#b4a5cb', name: 'Malva Sereno' },
  { hex: '#695782', name: 'Amatista Oscuro' },

  // 6. Acentos Vivos & Neutros Puros (5 tonos)
  { hex: '#e11d48', name: 'Carmín Pasión' },
  { hex: '#ea580c', name: 'Mandarina Cálida' },
  { hex: '#eab308', name: 'Amarillo Sol' },
  { hex: '#10b981', name: 'Esmeralda Vivo' },
  { hex: '#2563eb', name: 'Azul Cobalto' },
  { hex: '#1e293b', name: 'Azul Marino Íntimo' },
  { hex: '#18181b', name: 'Tinta Negra Profunda' },
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
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2.5 pt-1 px-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
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
