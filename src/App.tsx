'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { FloatingDock } from './components/FloatingDock';
import { RevealFooter } from './components/RevealFooter';
import { Hero } from './components/Hero';
import { BentoGrid } from './components/BentoGrid';
import { ProjectModal } from './components/ProjectModal';
import { projects } from './data/projects';
import { Language, ProjectCardInfo } from './types';
import { Heart, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * OPTIMIZACIÓN 1: CODE SPLITTING & LAZY LOADING
 * ColoringStudio (que encapsula ColoringCanvas, las utilidades pesadas de floodFill
 * y la galería de láminas) se importa de forma dinámica y bajo demanda con React.lazy().
 * Esto descarga más de 400 KiB del hilo principal y acelera el First Contentful Paint (FCP)
 * y Time to Interactive (TTI) en móviles.
 */
const ColoringStudio = lazy(() => import('./components/ColoringStudio'));
const CoupleQuizGame = lazy(() => import('./components/CoupleQuizGame'));
const RiddleDuelGame = lazy(() => import('./components/RiddleDuelGame'));
const WouldYouRatherGame = lazy(() => import('./components/WouldYouRatherGame'));
const IfIWereGame = lazy(() => import('./components/IfIWereGame'));

/**
 * Textos centralizados de la página principal.
 */
const TEXTOS = {
  mensajeAmorToast: 'Te amo. Gracias por construir tantos momentos juntos.',
  cargandoLienzo: 'Preparando nuestro rincón interactivo...',
  cargandoSubtitulo: 'Cargando herramientas, preguntas y momentos...',
};

/**
 * Componente Loader ligero y estético con Tailwind para el Suspense fallback del lienzo.
 */
function ColoringLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-4xl mx-auto my-8 sm:my-12 p-6 sm:p-14 flex flex-col items-center justify-center min-h-[380px] rounded-3xl bg-white/70 dark:bg-stone-900/70 border border-stone-200/80 dark:border-white/10 backdrop-blur-md shadow-xs animate-fade-in"
    >
      <div className="relative flex items-center justify-center w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-rose-300 dark:border-rose-900/50 animate-ping opacity-30" />
        <div className="w-12 h-12 rounded-full border-2 border-stone-200 dark:border-stone-800 border-t-rose-500 animate-spin" />
        <Palette className="w-5 h-5 text-rose-500 absolute" />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal mb-1.5 text-center">
        {TEXTOS.cargandoLienzo}
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 text-center max-w-md">
        {TEXTOS.cargandoSubtitulo}
      </p>

      {/* Esqueleto preliminar para evitar saltos de layout (CLS) */}
      <div className="w-full max-w-md mt-6 space-y-2.5">
        <div className="h-2 bg-stone-200/60 dark:bg-stone-800/60 rounded-full animate-pulse w-3/4 mx-auto" />
        <div className="h-1.5 bg-stone-200/40 dark:bg-stone-850/40 rounded-full animate-pulse w-1/2 mx-auto" />
      </div>
    </div>
  );
}

