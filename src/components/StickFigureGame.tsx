'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  Brush,
  Eraser,
  Check,
  Award,
  ChevronRight,
  Eye,
  HelpCircle,
  Clock,
  Shuffle,
} from 'lucide-react';
import { STICK_FIGURE_CARDS, StickFigureCard } from '../data/stickFigureData';
import { Language } from '../types';

interface StickFigureGameProps {
  onBack: () => void;
  lang?: Language;
}

type Mode = 'free' | 'duel';
type DuelPhase = 'card_reveal' | 'drawing' | 'guessing' | 'result';

export const StickFigureGame: React.FC<StickFigureGameProps> = ({ onBack }) => {
  const [player1Name, setPlayer1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name, setPlayer2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  const [mode, setMode] = useState<Mode>('duel');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number>(0);

  // MODO DUELO
  const [duelPhase, setDuelPhase] = useState<DuelPhase>('card_reveal');
  const [currentDrawer, setCurrentDrawer] = useState<'p1' | 'p2'>('p1');
  const [scoreP1, setScoreP1] = useState<number>(0);
  const [scoreP2, setScoreP2] = useState<number>(0);
  const [secretCard, setSecretCard] = useState<StickFigureCard>(STICK_FIGURE_CARDS[0]);
  const [guessOptions, setGuessOptions] = useState<StickFigureCard[]>([]);
  const [selectedGuessId, setSelectedGuessId] = useState<string | null>(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState<boolean | null>(null);

  // Canvas de dibujo
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#1e293b');
  const [brushSize, setBrushSize] = useState(3.5);
  const [isEraser, setIsEraser] = useState(false);

  // Dibujar el muñeco de palitos base en el canvas
  const drawBaseStickFigure = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const cx = width / 2;
    const headRadius = 26;
    const headY = 70;

    // Cabeza
    ctx.beginPath();
    ctx.arc(cx, headY, headRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Tronco
    const neckY = headY + headRadius;
    const pelvisY = neckY + 68;
    ctx.beginPath();
    ctx.moveTo(cx, neckY);
    ctx.lineTo(cx, pelvisY);
    ctx.stroke();

    // Brazos
    const shoulderY = neckY + 22;
    ctx.beginPath();
    ctx.moveTo(cx - 36, shoulderY + 24);
    ctx.lineTo(cx, shoulderY);
    ctx.lineTo(cx + 36, shoulderY + 24);
    ctx.stroke();

    // Piernas
    const feetY = pelvisY + 65;
    ctx.beginPath();
    ctx.moveTo(cx - 32, feetY);
    ctx.lineTo(cx, pelvisY);
    ctx.lineTo(cx + 32, feetY);
    ctx.stroke();
  };

  // Limpiar y resetear canvas
  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBaseStickFigure(ctx, canvas.width, canvas.height);
  };

  // Inicializar canvas al cargar o cambiar fase
  useEffect(() => {
    handleClearCanvas();
  }, [duelPhase, selectedCardIndex, mode]);

  // Manejadores de dibujo táctil / ratón
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = isEraser ? 16 : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Iniciar nueva ronda de Duelo
  const startNewDuelRound = () => {
    const randomCard = STICK_FIGURE_CARDS[Math.floor(Math.random() * STICK_FIGURE_CARDS.length)];
    setSecretCard(randomCard);

    // 4 opciones mezcladas (la correcta + 3 distractores)
    const distractors = STICK_FIGURE_CARDS.filter((c) => c.id !== randomCard.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [randomCard, ...distractors].sort(() => 0.5 - Math.random());

    setGuessOptions(options);
    setSelectedGuessId(null);
    setIsCorrectGuess(null);
    setDuelPhase('card_reveal');
  };

  useEffect(() => {
    if (mode === 'duel') {
      startNewDuelRound();
    }
  }, [mode]);

  // Enviar adivinanza
  const handleMakeGuess = (cardId: string) => {
    setSelectedGuessId(cardId);
    const isCorrect = cardId === secretCard.id;
    setIsCorrectGuess(isCorrect);

    if (isCorrect) {
      if (currentDrawer === 'p1') {
        setScoreP2((prev) => prev + 1);
      } else {
        setScoreP1((prev) => prev + 1);
      }
    }
    setDuelPhase('result');
  };

  // Pasar a la siguiente ronda
  const handleNextTurn = () => {
    setCurrentDrawer((prev) => (prev === 'p1' ? 'p2' : 'p1'));
    startNewDuelRound();
  };

  const drawerName = currentDrawer === 'p1' ? player1Name : player2Name;
  const guesserName = currentDrawer === 'p1' ? player2Name : player1Name;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 animate-fade-in select-none">
      {/* Barra superior de navegación */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-stone-900/80 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-white/10 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </button>

        {/* Marcador de Duelo */}
        {mode === 'duel' && (
          <div className="flex items-center gap-2 text-xs font-mono bg-white/80 dark:bg-stone-900/80 px-3 py-1 rounded-full border border-stone-200/80 dark:border-white/10 shadow-2xs">
            <span className="font-semibold text-rose-600">{player1Name}: {scoreP1} pts</span>
            <span>·</span>
            <span className="font-semibold text-blue-500">{player2Name}: {scoreP2} pts</span>
          </div>
        )}

        {/* Selector de modo */}
        <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-2xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setMode('duel')}
            className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              mode === 'duel'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            Duelo Adivina
          </button>
          <button
            type="button"
            onClick={() => setMode('free')}
            className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
              mode === 'free'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            Lámina Libre (15)
          </button>
        </div>
      </div>

      {mode === 'duel' ? (
        /* ================= MODO DUELO PIC-TIONARY ================= */
        <div className="space-y-6">
          {/* FASE 1: REVELACIÓN SECRETA DE TARJETA PARA QUIEN DIBUJA */}
          {duelPhase === 'card_reveal' && (
            <div className="max-w-md mx-auto text-center py-10 px-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-rose-200/80 dark:border-white/10 shadow-lg space-y-4">
              <span className="text-3xl">🤫</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-rose-600 bg-rose-50 dark:bg-rose-950/60 border border-rose-200">
                <span>Turno de Dibujo: {drawerName}</span>
              </div>

              <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-bold">
                Tarjeta Secreta para {drawerName}
              </h3>
              <p className="text-xs text-stone-500">
                {guesserName} no debe mirar la pantalla todavía.
              </p>

              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center my-3">
                <span className="text-3xl block mb-2">{secretCard.emoji}</span>
                <h4 className="font-serif text-lg font-bold text-rose-950 dark:text-rose-100">
                  "{secretCard.description}"
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setDuelPhase('drawing')}
                className="w-full px-6 py-3 rounded-2xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Brush className="w-4 h-4" />
                <span>Entendido, ¡comenzar a dibujar!</span>
              </button>
            </div>
          )}

          {/* FASE 2: DIBUJO EN EL CANVAS */}
          {duelPhase === 'drawing' && (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 font-bold">
                    {drawerName} está dibujando:
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                    "{secretCard.description}"
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClearCanvas}
                    className="px-3 py-1.5 rounded-xl text-xs text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    Borrar todo
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuelPhase('guessing')}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-500 text-white hover:bg-rose-600 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <span>Terminé, pasar a {guesserName}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contenedor del Canvas de Dibujo */}
              <div className="flex flex-col items-center">
                <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-white shadow-md touch-none">
                  <canvas
                    ref={canvasRef}
                    width={320}
                    height={340}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="cursor-crosshair block"
                  />
                </div>

                {/* Herramientas de dibujo táctiles */}
                <div className="flex items-center gap-3 mt-3 p-2 rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/60">
                  {['#1e293b', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setBrushColor(c);
                        setIsEraser(false);
                      }}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer ${
                        brushColor === c && !isEraser ? 'scale-125 ring-2 ring-rose-400' : ''
                      }`}
                    />
                  ))}
                  <div className="w-px h-5 bg-stone-300 dark:bg-stone-700 mx-1" />
                  <button
                    type="button"
                    onClick={() => setIsEraser(true)}
                    className={`p-1.5 rounded-lg text-xs cursor-pointer ${
                      isEraser ? 'bg-rose-100 text-rose-600 font-bold' : 'text-stone-400'
                    }`}
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FASE 3: ADIVINANZA DE LA PAREJA */}
          {duelPhase === 'guessing' && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-500 font-bold">
                  Turno de Adivinar: {guesserName}
                </span>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-bold">
                  ¿Cuál era la descripción que dibujó {drawerName}?
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {guessOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleMakeGuess(opt.id)}
                    className="p-4 rounded-2xl border bg-white dark:bg-stone-900 hover:border-rose-400 text-left font-serif text-sm font-semibold text-stone-900 dark:text-stone-100 shadow-xs cursor-pointer flex items-center justify-between group"
                  >
                    <span>"{opt.description}"</span>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* FASE 4: RESULTADO DE LA RONDA */}
          {duelPhase === 'result' && (
            <div className="max-w-md mx-auto text-center py-8 px-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-lg space-y-4">
              <span className="text-4xl">{isCorrectGuess ? '🎉' : '🙈'}</span>
              <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
                {isCorrectGuess ? '¡Adivinanza Correcta!' : '¡Casi casi!'}
              </h3>

              <p className="text-xs text-stone-600 dark:text-stone-300">
                La tarjeta correcta era:{' '}
                <strong className="text-rose-600">"{secretCard.description}"</strong>
              </p>

              <button
                type="button"
                onClick={handleNextTurn}
                className="w-full px-6 py-3 rounded-2xl text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <span>Siguiente Turno (Dibuja {guesserName})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* ================= MODO LÁMINA LIBRE DE 15 MUÑECOS ================= */
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs">
            <h3 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Completa el muñeco según la descripción
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Selecciona cualquiera de las 15 tarjetas de la lámina original y dibújale sus complementos:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-6">
              {STICK_FIGURE_CARDS.map((card, i) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCardIndex(i)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    selectedCardIndex === i
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 font-bold text-rose-950 dark:text-rose-200 shadow-2xs'
                      : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200/60 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="text-sm block mb-1">{card.emoji}</span>
                  <span className="line-clamp-2 leading-snug">{card.description}</span>
                </button>
              ))}
            </div>

            {/* Canvas interactivo */}
            <div className="flex flex-col items-center">
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 bg-white shadow-md touch-none">
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={340}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="cursor-crosshair block"
                />
              </div>

              <div className="flex items-center gap-3 mt-3">
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 cursor-pointer"
                >
                  Limpiar Muñeco
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StickFigureGame;
