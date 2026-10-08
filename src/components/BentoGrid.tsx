'use client';

import React from 'react';
import { BentoCard } from './BentoCard';
import { ProjectCardInfo, Language } from '../types';
import { Sparkles, Heart } from 'lucide-react';

/**
 * Textos centralizados de la galería de proyectos / rincones.
 */
const TEXTOS = {
  headerBadgePrefix: '01. Nuestros Rincones',
  headerBadgeSuffix: 'experiencias para compartir',
  titleFavorites: 'Nuestros Momentos Favoritos',
  titleAll: 'Rincones & Experiencias para Nosotros',
  filterTabs: [
    { id: 'all', label: 'Todos' },
    { id: 'live', label: 'Listos para disfrutar' },
    { id: 'cooking', label: 'Cocina & Veladas' },
    { id: 'art', label: 'Arte & Calma' },
  ],
  emptyState: {
    title: 'Aún no hay momentos guardados aquí',
    description: 'Guarda tus rincones favoritos con el corazón para verlos juntos aquí cuando quieras.',
    buttonReset: 'Ver todos nuestros rincones',
  },
};

interface BentoGridProps {
  projects: ProjectCardInfo[];
  lang?: Language;
  onOpenProject: (project: ProjectCardInfo) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  isOnlyFavorites: boolean;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  projects,
  onOpenProject,
  favorites,
  onToggleFavorite,
  activeFilter,
  onFilterChange,
  isOnlyFavorites,
}) => {
  return (
    <section id="bento-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Section Header with Segmented Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{TEXTOS.headerBadgePrefix}</span>
            <span>·</span>
            <span className="tabular-nums">
              {projects.length} {TEXTOS.headerBadgeSuffix}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
            {isOnlyFavorites ? TEXTOS.titleFavorites : TEXTOS.titleAll}
          </h2>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-2xl text-xs font-medium text-stone-600 dark:text-stone-300">
            {TEXTOS.filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeFilter === tab.id && !isOnlyFavorites
                    ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Responsive Bento Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 auto-rows-auto">
          {projects.map((project, index) => (
            <BentoCard
              key={project.id}
              project={project}
              onOpen={onOpenProject}
              isFavorite={favorites.includes(project.id)}
              onToggleFavorite={onToggleFavorite}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md rounded-3xl border border-stone-200/80 dark:border-white/10 shadow-xs max-w-lg mx-auto">
          <Heart className="w-8 h-8 text-rose-300 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-stone-800 dark:text-stone-200 mb-2">
            {TEXTOS.emptyState.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
            {TEXTOS.emptyState.description}
          </p>
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            {TEXTOS.emptyState.buttonReset}
          </button>
        </div>
      )}
    </section>
  );
};
