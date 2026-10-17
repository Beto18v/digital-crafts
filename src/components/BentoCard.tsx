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
  Wine,
  Clock,
  Flame,
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
    verAvance: 'Ver recetas',
    proximamente: 'Próximamente',
  },
  favoritos: {
    guardar: 'Guardar en nuestros favoritos',
    quitar: 'Quitar de nuestros favoritos',
  },
  artworks: {
    cocinaKicker: 'Cocina a cuatro manos',
    cocinaTitulo: 'Pappardelle al Tartufo',
    cocinaSubtitulo: 'Pasta fresca, trufa blanca & mantequilla dorada',
    cocinaTiempo: '35 min',
    cocinaDetalle1: 'Luz de velas',
    cocinaDetalle2: 'Vino Barolo',
    cocinaDetalle3: 'Música suave',
    lienzoSubtitulo: 'Lienzo interactivo · Colección de láminas',
    lienzoTitulo: 'Acuarelas & Bote de pintura',
    lienzoListo: 'Listo para pintar',
    tarjetasSubtitulo: '52 Cartas íntimas',
    tarjetasTitulo: 'Frasco de Conversaciones',
    tarjetasDetalles: 'Momentos espontáneos & recuerdos que nos unen',
    tarjetasDetalle1: 'Preguntas profundas',
    tarjetasDetalle2: 'Citas sorpresa',
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
        text: project.id === 'date-night-playbook' ? 'Recetas listas' : TEXTOS.estados.enProceso,
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
        <div className="relative w-full h-full min-h-[142px] flex items-center justify-center p-3.5 sm:p-4 select-none overflow-hidden">
          {/* Fondo cálido a la luz de las velas */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-rose-500/15 to-orange-500/10 rounded-2xl" />
          
          {/* Tarjeta flotante con estética de menú degustación */}
          <div className="relative z-10 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-amber-200/50 dark:border-white/10 shadow-xs flex flex-col gap-3 group-hover:border-amber-400/40 transition-colors">
            {/* Cabecera del plato */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-950/70 dark:to-rose-950/70 flex items-center justify-center text-rose-600 dark:text-rose-300 shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-300 font-semibold truncate">
                    {TEXTOS.artworks.cocinaKicker}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 dark:text-stone-400 bg-stone-100/90 dark:bg-stone-800/90 px-2 py-0.5 rounded-full shrink-0">
                    <Clock className="w-2.5 h-2.5 text-amber-500" />
                    <span>{TEXTOS.artworks.cocinaTiempo}</span>
                  </span>
                </div>
                <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate leading-snug">
                  {TEXTOS.artworks.cocinaTitulo}
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                  {TEXTOS.artworks.cocinaSubtitulo}
                </p>
              </div>
            </div>

            {/* Fila sensorial romántica: Velas, Vino y Ambiente */}
            <div className="flex items-center justify-between pt-2.5 border-t border-stone-200/60 dark:border-white/10 text-[11px] text-stone-600 dark:text-stone-300">
              <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 animate-pulse" />
                <span>{TEXTOS.artworks.cocinaDetalle1}</span>
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
                <Wine className="w-3.5 h-3.5 text-rose-500" />
                <span>{TEXTOS.artworks.cocinaDetalle2}</span>
              </span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-stone-500 dark:text-stone-400 font-serif italic text-xs">
                {TEXTOS.artworks.cocinaDetalle3}
              </span>
            </div>
          </div>
        </div>
      );
    }
    if (project.id === 'couple-quiz') {
      return (
        <div className="relative w-full h-full min-h-[155px] flex items-center justify-center p-3.5 sm:p-5 select-none overflow-hidden">
          {/* Fondo gradiente romántico suave */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/15 via-pink-500/10 to-amber-500/10 rounded-2xl" />

          {/* Tarjeta interactiva estilizada como la lámina "¿Qué tanto nos conocemos?" */}
          <div className="relative z-10 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-rose-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5 group-hover:border-rose-400/50 transition-colors">
            {/* Cabecera con pug dog y títulos */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐶</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  Duelo Secreto
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/50 dark:border-rose-900/40">
                5 Paquetes
              </span>
            </div>

            {/* Simulación de las columnas Esposa vs Esposo */}
            <div className="grid grid-cols-2 gap-2 py-1">
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 text-[11px]">
                <span className="font-semibold text-rose-900 dark:text-rose-200">Ella</span>
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px]">
                <span className="font-semibold text-amber-900 dark:text-amber-200">Él</span>
                <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Micro pie con pug y pregunta de muestra */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-white/10">
              <span className="italic font-serif truncate">"¿Quién dio el primer paso?"</span>
              <span className="text-xs shrink-0">✨ 95% sintonía</span>
            </div>
          </div>
        </div>
      );
    }
    if (project.id === 'riddle-duel') {
      return (
        <div className="relative w-full h-full min-h-[155px] flex items-center justify-center p-3.5 sm:p-5 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 rounded-2xl" />
          <div className="relative z-10 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-amber-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5 group-hover:border-amber-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕵️‍♂️</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 dark:text-amber-300 font-bold">
                  El que Adivina Gana
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-900/40">
                Pistas Progresivas
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-lg">📚</span>
                <span className="font-serif font-semibold text-stone-900 dark:text-stone-100">
                  El Enigma de la Biblioteca
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-600 bg-white dark:bg-stone-800 px-2 py-0.5 rounded-md shadow-2xs">
                +3 pts
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-white/10">
              <span className="italic font-serif truncate">Prenda: Desayuno en la cama 🥐</span>
              <span className="text-xs shrink-0">Lógica & Deducción</span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'would-you-rather') {
      return (
        <div className="relative w-full h-full min-h-[155px] flex items-center justify-center p-3.5 sm:p-5 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-pink-500/10 to-rose-500/10 rounded-2xl" />
          <div className="relative z-10 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-purple-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5 group-hover:border-purple-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔮</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold">
                  Lectura de Mente
                </span>
              </div>
              <span className="text-[10px] font-mono text-purple-700 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-purple-200/60 dark:border-purple-900/40">
                ¿Esto o Aquello?
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/50 text-center">
                <span className="block text-base mb-0.5">🪵</span>
                <span className="font-serif text-[11px] font-medium text-stone-900 dark:text-stone-100 truncate block">
                  Cabaña Nórdica
                </span>
              </div>
              <div className="p-2 rounded-xl bg-pink-50/70 dark:bg-pink-950/40 border border-pink-200/50 text-center">
                <span className="block text-base mb-0.5">🏝️</span>
                <span className="font-serif text-[11px] font-medium text-stone-900 dark:text-stone-100 truncate block">
                  Playa Tropical
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-white/10">
              <span className="italic font-serif truncate">¿Qué elegiría tu pareja?</span>
              <span className="text-xs shrink-0">✨ Telepatía</span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'if-i-were') {
      return (
        <div className="relative w-full h-full min-h-[155px] flex items-center justify-center p-3.5 sm:p-5 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-amber-500/10 rounded-2xl" />
          <div className="relative z-10 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2.5 group-hover:border-emerald-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 text-[11px] font-bold bg-amber-200 text-stone-900 rotate-[-2deg] border border-stone-800/20">Y</span>
                <span className="px-1.5 py-0.5 text-[11px] font-bold bg-rose-200 text-stone-900 rotate-[2deg] border border-stone-800/20">O</span>
                <span className="px-1.5 py-0.5 text-[11px] font-bold bg-emerald-200 text-stone-900 rotate-[-1deg] border border-stone-800/20">S</span>
                <span className="px-1.5 py-0.5 text-[11px] font-bold bg-sky-200 text-stone-900 rotate-[1deg] border border-stone-800/20">I</span>
                <span className="text-base ml-1">🐶</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Collage Poético
              </span>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-white/5 text-xs">
              <span className="text-xl">🦊</span>
              <div className="min-w-0 flex-1">
                <span className="font-serif text-[11px] font-semibold text-stone-900 dark:text-stone-100 block truncate">
                  "Si fueras un animal..."
                </span>
                <span className="text-[10px] text-stone-400 block truncate">
                  Metáforas íntimas, cómplices y tiernas
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-white/10">
              <span className="italic font-serif truncate">9 Categorías de recortes</span>
              <span className="text-xs shrink-0">🎨 Recuerdo</span>
            </div>
          </div>
        </div>
      );
    }

    if (project.id === 'coloring-canvas') {
      return (
        <div className="relative w-full h-[148px] flex items-center justify-center p-3.5 sm:p-4 select-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-rose-500/10 rounded-2xl" />
          <div className="relative z-10 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-200/80 dark:border-white/10 shadow-xs flex flex-col gap-2 group-hover:border-amber-400/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎨</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300 font-bold">
                  Lienzo & Acuarelas
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Pintar Juntos
              </span>
            </div>

            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-xs">
              <span className="font-serif font-medium text-stone-900 dark:text-stone-100 truncate">
                Láminas Botánicas & Pareja
              </span>
              <div className="flex gap-1 items-center shrink-0">
                {['#f43f5e', '#fb923c', '#eab308', '#10b981', '#8b5cf6'].map((c, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: c }}
                    className="w-2.5 h-2.5 rounded-full ring-1 ring-white/60 dark:ring-stone-800"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200/60 dark:border-white/10">
              <span className="italic font-serif truncate">Acuarelas & Bote de pintura</span>
              <span className="text-xs shrink-0">✨ Sin prisa</span>
            </div>
          </div>
        </div>
      );
    }

    // Default: Adventure Jar
    return (
      <div className="relative w-full h-full min-h-[142px] flex items-center justify-center p-3.5 sm:p-4 select-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/15 via-rose-500/10 to-transparent rounded-2xl" />
        <div className="relative z-10 w-full bg-white/90 dark:bg-stone-900/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 dark:border-white/10 shadow-xs flex flex-col gap-3 group-hover:border-purple-400/40 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-100 dark:bg-purple-950/70 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 group-hover:scale-105 transition-transform">
              <Shuffle className="w-5 h-5" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-700 dark:text-purple-300 font-semibold truncate">
                  {TEXTOS.artworks.tarjetasSubtitulo}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full shrink-0">
                  <Sparkles className="w-2.5 h-2.5 text-purple-500" />
                  <span>52 cartas</span>
                </span>
              </div>
              <h4 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate leading-snug">
                {TEXTOS.artworks.tarjetasTitulo}
              </h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                {TEXTOS.artworks.tarjetasDetalles}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2.5 border-t border-stone-200/60 dark:border-white/10 text-[11px] text-stone-600 dark:text-stone-300">
            <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
              <span>{TEXTOS.artworks.tarjetasDetalle1}</span>
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>{TEXTOS.artworks.tarjetasDetalle2}</span>
            </span>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-500 dark:text-stone-400 font-serif italic text-xs">
              Sin pantallas
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
        'group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/90 dark:bg-[#1a171c]/90 p-5 sm:p-5.5 md:p-6 backdrop-blur-md border border-stone-200/80 dark:border-white/10 transition-[box-shadow,border-color] duration-300 shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.35)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] hover:border-stone-400/80 dark:hover:border-rose-400/30 h-full',
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
      <div className="relative z-10 flex items-center justify-between gap-3 mb-3">
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
      <div className="relative z-10 my-2 rounded-2xl overflow-hidden border border-stone-100/90 dark:border-white/5 bg-stone-50/70 dark:bg-black/30 h-[148px] shrink-0">
        {renderVisualArtwork()}
      </div>

      {/* Card Content (Title, Description, Tags) */}
      <div className="relative z-10 flex flex-col flex-1 justify-between mt-2.5">
        <div>
          {/* Title */}
          <h3
            className="font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-rose-950 dark:group-hover:text-rose-200 transition-colors text-lg sm:text-xl truncate mb-1.5"
            title={project.title.es || project.title.en}
          >
            {project.title.es || project.title.en}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-3 line-clamp-2 min-h-[2.5rem]">
            {project.description.es || project.description.en}
          </p>

          {/* Tags with clean unboxed styling */}
          <div className="flex items-center gap-1.5 mb-3.5 h-6 overflow-hidden">
            {project.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10.5px] font-medium text-stone-500 dark:text-stone-300 bg-stone-100/80 dark:bg-stone-800/80 px-2 py-0.5 rounded-md whitespace-nowrap"
              >
                #{tag.es || tag.en}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Action Trigger with Animated Reveal */}
        <div className="pt-3 border-t border-stone-100 dark:border-white/10 flex items-center justify-between gap-3 mt-auto">
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
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all active:scale-[0.98] shadow-2xs group/btn',
                  project.id === 'date-night-playbook'
                    ? 'text-rose-950 dark:text-rose-100 bg-rose-100/90 dark:bg-rose-950/60 hover:bg-rose-200/90 dark:hover:bg-rose-900/70 border border-rose-200/80 dark:border-rose-800/50'
                    : 'text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/50 hover:bg-amber-200/80 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/50'
                )}
              >
                <span>{project.actionLabel?.es || TEXTOS.botones.verAvance}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
