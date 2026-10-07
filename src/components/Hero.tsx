import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart, ArrowDown, BookOpen } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  lang: Language;
  onExploreClick?: () => void;
  craftsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  onExploreClick,
  craftsCount,
}) => {
  const isEs = lang === 'es';

  // Words for the staggered text reveal
  const titleWordsEs = ['Nuestro', 'Taller', 'Creativo', '&', 'Digital'];
  const titleWordsEn = ['Our', 'Curated', 'Creative', '&', 'Digital', 'Crafts'];
  const words = isEs ? titleWordsEs : titleWordsEn;

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
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Editorial Sub-badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/5 dark:bg-white/10 border border-stone-200/80 dark:border-white/15 text-xs text-stone-600 dark:text-stone-300 font-medium mb-6 backdrop-blur-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>
            {isEs
              ? 'Espacio Privado para Parejas · Edición 2026'
              : 'Private Couples Space · 2026 Edition'}
          </span>
          <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">
            /
          </span>
          <span className="font-mono text-stone-500 dark:text-stone-400">
            {craftsCount} {isEs ? 'módulos' : 'modules'}
          </span>
        </motion.div>

        {/* Text Reveal Title with Staggered Framer Motion */}
        <motion.h1
          key={lang} // Key triggers smooth re-animation on language switch
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-stone-900 dark:text-stone-100 leading-[1.08] mb-6 flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 [text-wrap:balance]"
        >
          {words.map((word, index) => {
            const isItalicHighlight =
              (isEs && (word === 'Creativo' || word === 'Digital')) ||
              (!isEs && (word === 'Creative' || word === 'Crafts'));

            return (
              <span
                key={`${word}-${index}`}
                className="inline-block overflow-hidden py-1"
              >
                <motion.span
                  variants={wordVariants}
                  className={`inline-block ${
                    isItalicHighlight
                      ? 'italic text-rose-950 dark:text-rose-300 font-normal underline decoration-rose-300/40 dark:decoration-rose-500/40 decoration-1 underline-offset-8'
                      : ''
                  }`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </motion.h1>

        {/* Subtitle with Fade In */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
          className="text-base sm:text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed font-light mb-10 [text-wrap:balance]"
        >
          {isEs
            ? 'Un universo íntimo de experiencias interactivas concebidas para alimentar la complicidad: recetas gastronómicas para cocinar de noche, lienzos relajantes y mapas de recuerdos compartidos.'
            : 'An intimate universe of interactive experiences designed to spark connection: culinary companion guides, calming synchronized canvases, and maps of shared memories.'}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 text-sm"
        >
          <button
            type="button"
            onClick={onExploreClick}
            className="group relative px-6 py-3.5 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-medium hover:bg-stone-800 dark:hover:bg-white transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center gap-2.5 overflow-hidden"
          >
            <Compass className="w-4 h-4 text-rose-300 dark:text-rose-600 group-hover:rotate-45 transition-transform duration-300" />
            <span>{isEs ? 'Explorar el Bento Grid' : 'Explore Bento Grid'}</span>
            <ArrowDown className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <a
            href="#story"
            className="px-5 py-3.5 rounded-full bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white border border-stone-200/90 dark:border-white/10 shadow-2xs hover:shadow-xs transition-all font-medium flex items-center gap-2 backdrop-blur-xs"
          >
            <BookOpen className="w-4 h-4 text-stone-400" />
            <span>{isEs ? 'Historia del Proyecto' : 'Story & Vision'}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
