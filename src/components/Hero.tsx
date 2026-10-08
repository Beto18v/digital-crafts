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
        staggerChildren: 0.08,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '110%',
      opacity: 0,
      rotateX: -20,
    },
    visible: {
      y: '0%',
      opacity: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative min-h-[100dvh] w-full flex flex-col justify-center items-center overflow-hidden px-4 md:px-8 py-16 sm:py-20">
      {/* Animated ambient mesh gradient aura */}
      <div className="absolute inset-0 pointer-events-none -z-10 flex items-center justify-center overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.15, 0.95, 1],
            rotate: [0, 8, -6, 0],
            opacity: [0.4, 0.6, 0.45, 0.4],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[580px] h-[400px] sm:w-[800px] sm:h-[480px] rounded-full bg-gradient-to-tr from-rose-200/50 via-amber-100/45 to-purple-100/35 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, -30, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-10 right-1/4 w-[350px] h-[350px] rounded-full bg-gradient-to-bl from-amber-200/40 via-rose-100/30 to-transparent blur-3xl"
        />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10 flex flex-col items-center justify-center">
        {/* Editorial Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/5 dark:bg-white/10 border border-stone-200/80 dark:border-white/15 text-xs text-stone-600 dark:text-stone-300 font-medium mb-6 backdrop-blur-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>{TEXTOS.badge.label}</span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">
            /
          </span>
          <span className="font-mono text-stone-500 dark:text-stone-400">
            {craftsCount} {TEXTOS.badge.counterSuffix}
          </span>
        </motion.div>

        {/* Text Reveal Title with Staggered Framer Motion */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] mb-6 flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 [text-wrap:balance]"
        >
          {TEXTOS.titleWords.map((item, index) => (
            <span
              key={`${item.text}-${index}`}
              className="inline-block overflow-hidden py-1"
            >
              <motion.span
                variants={wordVariants}
                className={`inline-block ${
                  item.isItalic
                    ? 'italic text-rose-950 dark:text-rose-300 font-normal underline decoration-rose-300/40 dark:decoration-rose-500/40 decoration-1 underline-offset-8'
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed font-light mb-10 [text-wrap:balance]"
        >
          {TEXTOS.subtitle}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <button
            type="button"
            onClick={onExploreClick}
            className="group relative px-6 py-3.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2.5 overflow-hidden cursor-pointer"
          >
            <Compass className="w-4 h-4 text-rose-300 dark:text-rose-600 group-hover:rotate-45 transition-transform duration-300" />
            <span>{TEXTOS.buttons.explore}</span>
            <ArrowDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
