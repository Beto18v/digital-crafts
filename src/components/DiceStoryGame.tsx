'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  Dices,
  RotateCcw,
  BookOpen,
  Palette,
  Check,
  ChevronRight,
  Bookmark,
  Share2,
  Brush,
  Eraser,
} from 'lucide-react';
import {
  STORY_DICE_DATA,
  MONSTER_DICE_DATA,
  StoryElement,
} from '../data/diceData';
import { Language } from '../types';

interface DiceStoryGameProps {
  onBack: () => void;
  lang?: Language;
}

/**
 * Componente que renderiza un dado táctil animado de 1 a 6 con puntos clásicos.
 */
interface DieProps {
  value: number;
  isRolling: boolean;
  color?: string;
  label?: string;
  onClick?: () => void;
}

const Die: React.FC<DieProps> = ({
  value,
  isRolling,
  color = '#f43f5e',
  label,
  onClick,
}) => {
  // Puntos del dado según su valor (1-6)
  const dotPositions: Record<number, number[][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
  };

  const dots = dotPositions[value] || dotPositions[1];

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      {label && (
        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold truncate max-w-[90px]">
          {label}
        </span>
      )}
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        animate={
          isRolling
            ? {
                rotate: [0, 90, 180, 270, 360],
                scale: [1, 1.15, 0.95, 1.1, 1],
                y: [0, -18, -25, -6, 0],
              }
            : { rotate: 0, scale: 1, y: 0 }
        }
        transition={{ duration: 0.65, ease: 'easeInOut' }}
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-white/10 shadow-lg flex items-center justify-center relative cursor-pointer group"
        style={{
          boxShadow: `0 8px 24px -4px ${color}25`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-2">
          {dots.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="7"
              fill={color}
              className="drop-shadow-xs"
            />
          ))}
        </svg>

        {/* Brillo en la esquina superior del dado */}
        <div className="absolute top-1.5 left-1.5 w-3 h-3 rounded-full bg-white/40 blur-[1px] pointer-events-none" />
      </motion.button>
    </div>
  );
};

