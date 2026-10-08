import React, { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  Home,
  LayoutGrid,
  Heart,
  Globe,
  ArrowUp,
  Sun,
  Moon,
} from 'lucide-react';
import { Language } from '../types';

/**
 * Textos centralizados de la barra de navegación flotante.
 */
const TEXTOS = {
  inicio: {
    tooltip: 'Inicio',
    ariaLabel: 'Ir al inicio de nuestro espacio',
  },
  rincones: {
    tooltip: 'Nuestros rincones',
    ariaLabel: 'Explorar nuestros rincones',
  },
  corazon: {
    tooltip: 'Un latido con amor',
    ariaLabel: 'Enviar un latido de amor',
  },
  temaClaro: {
    tooltip: 'Luz de velas (Modo claro)',
    ariaLabel: 'Cambiar a modo claro con luz de velas',
  },
  temaOscuro: {
    tooltip: 'Noche estrellada (Modo oscuro)',
    ariaLabel: 'Cambiar a modo noche estrellada',
  },
  volverArriba: {
    tooltip: 'Volver arriba',
    ariaLabel: 'Subir suavemente al inicio',
  },
  idioma: {
    tooltip: 'Idioma',
    ariaLabel: 'Cambiar idioma',
  },
};

interface FloatingDockProps {
  lang: Language;
  onToggleLang: () => void;
  onScrollToTop: () => void;
  onScrollToBento: () => void;
  onLoveSparkle?: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  tooltip: string;
  ariaLabel: string;
  isSpecialHeart?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  tooltip,
  ariaLabel,
  isSpecialHeart = false,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Motion values for physical cursor attraction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth tactile spring physics
  const springX = useSpring(mouseX, { stiffness: 220, damping: 15, mass: 0.12 });
  const springY = useSpring(mouseY, { stiffness: 220, damping: 15, mass: 0.12 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const pullX = (e.clientX - centerX) * 0.32;
    const pullY = (e.clientY - centerY) * 0.32;

    mouseX.set(pullX);
    mouseY.set(pullY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleClick = () => {
    if (isSpecialHeart) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 900);
    }
    onClick();
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Tooltip Label */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: -42, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.92 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute bottom-full mb-1 z-30 pointer-events-none whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium bg-stone-900/90 dark:bg-stone-100/95 text-stone-100 dark:text-stone-900 shadow-lg backdrop-blur-md border border-white/10 dark:border-stone-900/10"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magnetic Button */}
      <motion.button
        ref={ref}
        type="button"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.88 }}
        style={{ x: springX, y: springY }}
        aria-label={ariaLabel}
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 cursor-pointer ${
          isSpecialHeart
            ? 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 active:bg-rose-200/80 shadow-xs'
            : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-white/10 active:bg-stone-200/60'
        }`}
      >
        {/* Heart ripple animation when clicked */}
        {isSpecialHeart && isPulsing && (
          <motion.span
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-rose-400/40 pointer-events-none -z-10"
          />
        )}

        <motion.div
          animate={
            isSpecialHeart && isPulsing
              ? { scale: [1, 1.35, 1.1, 1.25, 1] }
              : {}
          }
          transition={{ duration: 0.6 }}
        >
          {children}
        </motion.div>
      </motion.button>
    </div>
  );
};

export const FloatingDock: React.FC<FloatingDockProps> = ({
  lang,
  onToggleLang,
  onScrollToTop,
  onScrollToBento,
  onLoveSparkle,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <nav
      role="navigation"
      aria-label="Barra de navegación de nuestro espacio"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <motion.div
        initial={{ y: 70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.15 }}
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white/60 dark:bg-stone-900/70 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-[0_12px_45px_rgba(40,25,25,0.1)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.6)] ring-1 ring-stone-900/5 dark:ring-white/10 transition-colors duration-300"
      >
        {/* 1. Inicio */}
        <MagneticButton
          onClick={onScrollToTop}
          tooltip={TEXTOS.inicio.tooltip}
          ariaLabel={TEXTOS.inicio.ariaLabel}
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
        </MagneticButton>

        {/* 2. Nuestros Rincones */}
        <MagneticButton
          onClick={onScrollToBento}
          tooltip={TEXTOS.rincones.tooltip}
          ariaLabel={TEXTOS.rincones.ariaLabel}
        >
          <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
        </MagneticButton>

        {/* Separador romántico */}
        <div className="h-5 w-px bg-stone-300/60 dark:bg-stone-700/60 mx-0.5" aria-hidden="true" />

        {/* 3. Botón de latido con corazón */}
        <MagneticButton
          onClick={() => {
            if (onLoveSparkle) onLoveSparkle();
          }}
          tooltip={TEXTOS.corazon.tooltip}
          ariaLabel={TEXTOS.corazon.ariaLabel}
          isSpecialHeart={true}
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-rose-500 text-rose-500 stroke-[1.8]" />
        </MagneticButton>

        {/* Separador romántico */}
        <div className="h-5 w-px bg-stone-300/60 dark:bg-stone-700/60 mx-0.5" aria-hidden="true" />

        {/* 4. Selector de Idioma */}
        <MagneticButton
          onClick={onToggleLang}
          tooltip={TEXTOS.idioma.tooltip}
          ariaLabel={TEXTOS.idioma.ariaLabel}
        >
          <div className="flex items-center gap-1 font-mono text-xs font-bold tracking-tight text-stone-700 dark:text-stone-200">
            <Globe className="w-3.5 h-3.5 text-stone-400 dark:text-stone-400" />
            <span className="uppercase">{lang}</span>
          </div>
        </MagneticButton>

        {/* 5. Luz de velas / Noche estrellada */}
        <MagneticButton
          onClick={onToggleTheme}
          tooltip={isDarkMode ? TEXTOS.temaClaro.tooltip : TEXTOS.temaOscuro.tooltip}
          ariaLabel={isDarkMode ? TEXTOS.temaClaro.ariaLabel : TEXTOS.temaOscuro.ariaLabel}
        >
          <motion.div
            key={isDarkMode ? 'dark' : 'light'}
            initial={{ rotate: -40, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.25 }}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 stroke-[1.8]" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-700 stroke-[1.8]" />
            )}
          </motion.div>
        </MagneticButton>

        {/* 6. Subir suavemente */}
        <MagneticButton
          onClick={onScrollToTop}
          tooltip={TEXTOS.volverArriba.tooltip}
          ariaLabel={TEXTOS.volverArriba.ariaLabel}
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
        </MagneticButton>
      </motion.div>
    </nav>
  );
};
