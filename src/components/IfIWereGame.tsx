'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Share2,
} from 'lucide-react';
import {
  BASE_METAPHOR_CATEGORIES,
  MetaphorCategory,
} from '../data/ifIWereData';
import { Language } from '../types';

interface IfIWereGameProps {
  onBack: () => void;
  lang?: Language;
}

type Phase = 'setup' | 'p1' | 'transition' | 'p2' | 'reveal' | 'collage';

interface MetaphorAnswer {
  categoryName: string;
  emoji: string;
  value: string;
  reason?: string;
}

export const IfIWereGame: React.FC<IfIWereGameProps> = ({ onBack }) => {
  const [player1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  const [phase, setPhase] = useState<Phase>('setup');
  const [categories, setCategories] = useState<MetaphorCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Respuestas:
  // p1Answers: cómo ve Jugador 1 a Jugador 2
  // p2Answers: cómo ve Jugador 2 a Jugador 1
  const [p1Answers, setP1Answers] = useState<Record<string, MetaphorAnswer>>({});
  const [p2Answers, setP2Answers] = useState<Record<string, MetaphorAnswer>>({});

  // Input temporal
  const [currentInputValue, setCurrentInputValue] = useState<string>('');
  const [currentInputReason, setCurrentInputReason] = useState<string>('');

  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Iniciar partida
  const handleStartGame = (mode: 'clasico' | 'express') => {
    let list: MetaphorCategory[] = [];
    if (mode === 'clasico') {
      // Las 9 primeras son las exactas de la lámina original
      list = BASE_METAPHOR_CATEGORIES.slice(0, 9);
    } else {
      // 5 aleatorias
      list = [...BASE_METAPHOR_CATEGORIES].sort(() => 0.5 - Math.random()).slice(0, 5);
    }
    setCategories(list);
    setCurrentIndex(0);
    setP1Answers({});
    setP2Answers({});
    setCurrentInputValue('');
    setCurrentInputReason('');
    setPhase('p1');
  };

  const currentCat = categories[currentIndex];

  // Enviar respuesta de Jugador 1
  const handleSubmitP1 = () => {
    if (!currentInputValue.trim()) return;
    const ans: MetaphorAnswer = {
      categoryName: currentCat.name,
      emoji: currentCat.emoji,
      value: currentInputValue.trim(),
      reason: currentInputReason.trim(),
    };
    setP1Answers((prev) => ({ ...prev, [currentCat.id]: ans }));
    setCurrentInputValue('');
    setCurrentInputReason('');

    if (currentIndex + 1 < categories.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase('transition');
      setCurrentIndex(0);
    }
  };

  // Enviar respuesta de Jugador 2
  const handleSubmitP2 = () => {
    if (!currentInputValue.trim()) return;
    const ans: MetaphorAnswer = {
      categoryName: currentCat.name,
      emoji: currentCat.emoji,
      value: currentInputValue.trim(),
      reason: currentInputReason.trim(),
    };
    setP2Answers((prev) => ({ ...prev, [currentCat.id]: ans }));
    setCurrentInputValue('');
    setCurrentInputReason('');

    if (currentIndex + 1 < categories.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase('reveal');
      setRevealIndex(0);
    }
  };

  const nextReveal = () => {
    if (revealIndex + 1 < categories.length) {
      setRevealIndex((prev) => prev + 1);
    } else {
      setPhase('collage');
    }
  };

  const prevReveal = () => {
    if (revealIndex > 0) {
      setRevealIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    let text = `🎨 Nuestro Collage: Yo Si Fuera...
${player1Name} & ${player2Name}\n\n`;

    categories.forEach((cat) => {
      const a1 = p1Answers[cat.id];
      const a2 = p2Answers[cat.id];
      if (a1 && a2) {
        text += `${cat.emoji} ${cat.name}:\n`;
        text += `• ${player1Name} dice de ${player2Name}: "${a1.value}"\n`;
        text += `• ${player2Name} dice de ${player1Name}: "${a2.value}"\n\n`;
      }
    });

    text += `Creado en Nuestro Refugio Digital ✨`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 min-h-[85vh]">
      {/* Cabecera */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Refugio</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-900/30">
          <span>🎭</span>
          <span>Yo Si Fuera...</span>
        </div>

        {phase !== 'setup' && (
          <button
            type="button"
            onClick={() => setPhase('setup')}
            title="Reiniciar partida"
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* PANTALLA 1: SETUP DEL JUEGO                               */}
      {/* ========================================================= */}
      {phase === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Banner con estética de collage de recortes */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-100 via-white to-amber-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 p-6 sm:p-8 border-2 border-stone-300/80 dark:border-white/10 shadow-sm text-center">
            {/* Letras recortadas de revista estilo 'YO SI FUERA' */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3">
              <span className="px-2.5 py-1 text-sm font-bold bg-amber-200 text-stone-900 shadow-xs rotate-[-3deg] border border-stone-800/20">Y</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-rose-200 text-stone-900 shadow-xs rotate-[2deg] border border-stone-800/20">O</span>
              <span className="w-2" />
              <span className="px-2.5 py-1 text-sm font-bold bg-emerald-200 text-stone-900 shadow-xs rotate-[-2deg] border border-stone-800/20">S</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-sky-200 text-stone-900 shadow-xs rotate-[3deg] border border-stone-800/20">I</span>
              <span className="w-2" />
              <span className="px-2.5 py-1 text-sm font-bold bg-purple-200 text-stone-900 shadow-xs rotate-[-2deg] border border-stone-800/20">F</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-pink-200 text-stone-900 shadow-xs rotate-[1deg] border border-stone-800/20">U</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-amber-100 text-stone-900 shadow-xs rotate-[-3deg] border border-stone-800/20">E</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-emerald-100 text-stone-900 shadow-xs rotate-[2deg] border border-stone-800/20">R</span>
              <span className="px-2.5 py-1 text-sm font-bold bg-rose-100 text-stone-900 shadow-xs rotate-[-1deg] border border-stone-800/20">A</span>
              <span className="text-xl ml-1">🐶</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal mb-2">
              El Espejo de Metáforas & Risas
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              ¿Si tu pareja fuera un animal, un lugar o una bebida... cuál sería y por qué? Escriban sus metáforas en secreto y descúbranlas juntos en un collage de recortes.
            </p>
          </div>

          {/* Opciones de partida */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => handleStartGame('clasico')}
              className="p-5 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 hover:border-emerald-400 shadow-xs hover:shadow-md text-left transition-all cursor-pointer flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">📜</span>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold">
                  9 Categorías
                </span>
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                La Lámina Original
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Animal, Lugar, Planta, Personaje, Estación, Hobby, Color, Bebida y Comida.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleStartGame('express')}
              className="p-5 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 hover:border-purple-400 shadow-xs hover:shadow-md text-left transition-all cursor-pointer flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] font-mono text-purple-700 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full font-bold">
                  5 Rondas
                </span>
              </div>
              <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                Ronda Rápida Express
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                5 categorías sorpresa seleccionadas al azar (incluyendo canciones y superpoderes).
              </p>
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 2: TURNO JUGADOR 1                               */}
      {/* ========================================================= */}
      {phase === 'p1' && currentCat && (
        <motion.div
          key={`p1-${currentIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-900/30">
            <span className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
              Turno de: <strong>{player1Name}</strong> (Describiendo a {player2Name})
            </span>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              {currentIndex + 1} de {categories.length}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-sm flex flex-col items-center text-center gap-4">
            <span className="text-4xl">{currentCat.emoji}</span>
            <span className="text-[10px] font-mono uppercase text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-100/70 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
              {currentCat.name}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal leading-snug">
              {currentCat.prompt.replace('tu pareja', player2Name)}
            </h2>

            {/* Input de respuesta */}
            <div className="w-full max-w-md flex flex-col gap-2.5 mt-2">
              <input
                type="text"
                value={currentInputValue}
                onChange={(e) => setCurrentInputValue(e.target.value)}
                placeholder={`Si ${player2Name} fuera un(a) ${currentCat.name.toLowerCase()}, sería...`}
                maxLength={80}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />

              <input
                type="text"
                value={currentInputReason}
                onChange={(e) => setCurrentInputReason(e.target.value)}
                placeholder="¿Por qué? (opcional: anécdota o motivo tierno/gracioso)"
                maxLength={120}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />

              {/* Sugerencias rápidas con un toque */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 block w-full">Ideas inspiradoras:</span>
                {currentCat.suggestions.slice(0, 3).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentInputValue(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-white/5 cursor-pointer transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmitP1}
                disabled={!currentInputValue.trim()}
                className="w-full mt-2 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Guardar metáfora</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 3: TRANSICIÓN                                    */}
      {/* ========================================================= */}
      {phase === 'transition' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-lg my-auto gap-4"
        >
          <span className="text-4xl block animate-bounce">🎨🤫</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
            ¡Turno de {player2Name}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm leading-relaxed">
            {player1Name} ya guardó sus metáforas para ti. Ahora pásale el móvil a{' '}
            <strong className="text-stone-900 dark:text-white font-semibold">{player2Name}</strong> para que escriba las suyas.
          </p>

          <button
            type="button"
            onClick={() => {
              setPhase('p2');
              setCurrentIndex(0);
              setCurrentInputValue('');
              setCurrentInputReason('');
            }}
            className="w-full max-w-xs mt-3 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Soy {player2Name}, ¡vamos allá!
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 4: TURNO JUGADOR 2                               */}
      {/* ========================================================= */}
      {phase === 'p2' && currentCat && (
        <motion.div
          key={`p2-${currentIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/30">
            <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
              Turno de: <strong>{player2Name}</strong> (Describiendo a {player1Name})
            </span>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              {currentIndex + 1} de {categories.length}
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-sm flex flex-col items-center text-center gap-4">
            <span className="text-4xl">{currentCat.emoji}</span>
            <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-300 font-bold bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full">
              {currentCat.name}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal leading-snug">
              {currentCat.prompt.replace('tu pareja', player1Name)}
            </h2>

            <div className="w-full max-w-md flex flex-col gap-2.5 mt-2">
              <input
                type="text"
                value={currentInputValue}
                onChange={(e) => setCurrentInputValue(e.target.value)}
                placeholder={`Si ${player1Name} fuera un(a) ${currentCat.name.toLowerCase()}, sería...`}
                maxLength={80}
                className="w-full px-4 py-3 text-xs sm:text-sm rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />

              <input
                type="text"
                value={currentInputReason}
                onChange={(e) => setCurrentInputReason(e.target.value)}
                placeholder="¿Por qué? (opcional: anécdota o motivo tierno/gracioso)"
                maxLength={120}
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              />

              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 block w-full">Ideas inspiradoras:</span>
                {currentCat.suggestions.slice(0, 3).map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentInputValue(sug)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-white/5 cursor-pointer transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmitP2}
                disabled={!currentInputValue.trim()}
                className="w-full mt-2 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Guardar metáfora</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 5: REVELACIÓN PASO A PASO                        */}
      {/* ========================================================= */}
      {phase === 'reveal' && categories[revealIndex] && (
        <motion.div
          key={`reveal-${revealIndex}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-4"
        >
          {(() => {
            const cat = categories[revealIndex];
            const a1 = p1Answers[cat.id];
            const a2 = p2Answers[cat.id];

            return (
              <div className="rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/80 dark:border-white/10 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-200/60 dark:border-white/10 pb-2">
                  <span>Categoría {revealIndex + 1} de {categories.length}</span>
                  <span className="text-emerald-600 font-semibold">{cat.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  {/* Tarjeta de cómo ve Jugador 1 a Jugador 2 */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 text-left flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold block">
                      {player1Name} dice que {player2Name} sería:
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      "{a1?.value}"
                    </h4>
                    {a1?.reason && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                        "{a1.reason}"
                      </p>
                    )}
                  </div>

                  {/* Tarjeta de cómo ve Jugador 2 a Jugador 1 */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-left flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block">
                      {player2Name} dice que {player1Name} sería:
                    </span>
                    <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      "{a2?.value}"
                    </h4>
                    {a2?.reason && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                        "{a2.reason}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Navegación */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={prevReveal}
                    disabled={revealIndex === 0}
                    className="flex items-center gap-1 text-xs text-stone-600 dark:text-stone-300 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextReveal}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 cursor-pointer"
                  >
                    <span>{revealIndex + 1 < categories.length ? 'Siguiente categoría' : 'Ver collage completo'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 6: COLLAGE COMPLETO DE NOSOTROS                  */}
      {/* ========================================================= */}
      {phase === 'collage' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-5 text-center p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-lg my-auto"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">🐶</span>
            <span className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
              Nuestro Collage Poético
            </span>
            <span className="text-2xl">🐶</span>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            Un recuerdo creado entre {player1Name} y {player2Name} mirando a través de metáforas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const a1 = p1Answers[cat.id];
              const a2 = p2Answers[cat.id];
              return (
                <div
                  key={cat.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-white/10 text-left text-xs"
                >
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200 mb-1">
                    <span>{cat.emoji}</span>
                    <span className="font-mono text-[11px] uppercase">{cat.name}:</span>
                  </div>
                  <div className="text-[11px] text-stone-600 dark:text-stone-300">
                    <p>• {player2Name}: <strong className="font-medium text-emerald-700 dark:text-emerald-400">"{a1?.value}"</strong></p>
                    <p>• {player1Name}: <strong className="font-medium text-amber-700 dark:text-amber-400">"{a2?.value}"</strong></p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xs mx-auto mt-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? '¡Copiado!' : 'Compartir collage'}</span>
            </button>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-600 text-white shadow-xs cursor-pointer"
            >
              Jugar de nuevo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default IfIWereGame;
