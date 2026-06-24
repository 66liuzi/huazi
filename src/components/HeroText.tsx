'use client';

import { motion, type Variants } from 'framer-motion';

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
    const el = document.getElementById('portfolio-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
        className="text-sm tracking-[0.3em] uppercase text-cyan-400/80 mb-6 -translate-y-16"
      >
        HELLO
      </motion.p>

      <motion.h1
        variants={item}
        className="text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-6 -translate-y-6 font-[family-name:var(--font-cinzel)]"
      >
        <span className="bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
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

      <motion.div variants={item} className="mt-10 pt-6">
        <button
          onClick={scrollToPortfolio}
          className="relative inline-flex items-center justify-center gap-6 px-72 py-14 rounded-full
                     text-white font-semibold text-lg tracking-[0.2em]
                     transition-all duration-500 hover:scale-105
                     border-2 border-white/20 hover:border-cyan-400/60
                     shadow-[0_0_50px_rgba(34,211,238,0.15)] hover:shadow-[0_0_80px_rgba(34,211,238,0.35)]"
          style={{
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(80px)',
            WebkitBackdropFilter: 'blur(80px)',
          }}
        >
          <span className="whitespace-nowrap" style={{marginLeft: '55px'}}>查看作品集</span>
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
