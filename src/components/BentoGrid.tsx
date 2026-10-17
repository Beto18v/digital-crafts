'use client';

import React from 'react';
import { BentoCard } from './BentoCard';
import { ProjectCardInfo, Language } from '../types';
import { Sparkles, Heart } from 'lucide-react';

/**
 * Textos centralizados de la galería de proyectos / rincones.
 */
const TEXTOS = {
  headerBadgePrefix: 'Nuestros Rincones Especiales',
  headerBadgeSuffix: 'experiencias para compartir',
  titleFavorites: 'Nuestros Momentos Favoritos',
  titleAll: 'Rincones & Juegos para Nosotros',
  subtitle: 'Juegos interactivos, actividades y detalles pensados para compartir de a dos.',
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
  const getFilterLabel = () => {
    if (isOnlyFavorites) return 'Favoritos';
    if (activeFilter === 'games') return 'Juegos en Pareja';
    if (activeFilter === 'art') return 'Arte & Calma';
    if (activeFilter === 'cooking') return 'Cenas & Veladas';
    if (activeFilter === 'live') return 'Listos para jugar';
    return null;
  };

  const currentFilterLabel = getFilterLabel();

  return (
    <section id="bento-grid" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Transición cálida del Hero a los Rincones */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 sm:mb-8 pb-4 sm:pb-5 border-b border-stone-200/70 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>{TEXTOS.headerBadgePrefix}</span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span className="font-normal text-stone-500 dark:text-stone-400">
              {projects.length} {TEXTOS.headerBadgeSuffix}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
            {isOnlyFavorites ? TEXTOS.titleFavorites : TEXTOS.titleAll}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-light">
            {TEXTOS.subtitle}
          </p>
        </div>

        {/* Indicador discreto si hay filtro activo desde el dock inferior */}
        {currentFilterLabel && (
          <div className="flex items-center gap-2 self-start sm:self-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 border border-rose-200/80 dark:border-rose-900/40">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>Filtro:</span>
              <strong className="font-semibold">{currentFilterLabel}</strong>
            </span>
            <button
              type="button"
              onClick={() => onFilterChange('all')}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline cursor-pointer"
            >
              Mostrar todos
            </button>
          </div>
        )}
      </div>

      {/* Cuadrícula compacta y uniforme para PC y Móvil */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr items-stretch">
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
