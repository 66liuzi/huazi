'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageItem {
  src?: string;
  title: string;
  gradient: string;
}

interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function ImageViewer({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrev,
}: ImageViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const current = images[currentIndex] || images[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(24px)' }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10 text-xs tracking-[0.2em] uppercase"
          >
            Close [ESC]
          </button>

          {/* Counter */}
          <span className="absolute top-6 left-6 text-white/30 text-xs tracking-wider z-10">
            {currentIndex + 1} / {images.length}
          </span>

          {/* Nav */}
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center
                       rounded-full glass text-white/50 hover:text-white hover:border-white/20 transition-all z-10 text-2xl font-light"
          >
            ‹
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center
                       rounded-full glass text-white/50 hover:text-white hover:border-white/20 transition-all z-10 text-2xl font-light"
          >
            ›
          </button>

          {/* Image content */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl overflow-hidden glow-cyan p-1">
              <div
                className="w-[800px] h-[500px] max-w-[85vw] max-h-[75vh] rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${current.gradient}, #0a0a0f)`,
                }}
              >
                {/* Decorative lines to simulate image */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/3 left-1/4 w-1/2 h-px bg-white/40 rotate-12" />
                  <div className="absolute top-1/2 left-1/3 w-1/3 h-px bg-white/30 -rotate-6" />
                  <div className="absolute top-2/3 left-1/5 w-2/5 h-px bg-white/20 rotate-3" />
                  <div className="absolute top-1/4 right-1/4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute bottom-1/3 left-1/3 w-32 h-32 rounded-full bg-white/5 blur-3xl" />
                </div>

                {/* Center content */}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-white/80 mb-2">{current.title}</h3>
                  <p className="text-sm text-white/30">Cinematic still · 4K · 16:9</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
