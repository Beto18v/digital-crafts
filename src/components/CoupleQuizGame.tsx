'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  RotateCcw,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Share2,
  Smile,
  ShieldAlert,
  Flame,
  Award,
} from 'lucide-react';
import {
  QUIZ_PACKS,
  BASE_QUESTIONS,
  QuizQuestion,
  getQuestionsByPack,
} from '../data/coupleQuizData';
import { Language } from '../types';

interface CoupleQuizGameProps {
  onBack: () => void;
  lang?: Language;
}

type GamePhase = 'setup' | 'player1' | 'transition' | 'player2' | 'reveal' | 'summary';

interface CustomQuestion {
  id: string;
  text: string;
  emoji: string;
  tag: string;
}

export const CoupleQuizGame: React.FC<CoupleQuizGameProps> = ({ onBack }) => {
  // Configuración de Jugadores
  const [player1Name, setPlayer1Name] = useState<string>(() => {
    return localStorage.getItem('cq_p1_name') || 'Ella';
  });
  const [player2Name, setPlayer2Name] = useState<string>(() => {
    return localStorage.getItem('cq_p2_name') || 'Él';
  });

  const [selectedPackId, setSelectedPackId] = useState<string>('clasico');
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>(() => {
    try {
      const saved = localStorage.getItem('cq_custom_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Estado del juego
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [currentQuestions, setCurrentQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Votos: 'p1' (Player 1), 'p2' (Player 2), 'both' (Ambos)
  const [p1Answers, setP1Answers] = useState<Record<string, 'p1' | 'p2' | 'both'>>({});
  const [p2Answers, setP2Answers] = useState<Record<string, 'p1' | 'p2' | 'both'>>({});

  // Revelación paso a paso
  const [revealIndex, setRevealIndex] = useState<number>(0);
  const [showHeartsBurst, setShowHeartsBurst] = useState<boolean>(false);
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Guardar nombres en localStorage
  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  // Guardar preguntas personalizadas
  useEffect(() => {
    localStorage.setItem('cq_custom_questions', JSON.stringify(customQuestions));
  }, [customQuestions]);

  // Iniciar partida
  const startGame = (packId: string) => {
    setSelectedPackId(packId);
    let questions: QuizQuestion[] = [];

    if (packId === 'custom') {
      questions = customQuestions.map((q) => ({
        ...q,
        category: 'personalizado' as const,
      }));
      if (questions.length === 0) {
        setShowCustomModal(true);
        return;
      }
    } else {
      questions = getQuestionsByPack(packId);
    }

    setCurrentQuestions(questions);
    setCurrentIndex(0);
    setP1Answers({});
    setP2Answers({});
    setRevealIndex(0);
    setPhase('player1');
  };

  // Respuesta de Jugador 1
  const handleP1Answer = (choice: 'p1' | 'p2' | 'both') => {
    const q = currentQuestions[currentIndex];
    const newAnswers = { ...p1Answers, [q.id]: choice };
    setP1Answers(newAnswers);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Pasa a pantalla de transición
      setPhase('transition');
      setCurrentIndex(0);
    }
  };

  // Respuesta de Jugador 2
  const handleP2Answer = (choice: 'p1' | 'p2' | 'both') => {
    const q = currentQuestions[currentIndex];
    const newAnswers = { ...p2Answers, [q.id]: choice };
    setP2Answers(newAnswers);

    if (currentIndex + 1 < currentQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Todo listo, pasar a la gran revelación
      setPhase('reveal');
      setRevealIndex(0);
      triggerCelebrationIfMatch(0, newAnswers);
    }
  };

  // Animación de corazoncitos si coincide la pregunta revelada
  const triggerCelebrationIfMatch = (
    index: number,
    p2Override?: Record<string, 'p1' | 'p2' | 'both'>
  ) => {
    const q = currentQuestions[index];
    if (!q) return;
    const p1Choice = p1Answers[q.id];
    const p2Choice = (p2Override || p2Answers)[q.id];
    if (p1Choice && p2Choice && p1Choice === p2Choice) {
      setShowHeartsBurst(true);
      setTimeout(() => setShowHeartsBurst(false), 2000);
    }
  };

  // Avanzar en la revelación
  const nextReveal = () => {
    if (revealIndex + 1 < currentQuestions.length) {
      const nextIdx = revealIndex + 1;
      setRevealIndex(nextIdx);
      triggerCelebrationIfMatch(nextIdx);
    } else {
      setPhase('summary');
    }
  };

  const prevReveal = () => {
    if (revealIndex > 0) {
      setRevealIndex((prev) => prev - 1);
    }
  };

  // Cálculos de estadísticas finales
  const stats = useMemo(() => {
    if (currentQuestions.length === 0) return { matches: 0, total: 0, percentage: 0 };
    let matches = 0;
    currentQuestions.forEach((q) => {
      if (p1Answers[q.id] && p2Answers[q.id] && p1Answers[q.id] === p2Answers[q.id]) {
        matches++;
      }
    });
    const percentage = Math.round((matches / currentQuestions.length) * 100);
    return {
      matches,
      total: currentQuestions.length,
      percentage,
    };
  }, [currentQuestions, p1Answers, p2Answers]);

  // Título poético según el porcentaje
  const affinityVerdict = useMemo(() => {
    if (stats.percentage >= 90) {
      return {
        badge: 'Telepatía Absoluta 🔮',
        message: '¡Increíble conexión! Sus mentes y corazones están completamente en la misma página.',
        color: 'text-rose-600 dark:text-rose-400',
      };
    }
    if (stats.percentage >= 70) {
      return {
        badge: 'Gran Sintonía de Amor 💖',
        message: 'Se conocen muchísimo y comparten la misma perspectiva en casi todo lo importante.',
        color: 'text-pink-600 dark:text-pink-400',
      };
    }
    if (stats.percentage >= 50) {
      return {
        badge: 'Debate con Chispa & Ternura ✨',
        message: '¡Tienen visiones divertidamente distintas en varias cosas! Momento ideal para charlar y reírse.',
        color: 'text-amber-600 dark:text-amber-400',
      };
    }
    return {
      badge: '¡Guerra de Opiniones Amorosa! 🔥',
      message: '¡Cada uno tiene su propia versión de los hechos! Prepárense un vino porque esto requiere una buena charla.',
      color: 'text-orange-600 dark:text-orange-400',
    };
  }, [stats.percentage]);

  // Copiar resumen al portapapeles
  const handleCopySummary = () => {
    const text = `💖 ¡Qué Tanto Nos Conocemos!
Pareja: ${player1Name} & ${player2Name}
Sintonía: ${stats.percentage}% (${stats.matches}/${stats.total} coincidencias)
Veredicto: ${affinityVerdict.badge}
Jugado en Nuestro Refugio Digital ✨`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // Añadir pregunta personalizada
  const handleAddCustomQuestion = () => {
    if (!newQuestionText.trim()) return;
    const newQ: CustomQuestion = {
      id: `custom-${Date.now()}`,
      text: newQuestionText.trim(),
      emoji: '✨',
      tag: 'Personalizada',
    };
    setCustomQuestions((prev) => [newQ, ...prev]);
    setNewQuestionText('');
  };

  const handleDeleteCustomQuestion = (id: string) => {
    setCustomQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8 flex flex-col gap-5 min-h-[85vh]">
      {/* Barra de cabecera compacta y fija */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200/80 dark:border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-white/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-white/10 shadow-2xs active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Refugio</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200/60 dark:border-rose-900/30">
          <Heart className="w-3 h-3 fill-rose-500" />
          <span>¿Qué Tanto Nos Conocemos?</span>
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

      {/* Ráfaga de corazones flotantes al coincidir */}
      <AnimatePresence>
        {showHeartsBurst && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  scale: 0.5,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: 0,
                  scale: [0.5, 1.4, 0.8],
                  x: (Math.random() - 0.5) * 350,
                  y: (Math.random() - 0.7) * 380,
                  rotate: (Math.random() - 0.5) * 120,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                className="absolute text-2xl sm:text-3xl"
              >
                {['💖', '✨', '🥰', '💕', '❤️', '🐾'][i % 6]}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* FASE 1: CONFIGURACIÓN & ELECCIÓN DE PAQUETE (SETUP)      */}
      {/* ========================================================= */}
      {phase === 'setup' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          {/* Tarjeta de bienvenida con estética de la ilustración original */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/80 via-white to-amber-50/50 dark:from-stone-900/90 dark:via-stone-900/80 dark:to-rose-950/30 p-5 sm:p-7 border border-rose-200/70 dark:border-white/10 shadow-sm text-center">
            {/* Ilustración de los dos pugs y corazones */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🐶</span>
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
              <span className="text-3xl">🐶</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal tracking-tight mb-2">
              ¡Qué Tanto Nos Conocemos!
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              El juego de sintonía en pareja. Cada uno responderá en secreto quién es el dueño de cada hábito o momento. ¡Al final revelaremos las coincidencias y los debates!
            </p>

            {/* Configuración rápida de nombres de la pareja */}
            <div className="mt-5 pt-4 border-t border-rose-200/50 dark:border-white/10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="text-left">
                <label className="text-[11px] font-medium text-rose-700 dark:text-rose-300 block mb-1">
                  Pareja 1 (Esposa / Ella):
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Ella / Nombre"
                  maxLength={15}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-white/10 text-stone-800 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="text-left">
                <label className="text-[11px] font-medium text-rose-700 dark:text-rose-300 block mb-1">
                  Pareja 2 (Esposo / Él):
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Él / Nombre"
                  maxLength={15}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-stone-800 border border-rose-200 dark:border-white/10 text-stone-800 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Selector de Paquetes de Preguntas */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Elige tu paquete de preguntas</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Mis preguntas ({customQuestions.length})</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => startGame(pack.id)}
                  className="group relative flex items-start gap-3.5 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 hover:border-rose-400/80 dark:hover:border-rose-500/50 shadow-xs hover:shadow-md transition-all text-left cursor-pointer active:scale-[0.98]"
                >
                  <span className="text-2xl p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 shrink-0 group-hover:scale-110 transition-transform">
                    {pack.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {pack.name}
                      </h3>
                      <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full shrink-0">
                        {pack.questionCount} preg.
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {pack.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300 dark:text-stone-600 group-hover:text-rose-500 self-center shrink-0 transition-colors" />
                </button>
              ))}

              {/* Botón para jugar paquete personalizado si tiene preguntas */}
              {customQuestions.length > 0 && (
                <button
                  type="button"
                  onClick={() => startGame('custom')}
                  className="group relative flex items-start gap-3.5 p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-300/60 dark:border-rose-800/50 hover:border-rose-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer active:scale-[0.98] sm:col-span-2"
                >
                  <span className="text-2xl p-2 rounded-xl bg-rose-100 dark:bg-rose-900/60 shrink-0">
                    💌
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="font-serif text-base font-semibold text-rose-950 dark:text-rose-200">
                        Nuestras Preguntas Creadas
                      </h3>
                      <span className="text-[10px] font-mono text-rose-600 bg-rose-100 dark:bg-rose-900/80 px-2 py-0.5 rounded-full">
                        {customQuestions.length} preg.
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-700/80 dark:text-rose-300 line-clamp-1">
                      Preguntas secretas y exclusivas creadas por ustedes dos.
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400 group-hover:text-rose-600 self-center shrink-0" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FASE 2: TURNO DEL JUGADOR 1 (RESPUESTAS EN SECRETO)       */}
      {/* ========================================================= */}
      {phase === 'player1' && currentQuestions[currentIndex] && (
        <motion.div
          key={`p1-${currentIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col gap-5"
        >
          {/* Banner de turno */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-semibold text-rose-950 dark:text-rose-200">
                Turno de: <strong className="underline">{player1Name}</strong> (Responde en secreto)
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-medium">
              {currentIndex + 1} de {currentQuestions.length}
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-rose-500 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Tarjeta de la Pregunta Actual */}
          <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/90 dark:border-white/10 shadow-sm flex flex-col items-center text-center gap-4">
            <span className="text-4xl animate-bounce">
              {currentQuestions[currentIndex].emoji || '💭'}
            </span>

            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full font-semibold">
              {currentQuestions[currentIndex].tag || 'En Pareja'}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal leading-snug max-w-lg">
              {currentQuestions[currentIndex].text}
            </h2>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              ¿Quién de los dos crees que es? Toca tu respuesta:
            </p>

            {/* Opciones de respuesta para Jugador 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
              <button
                type="button"
                onClick={() => handleP1Answer('p1')}
                className="group flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 transition-colors" />
                <span className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                  {player1Name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleP1Answer('p2')}
                className="group flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-900/50 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500/20 group-hover:fill-amber-500 transition-colors" />
                <span className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                  {player2Name}
                </span>
              </button>
            </div>

            {/* Opción empate / ambos */}
            <button
              type="button"
              onClick={() => handleP1Answer('both')}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 py-1.5 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              🤝 ¡Ambos por igual!
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FASE 3: TRANSICIÓN ENTRE JUGADORES (PASA EL MÓVIL)        */}
      {/* ========================================================= */}
      {phase === 'transition' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center p-8 sm:p-10 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-lg my-auto gap-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950/70 flex items-center justify-center text-3xl shadow-inner animate-pulse">
            🫣
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold">
            <ShieldAlert className="w-4 h-4" />
            <span>¡Cero espionaje!</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
            ¡Tapa la pantalla!
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-sm leading-relaxed">
            {player1Name} ya guardó todas sus respuestas en secreto. Ahora pásale el móvil a{' '}
            <strong className="text-stone-900 dark:text-white font-semibold">{player2Name}</strong>.
          </p>

          <button
            type="button"
            onClick={() => {
              setPhase('player2');
              setCurrentIndex(0);
            }}
            className="w-full max-w-xs mt-3 py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Soy {player2Name}, ¡estoy listo!</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FASE 4: TURNO DEL JUGADOR 2 (RESPUESTAS EN SECRETO)       */}
      {/* ========================================================= */}
      {phase === 'player2' && currentQuestions[currentIndex] && (
        <motion.div
          key={`p2-${currentIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                Turno de: <strong className="underline">{player2Name}</strong> (Tu perspectiva sincera)
              </span>
            </div>
            <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-medium">
              {currentIndex + 1} de {currentQuestions.length}
            </span>
          </div>

          <div className="w-full bg-stone-200 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / currentQuestions.length) * 100}%`,
              }}
            />
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/90 dark:border-white/10 shadow-sm flex flex-col items-center text-center gap-4">
            <span className="text-4xl animate-bounce">
              {currentQuestions[currentIndex].emoji || '💭'}
            </span>

            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full font-semibold">
              {currentQuestions[currentIndex].tag || 'En Pareja'}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal leading-snug max-w-lg">
              {currentQuestions[currentIndex].text}
            </h2>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              ¿Quién de los dos crees que es? Toca tu respuesta:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md mt-2">
              <button
                type="button"
                onClick={() => handleP2Answer('p1')}
                className="group flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-rose-50/70 hover:bg-rose-100/80 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-900/50 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20 group-hover:fill-rose-500 transition-colors" />
                <span className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                  {player1Name}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleP2Answer('p2')}
                className="group flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 border border-amber-200/80 dark:border-amber-900/50 active:scale-95 transition-all cursor-pointer"
              >
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500/20 group-hover:fill-amber-500 transition-colors" />
                <span className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                  {player2Name}
                </span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleP2Answer('both')}
              className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 py-1.5 px-3 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              🤝 ¡Ambos por igual!
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FASE 5: LA GRAN REVELACIÓN (PASO A PASO JUNTOS)          */}
      {/* ========================================================= */}
      {phase === 'reveal' && currentQuestions[revealIndex] && (
        <motion.div
          key={`reveal-${revealIndex}`}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-4"
        >
          {/* Header de revelación */}
          <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-white/10">
            <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
              Pregunta {revealIndex + 1} de {currentQuestions.length}
            </span>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Revelación en directo</span>
            </span>
          </div>

          {/* Tarjeta de la Pregunta y Votos Comparados */}
          {(() => {
            const currentQ = currentQuestions[revealIndex];
            const p1Val = p1Answers[currentQ.id];
            const p2Val = p2Answers[currentQ.id];
            const isMatch = p1Val && p2Val && p1Val === p2Val;

            const formatChoice = (val: 'p1' | 'p2' | 'both') => {
              if (val === 'p1') return player1Name;
              if (val === 'p2') return player2Name;
              return 'Ambos por igual';
            };

            return (
              <div className="rounded-3xl bg-white/95 dark:bg-stone-900/95 p-6 sm:p-8 border border-stone-200/80 dark:border-white/10 shadow-md flex flex-col items-center text-center gap-5">
                <span className="text-3xl">{currentQ.emoji || '💖'}</span>

                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal leading-snug">
                  {currentQ.text}
                </h3>

                {/* Banner de veredicto instantáneo */}
                <div
                  className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 ${
                    isMatch
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {isMatch ? (
                    <>
                      <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      <span>¡COINCIDENCIA TOTAL! (+1 Punto de Sintonía)</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span>¡MOMENTO DE DEBATE! Discrepancia amorosa</span>
                    </>
                  )}
                </div>

                {/* Comparación visual de votos */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
                  {/* Voto de Jugador 1 */}
                  <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-rose-700 dark:text-rose-300 font-medium">
                      {player1Name} votó:
                    </span>
                    <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      {formatChoice(p1Val)}
                    </span>
                  </div>

                  {/* Voto de Jugador 2 */}
                  <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-300 font-medium">
                      {player2Name} votó:
                    </span>
                    <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                      {formatChoice(p2Val)}
                    </span>
                  </div>
                </div>

                {/* Controles de revelación */}
                <div className="flex items-center justify-between w-full max-w-md pt-4 border-t border-stone-200/60 dark:border-white/10">
                  <button
                    type="button"
                    onClick={prevReveal}
                    disabled={revealIndex === 0}
                    className={`flex items-center gap-1 text-xs font-medium px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      revealIndex === 0
                        ? 'text-stone-300 dark:text-stone-700 cursor-not-allowed'
                        : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Anterior</span>
                  </button>

                  <button
                    type="button"
                    onClick={nextReveal}
                    className="flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition-all shadow-xs cursor-pointer"
                  >
                    <span>
                      {revealIndex + 1 < currentQuestions.length
                        ? 'Siguiente revelación'
                        : 'Ver resultado final'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* FASE 6: RESUMEN FINAL & AFINIDAD (SUMMARY)                */}
      {/* ========================================================= */}
      {phase === 'summary' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-6"
        >
          {/* Tarjeta de Score Principal */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50 via-white to-amber-50/50 dark:from-stone-900 dark:via-stone-900 dark:to-rose-950/40 p-6 sm:p-8 border border-rose-200/80 dark:border-white/10 shadow-lg text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center p-1 shadow-md">
              <div className="w-full h-full rounded-full bg-white dark:bg-stone-900 flex flex-col items-center justify-center">
                <span className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 leading-none">
                  {stats.percentage}%
                </span>
                <span className="text-[9px] font-mono uppercase text-stone-400">Sintonía</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-white/10 text-xs font-semibold shadow-2xs">
              <Award className="w-4 h-4 text-rose-500" />
              <span className={affinityVerdict.color}>{affinityVerdict.badge}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
              {stats.matches} de {stats.total} Coincidencias
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md leading-relaxed">
              {affinityVerdict.message}
            </p>

            {/* Botones de acción final */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm mt-3 pt-4 border-t border-rose-200/60 dark:border-white/10">
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200/80 dark:border-white/10 shadow-2xs transition-all cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? '¡Copiado!' : 'Compartir resultado'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Jugar otra ronda</span>
              </button>
            </div>
          </div>

          {/* Desglose de preguntas: Coincidencias vs Debates */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold px-1">
              Desglose de la partida:
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {currentQuestions.map((q) => {
                const p1Choice = p1Answers[q.id];
                const p2Choice = p2Answers[q.id];
                const isMatch = p1Choice && p2Choice && p1Choice === p2Choice;

                const labelOf = (val: 'p1' | 'p2' | 'both') => {
                  if (val === 'p1') return player1Name;
                  if (val === 'p2') return player2Name;
                  return 'Ambos';
                };

                return (
                  <div
                    key={q.id}
                    className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border text-xs ${
                      isMatch
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/30'
                        : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/30'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{q.emoji || '💬'}</span>
                      <span className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                        {q.text}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isMatch ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-lg">
                          <Check className="w-3 h-3" />
                          <span>{labelOf(p1Choice)}</span>
                        </span>
                      ) : (
                        <div className="text-[10px] font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                          <span className="bg-rose-100 dark:bg-rose-950/80 px-1.5 py-0.5 rounded">
                            {player1Name}: {labelOf(p1Choice)}
                          </span>
                          <span>vs</span>
                          <span className="bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded">
                            {player2Name}: {labelOf(p2Choice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================= */}
      {/* MODAL: GESTOR DE PREGUNTAS PERSONALIZADAS                  */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-white/10 shadow-xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-white/10">
                <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Nuestras Preguntas Personalizadas
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-sm font-semibold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                Agrega anécdotas, chistes internos o preguntas secretas que solo ustedes dos entiendan:
              </p>

              {/* Input para nueva pregunta */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="¿Quién de los dos...?"
                  maxLength={120}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="button"
                  onClick={handleAddCustomQuestion}
                  disabled={!newQuestionText.trim()}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white disabled:opacity-50 cursor-pointer"
                >
                  Agregar
                </button>
              </div>

              {/* Lista de preguntas personalizadas */}
              <div className="flex flex-col gap-2 mt-2">
                {customQuestions.length > 0 ? (
                  customQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-white/5 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <span className="truncate flex-1">{q.text}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomQuestion(q.id)}
                        className="text-stone-400 hover:text-rose-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-stone-400 italic text-center py-4">
                    Aún no han creado preguntas. ¡Escribe la primera arriba!
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-stone-200/80 dark:border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 cursor-pointer"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoupleQuizGame;
