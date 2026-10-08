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
      className="fixed bottom-0 left-0 w-full z-0 h-[480px] sm:h-[540px] md:h-[580px] bg-[#221617] text-stone-100 flex flex-col justify-between px-6 sm:px-10 md:px-16 py-12 sm:py-16 overflow-hidden select-none"
    >
      {/* Luz ambiental cálida y romántica */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-rose-900/30 via-amber-900/15 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 right-10 w-[400px] h-[300px] bg-rose-950/40 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Zona superior: Insignias de complicidad y reloj en vivo */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-xs uppercase font-mono tracking-widest text-stone-400">
            {TEXTOS.insigniaSuperior}
          </span>
          <span className="text-stone-600">·</span>
          <span className="text-xs text-rose-200/80 font-serif italic text-sm">
            {TEXTOS.insigniaEdicion}
          </span>
        </div>

        {/* Reloj con hora compartida */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-stone-300">
          <Moon className="w-3.5 h-3.5 text-rose-300" />
          <span>{currentTime || '00:00:00'}</span>
          <span className="text-[10px] text-stone-500 font-sans uppercase">
            {TEXTOS.horaCompartida}
          </span>
        </div>
      </div>

      {/* Zona central: Título editorial y cita romántica */}
      <div className="relative z-10 my-auto py-6 sm:py-10 text-center sm:text-left">
        <p className="text-xs uppercase tracking-widest text-rose-300/70 font-mono mb-3">
          {TEXTOS.dedicatoria}
        </p>

        <h2 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-normal tracking-tight leading-[0.95] bg-clip-text text-transparent bg-gradient-to-b from-[#fbf8f3] via-[#e8ded1] to-[#a38c82]">
          {TEXTOS.tituloPrincipal}
        </h2>

        <p className="text-sm sm:text-base text-stone-400 font-light max-w-xl mt-4 sm:mt-6 leading-relaxed [text-wrap:balance]">
          {TEXTOS.citaAmor}
        </p>
      </div>

      {/* Zona inferior: Firma con cariño */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/80" />
          <span className="font-serif text-sm text-stone-300">
            {TEXTOS.nombreRefugio}
          </span>
          <span className="text-stone-600">·</span>
          <span>{TEXTOS.hechoConAmor}</span>
        </div>

        <p className="text-stone-500 text-center sm:text-right font-light">
          {TEXTOS.pieFrase}
        </p>
      </div>
    </footer>
  );
};
