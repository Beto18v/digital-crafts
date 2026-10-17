'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Heart,
  RotateCcw,
  KeyRound,
  Eye,
  Check,
  ChevronRight,
  HelpCircle,
  Plus,
  Send,
  Award,
} from 'lucide-react';
import {
  CIPHER_ALPHABET,
  NUMBER_TO_LETTER,
  PRESET_CIPHER_MESSAGES,
  CipherMessage,
  encodeToCipher,
} from '../data/secretCodeData';
import { Language } from '../types';

interface SecretCodeGameProps {
  onBack: () => void;
  lang?: Language;
}

export const SecretCodeGame: React.FC<SecretCodeGameProps> = ({ onBack }) => {
  const [player1Name, setPlayer1Name] = useState<string>(() => localStorage.getItem('cq_p1_name') || 'Ella');
  const [player2Name, setPlayer2Name] = useState<string>(() => localStorage.getItem('cq_p2_name') || 'Él');

  useEffect(() => {
    localStorage.setItem('cq_p1_name', player1Name);
    localStorage.setItem('cq_p2_name', player2Name);
  }, [player1Name, player2Name]);

  const [activeTab, setActiveTab] = useState<'decode' | 'create'>('decode');
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number>(0);
  const [customMessages, setCustomMessages] = useState<CipherMessage[]>([]);

  // Mensaje activo
  const allMessages = useMemo(() => {
    return [...PRESET_CIPHER_MESSAGES, ...customMessages];
  }, [customMessages]);

  const currentMessage = allMessages[selectedMessageIndex] || PRESET_CIPHER_MESSAGES[0];

  // Letras descubiertas por el usuario: Record<letra, boolean>
  const [discoveredLetters, setDiscoveredLetters] = useState<Record<string, boolean>>({});
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [cluesUsed, setCluesUsed] = useState<number>(0);

  // Reiniciar estado al cambiar de mensaje
  useEffect(() => {
    setDiscoveredLetters({});
    setHighlightedNumber(null);
    setIsCompleted(false);
    setCluesUsed(0);
  }, [selectedMessageIndex]);

  // Verificar si todas las letras del mensaje están descubiertas
  useEffect(() => {
    const rawLetters = currentMessage.paragraphs
      .join(' ')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z]/g, '');

    const allDiscovered = rawLetters
      .split('')
      .every((letter) => discoveredLetters[letter]);

    if (allDiscovered && rawLetters.length > 0 && !isCompleted) {
      setIsCompleted(true);
    }
  }, [discoveredLetters, currentMessage, isCompleted]);

  // Descubrir una letra (cuando el usuario teclea o adivina)
  const handleSelectLetter = (letter: string) => {
    const clean = letter.toUpperCase();
    if (!CIPHER_ALPHABET[clean]) return;

    setDiscoveredLetters((prev) => ({
      ...prev,
      [clean]: true,
    }));
  };

  // Pedir pista: revela una letra que aún no haya sido descubierta
  const handleGiveClue = () => {
    const rawLetters = currentMessage.paragraphs
      .join(' ')
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z]/g, '')
      .split('');

    const unrevealed = Array.from(new Set(rawLetters)).filter(
      (l) => !discoveredLetters[l]
    );

    if (unrevealed.length > 0) {
      const randomLetter = unrevealed[Math.floor(Math.random() * unrevealed.length)];
      handleSelectLetter(randomLetter);
      setCluesUsed((prev) => prev + 1);
    }
  };

  // Creador de mensaje personalizado
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');

  const handleCreateCustomCipher = () => {
    if (!customText.trim()) return;
    const newMsg: CipherMessage = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim() || 'Mensaje Secreto para Ti',
      subtitle: `Creado con amor por ${player1Name} para ${player2Name}`,
      difficulty: 'medium',
      paragraphs: customText
        .trim()
        .split('\n')
        .filter((line) => line.trim().length > 0),
    };
    setCustomMessages((prev) => [...prev, newMsg]);
    setSelectedMessageIndex(allMessages.length);
    setActiveTab('decode');
    setCustomText('');
    setCustomTitle('');
  };

  // Alfabeto A-Z ordenado en filas para el teclado
  const alphabetList = Object.keys(CIPHER_ALPHABET);

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

        <div className="flex items-center gap-2">
          {/* Tabs: Descifrar vs Crear */}
          <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-800/80 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('decode')}
              className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'decode'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Descifrar Código
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white font-semibold shadow-2xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              + Escribir Cifrado
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'decode' ? (
        <div className="space-y-6">
          {/* Cabecera Estilo Lámina de Papel Romántico */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#faf6f0] dark:bg-[#1a171c] border border-rose-200/80 dark:border-white/10 shadow-xs relative overflow-hidden">
            {/* Ilustración de cabecera sutil */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-rose-200/50 dark:border-white/10">
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="text-2xl">💌</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                    Criptograma Romántico
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 dark:text-stone-100">
                  {currentMessage.title}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Cada número representa una letra. Lee con atención el código y descubre el mensaje secreto.
                </p>
              </div>

              {/* Selector de mensajes disponibles */}
              <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
                {allMessages.map((msg, idx) => (
                  <button
                    key={msg.id}
                    type="button"
                    onClick={() => setSelectedMessageIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                      selectedMessageIndex === idx
                        ? 'bg-rose-500 text-white font-bold shadow-2xs'
                        : 'bg-white/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-white/5'
                    }`}
                  >
                    #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLA DE CÓDIGOS (A=1 ... Z=26) como en la lámina original */}
            <div className="mt-5 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-white/10 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-serif font-bold text-rose-950 dark:text-rose-200 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                  <span>Tabla de Correspondencia</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  Toca una letra para descifrarla
                </span>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-13 gap-1 sm:gap-1.5 text-center">
                {alphabetList.map((letter) => {
                  const num = CIPHER_ALPHABET[letter];
                  const isRevealed = !!discoveredLetters[letter];
                  const isHighlighted = highlightedNumber === num;

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => handleSelectLetter(letter)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isRevealed
                          ? 'bg-rose-500 text-white border-rose-600 font-bold shadow-2xs'
                          : isHighlighted
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 font-bold scale-105'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200/60 dark:border-white/5 text-stone-800 dark:text-stone-200 hover:border-rose-300'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold leading-none mb-1">
                        {letter}
                      </span>
                      <span
                        className={`text-[10px] font-mono leading-none ${
                          isRevealed ? 'text-rose-100' : 'text-stone-400'
                        }`}
                      >
                        {num}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN DEL MENSAJE EN CÓDIGO */}
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 font-semibold">
                  Mensaje en Código
                </span>

                <button
                  type="button"
                  onClick={handleGiveClue}
                  disabled={isCompleted}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/40 hover:bg-amber-100 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Pedir Pista {cluesUsed > 0 && `(${cluesUsed})`}</span>
                </button>
              </div>

              {/* Párrafos de números con casillas */}
              {currentMessage.paragraphs.map((paragraph, pIdx) => {
                const words = paragraph.split(' ');

                return (
                  <div
                    key={pIdx}
                    className="p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-stone-900/90 border border-rose-200/60 dark:border-white/10 shadow-2xs space-y-3"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      {words.map((word, wIdx) => {
                        const letters = word
                          .toUpperCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .split('');

                        return (
                          <div
                            key={wIdx}
                            className="inline-flex items-center gap-1 sm:gap-1.5 pb-1 border-b-2 border-stone-200 dark:border-stone-800"
                          >
                            {letters.map((char, cIdx) => {
                              const num = CIPHER_ALPHABET[char];
                              const isRevealed = !!discoveredLetters[char];

                              return (
                                <div
                                  key={cIdx}
                                  onClick={() => {
                                    if (num) {
                                      setHighlightedNumber(num);
                                    }
                                  }}
                                  className={`flex flex-col items-center justify-between w-7 h-11 sm:w-8 sm:h-12 rounded-lg border transition-all cursor-pointer ${
                                    isRevealed
                                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-600 text-rose-950 dark:text-rose-100 shadow-2xs'
                                      : highlightedNumber === num
                                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-400 text-stone-400'
                                      : 'bg-stone-100/80 dark:bg-stone-800/80 border-stone-200/80 dark:border-white/10 text-stone-400'
                                  }`}
                                >
                                  {/* Letra descifrada o espacio vacío */}
                                  <div className="flex-1 flex items-center justify-center font-mono font-bold text-sm sm:text-base">
                                    {isRevealed ? (
                                      <motion.span
                                        initial={{ scale: 0, rotate: -10 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        className="text-rose-600 dark:text-rose-300"
                                      >
                                        {char}
                                      </motion.span>
                                    ) : (
                                      <span className="opacity-0">·</span>
                                    )}
                                  </div>

                                  {/* Número correspondiente */}
                                  <div className="w-full text-center py-0.5 border-t border-stone-200/60 dark:border-white/5 font-mono text-[10px] text-stone-500 dark:text-stone-400 bg-white/40 dark:bg-black/20 rounded-b-lg">
                                    {num || char}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CELEBRACIÓN AL DESCIFRAR EL MENSAJE */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-amber-500/15 border-2 border-rose-400 dark:border-rose-700 text-center shadow-lg"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500 text-white shadow-md mb-2">
                    <Heart className="w-6 h-6 fill-white text-white animate-bounce" />
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                    ¡Código Descifrado con Éxito!
                  </h3>

                  <div className="my-4 p-4 rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-rose-200 dark:border-rose-900/40 shadow-xs max-w-lg mx-auto">
                    {currentMessage.paragraphs.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className="font-serif text-sm sm:text-base font-semibold text-rose-950 dark:text-rose-200 tracking-wide leading-relaxed"
                      >
                        "{line}"
                      </p>
                    ))}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {selectedMessageIndex === 0
                      ? `Una carta escrita en el corazón para ${player2Name} de parte de ${player1Name}.`
                      : '¡El amor siempre encuentra la forma de descifrarse!'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                    {selectedMessageIndex + 1 < allMessages.length && (
                      <button
                        type="button"
                        onClick={() => setSelectedMessageIndex((prev) => prev + 1)}
                        className="px-6 py-2.5 rounded-2xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer inline-flex items-center gap-2"
                      >
                        <span>Siguiente Código</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab('create')}
                      className="px-5 py-2.5 rounded-2xl text-xs font-semibold bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 cursor-pointer"
                    >
                      Escribir un código para {player2Name}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* TAB DE CREAR UN NUEVO MENSAJE CIFRADO */
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-stone-200/80 dark:border-white/10 shadow-sm space-y-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-semibold mb-1">
              <span>Modo Creador</span>
              <span>·</span>
              <span>De {player1Name} para {player2Name}</span>
            </div>
            <h3 className="font-serif text-2xl text-stone-900 dark:text-stone-100">
              Escribe un Mensaje Secreto
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Escribe cualquier frase de amor o complicidad. La app la convertirá automáticamente en números para que tu pareja la descifre.
            </p>
          </div>

          <div>
            <label className="text-xs font-mono text-stone-600 dark:text-stone-300 block mb-1">
              Título del mensaje (opcional):
            </label>
            <input
              type="text"
              placeholder="Ej. Para leer en la noche, Nuestra promesa..."
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div>
            <label className="text-xs font-mono text-stone-600 dark:text-stone-300 block mb-1">
              Texto secreto:
            </label>
            <textarea
              rows={4}
              placeholder="Escribe aquí tu frase... ej. TE AMO MAS QUE A LA PIZZA"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full p-3.5 rounded-xl text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {customText.trim() && (
            <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                Vista previa del código cifrado:
              </span>
              <p className="font-mono text-xs text-rose-600 dark:text-rose-400 break-words font-semibold">
                {encodeToCipher(customText)}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCreateCustomCipher}
              disabled={!customText.trim()}
              className="flex-1 py-3 rounded-2xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white shadow-xs cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Guardar y Pasar a Descifrar</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('decode')}
              className="px-4 py-3 rounded-2xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretCodeGame;
