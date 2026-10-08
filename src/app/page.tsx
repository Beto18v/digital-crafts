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
import { Heart } from 'lucide-react';
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
      <main className="relative z-10 bg-[#faf7f2] dark:bg-[#121013] shadow-[0_25px_60px_rgba(40,20,20,0.08)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] mb-[480px] sm:mb-[540px] md:mb-[580px] rounded-b-[2.5rem] sm:rounded-b-[3.5rem] border-b border-stone-200/80 dark:border-white/10 transition-colors duration-300">
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
          </>
        ) : (
          /* Interactive Coloring Studio */
          <div className="pt-8 sm:pt-12 pb-16">
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
