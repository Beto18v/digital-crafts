import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Sparkles,
  Lock,
  Utensils,
  Palette,
  Heart,
  Shuffle,
} from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';
import { cn } from '../lib/utils';

/**
 * Textos centralizados de la tarjeta individual.
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
  artworks: {
    cocinaSubtitulo: 'Menú sugerido para los dos',
    cocinaDetalles: '35 min · A la luz de las velas · Música suave',
    cocinaListo: 'Listo',
    lienzoSubtitulo: 'Lienzo interactivo · Colección de láminas',
    lienzoTitulo: 'Acuarelas & Bote de pintura',
    lienzoListo: 'Listo para pintar',
    tarjetasSubtitulo: '52 Cartas íntimas',
    tarjetasDetalles: 'Conversaciones & momentos espontáneos',
  },
};

interface BentoCardProps {
  project: ProjectCardInfo;
  lang?: Language;
  onOpen: (project: ProjectCardInfo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  index: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  project,
  onOpen,
  isFavorite = false,
  onToggleFavorite,
  index,
}) => {
  const isLive = project.status === 'Live' || project.status === 'available';
  const isInProgress = project.status === 'In Progress' || project.status === 'in-progress';
  const isFeatured = !!project.featured;

  // Mouse position for subtle dynamic radial glow on hover
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Status badge config
  const statusConfig = isLive
    ? {
        text: TEXTOS.estados.disponible,
        bgClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
        dotClass: 'bg-emerald-500 animate-pulse',
      }
    : isInProgress
    ? {
        text: TEXTOS.estados.enProceso,
        bgClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
        dotClass: 'bg-amber-500',
      }
    : {
        text: TEXTOS.estados.proximamente,
        bgClass: 'bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700',
        dotClass: 'bg-stone-400',
      };

  // Specific visual art graphics per card
  const renderVisualArtwork = () => {
    if (project.id === 'date-night-playbook') {
      return (
        <div className="relative w-full h-full min-h-[170px] flex items-center justify-center p-6 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full max-w-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-300 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <Utensils className="w-7 h-7" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800/80 dark:text-rose-300 font-semibold">
                {TEXTOS.artworks.cocinaSubtitulo}
              </span>
              <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                Truffle Pappardelle & Barolo
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {TEXTOS.artworks.cocinaDetalles}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-xs text-stone-400 font-mono">
              <span>🍷 100%</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                {TEXTOS.artworks.cocinaListo}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'coloring-canvas') {
      return (
        <div className="relative w-full h-full min-h-[170px] flex items-center justify-center p-6 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/5 rounded-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full max-w-md bg-white/85 dark:bg-stone-900/85 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-700 dark:text-amber-300 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <Palette className="w-7 h-7" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800/80 dark:text-amber-300 font-semibold block">
                {TEXTOS.artworks.lienzoSubtitulo}
              </span>
              <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                {TEXTOS.artworks.lienzoTitulo}
              </h4>
              <div className="flex gap-1.5 items-center mt-1.5">
                {['#f43f5e', '#fb923c', '#eab308', '#10b981', '#06b6d4', '#8b5cf6'].map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-3.5 h-3.5 rounded-full ring-1 ring-white/60 dark:ring-stone-800 shadow-2xs group-hover:scale-110 transition-transform"
                  />
                ))}
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end text-xs text-stone-400 font-mono">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">🎨 Activo</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                {TEXTOS.artworks.lienzoListo}
              </span>
            </div>
          </div>
        </div>
      );
    }

    // Default: Adventure Jar
    return (
      <div className="relative w-full h-full min-h-[130px] flex items-center justify-center p-4 select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-rose-500/5 to-transparent rounded-2xl" />
        <div className="relative z-10 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 flex items-center justify-center text-purple-700 dark:text-purple-300">
            <Shuffle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700 dark:text-purple-300 font-semibold block">
              {TEXTOS.artworks.tarjetasSubtitulo}
            </span>
            <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              {TEXTOS.artworks.tarjetasDetalles}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.65,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, scale: 1.01 }}
      style={{ willChange: 'transform, opacity' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/90 dark:bg-[#1a171c]/90 p-6 sm:p-7 md:p-8 backdrop-blur-md border border-stone-200/80 dark:border-white/10 transition-[box-shadow,border-color] duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:border-stone-400/80 dark:hover:border-rose-400/30',
        project.layoutSpan
      )}
    >
      {/* Subtle Noise Texture & Radial Mouse Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] dark:bg-[radial-gradient(#524c56_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />

      {/* Dynamic Cursor Light Glow Effect */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 63, 94, 0.12), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Card Header (Category, Status, Favorite Action) */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Status Indicator Badge */}
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border',
              statusConfig.bgClass
            )}
          >
            <span
              className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dotClass)}
            />
            <span>{statusConfig.text}</span>
          </span>

          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono hidden sm:inline">
            ·
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium hidden sm:inline">
            {project.category.es || project.category.en}
          </span>
        </div>

        {/* Favorite Bookmark */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id);
            }}
            aria-label={isFavorite ? TEXTOS.favoritos.quitar : TEXTOS.favoritos.guardar}
            title={isFavorite ? TEXTOS.favoritos.quitar : TEXTOS.favoritos.guardar}
            className="w-8 h-8 rounded-full bg-stone-100/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-colors',
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-400 dark:text-stone-500'
              )}
            />
          </button>
        )}
      </div>

      {/* Center Interactive Artwork / Demonstration Container */}
      <div className="relative z-10 my-3 rounded-2xl overflow-hidden border border-stone-100/90 dark:border-white/5 bg-stone-50/70 dark:bg-black/30">
        {renderVisualArtwork()}
      </div>

      {/* Card Content (Title, Description, Tags) */}
      <div className="relative z-10 flex flex-col justify-end mt-4">
        {/* Title */}
        <h3
          className={cn(
            'font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-rose-950 dark:group-hover:text-rose-200 transition-colors mb-2',
            isFeatured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          )}
        >
          {project.title.es || project.title.en}
        </h3>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5 line-clamp-2">
          {project.description.es || project.description.en}
        </p>

        {/* Tags with clean unboxed styling */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-stone-500 dark:text-stone-300 bg-stone-100/80 dark:bg-stone-800/80 px-2 py-0.5 rounded-md"
            >
              #{tag.es || tag.en}
            </span>
          ))}
        </div>

        {/* Bottom Bar: Action Trigger with Animated Reveal */}
        <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex items-center justify-between gap-4">
          <span className="text-xs font-mono text-stone-400 dark:text-stone-500">
            {project.slug}
          </span>

          {isLive ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white dark:text-stone-900 bg-stone-900 dark:bg-stone-100 hover:bg-rose-950 dark:hover:bg-rose-200 active:scale-[0.98] transition-all shadow-xs cursor-pointer group/btn"
            >
              <span>{project.actionLabel?.es || TEXTOS.botones.comenzar}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          ) : isInProgress ? (
            project.disabled ? (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/60 opacity-75 pointer-events-none select-none"
              >
                <span>{project.actionLabel?.es || TEXTOS.botones.verAvance}</span>
                <Sparkles className="w-3.5 h-3.5 text-stone-400" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onOpen(project)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/40 cursor-pointer transition-colors"
              >
                <span>{project.actionLabel?.es || TEXTOS.botones.verAvance}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              </button>
            )
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 font-medium select-none">
              <Lock className="w-3.5 h-3.5" />
              <span>{TEXTOS.botones.proximamente}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
