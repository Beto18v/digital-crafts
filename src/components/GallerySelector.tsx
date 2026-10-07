'use client';

import React from 'react';
import { ColoringPage } from '../data/pages';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

interface GallerySelectorProps {
  pages: ColoringPage[];
  currentPage: ColoringPage;
  onSelectPage: (page: ColoringPage) => void;
  lang: 'es' | 'en';
}

export const GallerySelector: React.FC<GallerySelectorProps> = ({
  pages,
  currentPage,
  onSelectPage,
  lang,
}) => {
  const isEs = lang === 'es';

  return (
    <div className="w-full flex flex-col gap-2 p-3 sm:p-4 rounded-3xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border border-stone-200/80 dark:border-white/10 shadow-sm">
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-stone-400 dark:text-stone-500" />
          <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
            {isEs ? 'Catálogo de Láminas para Colorear' : 'Coloring Pages Catalog'}
          </span>
        </div>
        <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">
          {pages.findIndex((p) => p.id === currentPage.id) + 1} / {pages.length}
        </span>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-200 dark:scrollbar-thumb-stone-700 scroll-smooth">
        {pages.map((page, idx) => {
          const isSelected = page.id === currentPage.id;
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => onSelectPage(page)}
              className={`group flex-shrink-0 flex flex-col items-start p-2 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                isSelected
                  ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-500/50 shadow-sm ring-1 ring-rose-400/40'
                  : 'bg-white dark:bg-stone-800/80 border-stone-200/80 dark:border-white/5 hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-2xs'
              }`}
            >
              {/* Mini canvas preview container */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white dark:bg-stone-900/90 border border-stone-200/70 dark:border-stone-700/60 overflow-hidden flex items-center justify-center p-1.5 mb-2 relative">
                {page.imagePath && !page.imagePath.startsWith('/images/coloring-') ? (
                  <img
                    src={page.imagePath}
                    alt={page.title[lang]}
                    className="w-full h-full object-contain pointer-events-none rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center p-1">
                    <span className="text-xs font-mono font-bold text-stone-400 dark:text-stone-500 block mb-1">
                      #{idx + 1}
                    </span>
                    <span className="text-[10px] text-stone-600 dark:text-stone-300 font-medium line-clamp-2 leading-tight">
                      {page.title[lang]}
                    </span>
                  </div>
                )}

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-xs" />
                )}
              </div>

              <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 max-w-[100px] truncate block">
                {page.title[lang]}
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
