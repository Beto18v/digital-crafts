'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles, Utensils, CheckCircle2, Shuffle, Palette, Clock } from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';

/**
 * Textos centralizados de la ventana modal y vistas previas interactivas.
 */
const TEXTOS = {
  cerrarVentana: 'Cerrar ventana',
  volverAEspacio: 'Volver a nuestro espacio',
  pieNota: 'Nuestro Refugio Digital · Creado con todo mi amor para ti',
  recetas: {
    tituloSeccion: 'Receta para cocinar juntos',
    ingredientesTitulo: 'Ingredientes para dos',
    pasosTitulo: 'Paso a paso juntos (Haz clic para marcar)',
  },
  tarjetas: {
    tituloSeccion: 'Tarjeta de Conversación & Momento',
    botonOtra: 'Sacar otra tarjeta',
    notaPaz: 'Tómense un momento para escuchar sin prisas, mirándose a los ojos.',
  },
  lienzo: {
    titulo: 'Paleta Botánica para Dos',
    descripcion: 'Este rincón nos permitirá pintar al mismo tiempo desde nuestras pantallas. Prueba un tono de acuarela:',
    tonoSeleccionado: 'Tono elegido:',
  },
};

interface ProjectModalProps {
  project: ProjectCardInfo | null;
  lang?: Language;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  // Estado para funciones interactivas en la vista previa
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [randomPromptIndex, setRandomPromptIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#f43f5e');

  const sampleRecipes = [
    {
      title: 'Pappardelle al Tartufo con Mantequilla Dorada',
      time: '35 min',
      difficulty: 'Fácil & Romántico',
      ingredients: [
        'Pasta fresca pappardelle (250g)',
        'Mantequilla de campo',
        'Aceite de trufa blanca',
        'Parmesano Reggiano curado',
        'Pimienta negra recién molida',
      ],
      steps: [
        'Hervir la pasta en agua abundante con sal marina hasta que esté al dente.',
        'En una sartén de hierro, dorar la mantequilla a fuego lento hasta aroma a avellana.',
        'Emulsionar la pasta con medio cucharón de agua de cocción y el parmesano rallado fino.',
        'Servir de inmediato con unas gotas de aceite de trufa y disfrutar con una copa de vino.',
      ],
    },
    {
      title: 'Risotto de Setas Silvestres y Romero Fresco',
      time: '45 min',
      difficulty: 'A cuatro manos',
      ingredients: [
        'Arroz Carnaroli o Arborio',
        'Mezcla de hongos silvestres',
        'Caldo vegetal casero caliente',
        'Vino blanco seco',
        'Queso mascarpone suave',
      ],
      steps: [
        'Saltear los hongos en aceite de oliva virgen con romero fresco hasta dorar.',
        'Nacarar el arroz durante 2 minutos y desglasar con un chorrito de vino blanco.',
        'Agregar el caldo poco a poco: uno remueve despacio mientras el otro pone la mesa y enciende las velas.',
        'Mantecar con una cucharada de mascarpone frío y servir bien caliente.',
      ],
    },
  ];

  const datePrompts = [
    '¿Cuál fue el momento exacto en el que supiste que querías que fuéramos un equipo?',
    'Si pudiéramos teletransportarnos hoy mismo a cualquier rincón del mundo solo para cenar los dos, ¿adónde iríamos?',
    '¿Qué pequeña costumbre o gesto cotidiano que compartimos te hace sentir más en casa?',
    'Planear una cita sorpresa de domingo sin teléfonos, sin prisas y disfrutando cada minuto juntos.',
    '¿Cuál es tu recuerdo favorito de nosotros en el último año?',
  ];

  const toggleStep = (idx: number) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-[#faf9f6] dark:bg-[#1a171c] rounded-3xl border border-stone-200/90 dark:border-white/15 shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80 dark:border-white/10 bg-white dark:bg-stone-900">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
              {project.slug}
            </span>
            <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              {project.title.es || project.title.en}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={TEXTOS.cerrarVentana}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Banner descriptivo */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200/70 dark:border-white/10 shadow-2xs">
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              {project.description.es || project.description.en}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300 font-medium"
                >
                  #{tag.es || tag.en}
                </span>
              ))}
            </div>
          </div>

          {/* Vistas previas específicas según el rincón */}
          {project.id === 'date-night-playbook' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-serif text-lg font-medium">
                  <Utensils className="w-5 h-5 text-rose-500" />
                  <span>{TEXTOS.recetas.tituloSeccion}</span>
                </div>
                <div className="flex gap-1.5 text-xs">
                  {sampleRecipes.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRecipe(idx);
                        setCheckedSteps({});
                      }}
                      className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        selectedRecipe === idx
                          ? 'bg-rose-900 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-stone-900/90 rounded-2xl p-5 border border-stone-200/70 dark:border-white/10 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                      {sampleRecipes[selectedRecipe].title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        {sampleRecipes[selectedRecipe].time}
                      </span>
                      <span>·</span>
                      <span>{sampleRecipes[selectedRecipe].difficulty}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
                    {TEXTOS.recetas.ingredientesTitulo}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                    {sampleRecipes[selectedRecipe].ingredients.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 mb-2">
                    {TEXTOS.recetas.pasosTitulo}
                  </h4>
                  <div className="space-y-2">
                    {sampleRecipes[selectedRecipe].steps.map((step, idx) => {
                      const isDone = !!checkedSteps[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                            isDone
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 line-through opacity-80'
                              : 'bg-stone-50/80 dark:bg-stone-800/60 text-stone-700 dark:text-stone-200 hover:bg-stone-100/80 dark:hover:bg-stone-800'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDone ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950' : 'text-stone-300 dark:text-stone-600'
                            }`}
                          />
                          <span>{step}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {project.id === 'adventure-jar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {TEXTOS.tarjetas.tituloSeccion}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRandomPromptIndex((prev) => (prev + 1) % datePrompts.length)
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/40 transition-colors cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{TEXTOS.tarjetas.botonOtra}</span>
                </button>
              </div>

              <div className="bg-white dark:bg-stone-900/90 rounded-2xl p-6 sm:p-8 border border-stone-200 dark:border-white/10 text-center shadow-xs">
                <span className="text-3xl mb-3 block">💌</span>
                <p className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100 italic max-w-lg mx-auto leading-snug">
                  "{datePrompts[randomPromptIndex]}"
                </p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-4">
                  {TEXTOS.tarjetas.notaPaz}
                </p>
              </div>
            </div>
          )}

          {project.id === 'coloring-canvas' && (
            <div className="bg-white dark:bg-stone-900/90 rounded-2xl p-6 border border-stone-200 dark:border-white/10 text-center space-y-4">
              <Palette className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900 dark:text-stone-100">
                {TEXTOS.lienzo.titulo}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                {TEXTOS.lienzo.descripcion}
              </p>
              <div className="flex justify-center gap-3 py-2">
                {['#f43f5e', '#fb923c', '#eab308', '#10b981', '#06b6d4', '#8b5cf6'].map(
                  (hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                        selectedColor === hex
                          ? 'scale-125 ring-2 ring-offset-2 ring-stone-900 dark:ring-white'
                          : 'hover:scale-110'
                      }`}
                    />
                  )
                )}
              </div>
              <div
                className="h-24 rounded-xl border border-stone-200/70 dark:border-white/10 flex items-center justify-center text-xs font-mono transition-colors"
                style={{ backgroundColor: `${selectedColor}15`, color: selectedColor }}
              >
                {TEXTOS.lienzo.tonoSeleccionado} {selectedColor}
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal */}
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900/95 border-t border-stone-200/80 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {TEXTOS.pieNota}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white transition-colors cursor-pointer"
          >
            {TEXTOS.volverAEspacio}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