export const DiceStoryGame: React.FC<DiceStoryGameProps> = ({ onBack }) => {
  const [player1Name, setPlayer1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name, setPlayer2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  const [gameMode, setGameMode] = useState<'story' | 'monster'>('story');

  // ESTADO MODO CUENTO: 3 dados
  const [charDie, setCharDie] = useState<number>(2); // Dragón
  const [probDie, setProbDie] = useState<number>(1); // Se convierte en pez
  const [settDie, setSettDie] = useState<number>(2); // En la cocina
  const [isRollingStory, setIsRollingStory] = useState<boolean>(false);

  // Historia colaborativa escrita
  const [storyText, setStoryText] = useState<string>('');
  const [savedStories, setSavedStories] = useState<
    Array<{ id: string; title: string; story: string; date: string }>
  >([]);

  // ESTADO MODO MONSTRUO: 4 dados
  const [bodyDie, setBodyDie] = useState<number>(1);
  const [eyeDie, setEyeDie] = useState<number>(1);
  const [mouthDie, setMouthDie] = useState<number>(5);
  const [earDie, setEarDie] = useState<number>(2);
  const [isRollingMonster, setIsRollingMonster] = useState<boolean>(false);
  const [monsterName, setMonsterName] = useState<string>('Puffi');

  // Tirar dados de Cuento
  const handleRollStory = () => {
    if (isRollingStory) return;
    setIsRollingStory(true);
    setTimeout(() => {
      setCharDie(Math.floor(Math.random() * 6) + 1);
      setProbDie(Math.floor(Math.random() * 6) + 1);
      setSettDie(Math.floor(Math.random() * 6) + 1);
      setIsRollingStory(false);
    }, 600);
  };

  // Tirar dados de Monstruo
  const handleRollMonster = () => {
    if (isRollingMonster) return;
    setIsRollingMonster(true);
    setTimeout(() => {
      setBodyDie(Math.floor(Math.random() * 6) + 1);
      setEyeDie(Math.floor(Math.random() * 6) + 1);
      setMouthDie(Math.floor(Math.random() * 6) + 1);
      setEarDie(Math.floor(Math.random() * 6) + 1);
      setIsRollingMonster(false);
    }, 600);
  };

  // Guardar historia actual
  const handleSaveStory = () => {
    if (!storyText.trim()) return;
    const newStory = {
      id: `story-${Date.now()}`,
      title: `${selectedChar.label} ${selectedProb.label.toLowerCase()} ${selectedSett.label.toLowerCase()}`,
      story: storyText.trim(),
      date: new Date().toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
    };
    setSavedStories((prev) => [newStory, ...prev]);
    setStoryText('');
  };

  // Elementos activos de Cuento
  const selectedChar = STORY_DICE_DATA.characters[charDie - 1];
  const selectedProb = STORY_DICE_DATA.problems[probDie - 1];
  const selectedSett = STORY_DICE_DATA.settings[settDie - 1];

  // Elementos activos de Monstruo
  const selectedBody = MONSTER_DICE_DATA.bodies[bodyDie - 1];
  const selectedEyes = MONSTER_DICE_DATA.eyes[eyeDie - 1];
  const selectedMouth = MONSTER_DICE_DATA.mouths[mouthDie - 1];
  const selectedEars = MONSTER_DICE_DATA.ears[earDie - 1];

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

        {/* Selector de Modo */}
        <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-2xl text-xs font-medium">
          <button
            type="button"
            onClick={() => setGameMode('story')}
            className={`px-3 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'story'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-rose-500" />
            <span>Tira un Cuento</span>
          </button>
          <button
            type="button"
            onClick={() => setGameMode('monster')}
            className={`px-3 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
              gameMode === 'monster'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>Tira y Crea Monstruo</span>
          </button>
        </div>
      </div>

      {gameMode === 'story' ? (
        /* ================= MODO A: TIRA UN CUENTO ================= */
        <div className="space-y-6">
          {/* Banner de Cabecera */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-rose-500/10 to-amber-500/10 border border-stone-200/80 dark:border-white/10 shadow-xs text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 mb-2 border border-emerald-200/60">
              <Dices className="w-3.5 h-3.5" />
              <span>Juego Colaborativo de Historias</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 dark:text-stone-100 mb-2">
              Tira un Cuento
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
              Tiren los 3 dados para obtener un <strong>Personaje</strong>, un <strong>Problema</strong> y un <strong>Escenario</strong>, e inventen juntos una historia divertida e inolvidable.
            </p>

            {/* DADOS EN PANTALLA */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 my-6">
              <Die
                value={charDie}
                isRolling={isRollingStory}
                color="#f43f5e"
                label="Personaje"
                onClick={handleRollStory}
              />
              <Die
                value={probDie}
                isRolling={isRollingStory}
                color="#10b981"
                label="Problema"
                onClick={handleRollStory}
              />
              <Die
                value={settDie}
                isRolling={isRollingStory}
                color="#3b82f6"
                label="Escenario"
                onClick={handleRollStory}
              />
            </div>

            <button
              type="button"
              onClick={handleRollStory}
              disabled={isRollingStory}
              className="px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Dices className="w-4 h-4 text-rose-400 dark:text-rose-600 animate-spin" />
              <span>{isRollingStory ? 'Tirando dados...' : '¡Tirar los Dados!'}</span>
            </button>
          </div>

          {/* TARJETA DE LA HISTORIA RESULTANTE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 1. Personaje */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-rose-200/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold mb-1">
                Personaje (Dado #{charDie})
              </span>
              <span className="text-4xl my-1">{selectedChar.icon}</span>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {selectedChar.label}
              </h4>
              <p className="text-xs text-stone-400">{selectedChar.sublabel}</p>
            </div>

            {/* 2. Problema */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-emerald-200/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                Problema (Dado #{probDie})
              </span>
              <span className="text-4xl my-1">{selectedProb.icon}</span>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {selectedProb.label}
              </h4>
              <p className="text-xs text-stone-400">¿Cómo lo resolverá?</p>
            </div>

            {/* 3. Escenario */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-blue-200/80 dark:border-white/10 shadow-xs text-center flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold mb-1">
                Escenario (Dado #{settDie})
              </span>
              <span className="text-4xl my-1">{selectedSett.icon}</span>
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                {selectedSett.label}
              </h4>
              <p className="text-xs text-stone-400">El lugar de la aventura</p>
            </div>
          </div>

          {/* ZONA DE ESCRITURA COLABORATIVA DE LA HISTORIA */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg text-stone-900 dark:text-stone-100 font-semibold">
                  Escriban o continúen el cuento:
                </h3>
                <p className="text-xs text-stone-500">
                  {player1Name} puede escribir la primera frase y {player2Name} el desenlace loco.
                </p>
              </div>

              <span className="text-xs font-mono text-stone-400">
                {player1Name} & {player2Name}
              </span>
            </div>

            <textarea
              rows={4}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder={`Érase una vez ${selectedChar.label.toLowerCase()} que estaba ${selectedSett.label.toLowerCase()}, cuando de repente ${selectedProb.label.toLowerCase()}...`}
              className="w-full p-3.5 rounded-2xl text-xs sm:text-sm bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleSaveStory}
                disabled={!storyText.trim()}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Guardar Historia en Recuerdos</span>
              </button>
            </div>

            {/* Historias guardadas */}
            {savedStories.length > 0 && (
              <div className="mt-5 pt-4 border-t border-stone-200/60 dark:border-white/10 space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                  Nuestras Historias Guardadas ({savedStories.length}):
                </span>
                <div className="space-y-2">
                  {savedStories.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-white/5 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-stone-800 dark:text-stone-200">
                        <span>{s.title}</span>
                        <span className="font-mono text-[10px] text-stone-400">{s.date}</span>
                      </div>
                      <p className="text-stone-600 dark:text-stone-300 italic">"{s.story}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= MODO B: TIRA EL DADO Y DIBUJA / CREA MONSTRUO ================= */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-rose-500/10 border border-stone-200/80 dark:border-white/10 shadow-xs text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 mb-2 border border-amber-200/60">
              <Palette className="w-3.5 h-3.5" />
              <span>Laboratorio de Criaturas Creativas</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 dark:text-stone-100 mb-2">
              Tira el Dado y Dibuja
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto">
              Tiren los 4 dados para descubrir qué partes le tocan a su criatura: Cuerpo, Ojos, Boca y Orejas.
            </p>

            {/* 4 DADOS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto my-6">
              <Die
                value={bodyDie}
                isRolling={isRollingMonster}
                color="#ec4899"
                label="Cuerpo"
                onClick={handleRollMonster}
              />
              <Die
                value={eyeDie}
                isRolling={isRollingMonster}
                color="#8b5cf6"
                label="Ojos"
                onClick={handleRollMonster}
              />
              <Die
                value={mouthDie}
                isRolling={isRollingMonster}
                color="#f59e0b"
                label="Boca"
                onClick={handleRollMonster}
              />
              <Die
                value={earDie}
                isRolling={isRollingMonster}
                color="#10b981"
                label="Orejas"
                onClick={handleRollMonster}
              />
            </div>

            <button
              type="button"
              onClick={handleRollMonster}
              disabled={isRollingMonster}
              className="px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-95 transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Dices className="w-4 h-4 text-amber-400 animate-spin" />
              <span>{isRollingMonster ? 'Combinando...' : '¡Tirar para Crear Criatura!'}</span>
            </button>
          </div>

          {/* VISUALIZADOR DEL MONSTRUO RESULTANTE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lista de características obtenidas */}
            <div className="p-5 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs space-y-3">
              <h4 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 mb-3">
                Rasgos Desbloqueados:
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/60 flex items-center justify-between">
                  <span className="font-semibold text-pink-900 dark:text-pink-200">1. Cuerpo:</span>
                  <span className="font-mono">{selectedBody.name} (Dado #{bodyDie})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 flex items-center justify-between">
                  <span className="font-semibold text-purple-900 dark:text-purple-200">2. Ojos:</span>
                  <span className="font-mono">{selectedEyes.name} (Dado #{eyeDie})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 flex items-center justify-between">
                  <span className="font-semibold text-amber-900 dark:text-amber-200">3. Boca:</span>
                  <span className="font-mono">{selectedMouth.name} (Dado #{mouthDie})</span>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 flex items-center justify-between">
                  <span className="font-semibold text-emerald-900 dark:text-emerald-200">4. Orejas:</span>
                  <span className="font-mono">{selectedEars.name} (Dado #{earDie})</span>
                </div>
              </div>

              <div className="pt-3">
                <label className="text-[11px] font-mono text-stone-500 block mb-1">
                  Nombre de la criatura:
                </label>
                <input
                  type="text"
                  value={monsterName}
                  onChange={(e) => setMonsterName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Lienzo Ilustrado del Monstruo Procedural */}
            <div className="p-6 rounded-3xl bg-white/95 dark:bg-stone-900/95 border border-amber-200/80 dark:border-white/10 shadow-xs flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-tr from-amber-100 to-rose-100 dark:from-stone-800 dark:to-stone-850 flex items-center justify-center relative shadow-inner overflow-hidden border border-stone-200/60">
                {/* Dibujo simpático SVG de la criatura combinada */}
                <svg viewBox="0 0 100 100" className="w-36 h-36 drop-shadow-md">
                  {/* Cuerpo */}
                  {bodyDie === 1 && <circle cx="50" cy="55" r="32" fill="#f43f5e" />}
                  {bodyDie === 2 && <ellipse cx="50" cy="55" rx="34" ry="26" fill="#ec4899" />}
                  {bodyDie === 3 && <polygon points="50,22 82,75 18,75" fill="#f59e0b" />}
                  {bodyDie === 4 && <rect x="22" y="30" width="56" height="50" rx="14" fill="#8b5cf6" />}
                  {bodyDie === 5 && <polygon points="50,20 85,82 15,82" fill="#10b981" />}
                  {bodyDie === 6 && <circle cx="50" cy="55" r="34" fill="#06b6d4" />}

                  {/* Orejas */}
                  {earDie === 1 && (
                    <g fill="#f43f5e">
                      <polygon points="25,32 10,20 28,26" />
                      <polygon points="75,32 90,20 72,26" />
                    </g>
                  )}
                  {earDie === 2 && (
                    <g fill="#ec4899">
                      <polygon points="28,32 18,14 36,25" />
                      <polygon points="72,32 82,14 64,25" />
                    </g>
                  )}
                  {earDie === 3 && (
                    <g stroke="#333" strokeWidth="2">
                      <line x1="30" y1="30" x2="20" y2="12" />
                      <circle cx="20" cy="12" r="4" fill="#f59e0b" />
                      <line x1="70" y1="30" x2="80" y2="12" />
                      <circle cx="80" cy="12" r="4" fill="#f59e0b" />
                    </g>
                  )}
                  {earDie === 6 && (
                    <g fill="#f43f5e">
                      <circle cx="25" cy="16" r="5" />
                      <circle cx="75" cy="16" r="5" />
                    </g>
                  )}

                  {/* Ojos */}
                  {eyeDie === 1 && (
                    <g>
                      <circle cx="50" cy="48" r="10" fill="#fff" />
                      <circle cx="50" cy="48" r="5" fill="#1e293b" />
                      <circle cx="52" cy="46" r="2" fill="#fff" />
                    </g>
                  )}
                  {eyeDie !== 1 && (
                    <g>
                      <circle cx="40" cy="48" r="7" fill="#fff" />
                      <circle cx="40" cy="48" r="3.5" fill="#1e293b" />
                      <circle cx="60" cy="48" r="7" fill="#fff" />
                      <circle cx="60" cy="48" r="3.5" fill="#1e293b" />
                    </g>
                  )}

                  {/* Boca */}
                  {mouthDie === 5 && (
                    <path d="M 38,64 Q 50,76 62,64" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
                  )}
                  {mouthDie === 1 && (
                    <g>
                      <line x1="38" y1="65" x2="62" y2="65" stroke="#fff" strokeWidth="2.5" />
                      <polygon points="48,65 52,65 50,72" fill="#fff" />
                    </g>
                  )}
                  {mouthDie !== 1 && mouthDie !== 5 && (
                    <path d="M 38,64 Q 50,72 62,64" stroke="#fff" strokeWidth="2.5" fill="none" />
                  )}

                  {/* Patitas */}
                  <ellipse cx="36" cy="85" rx="6" ry="4" fill="#1e293b" />
                  <ellipse cx="64" cy="85" rx="6" ry="4" fill="#1e293b" />
                </svg>
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-3">
                {monsterName}
              </h3>
              <p className="text-xs text-stone-500">
                Criatura creada con amor por {player1Name} y {player2Name}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceStoryGame;
