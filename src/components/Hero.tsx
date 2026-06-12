import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Heart, Star, Award, Cake } from 'lucide-react';

import { WebsiteConfig } from '../types';

interface HeroProps {
  onNavClick: (sectionId: string) => void;
  config?: WebsiteConfig;
}

interface SparkleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function Hero({ onNavClick, config }: HeroProps) {
  const [sparkles, setSparkles] = useState<SparkleItem[]>([]);

  useEffect(() => {
    // Generate lovely random flying sweet hearts or sparkles
    const interval = setInterval(() => {
      setSparkles((prev) => {
        const id = Date.now() + Math.random();
        const next = [
          ...prev,
          {
            id,
            x: Math.random() * 85 + 5,
            y: Math.random() * 85 + 5,
            size: Math.random() * 8 + 4,
          },
        ];
        // keep up to 15 particles
        return next.slice(-15);
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-rays"
    >
      {/* Background overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffeade]/10 to-[#ffdcc6]/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Copywriting */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-primary font-bold text-xs uppercase tracking-wider sticker-badge animate-bounce-slight shadow-sm hover:scale-105 transition-transform duration-200">
            <Award className="text-[#874e58]" size={15} />
            <span className="font-display">{config?.heroBadge || "FSSAI Certified Baker"}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-glow select-none">
            <span className="text-primary font-cursive text-5xl sm:text-6xl lg:text-7xl block tracking-wide my-1">
              {config?.heroTitleCursive || "Hand Made"}
            </span>
            <span className="shimmer-text bg-gradient-to-r from-primary via-secondary to-[#874e58] bg-clip-text text-transparent block">
              {config?.heroTitleGradient || "With Pure Love"} <Heart className="inline-block fill-primary text-primary w-5 h-5 ml-1 align-middle" />
            </span>
          </h1>

          <p className="font-sans text-sm sm:text-base md:text-lg text-on-surface-variant max-w-md mx-auto md:mx-0 leading-relaxed">
            {config?.heroDescription || "Krish Dreamy Delight is a gourmet boutique home baking kitchen. We craft dreamy, whimsical cakes and custom treats with only the finest premium chocolate, fresh organic seasonal fruits, and butter."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
            <button
              onClick={() => onNavClick('builder')}
              className="px-8 py-4 bg-primary text-white rounded-full font-bold text-sm tracking-wide shadow-md hover:bg-[#6b3741] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              id="hero-btn-builder"
            >
              Build Your Cake
              <ArrowRight size={16} className="transform group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavClick('gallery')}
              className="px-8 py-4 bg-white/95 text-primary border border-primary/20 rounded-full font-bold text-sm shadow-sm hover:bg-primary/5 hover:scale-105 transition-all duration-300 cursor-pointer"
              id="hero-btn-gallery"
            >
              View Our Creations
            </button>
          </div>

          {/* Quick stats badges */}
          <div className="pt-8 grid grid-cols-3 gap-3 max-w-sm mx-auto md:mx-0 text-center">
            <div className="p-2 bg-white/65 hover:bg-white rounded-2xl border border-primary/10 transition-colors">
              <span className="block text-xl font-display font-bold text-primary">100%</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Eggless Available</span>
            </div>
            <div className="p-2 bg-white/65 hover:bg-white rounded-2xl border border-primary/10 transition-colors">
              <span className="block text-xl font-display font-bold text-primary">5★</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">User Rating</span>
            </div>
            <div className="p-2 bg-white/65 hover:bg-white rounded-2xl border border-primary/10 transition-colors">
              <span className="block text-xl font-display font-bold text-primary">Fresh</span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Baked Daily</span>
            </div>
          </div>
        </div>

        {/* Right Side: Showcase Cake with Orbiting Ornaments */}
        <div className="relative flex justify-center items-center py-6 h-[350px] sm:h-[450px] md:h-[550px]" id="hero-image-container">
          {/* Soft background pink/orange glow */}
          <div className="absolute w-2/3 h-2/3 bg-primary-container/20 rounded-full blur-3xl animate-pulse" />

          {/* Sparkles / flying elements */}
          {sparkles.map((s) => (
            <div
              key={s.id}
              className="absolute pointer-events-none opacity-80 transition-opacity duration-1000 animate-pulse"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
              }}
            >
              {s.id % 3 === 0 ? (
                <Heart size={s.size} className="fill-primary/25 stroke-primary/30" />
              ) : s.id % 3 === 1 ? (
                <Star size={s.size} className="fill-[#e9c400]/40 stroke-[#e9c400]" />
              ) : (
                <Sparkles size={s.size} className="text-secondary/40" />
              )}
            </div>
          ))}

          {/* Floating Orbiting rings */}
          <div className="absolute inset-0 animate-spin-slow pointer-events-none">
            <span className="absolute top-12 left-1/4 animate-bounce text-[#83439e]"><Heart size={20} className="fill-current" /></span>
            <span className="absolute bottom-20 right-1/4 text-primary"><Sparkles size={16} /></span>
            <span className="absolute top-1/2 left-8 text-[#e9c400]"><Star size={24} className="fill-current" /></span>
          </div>

          {/* Main Hero Cake Mockup Illustration */}
          <div className="relative max-w-full z-10 transform hover:scale-[1.03] transition-transform duration-500">
            {/* The hotlinked sweet strawberry/cream tier cake image */}
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDn3nL1KY4jEX-wOu3OJG-hPN4rrokP8ihDG-_PLENIiisNySSDzZPUmuXzx6f5p-s_tSv685aFHMUA438EeQtQVgv0CPWpasrKKaHTuL0jQIUcIJtlm03QuN-hokalE-2cN0pRVdhMwbeQWaFTKOifnvipP5LouWOHImGXNDfK69-AB05dPemKNPmr2mD4lEIzRhld1tFQ3PZ6v9ik_CCBdFejJi1hKoH8cQXtwC8Zqu-q8h0-09ckUqXi4HlY1XXKil3_-FUxx6Q" 
              alt="Artistic multi-tier cake with rich strawberry garnishing and custom topper" 
              referrerPolicy="no-referrer"
              className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[480px] h-auto object-contain animate-float drop-shadow-[0_25px_40px_rgba(135,78,88,0.3)]"
            />
            {/* Floating text bubbles to emulate interactive feedback */}
            <div className="absolute top-4 right-4 bg-white/90 border border-[#ffb6c1] px-3.5 py-1.5 rounded-2xl shadow-sm text-xs font-bold text-primary sticker-badge flex items-center gap-1">
              <Cake size={13} className="text-primary shrink-0" /> Best Seller No. 1
            </div>
            <div className="absolute bottom-4 left-6 bg-white/90 border border-[#ffb6c1] px-3 py-1.5 rounded-2xl shadow-sm text-[11px] font-bold text-on-surface flex items-center gap-1.5 transform rotate-3">
              <Sparkles size={13} className="text-primary shrink-0 animate-pulse" /> Real Cream & Fruits
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-1">
        <svg 
          viewBox="0 0 1200 120" 
          className="relative block w-full h-[30px] md:h-[65px] fill-[#fff8f5]"
          preserveAspectRatio="none"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C50.27,105.4,101.9,112.9,153.3,115.8,209.68,119,265.59,105.8,321.39,56.44Z" />
        </svg>
      </div>
    </section>
  );
}
