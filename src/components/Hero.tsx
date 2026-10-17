'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowDown } from 'lucide-react';
import { Language } from '../types';

/**
 * Textos centralizados de la sección Hero.
 * Configuración fácil de editar y 100% en español cálido y romántico.
 */
const TEXTOS = {
  badge: {
    label: 'Nuestro Refugio Privado',
    counterSuffix: 'rincones especiales',
  },
  titleWords: [
    { text: 'Nuestro' },
    { text: 'Refugio' },
    { text: 'Creativo', isItalic: true },
    { text: '&' },
    { text: 'Digital', isItalic: true },
  ],
  subtitle:
    'Un rincón íntimo creado con todo mi amor para celebrar lo que somos: recetas para cocinar a fuego lento, lienzos relajantes para pintar juntos y pequeños tesoros pensados solo para los dos.',
  buttons: {
    explore: 'Explorar nuestro espacio',
  },
};

interface HeroProps {
  lang?: Language;
  onExploreClick?: () => void;
  craftsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  craftsCount,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
      rotateX: -15,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-[62vh] sm:min-h-[75vh] w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 py-8 sm:py-14">
      {/* Animated ambient mesh gradient aura */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 0.95, 1],
            rotate: [0, 6, -5, 0],
            opacity: [0.35, 0.5, 0.4, 0.35],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[380px] h-[320px] sm:w-[680px] sm:h-[420px] rounded-full bg-gradient-to-tr from-rose-200/50 via-amber-100/45 to-purple-100/35 blur-3xl"
        />
      </div>

      <div className="w-full max-w-3xl mx-auto px-2 sm:px-6 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Editorial Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/5 dark:bg-white/10 border border-stone-200/80 dark:border-white/15 text-[11px] sm:text-xs text-stone-600 dark:text-stone-300 font-medium mb-4 backdrop-blur-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>{TEXTOS.badge.label}</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">/</span>
          <span className="font-mono text-stone-500 dark:text-stone-400">
            {craftsCount} {TEXTOS.badge.counterSuffix}
          </span>
        </motion.div>

        {/* Text Reveal Title with Staggered Framer Motion */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-stone-900 dark:text-stone-100 leading-[1.12] mb-3 flex flex-wrap justify-center gap-x-2.5 sm:gap-x-3.5 gap-y-0.5 [text-wrap:balance]"
        >
          {TEXTOS.titleWords.map((item, index) => (
            <span
              key={`${item.text}-${index}`}
              className="inline-block overflow-hidden py-0.5"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block ${
                  item.isItalic
                    ? 'italic text-rose-950 dark:text-rose-300 font-normal underline decoration-rose-300/40 dark:decoration-rose-500/40 decoration-1 underline-offset-6'
                    : ''
                }`}
              >
                {item.text}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {/* Subtitle with Fade In */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-xs sm:text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed font-light mb-6 [text-wrap:balance]"
        >
          {TEXTOS.subtitle}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm"
        >
          <button
            type="button"
            onClick={onExploreClick}
            className="group relative px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-xs active:scale-[0.98] flex items-center gap-2 overflow-hidden cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-rose-300 dark:text-rose-600 group-hover:rotate-45 transition-transform duration-300" />
            <span>{TEXTOS.buttons.explore}</span>
            <ArrowDown className="w-3 h-3 text-stone-400 dark:text-stone-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
