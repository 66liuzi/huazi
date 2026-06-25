'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { smoothScrollTo } from '@/lib/gsap';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function HeroText() {
  const [ready, setReady] = useState(false);

  // Delay entrance to sync with Prism WebGL background loading
  useEffect(() => {
    // Wait for JS bundle execution + small buffer for WebGL canvas to paint first frame
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  const scrollToPortfolio = () => {
    smoothScrollTo('#portfolio-section');
  };

  if (!ready) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 text-center px-4 sm:px-6"
    >
      {/* HELLO */}
      <motion.p
        variants={item}
        className="text-[0.7rem] sm:text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 -translate-y-10 sm:-translate-y-16"
        style={{
          color: '#ffffff',
          mixBlendMode: 'difference' as React.CSSProperties['mixBlendMode'],
          WebkitTextStroke: '0.6px rgba(255,255,255,0.25)',
          textShadow: '0 0 10px rgba(255,255,255,0.4), 0 0 25px rgba(255,255,255,0.2)',
        }}
      >
        HELLO
      </motion.p>

      {/* 刘洋华子 */}
      <motion.h1
        variants={item}
        className="text-5xl sm:text-6xl md:text-7xl lg:text-9xl font-thin tracking-[0.02em] mb-4 sm:mb-6 -translate-y-4 sm:-translate-y-6 font-[family-name:var(--font-cinzel)]"
      >
        <span
          style={{
            color: '#ffffff',
            mixBlendMode: 'difference' as React.CSSProperties['mixBlendMode'],
            WebkitTextStroke: '0.8px rgba(255,255,255,0.2)',
            textShadow: '0 0 12px rgba(255,255,255,0.35), 0 0 30px rgba(255,255,255,0.15)',
          }}
        >
          刘洋华子
        </span>
      </motion.h1>

      {/* Subtitle line 1 */}
      <motion.p
        variants={item}
        className="text-xs sm:text-sm md:text-base text-slate-400 font-light mb-3 sm:mb-4 font-[family-name:var(--font-cinzel)] tracking-wide px-2"
      >
        Filmmaker / Editor / Visual Creator
      </motion.p>

      {/* Subtitle line 2 */}
      <motion.p
        variants={item}
        className="text-[0.7rem] sm:text-sm md:text-base text-slate-500 max-w-[18rem] sm:max-w-lg mx-auto mb-8 sm:mb-12 px-2"
      >
        Creating cinematic visual experiences with motion, sound and emotion.
      </motion.p>

      {/* CTA Button */}
      <motion.div variants={item} className="mt-8 sm:mt-12 pt-4 sm:pt-8">
        <button
          onClick={scrollToPortfolio}
          className="relative inline-flex items-center justify-center gap-3 sm:gap-5 px-8 sm:px-12 md:px-16 py-4 sm:py-5
                     text-white font-light text-sm sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.15em]
                     transition-all duration-500 active:scale-95 sm:hover:scale-105
                     border border-white/15 sm:hover:border-cyan-400/50 rounded-full
                     shadow-[0_0_30px_rgba(34,211,238,0.08)] sm:hover:shadow-[0_0_60px_rgba(34,211,238,0.25)]"
          style={{
            background: 'rgba(255,255,255,0.06)',
          }}
        >
          <span className="whitespace-nowrap">查看作品集</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
