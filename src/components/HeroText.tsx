'use client';

import { motion, type Variants } from 'framer-motion';
import { smoothScrollTo } from '@/lib/gsap';

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function HeroText() {
  const scrollToPortfolio = () => {
    smoothScrollTo('#portfolio-section');
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 text-center px-6"
    >
      <motion.p
        variants={item}
        className="text-sm tracking-[0.3em] uppercase mb-6 -translate-y-16"
        style={{
          color: '#ffffff',
          mixBlendMode: 'difference' as React.CSSProperties['mixBlendMode'],
          WebkitTextStroke: '0.5px rgba(128,128,128,0.4)',
          filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.5)) brightness(1.15)',
        }}
      >
        HELLO
      </motion.p>

      <motion.h1
        variants={item}
        className="text-6xl md:text-8xl lg:text-9xl font-thin tracking-[0.02em] mb-6 -translate-y-6 font-[family-name:var(--font-cinzel)]"
      >
        <span
          style={{
            color: '#ffffff',
            mixBlendMode: 'difference' as React.CSSProperties['mixBlendMode'],
            WebkitTextStroke: '0.75px rgba(128,128,128,0.35)',
            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.45)) brightness(1.15)',
          }}
        >
          刘洋华子
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="text-xl md:text-base text-slate-400 font-light mb-4 font-[family-name:var(--font-cinzel)] tracking-wide"
      >
        Filmmaker / Editor / Visual Creator
      </motion.p>

      <motion.p
        variants={item}
        className="text-base text-slate-500 max-w-lg mx-auto mb-12"
      >
        Creating cinematic visual experiences with motion, sound and emotion.
      </motion.p>

      <motion.div variants={item} className="mt-12 pt-8">
        <button
          onClick={scrollToPortfolio}
          className="relative inline-flex items-center justify-center gap-5 px-16 py-5
                     text-white font-light text-lg tracking-[0.15em]
                     transition-all duration-500 hover:scale-105
                     border border-white/15 hover:border-cyan-400/50 rounded-full
                     shadow-[0_0_40px_rgba(34,211,238,0.1)] hover:shadow-[0_0_60px_rgba(34,211,238,0.25)]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(80px)',
            WebkitBackdropFilter: 'blur(80px)',
          }}
        >
          <span className="whitespace-nowrap pl-1">查看作品集</span>
          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