export default function App() {
  const [lang] = useState<Language>('es');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([
    'couple-quiz',
    'riddle-duel',
    'would-you-rather',
    'if-i-were',
    'coloring-canvas',
  ]);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<ProjectCardInfo | null>(null);
  const [showLoveToast, setShowLoveToast] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<
    'hub' | 'coloring' | 'couple-quiz' | 'riddle-duel' | 'would-you-rather' | 'if-i-were'
  >('hub');

  // Modo Oscuro persistente (Luz de velas vs Noche estrellada)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Alternar favoritos
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtrado de rincones
  const filteredProjects = projects.filter((project) => {
    if (onlyFavorites && !favorites.includes(project.id)) {
      return false;
    }
    if (activeFilter === 'live') {
      return project.status === 'Live' || project.status === 'available';
    }
    if (activeFilter === 'games') {
      return (
        project.category.es.toLowerCase().includes('juegos') ||
        project.id === 'couple-quiz'
      );
    }
    if (activeFilter === 'cooking') {
      return (
        project.category.es.toLowerCase().includes('cocina') ||
        project.category.en.toLowerCase().includes('culinary')
      );
    }
    if (activeFilter === 'art') {
      return (
        project.category.es.toLowerCase().includes('arte') ||
        project.category.en.toLowerCase().includes('art')
      );
    }
    return true;
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBento = () => {
    if (viewMode !== 'hub') {
      setViewMode('hub');
      setTimeout(() => {
        const el = document.getElementById('bento-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById('bento-grid');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerLoveSparkle = () => {
    setShowLoveToast(true);
    setTimeout(() => setShowLoveToast(false), 3200);
  };

  const handleOpenProject = (project: ProjectCardInfo) => {
    if (project.id === 'coloring-canvas') {
      setViewMode('coloring');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (project.id === 'couple-quiz') {
      setViewMode('couple-quiz');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (project.id === 'riddle-duel') {
      setViewMode('riddle-duel');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (project.id === 'would-you-rather') {
      setViewMode('would-you-rather');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (project.id === 'if-i-were') {
      setViewMode('if-i-were');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveModalProject(project);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf7f2] dark:bg-[#121013] text-stone-800 dark:text-stone-100 antialiased selection:bg-rose-200 dark:selection:bg-rose-900 selection:text-stone-900 dark:selection:text-rose-100 overflow-x-clip transition-colors duration-300">
      {/* Notificación flotante de amor con aceleración GPU */}
      <AnimatePresence>
        {showLoveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{ willChange: 'transform, opacity' }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-rose-200 dark:border-rose-900/40 shadow-xl shadow-rose-900/10 flex items-center gap-2 text-xs text-rose-950 dark:text-rose-200 font-medium pointer-events-none"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{TEXTOS.mensajeAmorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenedor principal que se levanta como un telón (mobile first compacto) */}
      <main className="relative z-10 bg-[#faf7f2] dark:bg-[#121013] shadow-[0_20px_50px_rgba(40,20,20,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-[260px] sm:mb-[320px] md:mb-[380px] rounded-b-[2rem] sm:rounded-b-[3rem] border-b border-stone-200/80 dark:border-white/10 transition-colors duration-300">
        {viewMode === 'hub' ? (
          <>
            {/* Sección Hero en el bundle crítico */}
            <Hero
              lang={lang}
              craftsCount={projects.length}
              onExploreClick={scrollToBento}
            />

            {/* Cuadrícula Bento en el bundle crítico */}
            <BentoGrid
              projects={filteredProjects}
              lang={lang}
              onOpenProject={handleOpenProject}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter);
                setOnlyFavorites(false);
              }}
              isOnlyFavorites={onlyFavorites}
            />
          </>
        ) : viewMode === 'coloring' ? (
          /* Estudio interactivo de pintura cargado de manera diferida */
          <div className="pt-4 sm:pt-10 pb-16">
            <Suspense fallback={<ColoringLoader />}>
              <ColoringStudio
                lang={lang}
                onBackToHub={() => setViewMode('hub')}
              />
            </Suspense>
          </div>
        ) : viewMode === 'couple-quiz' ? (
          /* Juego interactivo "¿Qué Tanto Nos Conocemos?" */
          <div className="pt-2 sm:pt-6 pb-16">
            <Suspense fallback={<ColoringLoader />}>
              <CoupleQuizGame
                lang={lang}
                onBack={() => setViewMode('hub')}
              />
            </Suspense>
          </div>
        ) : viewMode === 'riddle-duel' ? (
          /* Juego interactivo "Duelo de Acertijos & Enigmas" */
          <div className="pt-2 sm:pt-6 pb-16">
            <Suspense fallback={<ColoringLoader />}>
              <RiddleDuelGame
                lang={lang}
                onBack={() => setViewMode('hub')}
              />
            </Suspense>
          </div>
        ) : viewMode === 'would-you-rather' ? (
          /* Juego interactivo "Esto o Aquello: Nuestra Sintonía" */
          <div className="pt-2 sm:pt-6 pb-16">
            <Suspense fallback={<ColoringLoader />}>
              <WouldYouRatherGame
                lang={lang}
                onBack={() => setViewMode('hub')}
              />
            </Suspense>
          </div>
        ) : (
          /* Juego interactivo "Yo Si Fuera..." (El Espejo de Metáforas) */
          <div className="pt-2 sm:pt-6 pb-16">
            <Suspense fallback={<ColoringLoader />}>
              <IfIWereGame
                lang={lang}
                onBack={() => setViewMode('hub')}
              />
            </Suspense>
          </div>
        )}
      </main>

      {/* Pie de página telón */}
      <RevealFooter lang={lang} />

      {/* Dock dinámico inferior en el bundle principal */}
      <FloatingDock
        onScrollToTop={scrollToTop}
        onScrollToBento={scrollToBento}
        onLoveSparkle={triggerLoveSparkle}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Modal interactivo de avance */}
      <ProjectModal
        project={activeModalProject}
        lang={lang}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}
