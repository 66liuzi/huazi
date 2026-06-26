'use client';

import { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
}

export default function VideoViewer({ isOpen, onClose, videoSrc, title }: VideoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(24px)' }}
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-10 text-xs tracking-[0.2em] uppercase"
          >
            Close [ESC]
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-strong rounded-2xl overflow-hidden glow-purple p-1">
              <div
                className="w-[900px] max-w-[85vw] rounded-xl overflow-hidden relative"
                style={{ aspectRatio: '16/9' }}
              >
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    className="w-full h-full object-cover"
                    controls
                    preload="none"
                    playsInline
                  />
                ) : (
                  /* Placeholder when no video source */
                  <div
                    className="w-full h-full flex flex-col items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #1a0a2e, #0a0a1a)',
                    }}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-white/30 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    </div>
                    <p className="text-white/40 text-sm">Video Preview</p>
                    <p className="text-white/20 text-xs mt-1">{title}</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-center mt-4 text-white/30 text-xs tracking-wider">
              {title} · 4K · 16:9
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
