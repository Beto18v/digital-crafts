import React from 'react';
import { ArrowUpRight, Sparkles, Lock, Utensils, Heart } from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';

/**
 * Textos centralizados para la tarjeta de proyecto alternativa.
 */
const TEXTOS = {
  estados: {
    disponible: 'Disponible',
    enProceso: 'En preparación',
    proximamente: 'Próximamente',
  },
  botones: {
    comenzar: 'Comenzar',
    verAvance: 'Ver avance',
    proximamente: 'Próximamente',
  },
  favoritos: {
    guardar: 'Guardar en nuestros favoritos',
    quitar: 'Quitar de nuestros favoritos',
  },
};

interface ProjectCardProps {
  project: ProjectCardInfo;
  lang?: Language;
  onOpen: (project: ProjectCardInfo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  isFavorite = false,
  onToggleFavorite,
}) => {
  const isAvailable = project.status === 'available' || project.status === 'Live';
  const isInProgress = project.status === 'in-progress' || project.status === 'In Progress';

  const statusConfig = isAvailable
    ? {
        text: TEXTOS.estados.disponible,
        badgeClass: 'text-emerald-700 bg-emerald-50/80 border-emerald-200/60',
        dotClass: 'bg-emerald-500',
      }
    : isInProgress
    ? {
        text: TEXTOS.estados.enProceso,
        badgeClass: 'text-amber-800 bg-amber-50/80 border-amber-200/60',
        dotClass: 'bg-amber-500',
      }
    : {
        text: TEXTOS.estados.proximamente,
        badgeClass: 'text-stone-600 bg-stone-100/90 border-stone-200/80',
        dotClass: 'bg-stone-400',
      };

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/90 dark:bg-stone-900/90 p-6 backdrop-blur-md border border-stone-200/80 dark:border-white/10 transition-all duration-300 shadow-sm hover:shadow-md">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.badgeClass}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
          <span>{statusConfig.text}</span>
        </span>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id);
            }}
            title={isFavorite ? TEXTOS.favoritos.quitar : TEXTOS.favoritos.guardar}
            aria-label={isFavorite ? TEXTOS.favoritos.quitar : TEXTOS.favoritos.guardar}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 dark:text-stone-100 group-hover:text-rose-950 transition-colors mb-2 tracking-tight">
          {project.title.es || project.title.en}
        </h3>

        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2 mb-6">
          {project.description.es || project.description.en}
        </p>

        <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="text-xs text-stone-400 font-mono">
            {project.slug}
          </div>

          {isAvailable ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-stone-900 hover:bg-rose-950 active:scale-[0.98] transition-all shadow-xs cursor-pointer"
            >
              <span>{TEXTOS.botones.comenzar}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-300" />
            </button>
          ) : isInProgress ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 transition-colors cursor-pointer"
            >
              <span>{TEXTOS.botones.verAvance}</span>
              <Sparkles className="w-3 h-3 text-amber-600" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 font-medium select-none">
              <Lock className="w-3.5 h-3.5" />
              <span>{TEXTOS.botones.proximamente}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
