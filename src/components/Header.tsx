import React from 'react';
import { Heart, Globe, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  favoritesCount?: number;
  onOpenFavorites?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  favoritesCount = 0,
  onOpenFavorites,
}) => {
  const isEs = lang === 'es';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#faf9f6]/90 border-b border-stone-200/70 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <a
            href="/"
            className="group flex items-center gap-2 text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
          >
            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-900 group-hover:text-rose-950 transition-colors">
              Our Digital Crafts
            </span>
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500 text-xs">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-500" />
            </span>
          </a>
        </div>

        {/* Zone 2: Clean Typography Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <a
            href="#projects"
            className="hover:text-stone-900 transition-colors text-stone-700"
          >
            {isEs ? 'Catálogo de Proyectos' : 'Crafts Catalog'}
          </a>
          <a
            href="#about"
            className="hover:text-stone-900 transition-colors text-stone-500"
          >
            {isEs ? 'Nuestra Historia' : 'Our Story'}
          </a>
          <a
            href="#journal"
            className="hover:text-stone-900 transition-colors text-stone-500"
          >
            {isEs ? 'Cuaderno Creativo' : 'Creative Log'}
          </a>
        </nav>

        {/* Zone 3: Language Switcher and Actions */}
        <div className="flex items-center gap-3">
          {/* Favorites quick trigger if any */}
          {favoritesCount > 0 && onOpenFavorites && (
            <button
              onClick={onOpenFavorites}
              aria-label={isEs ? 'Ver proyectos guardados' : 'View saved crafts'}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{favoritesCount}</span>
            </button>
          )}

          {/* Bilingual Switcher */}
          <div
            role="group"
            aria-label={isEs ? 'Selector de idioma' : 'Language selector'}
            className="inline-flex items-center p-1 rounded-full bg-stone-100/90 border border-stone-200/80 shadow-xs"
          >
            <div className="pl-1.5 pr-1 text-stone-400 hidden sm:block">
              <Globe className="w-3.5 h-3.5" />
            </div>

            <button
              type="button"
              onClick={() => onToggleLang('es')}
              aria-pressed={lang === 'es'}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === 'es'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ES
            </button>

            <button
              type="button"
              onClick={() => onToggleLang('en')}
              aria-pressed={lang === 'en'}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                lang === 'en'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
