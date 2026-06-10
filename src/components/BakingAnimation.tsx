import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, Sparkles, AlertCircle, Heart, ChefHat } from 'lucide-react';

interface BakingStep {
  id: number;
  label: string;
  statusText: string;
  emoji: string;
  soundDescription: string;
}

export default function BakingAnimation() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; duration: number }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const steps: BakingStep[] = [
    { id: 0, label: "Sanitize & Prep", statusText: "Preparing clean quartz kitchen slab...", emoji: "🧼🪵", soundDescription: "Eco-friendly wooden boards placed down" },
    { id: 1, label: "Placing Bowl", statusText: "Placing custom stoneware mixing bowl...", emoji: "🥣", soundDescription: "Clink! Ceramic bowl is set to work" },
    { id: 2, label: "Fusing Ingredients", statusText: "Pouring farm butter, flour & pure cocoa...", emoji: "🌾🥛🥚🍫", soundDescription: "Ladle splashes and egg separator noises" },
    { id: 3, label: "Whisking & Whipping", statusText: "Whipping the mixture with pure love...", emoji: "🌪️👩‍🍳", soundDescription: "Vigorous mechanical whisking circles" },
    { id: 4, label: "Into The Oven", statusText: "Sponge is baking in the convection oven at 180°C...", emoji: "🎛️🔥🧁", soundDescription: "Warm orange oven glow, slowly rising" },
    { id: 5, label: "Steaming Freshness", statusText: "Almost finished... letting warm aromas escape...", emoji: "💨👃✨", soundDescription: "Gourmet hot sweet stream rises up" },
    { id: 6, label: "Garnishing Ta-Da!", statusText: "Presto! Rich frosted masterpiece is ready! 🎂💖", emoji: "🎂🎉⭐🍰", soundDescription: "Sparkles! Delicious customized cake is served!" }
  ];

  const handleNextStep = () => {
    setCurrentStepIndex((prev) => {
      const next = prev + 1;
      if (next >= steps.length) {
        setIsPlaying(false);
        triggerConfetti();
        return steps.length - 1;
      }
      return next;
    });
  };

  const startAutoPlay = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    // Restart if we were at the end
    if (currentStepIndex === steps.length - 1 || currentStepIndex === -1) {
      setCurrentStepIndex(0);
    }

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsPlaying(false);
          triggerConfetti();
          return steps.length - 1;
        }
        return next;
      });
    }, 1500);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setConfetti([]);
  };

  const triggerConfetti = () => {
    const list = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      color: ['#ffb6c1', '#874e58', '#e9c400', '#83439e', '#f582ae'][Math.floor(Math.random() * 5)],
      duration: Math.random() * 2 + 1.2,
    }));
    setConfetti(list);
    setTimeout(() => {
      setConfetti([]);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section 
      id="baking-section"
      className="py-20 bg-gradient-to-b from-[#fff8f5] to-[#fff1ea] relative select-none"
    >
      <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
        {/* Header Title with animated Sparkle icon */}
        <div className="space-y-3 mb-10">
          <div className="flex items-center justify-center gap-2">
            <span className="p-1 px-3 bg-[#ffb6c1]/30 text-primary uppercase text-[10px] font-bold rounded-full tracking-widest border border-primary/10">
              Interactive Baking Stage
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary tracking-tight text-glow flex items-center justify-center gap-2">
            Watch The Magic Happen 
            <ChefHat className="text-[#874e58] animate-bounce-slight" size={28} />
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-lg mx-auto">
            Click 'Auto-Bake Creation' or step through manually to view our traditional 7-stage gourmet home baking assembly stream in real-time.
          </p>
        </div>

        {/* The Baking Area Box */}
        <div className="glass-card rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden border border-primary-container">
          {/* Confetti simulation overlay */}
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
              style={{
                left: `${c.x}%`,
                top: `-10px`,
                backgroundColor: c.color,
                animation: `fallDown ${c.duration}s linear forwards`,
              }}
            />
          ))}

          {/* Steaming ambient effect */}
          {currentStepIndex === 5 && (
            <div className="absolute inset-0 bg-white/10 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-48 h-12 bg-white/20 blur-xl animate-pulse rounded-full" />
            </div>
          )}

          {/* Central Cooking Stage */}
          <div className="h-44 w-full flex items-center justify-center relative">
            {currentStepIndex === -1 && (
              <div className="text-center space-y-3 text-on-surface-variant/70 animate-bounce-slight">
                <ChefHat size={48} className="mx-auto stroke-[1.2] text-primary/40" />
                <p className="text-xs font-bold tracking-widest uppercase">Oven is Pre-heated & Ready</p>
                <p className="text-sm font-sans italic">Use instructions controls below to start mixing ingredients...</p>
              </div>
            )}

            {/* Stage items and icons layers */}
            {currentStepIndex >= 0 && (
              <div className="flex flex-col items-center relative gap-4">
                {/* Visual Emojis Showcase with specific custom step scales */}
                <span 
                  className={`text-7xl select-none block transition-all duration-300 transform ${
                    currentStepIndex === 3 ? 'animate-spin-slow scale-110' : ''
                  } ${
                    currentStepIndex === 4 ? 'animate-pulse scale-105 filter drop-shadow-[0_0_15px_rgba(233,196,0,0.5)]' : ''
                  } ${
                    currentStepIndex === 5 ? 'animate-bounce-slight opacity-90' : ''
                  } ${
                    currentStepIndex === 6 ? 'scale-125 filter drop-shadow-[0_10px_20px_rgba(135,78,88,0.25)]' : 'scale-100'
                  }`}
                >
                  {steps[currentStepIndex].emoji}
                </span>

                {/* Additional overlay properties for oven fire or heat stars */}
                {currentStepIndex === 4 && (
                  <div className="absolute -top-3 flex gap-2 animate-bounce">
                    <Flame size={20} className="text-orange-500 fill-orange-500" />
                    <Flame size={16} className="text-red-500 fill-red-500" />
                  </div>
                )}
                {currentStepIndex === 6 && (
                  <div className="absolute -top-6 flex gap-6 text-[#e9c400] animate-pulse">
                    <Sparkles className="animate-spin-slow" />
                    <Sparkles />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Active Step status message info */}
          <div className="w-full max-w-sm mt-6 text-center space-y-2 relative z-10">
            <h4 className="font-display font-bold text-primary tracking-wide text-md">
              {currentStepIndex !== -1 ? `${currentStepIndex + 1}. ${steps[currentStepIndex].label}` : "Waiting to Bake..."}
            </h4>
            <p className="font-sans text-sm text-on-surface-variant italic min-h-[40px] flex items-center justify-center">
              {currentStepIndex !== -1 ? steps[currentStepIndex].statusText : "Press play to run through our artisanal home baking workflow."}
            </p>
            {currentStepIndex !== -1 && (
              <div className="text-[10px] font-sans font-semibold tracking-wider text-[#874e58]/80 bg-[#ffb6c1]/20 py-1 px-3 rounded-full inline-block uppercase">
                🎵 {steps[currentStepIndex].soundDescription}
              </div>
            )}
          </div>

          {/* Graphical Progress Steppers Checklist */}
          <div className="w-full flex items-center justify-between gap-1.5 mt-8 max-w-md relative z-10">
            {steps.map((st, sIdx) => {
              const isPassed = sIdx <= currentStepIndex;
              const isActive = sIdx === currentStepIndex;
              return (
                <button
                  key={st.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(sIdx);
                    if (sIdx === steps.length - 1) {
                      triggerConfetti();
                    }
                  }}
                  className={`h-2 flex-grow rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'bg-secondary scale-y-125' 
                      : isPassed 
                        ? 'bg-primary' 
                        : 'bg-[#d6c2c3]/40'
                  }`}
                  title={st.label}
                />
              );
            })}
          </div>

          {/* Sequence Action Buttons */}
          <div className="w-full flex justify-center items-center gap-4 mt-8 relative z-10 flex-wrap">
            <button
              onClick={startAutoPlay}
              className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                isPlaying 
                  ? 'bg-secondary text-white hover:bg-[#6f3388]' 
                  : 'bg-primary text-white hover:bg-[#6b3741]'
              }`}
            >
              <Play size={14} className={isPlaying ? 'animate-spin' : ''} />
              {isPlaying ? 'Pause Loop' : 'Auto-Bake Creation'}
            </button>

            <button
              onClick={handleNextStep}
              disabled={isPlaying || currentStepIndex === steps.length - 1}
              className="px-5 py-2.5 bg-white border border-primary/20 text-primary rounded-full font-bold text-xs tracking-wider uppercase hover:bg-primary-container/20 disabled:opacity-40 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Step Forward →
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-white border border-outline-variant text-[#847375] rounded-full hover:bg-neutral-50 hover:text-red-700 transition-colors"
              title="Reset Ingredients Slab"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Confetti inline styling fallback */}
      <style>{`
        @keyframes fallDown {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(450px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
