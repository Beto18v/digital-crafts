'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Check,
  Award,
  Share2,
} from 'lucide-react';
import {
  BASE_DILEMMAS,
  WYR_CATEGORIES,
  WouldYouRatherDilemma,
} from '../data/wouldYouRatherData';
import { Language } from '../types';

interface WouldYouRatherGameProps {
  onBack: () => void;
  lang?: Language;
}

type Phase = 'setup' | 'p1' | 'transition' | 'p2' | 'reveal' | 'summary';

export const WouldYouRatherGame: React.FC<WouldYouRatherGameProps> = ({ onBack }) => {
  const [player1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  const [phase, setPhase] = useState<Phase>('setup');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [roundCount, setRoundCount] = useState<number>(6);

  const [dilemmas, setDilemmas] = useState<WouldYouRatherDilemma[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Respuestas:
  // p1Own: qué prefiere Jugador 1 ('A' o 'B')
  // p1Guess: qué cree Jugador 1 que elegirá Jugador 2 ('A' o 'B')
  const [p1Own, setP1Own] = useState<Record<string, 'A' | 'B'>>({});
  const [p1Guess, setP1Guess] = useState<Record<string, 'A' | 'B'>>({});

  // p2Own: qué prefiere Jugador 2 ('A' o 'B')
  // p2Guess: qué cree Jugador 2 que elegirá Jugador 1 ('A' o 'B')
  const [p2Own, setP2Own] = useState<Record<string, 'A' | 'B'>>({});
  const [p2Guess, setP2Guess] = useState<Record<string, 'A' | 'B'>>({});

  // Sub-paso dentro del turno de cada jugador:
  // 1: elegir lo propio -> 2: adivinar lo del otro
  const [turnStep, setTurnStep] = useState<'own' | 'guess'>('own');
  const [tempOwnChoice, setTempOwnChoice] = useState<'A' | 'B' | null>(null);

  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [showHearts, setShowHearts] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Iniciar partida
  const handleStartGame = () => {
    let pool = [...BASE_DILEMMAS];
    if (selectedCategory !== 'todos') {
      pool = pool.filter((d) => d.category === selectedCategory);
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, roundCount);
    setDilemmas(shuffled);
    setCurrentIndex(0);
    setP1Own({});
    setP1Guess({});
    setP2Own({});
    setP2Guess({});
    setTurnStep('own');
    setTempOwnChoice(null);
    setPhase('p1');
  };

  const currentDilemma = dilemmas[currentIndex];

  // Flujo Jugador 1
  const handleP1Choice = (choice: 'A' | 'B') => {
    if (turnStep === 'own') {
      setTempOwnChoice(choice);
      setTurnStep('guess');
    } else {
      const qId = currentDilemma.id;
      setP1Own((prev) => ({ ...prev, [qId]: tempOwnChoice! }));
      setP1Guess((prev) => ({ ...prev, [qId]: choice }));

      if (currentIndex + 1 < dilemmas.length) {
        setCurrentIndex((prev) => prev + 1);
        setTurnStep('own');
        setTempOwnChoice(null);
      } else {
        setPhase('transition');
        setCurrentIndex(0);
        setTurnStep('own');
        setTempOwnChoice(null);
      }
    }
  };

  // Flujo Jugador 2
  const handleP2Choice = (choice: 'A' | 'B') => {
    if (turnStep === 'own') {
      setTempOwnChoice(choice);
      setTurnStep('guess');
    } else {
      const qId = currentDilemma.id;
      setP2Own((prev) => ({ ...prev, [qId]: tempOwnChoice! }));
      setP2Guess((prev) => ({ ...prev, [qId]: choice }));

      if (currentIndex + 1 < dilemmas.length) {
        setCurrentIndex((prev) => prev + 1);
        setTurnStep('own');
        setTempOwnChoice(null);
      } else {
        setPhase('reveal');
        setRevealIndex(0);
      }
    }
  };

  // Estadísticas finales
  const stats = useMemo(() => {
    if (dilemmas.length === 0) return { p1Hits: 0, p2Hits: 0, shared: 0, total: 0, telepathyRate: 0 };
    let p1Hits = 0;
    let p2Hits = 0;
    let shared = 0;

    dilemmas.forEach((d) => {
      const p1O = p1Own[d.id];
      const p1G = p1Guess[d.id];
      const p2O = p2Own[d.id];
      const p2G = p2Guess[d.id];

      // Jugador 1 acertó qué prefería Jugador 2
      if (p1G && p2O && p1G === p2O) p1Hits++;
      // Jugador 2 acertó qué prefería Jugador 1
      if (p2G && p1O && p2G === p1O) p2Hits++;
      // Ambos eligieron lo mismo para sí mismos
      if (p1O && p2O && p1O === p2O) shared++;
    });

    const totalGuesses = dilemmas.length * 2;
    const telepathyRate = Math.round(((p1Hits + p2Hits) / totalGuesses) * 100);

    return {
      p1Hits,
      p2Hits,
      shared,
      total: dilemmas.length,
      telepathyRate,
    };
  }, [dilemmas, p1Own, p1Guess, p2Own, p2Guess]);

  const nextReveal = () => {
    if (revealIndex + 1 < dilemmas.length) {
      setRevealIndex((prev) => prev + 1);
    } else {
      setPhase('summary');
    }
  };

  const prevReveal = () => {
    if (revealIndex > 0) {
      setRevealIndex((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    const text = `🔮 Sintonía en Pareja: ¿Esto o Aquello?
${player1Name} & ${player2Name}
Lectura de Mente: ${stats.telepathyRate}% de telepatía mutua.
Preferencia Compartida: Coincidimos en ${stats.shared} de ${stats.total} dilemas.
Jugado en Nuestro Refugio Digital ✨`;
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

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200/60 dark:border-purple-900/30">
          <span>🔮</span>
          <span>¿Esto o Aquello?</span>
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
      {/* PANTALLA 1: SETUP DE DILEMAS                              */}
      {/* ========================================================= */}
      {phase === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-purple-50/80 via-white to-pink-50/40 dark:from-stone-900/90 dark:via-stone-900/80 dark:to-purple-950/30 p-5 sm:p-7 border border-purple-200/70 dark:border-white/10 shadow-sm text-center">
            <span className="text-4xl block mb-2">⚖️🔮✨</span>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal tracking-tight mb-2">
              Esto o Aquello: Nuestra Sintonía
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              El dilema definitivo para parejas. No solo eligen qué prefieren: ¡también intentan adivinar qué elegirá el otro para medir su nivel de lectura de mente!
            </p>

            <div className="mt-4 pt-3 border-t border-purple-200/50 dark:border-white/10 flex items-center justify-center gap-3">
              <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Dilemas por ronda:
              </span>
              <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
                {[6, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRoundCount(num)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      roundCount === num
                        ? 'bg-purple-600 text-white shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {num} dilemas
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de categorías */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3 px-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Categoría de dilemas</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WYR_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.98] ${
                    selectedCategory === cat.id
                      ? 'bg-purple-50/90 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 shadow-xs'
                      : 'bg-white/80 dark:bg-stone-900/80 border-stone-200/80 dark:border-white/10 hover:border-purple-300'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-purple-100/70 dark:bg-purple-900/50 shrink-0">
                    {cat.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm shadow-md hover:bg-stone-800 dark:hover:bg-white active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Comenzar los Dilemas!</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 2: TURNO DEL JUGADOR 1                           */}
      {/* ========================================================= */}
      {phase === 'p1' && currentDilemma && (
        <motion.div
          key={`p1-${currentIndex}-${turnStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Banner de paso */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200/80 dark:border-purple-900/30">
            <span className="text-xs font-semibold text-purple-950 dark:text-purple-200">
              Turno de: <strong>{player1Name}</strong>
            </span>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              {currentIndex + 1} de {dilemmas.length}
            </span>
          </div>

          {/* Pregunta activa según el paso */}
          <div className="text-center py-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block mb-1">
              {turnStep === 'own' ? 'Paso 1 de 2: Tu preferencia' : `Paso 2 de 2: ¡Adivina a ${player2Name}!`}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
              {turnStep === 'own'
                ? '¿Qué preferirías tú?'
                : `¿Qué crees que preferiría ${player2Name}?`}
            </h2>
          </div>

          {/* Tarjetas de opciones A vs B */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Opción A */}
            <button
              type="button"
              onClick={() => handleP1Choice('A')}
              className="p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200/80 hover:border-purple-400 dark:border-white/10 dark:hover:border-purple-500 shadow-sm hover:shadow-md flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50">
                {currentDilemma.optionA.emoji}
              </span>
              <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {currentDilemma.optionA.text}
              </p>
            </button>

            {/* Opción B */}
            <button
              type="button"
              onClick={() => handleP1Choice('B')}
              className="p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200/80 hover:border-pink-400 dark:border-white/10 dark:hover:border-pink-500 shadow-sm hover:shadow-md flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl p-2 rounded-2xl bg-pink-50 dark:bg-pink-950/50">
                {currentDilemma.optionB.emoji}
              </span>
              <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {currentDilemma.optionB.text}
              </p>
            </button>
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
          <span className="text-4xl block animate-bounce">📱🤫</span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
            ¡Turno de {player2Name}!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm leading-relaxed">
            {player1Name} ya eligió sus dilemas y predijo tus gustos. Pásale el móvil a{' '}
            <strong className="text-stone-900 dark:text-white font-semibold">{player2Name}</strong>.
          </p>

          <button
            type="button"
            onClick={() => {
              setPhase('p2');
              setCurrentIndex(0);
              setTurnStep('own');
            }}
            className="w-full max-w-xs mt-3 py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Soy {player2Name}, ¡vamos allá!
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 4: TURNO DEL JUGADOR 2                           */}
      {/* ========================================================= */}
      {phase === 'p2' && currentDilemma && (
        <motion.div
          key={`p2-${currentIndex}-${turnStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200/80 dark:border-pink-900/30">
            <span className="text-xs font-semibold text-pink-950 dark:text-pink-200">
              Turno de: <strong>{player2Name}</strong>
            </span>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
              {currentIndex + 1} de {dilemmas.length}
            </span>
          </div>

          <div className="text-center py-2">
            <span className="text-xs font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold block mb-1">
              {turnStep === 'own' ? 'Paso 1 de 2: Tu preferencia' : `Paso 2 de 2: ¡Adivina a ${player1Name}!`}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
              {turnStep === 'own'
                ? '¿Qué preferirías tú?'
                : `¿Qué crees que preferiría ${player1Name}?`}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={() => handleP2Choice('A')}
              className="p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200/80 hover:border-purple-400 dark:border-white/10 dark:hover:border-purple-500 shadow-sm hover:shadow-md flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl p-2 rounded-2xl bg-purple-50 dark:bg-purple-950/50">
                {currentDilemma.optionA.emoji}
              </span>
              <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {currentDilemma.optionA.text}
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleP2Choice('B')}
              className="p-5 rounded-3xl bg-white/95 dark:bg-stone-900/95 border-2 border-stone-200/80 hover:border-pink-400 dark:border-white/10 dark:hover:border-pink-500 shadow-sm hover:shadow-md flex flex-col items-center text-center gap-3 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-4xl p-2 rounded-2xl bg-pink-50 dark:bg-pink-950/50">
                {currentDilemma.optionB.emoji}
              </span>
              <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-snug">
                {currentDilemma.optionB.text}
              </p>
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 5: REVELACIÓN PASO A PASO                        */}
      {/* ========================================================= */}
      {phase === 'reveal' && dilemmas[revealIndex] && (
        <motion.div
          key={`reveal-${revealIndex}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-4"
        >
          {(() => {
            const d = dilemmas[revealIndex];
            const p1O = p1Own[d.id];
            const p1G = p1Guess[d.id];
            const p2O = p2Own[d.id];
            const p2G = p2Guess[d.id];

            const p1GotIt = p1G === p2O;
            const p2GotIt = p2G === p1O;
            const sameTaste = p1O === p2O;

            const textOf = (choice: 'A' | 'B') =>
              choice === 'A' ? d.optionA.text : d.optionB.text;
            const emojiOf = (choice: 'A' | 'B') =>
              choice === 'A' ? d.optionA.emoji : d.optionB.emoji;

            return (
              <div className="rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/80 dark:border-white/10 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-200/60 dark:border-white/10 pb-2">
                  <span>Dilema {revealIndex + 1} de {dilemmas.length}</span>
                  <span className="text-purple-600 font-semibold">🔮 Gran Revelación</span>
                </div>

                {/* Banner de coincidencia de gusto */}
                <div className="text-center py-1">
                  {sameTaste ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold">
                      ✨ ¡Ambos prefieren lo mismo!
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold">
                      ⚖️ Gustos diferentes en este dilema
                    </span>
                  )}
                </div>

                {/* Comparación de elecciones reales */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/40 text-center">
                    <span className="text-[10px] font-mono uppercase text-purple-700 dark:text-purple-300 font-semibold block mb-1">
                      {player1Name} eligió:
                    </span>
                    <span className="text-2xl block mb-1">{emojiOf(p1O)}</span>
                    <p className="font-serif text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-2">
                      {textOf(p1O)}
                    </p>
                    <div className="mt-2 pt-2 border-t border-purple-200/50 text-[10px] text-stone-500">
                      {p2GotIt ? '🎯 ' + player2Name + ' lo adivinó' : '❌ ' + player2Name + ' no acertó'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-pink-50/70 dark:bg-pink-950/30 border border-pink-200/80 dark:border-pink-900/40 text-center">
                    <span className="text-[10px] font-mono uppercase text-pink-700 dark:text-pink-300 font-semibold block mb-1">
                      {player2Name} eligió:
                    </span>
                    <span className="text-2xl block mb-1">{emojiOf(p2O)}</span>
                    <p className="font-serif text-xs font-semibold text-stone-900 dark:text-stone-100 line-clamp-2">
                      {textOf(p2O)}
                    </p>
                    <div className="mt-2 pt-2 border-t border-pink-200/50 text-[10px] text-stone-500">
                      {p1GotIt ? '🎯 ' + player1Name + ' lo adivinó' : '❌ ' + player1Name + ' no acertó'}
                    </div>
                  </div>
                </div>

                {/* Botones de navegación */}
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
                    <span>{revealIndex + 1 < dilemmas.length ? 'Siguiente dilema' : 'Ver resultado final'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 6: RESUMEN FINAL                                 */}
      {/* ========================================================= */}
      {phase === 'summary' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-5 text-center p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-lg my-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/70 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔮
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
            {stats.telepathyRate}% de Telepatía
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm mx-auto leading-relaxed">
            {stats.telepathyRate >= 80
              ? '¡Se conocen como la palma de su mano! Saben exactamente qué pasa por la cabeza del otro.'
              : stats.telepathyRate >= 50
              ? '¡Muy buena sintonía! Aún guardan pequeños misterios que hacen divertida la relación.'
              : '¡Sorpresas garantizadas! Tienen formas únicas de ver el mundo que enriquecen su historia.'}
          </p>

          <div className="grid grid-cols-3 gap-2 py-2 max-w-md mx-auto w-full text-xs">
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/30">
              <span className="text-[10px] text-stone-400 block">{player1Name} acertó:</span>
              <strong className="text-purple-600 text-base">{stats.p1Hits}/{stats.total}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-900/30">
              <span className="text-[10px] text-stone-400 block">{player2Name} acertó:</span>
              <strong className="text-pink-600 text-base">{stats.p2Hits}/{stats.total}</strong>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/30">
              <span className="text-[10px] text-stone-400 block">Mismo gusto:</span>
              <strong className="text-emerald-600 text-base">{stats.shared}/{stats.total}</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xs mx-auto mt-2">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? '¡Copiado!' : 'Compartir'}</span>
            </button>

            <button
              type="button"
              onClick={handleStartGame}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-purple-600 text-white shadow-xs cursor-pointer"
            >
              Jugar otra ronda
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default WouldYouRatherGame;
