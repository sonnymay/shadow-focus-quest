/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sword, 
  Shield, 
  Zap, 
  Bug, 
  Dna, 
  Timer, 
  Trophy, 
  Settings, 
  User, 
  Play, 
  Square, 
  ChevronRight,
  Flame,
  Skull,
  Sparkles,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { INITIAL_SOLDIERS, FOCUS_DURATIONS, ShadowSoldier } from './constants';
import { GoogleGenAI } from "@google/genai";

export default function App() {
  const [isFocusing, setIsFocusing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [activeSoldier, setActiveSoldier] = useState<ShadowSoldier>(INITIAL_SOLDIERS[0]);
  const [soldiers, setSoldiers] = useState<ShadowSoldier[]>(INITIAL_SOLDIERS);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateCoolImage = async (soldier: ShadowSoldier) => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: soldier.prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          },
        },
      });

      let imageUrl = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        const updatedSoldiers = soldiers.map(s => 
          s.id === soldier.id ? { ...s, imageUrl } : s
        );
        setSoldiers(updatedSoldiers);
        if (activeSoldier.id === soldier.id) {
          setActiveSoldier({ ...activeSoldier, imageUrl });
        }
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const startFocus = (duration: number) => {
    setTimeLeft(duration);
    setTotalTime(duration);
    setIsFocusing(true);
    setShowSuccess(false);
    setShowFailure(false);
  };

  const cancelFocus = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFocusing(false);
    setShowFailure(true);
    setTimeout(() => setShowFailure(false), 3000);
  };

  const completeFocus = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFocusing(false);
    
    // Calculate XP
    const earnedXp = Math.floor(totalTime / 60) * 10;
    addXp(earnedXp);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  }, [totalTime]);

  const addXp = (amount: number) => {
    setXp(prev => {
      const newXp = prev + amount;
      const xpToLevel = level * 1000;
      if (newXp >= xpToLevel) {
        setLevel(l => l + 1);
        return newXp - xpToLevel;
      }
      return newXp;
    });
  };

  useEffect(() => {
    if (isFocusing && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeFocus();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFocusing, timeLeft, completeFocus]);

  // Detect tab switching to simulate "Forest" failure
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isFocusing) {
        cancelFocus();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isFocusing]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sword': return <Sword className="w-8 h-8" />;
      case 'Shield': return <Shield className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Bug': return <Bug className="w-8 h-8" />;
      case 'Dna': return <Dna className="w-8 h-8" />;
      default: return <Sword className="w-8 h-8" />;
    }
  };

  const [view, setView] = useState<'focus' | 'army' | 'quests'>('focus');

  const selectSoldier = (soldier: ShadowSoldier) => {
    if (soldier.unlocked || level >= (soldiers.indexOf(soldier) * 5 + 1)) {
      setActiveSoldier(soldier);
      setView('focus');
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-shadow-blue relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src="https://picsum.photos/seed/dungeon-gate/800/1200?blur=5" 
          alt="Background" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-shadow-blue via-transparent to-shadow-blue" />
      </div>

      {/* Header */}
      <header className="p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-shadow-purple border border-mana-cyan/30 flex items-center justify-center mana-glow">
            <User className="text-mana-cyan" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Hunter Sung</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-mana-cyan">LV. {level}</span>
              <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-mana-cyan"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / (level * 1000)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Settings className="w-6 h-6 text-slate-400" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'focus' ? (
            <motion.div 
              key="focus-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex-1 flex flex-col items-center justify-center gap-8"
            >
              {!isFocusing ? (
                <div className="w-full flex flex-col items-center gap-8">
                  {/* Creature Display */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-mana-cyan/10 blur-3xl rounded-full" />
                    <motion.div 
                      className="w-48 h-48 rounded-full border-2 border-dashed border-mana-cyan/30 flex items-center justify-center relative z-10 animate-float overflow-hidden"
                    >
                      <img 
                        src={activeSoldier.imageUrl} 
                        alt={activeSoldier.name}
                        className="w-full h-full object-cover opacity-80"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-mana-cyan/20 mix-blend-overlay" />
                    </motion.div>
                    <div className="mt-4 text-center">
                      <h2 className="text-2xl font-bold mana-text-glow">{activeSoldier.name}</h2>
                      <p className="text-xs text-slate-400 uppercase tracking-widest">{activeSoldier.rank} Rank</p>
                    </div>
                  </div>

                  {/* Duration Selection */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {FOCUS_DURATIONS.map((d) => (
                      <button
                        key={d.label}
                        onClick={() => startFocus(d.value)}
                        className="p-4 rounded-2xl bg-shadow-purple border border-white/5 hover:border-mana-cyan/50 transition-all group flex flex-col items-center gap-1"
                      >
                        <span className="text-xl font-bold group-hover:text-mana-cyan transition-colors">{d.label}</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> +{d.xp} XP
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col items-center gap-12">
                  {/* Active Focus Animation */}
                  <div className="relative">
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-64 h-64 rounded-full border-4 border-mana-cyan flex items-center justify-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-mana-cyan/5 animate-pulse" />
                      <img 
                        src={activeSoldier.imageUrl} 
                        alt={activeSoldier.name}
                        className="w-full h-full object-cover opacity-90 scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-mana-cyan/30 mix-blend-color" />
                      
                      {/* Progress Ring Overlay */}
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="128"
                          cy="128"
                          r="124"
                          fill="transparent"
                          stroke="rgba(0, 242, 255, 0.1)"
                          strokeWidth="8"
                        />
                        <motion.circle
                          cx="128"
                          cy="128"
                          r="124"
                          fill="transparent"
                          stroke="var(--color-mana-cyan)"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 124}
                          animate={{ strokeDashoffset: (2 * Math.PI * 124) * (1 - timeLeft / totalTime) }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </svg>
                    </motion.div>
                    
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                      <Flame className="w-3 h-3" /> LOKKIN
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-6xl font-mono font-bold tracking-tighter mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <p className="text-slate-400 flex items-center justify-center gap-2">
                      <Skull className="w-4 h-4" /> Don't leave the app or the shadow will fade...
                    </p>
                  </div>

                  <button 
                    onClick={cancelFocus}
                    className="px-8 py-4 rounded-2xl bg-slate-800 text-slate-400 font-bold hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center gap-2"
                  >
                    <Square className="w-5 h-5" /> GIVE UP
                  </button>
                </div>
              )}
            </motion.div>
          ) : view === 'army' ? (
            <motion.div 
              key="army-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Shadow Army</h2>
                <span className="text-xs text-slate-500 uppercase tracking-widest">{soldiers.filter(s => s.unlocked || level >= (soldiers.indexOf(s) * 5 + 1)).length} / {soldiers.length} Collected</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-20">
                {soldiers.map((s, idx) => {
                  const isUnlocked = s.unlocked || level >= (idx * 5 + 1);
                  const isActive = activeSoldier.id === s.id;
                  
                  return (
                    <div
                      key={s.id}
                      onClick={() => isUnlocked && selectSoldier(s)}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                        isUnlocked ? 'cursor-pointer' : 'opacity-50 grayscale'
                      } ${
                        isActive 
                          ? 'bg-shadow-purple border-mana-cyan mana-glow' 
                          : isUnlocked 
                            ? 'bg-shadow-purple/50 border-white/5 hover:border-white/20' 
                            : 'bg-slate-900/50 border-white/5'
                      }`}
                    >
                      <div className={`w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center ${isActive ? 'ring-2 ring-mana-cyan' : ''}`}>
                        <img 
                          src={s.imageUrl} 
                          alt={s.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className={`font-bold ${isActive ? 'text-mana-cyan' : 'text-slate-100'}`}>{s.name}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">{s.rank} Rank</p>
                      </div>
                      
                      {isUnlocked && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            generateCoolImage(s);
                          }}
                          disabled={isGenerating}
                          className="p-2 rounded-lg bg-mana-cyan/10 text-mana-cyan hover:bg-mana-cyan/20 transition-colors z-20"
                          title="Awaken with AI Image"
                        >
                          {isGenerating && activeSoldier.id === s.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wand2 className="w-4 h-4" />
                          )}
                        </button>
                      )}

                      {!isUnlocked && (
                        <div className="text-xs font-mono text-slate-600">
                          REQ. LV {idx * 5 + 1}
                        </div>
                      )}
                      {isActive && (
                        <div className="bg-mana-cyan/20 text-mana-cyan px-2 py-1 rounded-md text-[10px] font-bold uppercase">
                          Active
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="quests-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-20 h-20 bg-shadow-purple rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold">Daily Quests</h2>
              <p className="text-slate-500 text-sm max-w-[200px]">Complete focus sessions to unlock legendary rewards. Coming soon in the next update.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <nav className="p-6 border-t border-white/5 flex justify-around items-center bg-shadow-blue/80 backdrop-blur-xl z-20">
        <button 
          onClick={() => setView('focus')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'focus' ? 'text-mana-cyan' : 'text-slate-500'}`}
        >
          <Timer className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Focus</span>
        </button>
        <button 
          onClick={() => setView('army')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'army' ? 'text-mana-cyan' : 'text-slate-500'}`}
        >
          <Sword className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Army</span>
        </button>
        <button 
          onClick={() => setView('quests')}
          className={`flex flex-col items-center gap-1 transition-colors ${view === 'quests' ? 'text-mana-cyan' : 'text-slate-500'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Quests</span>
        </button>
      </nav>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-shadow-blue/90 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-32 h-32 bg-mana-cyan rounded-full flex items-center justify-center mb-6 mana-glow"
            >
              <Trophy className="w-16 h-16 text-shadow-blue" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-2 mana-text-glow">LEVEL UP!</h2>
            <p className="text-slate-300 mb-8">You successfully focused and strengthened your shadow army.</p>
            <div className="flex gap-4">
              <div className="bg-shadow-purple p-4 rounded-2xl border border-mana-cyan/30">
                <div className="text-xs text-slate-500 uppercase">XP Gained</div>
                <div className="text-2xl font-bold text-mana-cyan">+{Math.floor(totalTime / 60) * 10}</div>
              </div>
              <div className="bg-shadow-purple p-4 rounded-2xl border border-mana-cyan/30">
                <div className="text-xs text-slate-500 uppercase">Focus Time</div>
                <div className="text-2xl font-bold text-mana-cyan">{Math.floor(totalTime / 60)}m</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Failure Overlay */}
      <AnimatePresence>
        {showFailure && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-red-950/90 flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ x: [-5, 5, -5, 5, 0] }}
              transition={{ duration: 0.2, repeat: 2 }}
              className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-red-500/50"
            >
              <Skull className="w-16 h-16 text-white" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-2 text-white">QUEST FAILED</h2>
            <p className="text-red-200">The shadow dissipated. You lost focus.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Mana Particles (Decorative) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-mana-cyan rounded-full"
            initial={{ 
              x: Math.random() * 400, 
              y: 800, 
              opacity: 0 
            }}
            animate={{ 
              y: -100, 
              opacity: [0, 0.5, 0],
              x: (Math.random() * 400) + (Math.sin(i) * 50)
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  );
}
