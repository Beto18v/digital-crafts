'use client';

import React, { useState, useMemo } from 'react';
import { ColoringPage } from '../data/pages';
import { Image as ImageIcon } from 'lucide-react';

/**
 * Textos centralizados del carrusel de láminas.
 */
const TEXTOS = {
  tituloSeccion: 'Nuestros lienzos para pintar',
  categoriaTodas: 'Todas las láminas',
};

interface GallerySelectorProps {
  pages: ColoringPage[];
  currentPage: ColoringPage;
  onSelectPage: (page: ColoringPage) => void;
  lang?: 'es' | 'en';
}

export const GallerySelector: React.FC<GallerySelectorProps> = ({
  pages,
  currentPage,
  onSelectPage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Categorías únicas
  const categories = useMemo(() => {
    const cats = Array.from(new Set(pages.map((p) => p.category)));
    return cats;
  }, [pages]);

  // Filtrado reactivo de páginas
  const filteredPages = useMemo(() => {
    if (selectedCategory === 'all') return pages;
    return pages.filter((p) => p.category === selectedCategory);
  }, [pages, selectedCategory]);

  return (
    <div className="w-full flex flex-col gap-3 p-3.5 sm:p-5 rounded-3xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-sm transition-all">
      {/* Header Bar con contador de momentos */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-rose-500" />
          <span className="text-xs sm:text-sm font-medium text-stone-800 dark:text-stone-200">
            {TEXTOS.tituloSeccion}
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800/80 px-2 py-0.5 rounded-full">
          {pages.findIndex((p) => p.id === currentPage.id) + 1} / {pages.length}
        </span>
      </div>

      {/* Selector de Filtros por Categoría */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-stone-700/60'
          }`}
        >
          {TEXTOS.categoriaTodas}
        </button>
        {categories.map((cat) => {
          const isCatSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                isCatSelected
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400 hover:bg-stone-200/70 dark:hover:bg-stone-700/60'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Carrusel Horizontal de Láminas */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-700 scroll-smooth">
        {filteredPages.map((page, idx) => {
          const isSelected = page.id === currentPage.id;
          const displayImage = page.thumbnail || page.imagePath;

          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page)}
              className={`group flex-shrink-0 flex flex-col items-start p-2 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                isSelected
                  ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-400 dark:border-rose-500/60 shadow-sm ring-2 ring-rose-400/40'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200/80 dark:border-white/5 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-2xs'
              }`}
            >
              {/* Mini canvas preview container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white dark:bg-stone-900/90 border border-stone-200/70 dark:border-stone-700/60 overflow-hidden flex items-center justify-center p-1.5 mb-2 relative">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={page.title.es || page.title.en}
                    className="w-full h-full object-contain pointer-events-none rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center p-1">
                    <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 block mb-1">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium line-clamp-2 leading-tight">
                      {page.title.es || page.title.en}
                    </span>
                  </div>
                )}

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-stone-900 shadow-xs" />
                )}
              </div>

              <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 max-w-[100px] truncate block">
                {page.title.es || page.title.en}
              </span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-wider font-mono">
                {page.category}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
