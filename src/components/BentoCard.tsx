import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Clock,
  Sparkles,
  Lock,
  Utensils,
  Palette,
  Heart,
  Music,
  Star,
  Shuffle,
  ChevronRight,
} from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';
import { cn } from '../lib/utils';

interface BentoCardProps {
  project: ProjectCardInfo;
  lang: Language;
  onOpen: (project: ProjectCardInfo) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  index: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  project,
  lang,
  onOpen,
  isFavorite = false,
  onToggleFavorite,
  index,
}) => {
  const isEs = lang === 'es';
  const isLive = project.status === 'Live' || project.status === 'available';
  const isComingSoon = project.status === 'Coming Soon' || project.status === 'coming-soon';
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
        text: isEs ? 'Disponible' : 'Live Craft',
        bgClass: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
        dotClass: 'bg-emerald-500 animate-pulse',
      }
    : isInProgress
    ? {
        text: isEs ? 'En Proceso' : 'In Progress',
        bgClass: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
        dotClass: 'bg-amber-500',
      }
    : {
        text: isEs ? 'Próximamente' : 'Coming Soon',
        bgClass: 'bg-stone-500/10 text-stone-600 border-stone-300',
        dotClass: 'bg-stone-400',
      };

  // Specific visual art graphics per card
  const renderVisualArtwork = () => {
    if (project.id === 'date-night-playbook') {
      return (
        <div className="relative w-full h-full min-h-[170px] flex items-center justify-center p-6 select-none overflow-hidden">
          {/* Decorative ambient elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-transparent rounded-2xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 w-full max-w-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-sm group-hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-300 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
              <Utensils className="w-7 h-7" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800/80 dark:text-rose-300 font-semibold">
                {isEs ? 'Menú sugerido para dos' : 'Curated 2-person menu'}
              </span>
              <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                {isEs ? 'Truffle Pappardelle & Barolo' : 'Truffle Pappardelle & Barolo'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {isEs ? '35 min · Luz de velas · Música jazz' : '35 min · Candlelight · Jazz score'}
              </p>
            </div>
            <div className="hidden sm:flex flex-col items-end text-xs text-stone-400 font-mono">
              <span>🍷 98%</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">Ready</span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'coloring-canvas') {
      return (
        <div className="relative w-full h-full min-h-[130px] flex items-center justify-center p-4 select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-2xl" />
          <div className="relative z-10 flex items-center gap-3 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <Palette className="w-5 h-5" />
            </div>
            <div className="flex gap-1.5 items-center">
              {['#f43f5e', '#fb923c', '#eab308', '#10b981', '#06b6d4'].map((c, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: c }}
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-white/60 dark:ring-stone-800 shadow-2xs group-hover:scale-110 transition-transform"
                />
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'adventure-jar') {
      return (
        <div className="relative w-full h-full min-h-[130px] flex items-center justify-center p-4 select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-rose-500/5 to-transparent rounded-2xl" />
          <div className="relative z-10 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 flex items-center justify-center text-purple-700 dark:text-purple-300">
              <Shuffle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700 dark:text-purple-300 font-semibold block">
                {isEs ? '52 Cartas' : '52 Cards'}
              </span>
              <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                {isEs ? 'Micro-citas & preguntas' : 'Prompts & dates'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'memory-capsule') {
      return (
        <div className="relative w-full h-full min-h-[140px] flex items-center justify-center p-4 select-none">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl" />
          <div className="relative z-10 flex items-center gap-4 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs max-w-sm w-full">
            <div className="w-11 h-11 rounded-full bg-emerald-100 dark:bg-emerald-950/70 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0">
              <Music className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 uppercase tracking-wider font-semibold">
                  Tape #01
                </span>
              </div>
              <p className="text-xs text-stone-800 dark:text-stone-200 font-medium truncate">
                {isEs ? 'Nuestra canción en Florencia' : 'Our song in Florence'}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default Stargazer
    return (
      <div className="relative w-full h-full min-h-[130px] flex items-center justify-center p-4 select-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-transparent rounded-2xl" />
        <div className="relative z-10 bg-white/85 dark:bg-stone-900/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
            <Star className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono tracking-wider text-indigo-700 dark:text-indigo-300 font-semibold block">
              Sky Map
            </span>
            <span className="text-xs text-stone-700 dark:text-stone-300 font-medium">
              {isEs ? 'Alineación de estrellas' : 'Celestial alignment'}
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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/90 dark:bg-[#1a171c]/90 p-6 sm:p-7 md:p-8 backdrop-blur-md border border-stone-200/80 dark:border-white/10 transition-all duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:border-stone-400/80 dark:hover:border-rose-400/30',
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
            {project.category[lang]}
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
            aria-label={isFavorite ? 'Quitar favorito' : 'Guardar favorito'}
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
          {project.title[lang]}
        </h3>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5 line-clamp-2">
          {project.description[lang]}
        </p>

        {/* Tags with clean unboxed styling */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] font-medium text-stone-500 dark:text-stone-300 bg-stone-100/80 dark:bg-stone-800/80 px-2 py-0.5 rounded-md"
            >
              #{tag[lang]}
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
              <span>{isEs ? 'Abrir Experiencia' : 'Open Experience'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-stone-300 dark:text-stone-700 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          ) : isInProgress ? (
            <button
              type="button"
              onClick={() => onOpen(project)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/40 transition-colors cursor-pointer"
            >
              <span>{isEs ? 'Ver Avance' : 'Preview'}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500 font-medium select-none">
              <Lock className="w-3.5 h-3.5" />
              <span>{isEs ? 'En Construcción' : 'Under Construction'}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
