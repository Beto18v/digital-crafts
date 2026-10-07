import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Compass, Bookmark, Globe } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
  isOnlyFavorites?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  favoritesCount = 0,
  onOpenFavorites,
  isOnlyFavorites = false,
}) => {
  const isEs = lang === 'es';

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-white/75 backdrop-blur-xl border border-stone-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all max-w-3xl w-full"
      >
        {/* Brand Zone */}
        <a
          href="/"
          className="group flex items-center gap-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-full"
        >
          <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 group-hover:scale-110 transition-transform">
            <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors">
            Our Digital Crafts
          </span>
        </a>

        {/* Center Navigation Links (Hidden on small screens) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-stone-600">
          <a
            href="#bento-grid"
            className="hover:text-stone-900 transition-colors"
          >
            {isEs ? 'Proyectos' : 'Crafts'}
          </a>
          <a
            href="#story"
            className="hover:text-stone-900 transition-colors"
          >
            {isEs ? 'Historia' : 'Story'}
          </a>
          <a
            href="#manifesto"
            className="hover:text-stone-900 transition-colors"
          >
            {isEs ? 'Manifiesto' : 'Manifesto'}
          </a>
        </div>

        {/* Right Zone: Favorites Pill & Animated Sliding Language Switcher */}
        <div className="flex items-center gap-2">
          {/* Favorites toggle */}
          {onOpenFavorites && (
            <button
              type="button"
              onClick={onOpenFavorites}
              aria-label={isEs ? 'Filtrar guardados' : 'Filter saved'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                isOnlyFavorites
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  isOnlyFavorites
                    ? 'fill-rose-500 text-rose-500'
                    : favoritesCount > 0
                    ? 'text-rose-500'
                    : 'text-stone-400'
                }`}
              />
              <span className="font-mono text-[11px]">{favoritesCount}</span>
            </button>
          )}

          {/* Minimalist Sliding Tab Language Switcher with Framer Motion */}
          <div
            role="group"
            aria-label={isEs ? 'Selector de idioma' : 'Language selector'}
            className="relative flex items-center p-0.5 rounded-full bg-stone-100/90 border border-stone-200/80 shadow-inner"
          >
            <button
              type="button"
              onClick={() => onToggleLang('es')}
              className={`relative z-10 px-2.5 py-1 text-[11px] font-semibold transition-colors duration-200 ${
                lang === 'es' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ES
              {lang === 'es' && (
                <motion.div
                  layoutId="activeLangIndicator"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleLang('en')}
              className={`relative z-10 px-2.5 py-1 text-[11px] font-semibold transition-colors duration-200 ${
                lang === 'en' ? 'text-stone-950 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              EN
              {lang === 'en' && (
                <motion.div
                  layoutId="activeLangIndicator"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.1)] -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
