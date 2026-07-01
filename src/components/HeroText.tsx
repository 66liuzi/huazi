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

interface HeroTextProps {
  bgColor?: { r: number; g: number; b: number };
}

export default function HeroText({ bgColor = { r: 9, g: 9, b: 11 } }: HeroTextProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  const scrollToPortfolio = () => {
    smoothScrollTo('#portfolio-section');
  };

  // Compute inverse color: text = 255 - background for each channel
  const invR = 255 - bgColor.r;
  const invG = 255 - bgColor.g;
  const invB = 255 - bgColor.b;

  // Boost contrast: if inverse is near middle-gray (too close to background), push toward extremes
  const lum = 0.2126 * invR + 0.7152 * invG + 0.0722 * invB;
  let cr = invR, cg = invG, cb = invB;
  if (lum > 100 && lum < 155) {
    // Middle gray zone — push lighter (toward white)
    const push = (155 - lum) / 55;
    cr = Math.min(255, invR + push * 60);
    cg = Math.min(255, invG + push * 60);
    cb = Math.min(255, invB + push * 60);
  }

  const textColor = `rgb(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)})`;
  // Slightly dimmer version for smaller text (subtitle)
  const subColor = `rgba(${Math.round(cr)},${Math.round(cg)},${Math.round(cb)},0.75)`;

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
          color: textColor,
          transition: 'color 0.3s ease',
          WebkitTextStroke: `0.6px ${subColor}`,
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
            color: textColor,
            transition: 'color 0.3s ease',
            WebkitTextStroke: `0.8px ${subColor}`,
          }}
        >
          刘洋华子
        </span>
      </motion.h1>

      {/* Subtitle line 1 */}
      <motion.p
        variants={item}
        className="text-xs sm:text-sm md:text-base font-light mb-3 sm:mb-4 font-[family-name:var(--font-cinzel)] tracking-wide px-2"
        style={{
          color: subColor,
          transition: 'color 0.3s ease',
        }}
      >
        Filmmaker / Editor / Visual Creator
      </motion.p>

      {/* Subtitle line 2 */}
      <motion.p
        variants={item}
        className="text-[0.7rem] sm:text-sm md:text-base max-w-[18rem] sm:max-w-lg mx-auto mb-8 sm:mb-12 px-2"
        style={{
          color: subColor,
          transition: 'color 0.3s ease',
        }}
      >
        Creating cinematic visual experiences with motion, sound and emotion.
      </motion.p>

      {/* CTA Button */}
      <motion.div variants={item} className="mt-8 sm:mt-12 pt-4 sm:pt-8">
        <button
          onClick={scrollToPortfolio}
          className="relative inline-flex items-center justify-center gap-3 sm:gap-5 px-8 sm:px-12 md:px-16 py-4 sm:py-5
                     font-light text-sm sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.15em]
                     transition-all duration-500 active:scale-95 sm:hover:scale-105
                     rounded-full"
          style={{
            color: textColor,
            borderColor: `${subColor.replace('0.75', '0.2')}`,
            borderWidth: 1,
            borderStyle: 'solid',
            background: `rgba(${cr},${cg},${cb},0.06)`,
            transition: 'color 0.3s ease, border-color 0.3s ease, background 0.3s ease',
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
