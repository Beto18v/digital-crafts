import React, { useEffect, useState } from 'react';
import { Heart, Moon } from 'lucide-react';
import { Language } from '../types';

/**
 * Textos centralizados del pie de página que se revela como un telón.
 */
const TEXTOS = {
  insigniaSuperior: 'Creando recuerdos juntos',
  insigniaEdicion: 'Edición íntima',
  horaCompartida: 'Hora compartida',
  dedicatoria: 'Para nosotros dos',
  tituloPrincipal: 'Siempre nosotros.',
  citaAmor:
    '«En medio de todo el ruido del mundo, este espacio existe únicamente para celebrar los instantes que nos hacen felices.»',
  nombreRefugio: 'Nuestro Refugio Digital',
  hechoConAmor: 'Hecho a mano con todo mi amor para ti',
  pieFrase: 'Cocinando, pintando y soñando juntos.',
};

interface RevealFooterProps {
  lang?: Language;
}

export const RevealFooter: React.FC<RevealFooterProps> = () => {
  // Reloj digital con hora local compartida
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      role="contentinfo"
      aria-label="Pie de página de nuestro espacio íntimo"
      className="fixed bottom-0 left-0 w-full z-0 h-[260px] sm:h-[320px] md:h-[380px] bg-[#221617] text-stone-100 flex flex-col justify-between px-4 sm:px-8 md:px-12 py-4 sm:py-8 overflow-hidden select-none"
    >
      {/* Luz ambiental cálida y romántica */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-rose-900/30 via-amber-900/15 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Zona superior: Insignias de complicidad y reloj en vivo */}
      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-stone-400">
            {TEXTOS.insigniaSuperior}
          </span>
          <span className="hidden sm:inline text-stone-600">·</span>
          <span className="hidden sm:inline text-xs text-rose-200/80 font-serif italic">
            {TEXTOS.insigniaEdicion}
          </span>
        </div>

        {/* Reloj con hora compartida */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-stone-300">
          <Moon className="w-3 h-3 text-rose-300" />
          <span>{currentTime || '00:00:00'}</span>
        </div>
      </div>

      {/* Zona central: Título editorial y dedicatoria compacta */}
      <div className="relative z-10 my-auto py-2 sm:py-4 text-center sm:text-left">
        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-[#fbf8f3] via-[#e8ded1] to-[#a38c82]">
          {TEXTOS.tituloPrincipal}
        </h2>

        <p className="text-xs sm:text-sm text-stone-400 font-light max-w-lg mt-1.5 sm:mt-2 leading-relaxed line-clamp-2">
          {TEXTOS.citaAmor}
        </p>
      </div>

      {/* Zona inferior: Firma con cariño */}
      <div className="relative z-10 flex items-center justify-between gap-2 pt-2.5 border-t border-white/10 text-[11px] text-stone-400">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400/80" />
          <span className="font-serif text-xs text-stone-300">
            {TEXTOS.nombreRefugio}
          </span>
        </div>

        <p className="text-stone-400 text-right font-light text-[11px]">
          {TEXTOS.pieFrase}
        </p>
      </div>
    </footer>
  );
};
