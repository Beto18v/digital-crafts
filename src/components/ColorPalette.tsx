import React, { useRef } from 'react';
import { Pipette, Sparkles } from 'lucide-react';

interface ColorPaletteProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
  lang: 'es' | 'en';
}

export const PRESET_COLORS = [
  // Romantic & Pastels
  { hex: '#f43f5e', name: { es: 'Rosa Romántico', en: 'Romantic Rose' } },
  { hex: '#fda4af', name: { es: 'Pétalo Blush', en: 'Blush Petal' } },
  { hex: '#fecdd3', name: { es: 'Rosa Pastel', en: 'Pastel Pink' } },
  { hex: '#e11d48', name: { es: 'Cereza Intensa', en: 'Deep Cherry' } },

  // Warm Terracottas & Sunset
  { hex: '#fb923c', name: { es: 'Melocotón Cálido', en: 'Warm Peach' } },
  { hex: '#f97316', name: { es: 'Terracota', en: 'Terracotta' } },
  { hex: '#ea580c', name: { es: 'Atardecer', en: 'Sunset Ochre' } },
  { hex: '#fef08a', name: { es: 'Vainilla Suave', en: 'Soft Vanilla' } },
  { hex: '#facc15', name: { es: 'Miel Dorada', en: 'Golden Honey' } },

  // Sage & Botanical Greens
  { hex: '#86efac', name: { es: 'Menta Suave', en: 'Soft Mint' } },
  { hex: '#4ade80', name: { es: 'Verde Salvia', en: 'Sage Green' } },
  { hex: '#16a34a', name: { es: 'Eucalipto', en: 'Eucalyptus' } },
  { hex: '#14532d', name: { es: 'Pino Bosque', en: 'Forest Pine' } },

  // Muted Blues & Lavender
  { hex: '#a5f3fc', name: { es: 'Brisa Celeste', en: 'Sky Breeze' } },
  { hex: '#38bdf8', name: { es: 'Azul Agua', en: 'Ocean Mist' } },
  { hex: '#0284c7', name: { es: 'Azul Noche', en: 'Night Sky' } },
  { hex: '#c084fc', name: { es: 'Lavanda Dulce', en: 'Sweet Lavender' } },
  { hex: '#7c3aed', name: { es: 'Violeta Profundo', en: 'Deep Violet' } },

  // Earth & Neutrals
  { hex: '#d6d3d1', name: { es: 'Gris Perla', en: 'Pearl Gray' } },
  { hex: '#a8a29e', name: { es: 'Piedra Cálida', en: 'Warm Stone' } },
  { hex: '#78716c', name: { es: 'Café Tostado', en: 'Roasted Coffee' } },
  { hex: '#292524', name: { es: 'Tinta Negra', en: 'Ink Black' } },
  { hex: '#ffffff', name: { es: 'Blanco Lienzo', en: 'Canvas White' } },
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  currentColor,
  onSelectColor,
  lang,
}) => {
  const isEs = lang === 'es';
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
            {activeColorObj
              ? activeColorObj.name[lang]
              : isEs
              ? 'Color Personalizado'
              : 'Custom Shade'}
          </span>
        </div>

        <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 uppercase">
          {currentColor}
        </span>
      </div>

      {/* Swatches Matrix */}
      <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 sm:gap-2">
        {PRESET_COLORS.map((color) => {
          const isSelected = currentColor.toLowerCase() === color.hex.toLowerCase();
          return (
            <button
              key={color.hex}
              type="button"
              onClick={() => onSelectColor(color.hex)}
              title={color.name[lang]}
              aria-label={color.name[lang]}
              style={{ backgroundColor: color.hex }}
              className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 dark:border-white/10 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'scale-115 ring-2 ring-stone-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-stone-900 shadow-sm z-10'
                  : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
            />
          );
        })}

        {/* Custom Color Pipette Button */}
        <div className="relative flex items-center justify-center">
          <input
            ref={colorInputRef}
            type="color"
            value={currentColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="sr-only"
            id="custom-color-picker"
            aria-label={isEs ? 'Elegir color personalizado' : 'Choose custom color'}
          />
          <button
            type="button"
            onClick={() => colorInputRef.current?.click()}
            title={isEs ? 'Color personalizado' : 'Custom color picker'}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-white/20 flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:scale-105 transition-all shadow-2xs cursor-pointer"
          >
            <Pipette className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
