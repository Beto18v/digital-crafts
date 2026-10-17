'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Eye,
  Check,
  X,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  Plus,
  HelpCircle,
  Gift,
} from 'lucide-react';
import {
  BASE_RIDDLES,
  RIDDLE_CATEGORIES,
  RIDDLE_BETS,
  Riddle,
} from '../data/riddlesData';
import { Language } from '../types';

interface RiddleDuelGameProps {
  onBack: () => void;
  lang?: Language;
}

export const RiddleDuelGame: React.FC<RiddleDuelGameProps> = ({ onBack }) => {
  // Nombres de jugadores guardados con sincronización local
  const [player1Name, setPlayer1Name] = useState<string>(() => {
    return localStorage.getItem('cq_p1_name') || 'Ella';
  });
  const [player2Name, setPlayer2Name] = useState<string>(() => {
    return localStorage.getItem('cq_p2_name') || 'Él';
  });

  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  // Estado de juego
  const [phase, setPhase] = useState<'setup' | 'playing' | 'victory'>('setup');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedBet, setSelectedBet] = useState<string>(RIDDLE_BETS[0]);
  const [targetScore, setTargetScore] = useState<number>(3);

  // Acertijos de la partida actual
  const [deck, setDeck] = useState<Riddle[]>([]);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState<number>(0);
  const [unlockedHintsCount, setUnlockedHintsCount] = useState<number>(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  // Puntuación
  const [p1Score, setP1Score] = useState<number>(0);
  const [p2Score, setP2Score] = useState<number>(0);
  const [winnerName, setWinnerName] = useState<string>('');

  // Efecto visual de celebración
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Iniciar partida
  const handleStartGame = () => {
    let pool = [...BASE_RIDDLES];
    if (selectedCategory !== 'todos') {
      pool = pool.filter((r) => r.category === selectedCategory);
    }
    // Barajar
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setDeck(shuffled);
    setCurrentRiddleIndex(0);
    setUnlockedHintsCount(0);
    setIsAnswerRevealed(false);
    setP1Score(0);
    setP2Score(0);
    setPhase('playing');
  };

  const currentRiddle = deck[currentRiddleIndex];

  // Puntos calculados según pistas usadas
  const currentPointsReward = useMemo(() => {
    if (unlockedHintsCount === 0) return 3;
    if (unlockedHintsCount === 1) return 2;
    if (unlockedHintsCount === 2) return 1;
    return 1;
  }, [unlockedHintsCount]);

  // Desbloquear pista siguiente
  const handleUnlockHint = () => {
    if (currentRiddle && unlockedHintsCount < currentRiddle.hints.length) {
      setUnlockedHintsCount((prev) => prev + 1);
    }
  };

  // Asignar punto y avanzar
  const handleAwardPoint = (player: 'p1' | 'p2' | 'none') => {
    let nextP1 = p1Score;
    let nextP2 = p2Score;

    if (player === 'p1') {
      nextP1 += currentPointsReward;
      setP1Score(nextP1);
    } else if (player === 'p2') {
      nextP2 += currentPointsReward;
      setP2Score(nextP2);
    }

    // Verificar si alguien alcanzó la meta
    if (nextP1 >= targetScore) {
      setWinnerName(player1Name);
      setPhase('victory');
      setShowCelebration(true);
      return;
    }
    if (nextP2 >= targetScore) {
      setWinnerName(player2Name);
      setPhase('victory');
      setShowCelebration(true);
      return;
    }

    // Siguiente acertijo
    if (currentRiddleIndex + 1 < deck.length) {
      setCurrentRiddleIndex((prev) => prev + 1);
      setUnlockedHintsCount(0);
      setIsAnswerRevealed(false);
    } else {
      // Fin del mazo: gana el que tenga más puntos
      if (nextP1 > nextP2) {
        setWinnerName(player1Name);
      } else if (nextP2 > nextP1) {
        setWinnerName(player2Name);
      } else {
        setWinnerName('¡Empate de Mentes Maestras!');
      }
      setPhase('victory');
      setShowCelebration(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 min-h-[85vh]">
      {/* Barra de cabecera */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Refugio</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200/60 dark:border-amber-900/30">
          <span>🔍</span>
          <span>Duelo de Acertijos</span>
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

      {/* Animación de confeti al ganar */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0.5, 1.4, 0.8],
                  x: (Math.random() - 0.5) * 380,
                  y: (Math.random() - 0.7) * 420,
                  rotate: (Math.random() - 0.5) * 160,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className="absolute text-2xl sm:text-3xl"
              >
                {['🏆', '✨', '🧠', '💡', '🎉', '🥐', '💆'][i % 7]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PANTALLA 1: SETUP DE LA PARTIDA                           */}
      {/* ========================================================= */}
      {phase === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Banner de bienvenida estilo detective romántico */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/80 via-white to-rose-50/40 dark:from-stone-900/90 dark:via-stone-900/80 dark:to-amber-950/30 p-5 sm:p-7 border border-amber-200/70 dark:border-white/10 shadow-sm text-center">
            <span className="text-4xl block mb-2">🕵️‍♂️📚🕵️‍♀️</span>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal tracking-tight mb-2">
              Duelo de Acertijos & Enigmas
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              El que lo adivine gana. Reten sus mentes con pistas progresivas, piensen despacio y compitan con humor por la prenda de la cita.
            </p>

            {/* Configuración de nombres de la pareja */}
            <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-white/10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="text-left">
                <label className="text-[10px] font-medium text-amber-800 dark:text-amber-300 block mb-1">
                  Pareja 1 (Ella / Nombre):
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Ella"
                  maxLength={15}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-white/10 text-stone-800 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-medium text-amber-800 dark:text-amber-300 block mb-1">
                  Pareja 2 (Él / Nombre):
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Él"
                  maxLength={15}
                  className="w-full px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-amber-200 dark:border-white/10 text-stone-800 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Marcador de meta de puntos */}
            <div className="mt-4 pt-3 border-t border-amber-200/50 dark:border-white/10 flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                Gana el primero en llegar a:
              </span>
              <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs font-semibold">
                {[3, 5, 7].map((pts) => (
                  <button
                    key={pts}
                    type="button"
                    onClick={() => setTargetScore(pts)}
                    className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                      targetScore === pts
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                    }`}
                  >
                    {pts} pts
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selector de Apuesta / Prenda Romántica */}
          <div className="rounded-2xl bg-white/80 dark:bg-stone-900/80 p-4 border border-stone-200/80 dark:border-white/10 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 font-semibold">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>¿Qué se juega el perdedor? (Prenda del duelo)</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {RIDDLE_BETS.map((bet) => (
                <button
                  key={bet}
                  type="button"
                  onClick={() => setSelectedBet(bet)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                    selectedBet === bet
                      ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 font-semibold border border-amber-300 dark:border-amber-800'
                      : 'bg-stone-50 dark:bg-stone-800/50 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedBet === bet ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-600'}`} />
                  <span className="flex-1">{bet}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Categoría de Acertijos */}
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3 px-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Elige la temática de enigmas</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RIDDLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`group relative flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.98] ${
                    selectedCategory === cat.id
                      ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 shadow-sm'
                      : 'bg-white/80 dark:bg-stone-900/80 border-stone-200/80 dark:border-white/10 hover:border-amber-300'
                  }`}
                >
                  <span className="text-2xl p-2 rounded-xl bg-amber-100/70 dark:bg-amber-900/50 shrink-0">
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

          {/* Botón principal de comenzar duelo */}
          <button
            type="button"
            onClick={handleStartGame}
            className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold text-sm shadow-md hover:bg-stone-800 dark:hover:bg-white active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>¡Comenzar el Duelo!</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 2: JUEGO EN VIVO (TABLERO DEL ENIGMA)            */}
      {/* ========================================================= */}
      {phase === 'playing' && currentRiddle && (
        <motion.div
          key={`riddle-${currentRiddle.id}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-4"
        >
          {/* Marcador en vivo Pareja 1 vs Pareja 2 */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs">
            {/* Jugador 1 */}
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-sm font-bold text-rose-700 dark:text-rose-300">
                {p1Score}
              </span>
              <div className="text-left">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                  {player1Name}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  Meta: {targetScore} pts
                </span>
              </div>
            </div>

            {/* Recompensa en juego */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-bold bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                +{currentPointsReward} pts en juego
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">
                Acertijo {currentRiddleIndex + 1} de {deck.length}
              </span>
            </div>

            {/* Jugador 2 */}
            <div className="flex items-center gap-2 text-right">
              <div className="text-right">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                  {player2Name}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  Meta: {targetScore} pts
                </span>
              </div>
              <span className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-sm font-bold text-amber-700 dark:text-amber-300">
                {p2Score}
              </span>
            </div>
          </div>

          {/* Tarjeta del Acertijo */}
          <div className="relative rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/80 dark:border-white/10 shadow-md flex flex-col gap-5">
            {/* Cabecera del enigma */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-200/60 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentRiddle.emoji}</span>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-700 dark:text-amber-400 font-semibold block">
                    {currentRiddle.difficulty}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
                    {currentRiddle.title}
                  </h3>
                </div>
              </div>

              <span className="text-xs text-stone-500 dark:text-stone-400 italic">
                {unlockedHintsCount} de {currentRiddle.hints.length} pistas
              </span>
            </div>

            {/* Texto del acertijo */}
            <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
              "{currentRiddle.question}"
            </p>

            {/* Sección de Pistas Desbloqueadas */}
            {unlockedHintsCount > 0 && (
              <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pistas desbloqueadas:</span>
                </div>
                {currentRiddle.hints.slice(0, unlockedHintsCount).map((hint, idx) => (
                  <p key={idx} className="text-xs text-stone-700 dark:text-stone-300 flex items-start gap-2">
                    <span className="font-mono text-amber-600 font-bold shrink-0">#{idx + 1}:</span>
                    <span>{hint}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Botón para pedir más pistas */}
            {!isAnswerRevealed && unlockedHintsCount < currentRiddle.hints.length && (
              <button
                type="button"
                onClick={handleUnlockHint}
                className="self-center flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-amber-800 dark:text-amber-200 bg-amber-100/70 dark:bg-amber-950/60 hover:bg-amber-200/80 dark:hover:bg-amber-900/70 transition-colors cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pedir pista #{unlockedHintsCount + 1} (reduce puntos)</span>
              </button>
            )}

            {/* Revelar Solución */}
            {!isAnswerRevealed ? (
              <div className="pt-2 border-t border-stone-200/60 dark:border-white/10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsAnswerRevealed(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Eye className="w-4 h-4" />
                  <span>Revelar Solución Oficial</span>
                </button>
              </div>
            ) : (
              /* Solución revelada y asignación de puntos */
              <div className="pt-3 border-t border-stone-200/60 dark:border-white/10 flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs">
                  <span className="text-[10px] font-mono uppercase text-emerald-800 dark:text-emerald-300 font-bold block mb-1">
                    Solución:
                  </span>
                  <p className="font-serif text-base font-semibold text-emerald-950 dark:text-emerald-100 mb-1">
                    {currentRiddle.answer}
                  </p>
                  <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
                    {currentRiddle.explanation}
                  </p>
                </div>

                <div className="text-center">
                  <span className="text-xs font-medium text-stone-600 dark:text-stone-300 block mb-2">
                    ¿Quién lo adivinó primero?
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAwardPoint('p1')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      ¡Lo adivinó {player1Name}! (+{currentPointsReward})
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAwardPoint('p2')}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-2xs active:scale-95 transition-all cursor-pointer"
                    >
                      ¡Lo adivinó {player2Name}! (+{currentPointsReward})
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAwardPoint('none')}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      Nadie acertó (Siguiente)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* PANTALLA 3: VICTORIA & CUMPLIR LA PRENDA                  */}
      {/* ========================================================= */}
      {phase === 'victory' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-5 p-6 sm:p-8 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-lg my-auto"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/70 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            🏆
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/40 text-xs font-semibold text-amber-800 dark:text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
            <span>¡Victoria del Duelo!</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
            ¡Felicidades, {winnerName}!
          </h2>

          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 max-w-md text-xs">
            <span className="text-[10px] font-mono uppercase text-amber-800 dark:text-amber-300 font-bold block mb-1">
              Premio / Prenda a reclamar:
            </span>
            <p className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
              {selectedBet}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 py-2 text-xs font-mono">
            <div>
              <span className="text-stone-400 block">{player1Name}:</span>
              <strong className="text-rose-600 text-lg">{p1Score} pts</strong>
            </div>
            <span className="text-stone-300 text-xl font-light">vs</span>
            <div>
              <span className="text-stone-400 block">{player2Name}:</span>
              <strong className="text-amber-600 text-lg">{p2Score} pts</strong>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-xs mt-2">
            <button
              type="button"
              onClick={handleStartGame}
              className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revancha</span>
            </button>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="py-3 px-4 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-medium text-xs transition-colors cursor-pointer"
            >
              Cambiar temática
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RiddleDuelGame;
