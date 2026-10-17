'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  Plus,
  Trash2,
  Share2,
  Check,
  Award,
  ChevronRight,
  Eye,
  Sliders,
} from 'lucide-react';
import { GLASSES_PROFILES, GlassItem } from '../data/glassesData';
import { Language } from '../types';

interface CoupleGlassesGameProps {
  onBack: () => void;
  lang?: Language;
}

type Mode = 'duel' | 'coop';
type Phase = 'setup' | 'p1_fill' | 'transition' | 'p2_fill' | 'reveal';

/**
 * Componente interactivo que dibuja un vaso realista con física de líquido y reflejos de cristal.
 */
interface RealisticGlassProps {
  glass: GlassItem;
  value: number; // 0 - 100
  onChange?: (val: number) => void;
  compareValue?: number; // Para la revelación
  showCompare?: boolean;
  p1Name?: string;
  p2Name?: string;
  readOnly?: boolean;
  size?: 'normal' | 'compact';
}

const RealisticGlass: React.FC<RealisticGlassProps> = ({
  glass,
  value,
  onChange,
  compareValue,
  showCompare = false,
  p1Name = 'Ella',
  p2Name = 'Él',
  readOnly = false,
  size = 'normal',
}) => {
  const isCompact = size === 'compact';
  const height = isCompact ? 140 : 170;
  const width = isCompact ? 76 : 94;

  const handleLevelClick = (percent: number) => {
    if (readOnly || !onChange) return;
    onChange(percent);
  };

  return (
    <div className="flex flex-col items-center select-none group">
      {/* Vaso de cristal interactivo */}
      <div
        className={`relative cursor-pointer transition-transform duration-200 active:scale-95 ${
          readOnly ? 'cursor-default active:scale-100' : ''
        }`}
        style={{ width: `${width}px`, height: `${height}px` }}
        onClick={() => {
          if (readOnly || !onChange) return;
          // Si tocas el vaso, aumenta en pasos de 25% (cíclico)
          const next = value >= 100 ? 0 : Math.min(100, value + 25);
          onChange(next);
        }}
        title={readOnly ? '' : 'Toca para cambiar nivel'}
      >
        {/* SVG Contenedor del Vaso */}
        <svg
          viewBox="0 0 100 160"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Gradiente de Líquido */}
            <linearGradient id={`liquid-${glass.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={glass.color} stopOpacity="0.95" />
              <stop offset="100%" stopColor={glass.color} stopOpacity="0.75" />
            </linearGradient>

            {/* Gradiente del Líquido Comparado */}
            <linearGradient id={`compare-${glass.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.65" />
            </linearGradient>

            {/* Clip path para la forma cónica del vaso */}
            <clipPath id={`glass-clip-${glass.id}`}>
              <polygon points="12,10 88,10 80,148 20,148" />
            </clipPath>
          </defs>

          {/* Sombra de la base */}
          <ellipse cx="50" cy="154" rx="34" ry="4" className="fill-stone-900/10 dark:fill-white/5" />

          {/* Líquido principal animado */}
          <g clipPath={`url(#glass-clip-${glass.id})`}>
            {/* Fondo vacío sutil */}
            <rect x="0" y="0" width="100" height="160" className="fill-stone-100/30 dark:fill-white/5" />

            {/* Si estamos en modo comparación y hay dos valores */}
            {showCompare && compareValue !== undefined && (
              <motion.rect
                x="0"
                y={150 - (compareValue / 100) * 140}
                width="100"
                height={(compareValue / 100) * 140 + 10}
                fill={`url(#compare-${glass.id})`}
                initial={{ height: 0, y: 150 }}
                animate={{
                  height: (compareValue / 100) * 140 + 10,
                  y: 150 - (compareValue / 100) * 140,
                }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                opacity={0.4}
              />
            )}

            {/* Líquido del jugador actual */}
            <motion.rect
              x="0"
              y={150 - (value / 100) * 140}
              width="100"
              height={(value / 100) * 140 + 10}
              fill={`url(#liquid-${glass.id})`}
              initial={{ height: 0, y: 150 }}
              animate={{
                height: (value / 100) * 140 + 10,
                y: 150 - (value / 100) * 140,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />

            {/* Superficie del líquido con brillo */}
            {value > 0 && (
              <motion.ellipse
                cx="50"
                cy={150 - (value / 100) * 140}
                rx={36 - (1 - value / 100) * 5}
                ry="3"
                className="fill-white/40"
                animate={{
                  cy: 150 - (value / 100) * 140,
                }}
                transition={{ duration: 0.5 }}
              />
            )}

            {/* Burbujitas si está lleno */}
            {value >= 50 && (
              <g className="animate-pulse opacity-60">
                <circle cx="40" cy={140 - (value / 100) * 70} r="1.5" fill="#fff" />
                <circle cx="60" cy={145 - (value / 100) * 90} r="2" fill="#fff" />
                <circle cx="48" cy={148 - (value / 100) * 50} r="1.2" fill="#fff" />
              </g>
            )}
          </g>

          {/* Líneas guía de medición (25%, 50%, 75%) */}
          <line x1="22" y1="115" x2="30" y2="115" stroke="currentColor" strokeWidth="0.8" className="text-stone-300 dark:text-stone-600" />
          <line x1="19" y1="80" x2="31" y2="80" stroke="currentColor" strokeWidth="0.8" className="text-stone-300 dark:text-stone-600" />
          <line x1="16" y1="45" x2="33" y2="45" stroke="currentColor" strokeWidth="0.8" className="text-stone-300 dark:text-stone-600" />

          {/* Contorno y cuerpo de cristal */}
          <polygon
            points="12,10 88,10 80,148 20,148"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinejoin="round"
            className="text-stone-300/80 dark:text-white/30"
          />

          {/* Borde superior del vaso (boca elíptica) */}
          <ellipse
            cx="50"
            cy="10"
            rx="38"
            ry="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-stone-300/80 dark:text-white/40"
          />

          {/* Base gruesa de cristal */}
          <path
            d="M 20,148 L 80,148 L 78,153 L 22,153 Z"
            fill="currentColor"
            className="text-stone-200/90 dark:text-white/20"
          />

          {/* Brillos y reflejos verticales del cristal */}
          <path
            d="M 17,20 L 23,142"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 83,20 L 77,142"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>

        {/* Badge flotante del porcentaje */}
        <div className="absolute top-2 right-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-stone-900/90 shadow-2xs border border-stone-200/60 dark:border-white/10 text-stone-700 dark:text-stone-300 pointer-events-none">
          {value}%
        </div>
      </div>

      {/* Nombre de la cualidad */}
      <div className="mt-2 text-center w-full max-w-[110px]">
        <div className="flex items-center justify-center gap-1">
          {glass.icon && <span className="text-xs">{glass.icon}</span>}
          <span className="font-serif text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 truncate block">
            {glass.name}
          </span>
        </div>

        {/* Botones rápidos de nivel si es interactivo */}
        {!readOnly && onChange && (
          <div className="flex items-center justify-center gap-1 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {[0, 50, 100].map((step) => (
              <button
                key={step}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLevelClick(step);
                }}
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                  value === step
                    ? 'bg-rose-500 text-white font-bold'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {step === 0 ? '0' : `${step}%`}
              </button>
            ))}
          </div>
        )}

        {/* Comparación visual de texto si está en revelación */}
        {showCompare && compareValue !== undefined && (
          <div className="mt-1 text-[10px] font-mono flex items-center justify-center gap-1 text-stone-500 dark:text-stone-400">
            <span className="text-rose-600 font-bold">{value}%</span>
            <span>vs</span>
            <span className="text-blue-500 font-bold">{compareValue}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const CoupleGlassesGame: React.FC<CoupleGlassesGameProps> = ({ onBack }) => {
  // Sincronización de nombres desde localStorage compartido
  const [player1Name, setPlayer1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name, setPlayer2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  const [mode, setMode] = useState<Mode>('duel');
  const [targetProfile, setTargetProfile] = useState<'female' | 'male'>('female');
  const [phase, setPhase] = useState<Phase>('setup');

  // Vasos actuales cargados
  const [glasses, setGlasses] = useState<GlassItem[]>(GLASSES_PROFILES.female.glasses);

  // Niveles del jugador 1 (cómo ve al otro en duel, o valores coop)
  const [p1Levels, setP1Levels] = useState<Record<string, number>>({});
  // Niveles del jugador 2 (cómo se ve a sí mismo en duel)
  const [p2Levels, setP2Levels] = useState<Record<string, number>>({});

  // Al cambiar perfil objetivo, cargar su lista inicial
  const handleProfileChange = (prof: 'female' | 'male') => {
    setTargetProfile(prof);
    setGlasses(GLASSES_PROFILES[prof].glasses);
    setP1Levels({});
    setP2Levels({});
  };

  // Añadir un nuevo vaso personalizado
  const [newGlassName, setNewGlassName] = useState('');
  const [isAddingGlass, setIsAddingGlass] = useState(false);

  const handleAddCustomGlass = () => {
    if (!newGlassName.trim()) return;
    const newId = `custom-${Date.now()}`;
    const newG: GlassItem = {
      id: newId,
      name: newGlassName.trim(),
      category: 'fun',
      color: '#ec4899',
      icon: '✨',
    };
    setGlasses((prev) => [...prev, newG]);
    setNewGlassName('');
    setIsAddingGlass(false);
  };

  // Iniciar partida
  const handleStartGame = () => {
    // Inicializar valores en 50% por defecto si no se han tocado
    const initialLevels: Record<string, number> = {};
    glasses.forEach((g) => {
      initialLevels[g.id] = 50;
    });
    setP1Levels(initialLevels);
    setP2Levels(initialLevels);

    if (mode === 'duel') {
      setPhase('p1_fill');
    } else {
      setPhase('p1_fill');
    }
  };

  // Finalizar turno de jugador 1 en duelo
  const handleFinishP1 = () => {
    if (mode === 'duel') {
      setPhase('transition');
    } else {
      setPhase('reveal');
    }
  };

  // Pasar a turno de jugador 2
  const handleStartP2 = () => {
    setPhase('p2_fill');
  };

  // Finalizar turno de jugador 2 y ver revelación
  const handleFinishP2 = () => {
    setPhase('reveal');
  };

  // Calcular índice de sintonía en modo duelo
  const calculateCompatibility = () => {
    if (glasses.length === 0) return 100;
    let totalDiff = 0;
    glasses.forEach((g) => {
      const v1 = p1Levels[g.id] ?? 50;
      const v2 = p2Levels[g.id] ?? 50;
      totalDiff += Math.abs(v1 - v2);
    });
    const maxDiff = glasses.length * 100;
    const score = Math.max(0, Math.round(100 - (totalDiff / maxDiff) * 100));
    return score;
  };

  const currentProfileInfo = GLASSES_PROFILES[targetProfile];
  const compatibilityScore = calculateCompatibility();

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 animate-fade-in">
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

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/40">
            <Sparkles className="w-3 h-3 text-rose-500" />
            <span>Los Vasos de Nuestra Esencia</span>
          </span>
        </div>
      </div>

      {/* FASE 1: CONFIGURACIÓN Y ELECCIÓN DE HOJA */}
      {phase === 'setup' && (
        <div className="space-y-6">
          {/* Banner Principal */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-200/80 dark:border-white/10 shadow-xs text-center relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/90 dark:bg-stone-900/90 text-rose-500 shadow-sm mb-3">
              <span className="text-3xl">🥛</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-stone-900 dark:text-stone-100 mb-2">
              Los Vasos de Nuestra Esencia
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
              ¿Qué tan cariñosos, dramáticos, pacientes o románticos somos? Llenen los vasos con niveles de líquido interactivo y descubran qué tanto coincide su visión de pareja.
            </p>

            {/* Configuración de nombres de la pareja */}
            <div className="mt-5 pt-4 border-t border-rose-200/50 dark:border-white/10 grid grid-cols-2 gap-3 max-w-sm mx-auto">
              <div className="text-left">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                  Jugador 1 (Ella)
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  maxLength={16}
                  className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 focus:outline-none focus:ring-2 focus:ring-rose-400 text-stone-800 dark:text-stone-100"
                />
              </div>
              <div className="text-left">
                <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
                  Jugador 2 (Él)
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  maxLength={16}
                  className="w-full px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Selector de Hoja: "Según mi Esposo (Para Ella)" vs "Según mi Esposa (Para Él)" */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
              1. Elige qué hoja de vasos van a colorear:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Opción A: Para Ella */}
              <button
                type="button"
                onClick={() => handleProfileChange('female')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  targetProfile === 'female'
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 ring-2 ring-rose-400/30'
                    : 'bg-stone-50/60 dark:bg-stone-850/60 border-stone-200/80 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-stone-800 shadow-2xs">
                  👰‍♀️
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                      Según mi Esposo
                    </span>
                    <span className="text-[10px] font-mono text-rose-600 bg-rose-100/70 dark:bg-rose-900/50 px-2 py-0.5 rounded-full">
                      12 Vasos
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Cariñosa, Atenta, Inteligente, Divertida, Paciente, Bonita, La mejor esposa...
                  </p>
                </div>
              </button>

              {/* Opción B: Para Él */}
              <button
                type="button"
                onClick={() => handleProfileChange('male')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                  targetProfile === 'male'
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-400 dark:border-amber-700 ring-2 ring-amber-400/30'
                    : 'bg-stone-50/60 dark:bg-stone-850/60 border-stone-200/80 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-stone-800 shadow-2xs">
                  🤵‍♂️
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                      Según mi Esposa
                    </span>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-100/70 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                      12 Vasos
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Sensible, Enojón, Celoso, Dramático, Lindo, Seco/Frío, Romántico, Inteligente...
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Selector de Modo de Juego */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-white/10">
            <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold mb-3">
              2. Elige el modo de juego:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode('duel')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'duel'
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 dark:border-purple-700 ring-2 ring-purple-400/30'
                    : 'bg-stone-50/60 dark:bg-stone-850/60 border-stone-200/80 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    🔮 Duelo Secreto («¿Coincidimos?»)
                  </span>
                  <span className="text-[10px] font-mono text-purple-700 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-full">
                    Pasa el móvil
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Uno llena en secreto cómo ve a su pareja; luego el otro llena cómo se ve a sí mismo. Al final se revelan juntos para comparar sintonía.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('coop')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  mode === 'coop'
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-400/30'
                    : 'bg-stone-50/60 dark:bg-stone-850/60 border-stone-200/80 dark:border-stone-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    🎨 Colorear Juntos en Directo
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">
                    Mesa redonda
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Van llenando los vasos juntos mientras conversan y debaten cada nivel hasta completar su lámina de recuerdo compartida.
                </p>
              </button>
            </div>
          </div>

          {/* Botón de inicio */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white active:scale-98 transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-rose-400 dark:text-rose-600" />
              <span>Comenzar a Llenar los Vasos</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FASE 2: TURNO DEL JUGADOR 1 (O MODO COOP) */}
      {phase === 'p1_fill' && (
        <div className="space-y-6">
          {/* Cabecera del turno */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
                <span>Turno 1</span>
                <span>·</span>
                <span>
                  {mode === 'duel'
                    ? `${player1Name} llena los vasos de ${player2Name} en secreto`
                    : 'Coloreando juntos'}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                {currentProfileInfo.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Toca cualquier vaso para aumentar su nivel o usa los botones [0%, 50%, 100%].
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinishP1}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
            >
              <span>{mode === 'duel' ? 'Guardar y Pasar Móvil' : 'Ver Lámina Final'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grilla de Vasos */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {glasses.map((glass) => (
                <RealisticGlass
                  key={glass.id}
                  glass={glass}
                  value={p1Levels[glass.id] ?? 50}
                  onChange={(val) => {
                    setP1Levels((prev) => ({ ...prev, [glass.id]: val }));
                  }}
                  p1Name={player1Name}
                  p2Name={player2Name}
                />
              ))}
            </div>

            {/* Botón para añadir un vaso personalizado */}
            <div className="mt-8 pt-4 border-t border-stone-200/60 dark:border-white/10 text-center">
              {isAddingGlass ? (
                <div className="max-w-xs mx-auto flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej. Chef nocturno, Dormilona..."
                    value={newGlassName}
                    onChange={(e) => setNewGlassName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomGlass}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500 text-white cursor-pointer"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingGlass(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingGlass(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-500" />
                  <span>Añadir vaso personalizado</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FASE 3: TRANSICIÓN / PASAR EL MÓVIL */}
      {phase === 'transition' && (
        <div className="max-w-md mx-auto text-center py-10 px-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-purple-200/80 dark:border-white/10 shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center mx-auto text-3xl shadow-inner">
            📱
          </div>

          <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100 font-semibold">
            ¡Pasa el móvil a {player2Name}!
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
            {player1Name} ya llenó los vasos en secreto. Ahora le toca a <strong>{player2Name}</strong> llenar cómo se ve a sí mismo(a) sin mirar las respuestas anteriores.
          </p>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleStartP2}
              className="w-full px-6 py-3 rounded-2xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Soy {player2Name}, ¡listo para llenar!</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FASE 4: TURNO DEL JUGADOR 2 */}
      {phase === 'p2_fill' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold mb-1">
                <span>Turno 2</span>
                <span>·</span>
                <span>{player2Name} se autocalifica en secreto</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl text-stone-900 dark:text-stone-100">
                ¿Cómo te ves a ti mismo(a)?
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Sé sincero(a). ¡Luego compararemos ambos resultados!
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinishP2}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver Gran Revelación</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {glasses.map((glass) => (
                <RealisticGlass
                  key={glass.id}
                  glass={glass}
                  value={p2Levels[glass.id] ?? 50}
                  onChange={(val) => {
                    setP2Levels((prev) => ({ ...prev, [glass.id]: val }));
                  }}
                  p1Name={player1Name}
                  p2Name={player2Name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FASE 5: GRAN REVELACIÓN Y RESULTADOS */}
      {phase === 'reveal' && (
        <div className="space-y-6">
          {/* Card de Compatibilidad / Sintonía */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-500/15 via-purple-500/10 to-amber-500/10 border border-rose-200 dark:border-rose-900/40 text-center relative overflow-hidden shadow-sm">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 mb-2">
              <Award className="w-3.5 h-3.5 text-rose-500" />
              <span>Nivel de Sintonía en Nuestra Esencia</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight my-2">
              {mode === 'duel' ? `${compatibilityScore}% de Coincidencia` : '¡Lámina Completada con Éxito!'}
            </h2>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
              {mode === 'duel'
                ? compatibilityScore >= 80
                  ? '¡Telepatía pura! Se conocen profundamente y ven las cosas con los mismos ojos.'
                  : compatibilityScore >= 60
                  ? '¡Excelente sintonía! Coinciden en lo fundamental y las diferencias les sacarán varias risas.'
                  : '¡Hay buen debate aquí! Comparen los vasos y descubran cómo se percibe cada uno.'
                : 'Una lámina íntima guardada con cariño para recordar cómo se ven y se valoran.'}
            </p>

            {/* Leyenda de colores */}
            {mode === 'duel' && (
              <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-rose-200/50 dark:border-white/10 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span>{player1Name} ({currentProfileInfo.title})</span>
                </span>
                <span className="flex items-center gap-1.5 text-blue-500 font-semibold">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>{player2Name} (Autopercepción)</span>
                </span>
              </div>
            )}
          </div>

          {/* Grilla Comparada */}
          <div className="p-4 sm:p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {glasses.map((glass) => (
                <RealisticGlass
                  key={glass.id}
                  glass={glass}
                  value={p1Levels[glass.id] ?? 50}
                  compareValue={mode === 'duel' ? p2Levels[glass.id] ?? 50 : undefined}
                  showCompare={mode === 'duel'}
                  readOnly={true}
                  p1Name={player1Name}
                  p2Name={player2Name}
                />
              ))}
            </div>
          </div>

          {/* Botones de acción final */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                // Invertir hoja (si hicieron la de ella, hacer la de él)
                handleProfileChange(targetProfile === 'female' ? 'male' : 'female');
                setPhase('setup');
              }}
              className="px-6 py-2.5 rounded-2xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Jugar con la otra hoja ({targetProfile === 'female' ? 'Para Él' : 'Para Ella'})</span>
            </button>

            <button
              type="button"
              onClick={() => setPhase('setup')}
              className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
            >
              Reiniciar partida
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleGlassesGame;
