'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title: string;
}

export default function VideoViewer({ isOpen, onClose, videoSrc, title }: VideoViewerProps) {
  const [showVideo, setShowVideo] = useState(false);

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
      // Delay video load until overlay fade-in completes
      const t = setTimeout(() => setShowVideo(true), 200);
      return () => {
        clearTimeout(t);
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Reset video state when closed
  useEffect(() => {
    if (!isOpen) {
      setShowVideo(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — pure opacity, no blur, no transform */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.96)',
              willChange: 'opacity',
            }}
            onClick={onClose}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 24px rgba(255,255,255,0.12)',
              }}
              aria-label="Close video"
            >
              <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video content — opacity only, no scale/y transform */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
              style={{ willChange: 'opacity' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 0 40px rgba(168,85,247,0.1)',
                }}
              >
                <div
                  className="w-[900px] max-w-[85vw] rounded-xl overflow-hidden relative"
                  style={{ aspectRatio: '16/9', background: '#0a0a0a' }}
                >
                  {showVideo && videoSrc ? (
                    <video
                      src={videoSrc}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      muted
                      playsInline
                      loop
                      preload="metadata"
                    />
                  ) : videoSrc ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0a2e] to-[#0a0a1a]">
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
        </>
      )}
    </AnimatePresence>
  );
}
