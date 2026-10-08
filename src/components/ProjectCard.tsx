import React from 'react';
import { ArrowUpRight, Clock, Sparkles, Lock, Utensils, Palette, Music, Compass, Heart } from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';

interface ProjectCardProps {
  project: ProjectCardInfo;
  lang: Language;
  onOpen: (project: ProjectCardInfo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  lang,
  onOpen,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isEs = lang === 'es';
  const isAvailable = project.status === 'available' || project.status === 'Live';
  const isComingSoon = project.status === 'coming-soon' || project.status === 'Coming Soon';
  const isInProgress = project.status === 'in-progress' || project.status === 'In Progress';

  // Status visual label and tone
  const statusConfig = isAvailable
    ? {
        text: isEs ? 'Disponible' : 'Available',
        badgeClass: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/60',
        dotClass: 'bg-emerald-500',
      }
    : isInProgress
    ? {
        text: isEs ? 'En progreso' : 'In Progress',
        badgeClass: 'text-amber-800 bg-amber-50/80 border-amber-200/60',
        dotClass: 'bg-amber-500',
      }
    : {
        text: isEs ? 'Próximamente' : 'Coming Soon',
        badgeClass: 'text-stone-600 bg-stone-100/90 border-stone-200/80',
        dotClass: 'bg-stone-400',
      };

  // Specific theme illustration icon for card hero art
  const renderArtIcon = () => {
    switch (project.id) {
      case 'date-night-playbook':
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-100/80 flex items-center justify-center text-rose-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Utensils className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs">
              🍷
            </div>
          </div>
        );
      case 'coloring-canvas':
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-amber-100/80 flex items-center justify-center text-amber-800 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Palette className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 text-xs">
              🎨
            </div>
          </div>
        );
      case 'memory-capsule':
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-800 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Music className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 text-xs">
              📻
            </div>
          </div>
        );
      default:
        return (
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <Compass className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs">
              ✨
            </div>
          </div>
        );
    }
  };

  return (
    <article className="group relative flex flex-col bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-300 hover:border-stone-300 overflow-hidden">
      {/* Visual Cover Art Area with Subtle Zoom on Hover */}
      <div className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-stone-100 via-[#f7f5f0] to-stone-200/70 flex items-center justify-center select-none border-b border-stone-100">
        {/* Subtle patterned craft background */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Dynamic Artistic Visual Container with hover zoom */}
        <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500 ease-out flex flex-col items-center">
          {renderArtIcon()}
          <span className="mt-3 text-xs tracking-wider uppercase font-mono text-stone-500">
            craft #{project.id.slice(0, 4)}
          </span>
        </div>

        {/* Top-Right Favorite Bookmark Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id);
            }}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-stone-200/80 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:scale-105 transition-all shadow-xs"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
              }`}
            />
          </button>
        )}

        {/* Top-Left Status Indicator */}
        <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-white/95 backdrop-blur-xs shadow-xs">
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`}
            aria-hidden="true"
          />
          <span className="text-stone-700">{statusConfig.text}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-6">
        {/* Unboxed Metadata & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3 text-xs text-stone-500">
          {project.tags.map((tag, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium text-stone-600 hover:text-stone-900 transition-colors">
                {tag[lang]}
              </span>
              {idx < project.tags.length - 1 && (
                <span aria-hidden="true" className="text-stone-300">
                  ·
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 group-hover:text-rose-950 transition-colors mb-2.5 tracking-tight">
          {project.title[lang]}
        </h3>

        {/* Description Clamped to 2 lines */}
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-6 flex-1">
          {project.description[lang]}
        </p>

        {/* Card Footer with CTA Button */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-400 font-mono">
            {project.slug}
          </div>

          {isAvailable ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-rose-950 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <span>{isEs ? 'Abrir' : 'Open'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          ) : isInProgress ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer"
            >
              <span>{isEs ? 'Ver Avance' : 'Preview'}</span>
              <Sparkles className="w-3 h-3 text-amber-600" />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-400 bg-stone-100 border border-stone-200/60 cursor-not-allowed select-none"
            >
              <Lock className="w-3 h-3 text-stone-400" />
              <span>{isEs ? 'Próximamente' : 'Coming Soon'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
