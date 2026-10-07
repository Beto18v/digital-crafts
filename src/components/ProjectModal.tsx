import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Utensils, Heart, CheckCircle2, Shuffle, Music, Palette, BookOpen, Clock } from 'lucide-react';
import { ProjectCardInfo, Language } from '../types';

interface ProjectModalProps {
  project: ProjectCardInfo | null;
  lang: Language;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  lang,
  onClose,
}) => {
  if (!project) return null;
  const isEs = lang === 'es';

  // State for interactive features inside modal
  const [selectedRecipe, setSelectedRecipe] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [randomPromptIndex, setRandomPromptIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#f43f5e');

  const sampleRecipes = [
    {
      title: isEs ? 'Pappardelle al Tartufo con Mantequilla Dorada' : 'Truffle Pappardelle with Brown Butter',
      time: '35 min',
      difficulty: isEs ? 'Fácil & Romántico' : 'Easy & Romantic',
      ingredients: isEs
        ? ['Pasta fresca pappardelle (250g)', 'Mantequilla de campo', 'Aceite de trufa blanca', 'Parmesano Reggiano curado', 'Pimienta negra recién molida']
        : ['Fresh pappardelle pasta (250g)', 'Artisan butter', 'White truffle oil', 'Aged Parmigiano Reggiano', 'Freshly cracked black pepper'],
      steps: isEs
        ? [
            'Hervir la pasta en agua abundante con sal marina hasta que esté al dente.',
            'En una sartén de hierro, dorar la mantequilla a fuego lento hasta aroma a avellana.',
            'Emulsionar la pasta con medio cucharón de agua de cocción y el parmesano rallado fino.',
            'Servir de inmediato con unas gotas de aceite de trufa y disfrutar con una copa de vino tinto.'
          ]
        : [
            'Boil the pasta in generously salted water until al dente.',
            'In a cast-iron skillet, gently brown the butter until nutty and aromatic.',
            'Toss pasta with a ladle of starchy pasta water and finely grated Parmigiano.',
            'Drizzle with white truffle oil and serve immediately with glasses of red wine.'
          ]
    },
    {
      title: isEs ? 'Risotto de Setas Silvestres y Romero Fresco' : 'Wild Mushroom & Fresh Rosemary Risotto',
      time: '45 min',
      difficulty: isEs ? 'A cuatro manos' : 'Cook Together',
      ingredients: isEs
        ? ['Arroz Carnaroli o Arborio', 'Mezcla de hongos silvestres', 'Caldo vegetal casero caliente', 'Vino blanco seco', 'Queso mascarpone']
        : ['Carnaroli or Arborio rice', 'Wild mushroom medley', 'Warm homemade vegetable broth', 'Dry white wine', 'Dollop of mascarpone'],
      steps: isEs
        ? [
            'Saltear los hongos en aceite de oliva con romero hasta dorar.',
            'Nacarar el arroz durante 2 minutos y desglasar con vino blanco.',
            'Agregar el caldo poco a poco mientras uno remueve y el otro prepara la mesa.',
            'Mantecar con mascarpone frío y servir con la luz tenue de velas.'
          ]
        : [
            'Sauté wild mushrooms with fresh rosemary until golden.',
            'Toast rice grains for 2 minutes and deglaze with crisp white wine.',
            'Add broth ladle by ladle: one stirs while the other sets the candlelit table.',
            'Mantecatura with cold mascarpone and serve warm.'
          ]
    }
  ];

  const datePrompts = [
    {
      es: '¿Cuál fue el momento exacto en el que te diste cuenta de que querías que fuéramos un equipo?',
      en: 'What was the exact moment you realized you wanted us to be a team?'
    },
    {
      es: 'Si pudiéramos teletransportarnos hoy mismo a cualquier rincón del mundo solo por una cena, ¿adónde iríamos?',
      en: 'If we could teleport anywhere in the world tonight just for dinner, where would we go?'
    },
    {
      es: '¿Qué pequeña costumbre o gesto que compartimos te hace sentir más en casa?',
      en: 'What little ritual or habit we share makes you feel most at home?'
    },
    {
      es: 'Planear una cita sorpresa de domingo sin pantallas y con presupuesto libre de estrés.',
      en: 'Plan a screen-free surprise Sunday date with a zero-stress budget.'
    }
  ];

  const toggleStep = (idx: number) => {
    setCheckedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
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
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80 dark:border-white/10 bg-white dark:bg-stone-900">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-stone-400 dark:text-stone-500">
              {project.slug}
            </span>
            <h2 className="font-serif text-2xl font-medium text-stone-900 dark:text-stone-100">
              {project.title[lang]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEs ? 'Cerrar ventana' : 'Close modal'}
            className="w-9 h-9 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200/80 dark:hover:bg-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200/70 dark:border-white/10 shadow-2xs">
            <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">
              {project.description[lang]}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
              {project.tags.map((tag, i) => (
                <span key={i} className="bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded text-stone-600 dark:text-stone-300 font-medium">
                  #{tag[lang]}
                </span>
              ))}
            </div>
          </div>

          {/* Special Interactive Previews Based on Project */}
          {project.id === 'date-night-playbook' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-serif text-lg font-medium">
                  <Utensils className="w-5 h-5 text-rose-500" />
                  <span>{isEs ? 'Receta de Esta Semana' : "This Week's Recipe"}</span>
                </div>
                <div className="flex gap-1.5 text-xs">
                  {sampleRecipes.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedRecipe(idx);
                        setCheckedSteps({});
                      }}
                      className={`px-3 py-1 rounded-full font-medium transition-colors ${
                        selectedRecipe === idx
                          ? 'bg-rose-900 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-2xs space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-xl text-stone-900">
                      {sampleRecipes[selectedRecipe].title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {sampleRecipes[selectedRecipe].time}
                      </span>
                      <span>·</span>
                      <span>{sampleRecipes[selectedRecipe].difficulty}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    {isEs ? 'Ingredientes para dos' : 'Ingredients for two'}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600">
                    {sampleRecipes[selectedRecipe].ingredients.map((item, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
                    {isEs ? 'Paso a paso juntos (Haz clic para marcar)' : 'Step by step (Click to complete)'}
                  </h4>
                  <div className="space-y-2">
                    {sampleRecipes[selectedRecipe].steps.map((step, idx) => {
                      const isDone = !!checkedSteps[idx];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start gap-2.5 transition-all ${
                            isDone
                              ? 'bg-emerald-50/70 text-emerald-900 line-through opacity-80'
                              : 'bg-stone-50/80 text-stone-700 hover:bg-stone-100/80'
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${
                              isDone ? 'text-emerald-600 fill-emerald-100' : 'text-stone-300'
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
                <span className="font-serif text-lg font-medium text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  {isEs ? 'Tarjeta de Conversación / Aventura' : 'Conversation & Micro-Date Card'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRandomPromptIndex((prev) => (prev + 1) % datePrompts.length)
                  }
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>{isEs ? 'Sacar otra tarjeta' : 'Draw another card'}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 text-center shadow-xs">
                <span className="text-3xl mb-3 block">💌</span>
                <p className="font-serif text-xl sm:text-2xl text-stone-900 italic max-w-lg mx-auto leading-snug">
                  "{datePrompts[randomPromptIndex][lang]}"
                </p>
                <p className="text-xs text-stone-400 mt-4">
                  {isEs
                    ? 'Tómense un momento para escuchar sin juzgar ni prisas.'
                    : 'Take a quiet moment to listen with full attention and no rush.'}
                </p>
              </div>
            </div>
          )}

          {project.id === 'coloring-canvas' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center space-y-4">
              <Palette className="w-10 h-10 text-amber-600 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900">
                {isEs ? 'Paleta Botánica Colaborativa' : 'Collaborative Botanical Palette'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {isEs
                  ? 'Este lienzo permitirá pintar simultáneamente desde dos teléfonos o portátiles. Elige un tono de acuarela de prueba:'
                  : 'This canvas will allow painting simultaneously across two devices. Select a watercolor swatch test:'}
              </p>
              <div className="flex justify-center gap-3 py-2">
                {['#f43f5e', '#fb923c', '#eab308', '#10b981', '#06b6d4', '#8b5cf6'].map(
                  (hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setSelectedColor(hex)}
                      style={{ backgroundColor: hex }}
                      className={`w-8 h-8 rounded-full transition-transform ${
                        selectedColor === hex ? 'scale-125 ring-2 ring-offset-2 ring-stone-900' : 'hover:scale-110'
                      }`}
                    />
                  )
                )}
              </div>
              <div
                className="h-24 rounded-xl border border-stone-200/70 flex items-center justify-center text-xs font-mono transition-colors"
                style={{ backgroundColor: `${selectedColor}15`, color: selectedColor }}
              >
                {isEs ? `Tono seleccionado: ${selectedColor}` : `Selected tone: ${selectedColor}`}
              </div>
            </div>
          )}

          {project.id === 'memory-capsule' && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 text-center space-y-4">
              <Music className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-xl text-stone-900">
                {isEs ? 'Nuestra Banda Sonora' : 'Our Soundtrack'}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                {isEs
                  ? 'Próximamente podrás guardar fragmentos de voz, fotos analógicas escaneadas y canciones sincronizadas.'
                  : 'Soon you will be able to store voice notes, scanned film photos, and synced romantic melodies.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            {isEs ? 'Our Digital Crafts · Hecho con amor' : 'Our Digital Crafts · Made with love'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            {isEs ? 'Entendido' : 'Got it'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
