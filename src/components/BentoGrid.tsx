'use client';

import React from 'react';
import { BentoCard } from './BentoCard';
import { ProjectCardInfo, Language } from '../types';
import { Sparkles, Layers, Heart } from 'lucide-react';

interface BentoGridProps {
  projects: ProjectCardInfo[];
  lang: Language;
  onOpenProject: (project: ProjectCardInfo) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  isOnlyFavorites: boolean;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  projects,
  lang,
  onOpenProject,
  favorites,
  onToggleFavorite,
  activeFilter,
  onFilterChange,
  isOnlyFavorites,
}) => {
  const isEs = lang === 'es';

  return (
    <section id="bento-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Section Header with Segmented Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-500 mb-2">
            <Layers className="w-3.5 h-3.5 text-stone-400" />
            <span>{isEs ? '01. Arquitectura Bento' : '01. Bento Architecture'}</span>
            <span>·</span>
            <span className="tabular-nums">
              {projects.length} {isEs ? 'módulos interactivos' : 'interactive crafts'}
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight">
            {isOnlyFavorites
              ? isEs
                ? 'Nuestros Favoritos Seleccionados'
                : 'Our Curated Favorites'
              : isEs
              ? 'Colección de Manualidades Digitales'
              : 'Digital Crafts Collection'}
          </h2>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-800 rounded-2xl text-xs font-medium text-stone-600 dark:text-stone-300">
            {[
              { id: 'all', es: 'Todos', en: 'All' },
              { id: 'live', es: 'Disponibles', en: 'Available' },
              { id: 'cooking', es: 'Cocina & Citas', en: 'Cooking & Dates' },
              { id: 'art', es: 'Arte & Calma', en: 'Art & Calm' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  activeFilter === tab.id && !isOnlyFavorites
                    ? 'bg-white dark:bg-stone-700 text-stone-950 dark:text-white font-semibold shadow-2xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {tab[lang]}
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
              lang={lang}
              onOpen={onOpenProject}
              isFavorite={favorites.includes(project.id)}
              onToggleFavorite={onToggleFavorite}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-6 bg-white/70 backdrop-blur-md rounded-3xl border border-stone-200/80 shadow-xs max-w-lg mx-auto">
          <Heart className="w-8 h-8 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif text-xl text-stone-800 mb-2">
            {isEs ? 'Sin proyectos en este filtro' : 'No crafts found'}
          </h3>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            {isEs
              ? 'No tienes proyectos guardados o no coinciden con la categoría actual.'
              : 'You have no saved crafts in this category or filter.'}
          </p>
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            {isEs ? 'Mostrar todos los proyectos' : 'Show all crafts'}
          </button>
        </div>
      )}
    </section>
  );
};
