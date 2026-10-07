'use client';

import React, { useState, useEffect } from 'react';
import { FloatingDock } from '../components/FloatingDock';
import { RevealFooter } from '../components/RevealFooter';
import { Hero } from '../components/Hero';
import { BentoGrid } from '../components/BentoGrid';
import { ProjectModal } from '../components/ProjectModal';
import { ColoringStudio } from '../components/ColoringStudio';
import { projects } from '../data/projects';
import { Language, ProjectCardInfo } from '../types';
import { Heart, Sparkles, Coffee, Feather, Moon, Palette, Layers, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Page() {
  const [lang, setLang] = useState<Language>('es');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([
    'date-night-playbook',
    'adventure-jar',
  ]);
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);
  const [activeModalProject, setActiveModalProject] = useState<ProjectCardInfo | null>(null);
  const [showLoveToast, setShowLoveToast] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'hub' | 'coloring'>('hub');

  // Persistent Dark Mode State
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

  const isEs = lang === 'es';

  // Toggle favorite / bookmark
  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    if (onlyFavorites && !favorites.includes(project.id)) {
      return false;
    }
    if (activeFilter === 'live') {
      return project.status === 'Live' || project.status === 'available';
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
    } else {
      setActiveModalProject(project);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#faf7f2] dark:bg-[#121013] text-stone-800 dark:text-stone-100 antialiased selection:bg-rose-200 dark:selection:bg-rose-900 selection:text-stone-900 dark:selection:text-rose-100 overflow-x-clip transition-colors duration-300">
      {/* Discreet Quiet Top Brand Bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-10 py-5 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => setViewMode('hub')}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <span className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-rose-950 dark:group-hover:text-rose-300 transition-colors">
              Our Digital Crafts
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          </button>
        </div>

        {/* View Switcher Pills */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-white/70 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-white/10 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('hub')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'hub'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isEs ? 'Catálogo' : 'Hub'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('coloring')}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              viewMode === 'coloring'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>{isEs ? 'Lienzo para Colorear' : 'Coloring Canvas'}</span>
          </button>
        </div>
      </div>

      {/* Love Sparkle Floating Toast Notification */}
      <AnimatePresence>
        {showLoveToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-rose-200 dark:border-rose-900/40 shadow-xl shadow-rose-900/10 flex items-center gap-2.5 text-xs text-rose-950 dark:text-rose-200 font-medium pointer-events-none"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
            <span>
              {isEs
                ? 'Te amo. Gracias por construir tantos momentos juntos.'
                : 'I love you. Thank you for crafting so many moments together.'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Solid Content Container (Lifts like a curtain to reveal the footer below) */}
      <main className="relative z-10 bg-[#faf7f2] dark:bg-[#121013] shadow-[0_25px_60px_rgba(40,20,20,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] mb-[480px] sm:mb-[540px] md:mb-[580px] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] border-b border-stone-200/80 dark:border-white/10 transition-colors duration-300 pt-16">
        {viewMode === 'hub' ? (
          <>
            {/* Hero Section */}
            <Hero
              lang={lang}
              craftsCount={projects.length}
              onExploreClick={scrollToBento}
            />

            {/* Bento Grid Architecture */}
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

            {/* Intimate Story & Couple Manifesto */}
            <section
              id="story"
              className="bg-white/70 dark:bg-stone-900/40 backdrop-blur-md border-t border-stone-200/70 dark:border-white/10 py-16 sm:py-24"
            >
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-14">
                  <span className="text-xs font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
                    {isEs ? 'Nuestro Espacio Compartido' : 'Our Shared Space'}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 mt-2 tracking-tight">
                    {isEs
                      ? 'Pequeñas cosas hechas con mucho amor'
                      : 'Little things crafted with deep love'}
                  </h2>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mt-3 leading-relaxed [text-wrap:balance]">
                    {isEs
                      ? 'Un rincón tranquilo, libre de notificaciones y algoritmos, diseñado para disfrutar del tiempo de calidad que nos dedicamos.'
                      : 'A serene corner, free from feeds and notifications, dedicated exclusively to the quality time we share.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="p-7 rounded-3xl bg-[#faf7f2] dark:bg-[#1a171c] border border-stone-200/80 dark:border-white/10 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-300 mb-4">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mb-2">
                      {isEs ? 'Pausa & Calma' : 'Quiet Rituals'}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {isEs
                        ? 'Preparar una cena sin prisas, descorchar un vino y disfrutar de cocinar el uno con el otro.'
                        : 'Cooking unhurried dinners, opening wine, and delighting in making a meal hand in hand.'}
                    </p>
                  </div>

                  <div className="p-7 rounded-3xl bg-[#faf7f2] dark:bg-[#1a171c] border border-stone-200/80 dark:border-white/10 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-4">
                      <Feather className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mb-2">
                      {isEs ? 'Creatividad Juntos' : 'Shared Art'}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {isEs
                        ? 'Lienzos para pintar acuarelas y notas espontáneas que nos sacan una sonrisa en cualquier momento.'
                        : 'Watercolors to paint in sync and spontaneous notes that spark a warm smile anytime.'}
                    </p>
                  </div>

                  <div className="p-7 rounded-3xl bg-[#faf7f2] dark:bg-[#1a171c] border border-stone-200/80 dark:border-white/10 shadow-2xs">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-4">
                      <Heart className="w-5 h-5 fill-emerald-500/50" />
                    </div>
                    <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100 mb-2">
                      {isEs ? 'Nuestros Recuerdos' : 'Our Memories'}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                      {isEs
                        ? 'Un archivo vivo de viajes, canciones y fechas que son solo nuestras y de nadie más.'
                        : 'A living archive of adventures, melodies, and dates that belong uniquely to us.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Interactive Coloring Studio */
          <div className="pt-4 pb-16">
            <ColoringStudio
              lang={lang}
              onBackToHub={() => setViewMode('hub')}
            />
          </div>
        )}
      </main>

      {/* Curtain Reveal Footer (Fixed at z-0, revealed as the main layer scrolls up) */}
      <RevealFooter lang={lang} />

      {/* Floating Dynamic Dock (Fixed at bottom z-50, always accessible) */}
      <FloatingDock
        lang={lang}
        onToggleLang={() => setLang(lang === 'es' ? 'en' : 'es')}
        onScrollToTop={scrollToTop}
        onScrollToBento={scrollToBento}
        onLoveSparkle={triggerLoveSparkle}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Interactive Project Modal */}
      <ProjectModal
        project={activeModalProject}
        lang={lang}
        onClose={() => setActiveModalProject(null)}
      />
    </div>
  );
}
