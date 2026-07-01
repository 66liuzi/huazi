'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// === Types ===
interface VideoCard {
  id: number;
  title: string;
  color: string;
  gradient: string;
  src?: string;
  poster?: string;
  w?: number;
  h?: number;
}

interface Panel {
  id: string;
  label: string;
  labelEn: string;
  icon: 'image' | 'video' | 'ai' | 'sound';
  color1: string;
  color2: string;
  type: 'image' | 'video' | 'sound';
  cards?: VideoCard[];
  imageSrc?: string;
  imageTitle?: string;
}

interface Props {
  panels: Panel[];
  onVideoClick?: (card: VideoCard) => void;
}

// === Icons ===
function PanelIcon({ type, className, style }: { type: string; className?: string; style?: React.CSSProperties }) {
  switch (type) {
    case 'image':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z" />
        </svg>
      );
    case 'video':
      return (
        <svg className={className} style={style} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5.14v14l11-7-11-7z" />
        </svg>
      );
    case 'ai':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
      );
    case 'sound':
      return (
        <svg className={className} style={style} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
        </svg>
      );
    default:
      return null;
  }
}

// === Close Button (reusable, always on top) ===
function CloseButton({ color, onClose }: { color: string; onClose: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onClose(); }}
      onTouchStart={(e) => { e.stopPropagation(); }}
      className="fixed top-4 right-4 z-[100] w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
      style={{
        background: `${color}30`,
        border: `2px solid ${color}80`,
        boxShadow: `0 0 30px ${color}50, 0 4px 16px rgba(0,0,0,0.4)`,
        willChange: 'transform',
      }}
      aria-label="Close"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

// === Main Component ===
export default function PortfolioGrid({ panels, onVideoClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const [imagePreview, setImagePreview] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouch(touch);
  }, []);

  const handleClick = useCallback((id: string) => {
    setActiveId(prev => prev === id ? null : id);
  }, []);

  const handleClose = useCallback(() => setActiveId(null), []);

  const activePanel = panels.find(p => p.id === activeId);

  return (
    <div className="relative w-full">
      {/* === Collapsed Grid — NEVER reflows === */}
      <div
        className={`grid gap-2.5 md:gap-3 w-full ${isTouch ? 'grid-cols-2' : 'grid-cols-4'}`}
        style={{
          height: isTouch ? 'auto' : 'min(58vh, 520px)',
          minHeight: isTouch ? 'auto' : '380px',
        }}
      >
        {panels.map(panel => (
          <CollapsedPanel
            key={panel.id}
            panel={panel}
            isHidden={activeId !== null && activeId !== panel.id}
            isTouch={isTouch}
            onClick={handleClick}
          />
        ))}
      </div>

      {/* === Expanded Overlay — separate layer, zero layout impact === */}
      <AnimatePresence>
        {activePanel && (
          <ExpandedOverlay
            key={activePanel.id}
            panel={activePanel}
            onClose={handleClose}
            onVideoClick={onVideoClick}
            onImageClick={(src, title) => setImagePreview({ src, title })}
            isTouch={isTouch}
          />
        )}
      </AnimatePresence>

      {/* === Full-screen Image Preview === */}
      <AnimatePresence>
        {imagePreview && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.96)', willChange: 'opacity' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setImagePreview(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-[210] w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                boxShadow: '0 0 24px rgba(255,255,255,0.12)',
              }}
              aria-label="Close image"
            >
              <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 0 40px rgba(168,85,247,0.1)',
              }}
            >
              <img
                src={imagePreview.src}
                alt={imagePreview.title}
                className="object-contain"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '85vh',
                  transform: 'translateZ(0)',
                }}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// === Collapsed Panel ===
function CollapsedPanel({
  panel,
  isHidden,
  isTouch,
  onClick,
}: {
  panel: Panel;
  isHidden: boolean;
  isTouch: boolean;
  onClick: (id: string) => void;
}) {
  const cardCount = panel.cards?.length || 0;

  return (
    <div
      onClick={() => onClick(panel.id)}
      className="relative rounded-xl overflow-hidden cursor-pointer"
      style={{
        opacity: isHidden ? 0.25 : 1,
        transform: isHidden ? 'scale(0.95)' : 'scale(1)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        background: 'linear-gradient(135deg, rgba(20,20,30,0.92), rgba(15,15,25,0.92))',
        border: `1px solid ${panel.color1}20`,
        minHeight: isTouch ? '148px' : '100%',
        height: isTouch ? 'auto' : '100%',
        willChange: 'opacity, transform',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full p-3 gap-2">
        <div
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${panel.color1}15`, border: `1px solid ${panel.color1}28` }}
        >
          <PanelIcon type={panel.icon} className="w-5 h-5" style={{ color: panel.color1 }} />
        </div>

        <span className="text-sm font-medium text-white/80">{panel.label}</span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">{panel.labelEn}</span>

        <span className="text-[10px] text-white/20">
          {panel.type === 'image' ? `${cardCount || 1} 张` : `${cardCount} 个作品`}
        </span>

        {!isTouch && panel.type === 'video' && panel.cards && panel.cards.length > 0 && (
          <div className="mt-1 flex -space-x-1.5">
            {panel.cards.slice(0, 3).map(c => (
              <div
                key={c.id}
                className="w-7 h-9 rounded overflow-hidden"
                style={{ border: `1px solid ${panel.color1}25` }}
              >
                {c.poster ? (
                  <img src={c.poster} className="w-full h-full object-cover" alt="" loading="lazy" />
                ) : (
                  <div className="w-full h-full" style={{ background: c.gradient }} />
                )}
              </div>
            ))}
          </div>
        )}

        {!isTouch && panel.type === 'sound' && (
          <div className="mt-1 flex items-end gap-0.5 h-4">
            {[0.3, 0.6, 0.9, 0.6, 0.3].map((h, i) => (
              <div
                key={i}
                className="w-0.5 rounded-full"
                style={{ height: `${h * 100}%`, background: panel.color1, opacity: 0.4 }}
              />
            ))}
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${panel.color1}08, transparent 70%)` }}
      />
    </div>
  );
}

// === Expanded Overlay ===
function ExpandedOverlay({
  panel,
  onClose,
  onVideoClick,
  onImageClick,
  isTouch,
}: {
  panel: Panel;
  onClose: () => void;
  onVideoClick?: (card: VideoCard) => void;
  onImageClick?: (src: string, title: string) => void;
  isTouch: boolean;
}) {
  if (isTouch) {
    // Mobile: compact centered modal — just header + cards + footer
    return (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        {/* Modal panel — compact, auto height based on content */}
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(20,20,30,0.98), rgba(15,15,25,0.98))',
              border: `1px solid ${panel.color1}40`,
              boxShadow: `0 0 60px ${panel.color1}20`,
              willChange: 'opacity',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExpandedContent
              panel={panel}
              onClose={onClose}
              onVideoClick={onVideoClick}
              onImageClick={onImageClick}
              isTouch={isTouch}
            />
          </motion.div>
        </motion.div>
        <CloseButton color={panel.color1} onClose={onClose} />
      </>
    );
  }

  // Desktop: absolute overlay — height fits content, no forced stretch
  return (
    <>
      <div className="fixed inset-0 z-20" onClick={onClose} style={{ cursor: 'default' }} />
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,30,0.96), rgba(15,15,25,0.96))',
          border: `1px solid ${panel.color1}40`,
          boxShadow: `0 0 80px ${panel.color1}15`,
          willChange: 'opacity',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpandedContent
          panel={panel}
          onClose={onClose}
          onVideoClick={onVideoClick}
          onImageClick={onImageClick}
          isTouch={isTouch}
        />
      </motion.div>
    </>
  );
}

// === Expanded Content (shared) ===
function ExpandedContent({
  panel,
  onClose,
  onVideoClick,
  onImageClick,
  isTouch,
}: {
  panel: Panel;
  onClose: () => void;
  onVideoClick?: (card: VideoCard) => void;
  onImageClick?: (src: string, title: string) => void;
  isTouch: boolean;
}) {
  return (
    <div className="w-full flex flex-col relative" style={{ maxHeight: isTouch ? '52vh' : '100%' }}>
      {/* Desktop close button inside the panel */}
      {!isTouch && (
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-3 right-3 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
          style={{
            background: `${panel.color1}25`,
            border: `1.5px solid ${panel.color1}55`,
            boxShadow: `0 0 24px ${panel.color1}40`,
          }}
          aria-label="Close panel"
        >
          <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Label header — compact */}
      <div className="px-5 pt-3.5 pb-1.5 pointer-events-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <PanelIcon type={panel.icon} className="w-3.5 h-3.5" style={{ color: panel.color1 }} />
          <span className="text-[11px] font-medium tracking-[0.18em] uppercase" style={{ color: panel.color1 }}>
            {panel.labelEn}
          </span>
        </div>
        <h3 className="text-sm font-medium text-white/85 mt-0.5">{panel.label}</h3>
      </div>

      {/* Content area — no overflow wrapper, let inner scroll handle natively */}
      {panel.type === 'image' ? (
        <ImageContent panel={panel} onImageClick={onImageClick} />
      ) : (
        <VideoGallery
          panel={panel}
          onCardClick={(card) => {
            onClose();
            onVideoClick?.(card);
          }}
          isTouch={isTouch}
        />
      )}
    </div>
  );
}

// === Video Card ===
const VideoCardItem = ({
  card,
  panelColor,
  isActive,
  isTouch,
  onEnter,
  onLeave,
  onClick,
  dragMovedRef,
}: {
  card: VideoCard & { cardW: number; cardH: number };
  panelColor: string;
  isActive: boolean;
  isTouch: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
  dragMovedRef?: React.MutableRefObject<boolean>;
}) => {
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    if (dragMovedRef?.current) return; // suppress click after drag
    onClick();
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={isTouch ? handleClick : undefined}
      className="flex-shrink-0 rounded-xl border overflow-hidden"
      style={{
        width: card.cardW,
        maxWidth: '55vw',
        height: card.cardH,
        background: '#1a1a1a',
        borderColor: isActive ? `${panelColor}45` : `${panelColor}12`,
        opacity: isActive || !isTouch ? 1 : 0.85,
        position: 'relative',
        transition: 'border-color 0.15s, opacity 0.15s',
        cursor: isTouch ? 'pointer' : 'grab',
        userSelect: 'none',
      }}
    >
      {card.poster && !imgError ? (
        <img
          src={card.poster}
          className="absolute inset-0 w-full h-full object-cover"
          alt={card.title}
          loading="eager"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{ transform: 'translateZ(0)', pointerEvents: 'none' }}
        />
      ) : (
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${card.gradient}, #0a0a0f)` }} />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5" style={{ zIndex: 2, pointerEvents: 'none' }}>
        {/* Play button — clickable on desktop, decorative on touch */}
        {isTouch ? (
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </div>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center mb-2 transition-all hover:bg-white/30 hover:scale-110 active:scale-95"
            style={{ cursor: 'pointer', pointerEvents: 'auto', backdropFilter: 'blur(4px)' }}
            aria-label={`Play ${card.title}`}
          >
            <svg className="w-4 h-4 text-white/80 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5.14v14l11-7-11-7z" />
            </svg>
          </button>
        )}
        <span className="text-white/45 text-[10px] font-medium tracking-wider">{String(card.id).padStart(2, '0')}</span>
        <span className="text-white/65 text-[10px] mt-0.5 text-center leading-tight px-1" style={{ opacity: isActive ? 1 : 0, transition: 'opacity 0.15s' }}>
          {card.title}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />
    </div>
  );
};

// === Video Gallery — native scroll, NO infinite loop, NO rAF hacks ===
function VideoGallery({
  panel,
  onCardClick,
  isTouch,
}: {
  panel: Panel;
  onCardClick?: (card: VideoCard) => void;
  isTouch: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Mouse drag-to-scroll state (desktop only)
  const dragState = useRef({ startX: 0, startScroll: 0, isDragging: false });
  const dragMovedRef = useRef(false);

  const cards = panel.cards || [];
  const hasMultiple = cards.length > 1;

  const CARD_H = isTouch ? 170 : 190;
  const CARD_MIN_W = 130;
  const CARD_MAX_W = 340;
  const GAP = 14;

  const sizedCards = useMemo(() => cards.map(c => {
    const ratio = (c.w && c.h) ? c.w / c.h : 3 / 4;
    let cardW = Math.round(CARD_H * ratio);
    if (cardW > CARD_MAX_W) cardW = CARD_MAX_W;
    if (cardW < CARD_MIN_W) cardW = CARD_MIN_W;
    return { ...c, cardW, cardH: CARD_H };
  }), [cards, CARD_H]);

  // Check scroll position for nav button visibility
  const checkScrollPos = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  }, []);

  useEffect(() => {
    checkScrollPos();
  }, [checkScrollPos, sizedCards]);

  const scrollByAmount = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const avgStep = sizedCards.length > 0
      ? (sizedCards.reduce((s, it) => s + it.cardW + GAP, 0)) / sizedCards.length
      : 200;
    el.scrollBy({ left: dir * avgStep, behavior: 'smooth' });
  }, [sizedCards, GAP]);

  // === Mouse drag-to-scroll handlers (desktop only) ===
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTouch) return;
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      startX: e.pageX,
      startScroll: el.scrollLeft,
      isDragging: true,
    };
    dragMovedRef.current = false;
  }, [isTouch]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDragging) return;
    const el = scrollRef.current;
    if (!el) return;
    const delta = e.pageX - dragState.current.startX;
    if (Math.abs(delta) > 5) {
      dragMovedRef.current = true;
      el.style.cursor = 'grabbing';
    }
    el.scrollLeft = dragState.current.startScroll - delta;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (dragState.current.isDragging) {
      dragState.current.isDragging = false;
      const el = scrollRef.current;
      if (el) el.style.cursor = '';
      // Keep dragMovedRef true briefly so click handlers can check it
      setTimeout(() => { dragMovedRef.current = false; }, 100);
    }
  }, []);

  // Single card centered
  if (!hasMultiple) {
    const c = sizedCards[0];
    if (!c) return null;
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 py-3">
        <div
          className="rounded-xl overflow-hidden cursor-pointer relative group"
          style={{
            width: c.cardW,
            maxWidth: '80vw',
            height: c.cardH,
            background: '#1a1a1a',
            border: `1px solid ${panel.color1}30`,
          }}
          onMouseEnter={() => setActive(c.id)}
          onMouseLeave={() => setActive(null)}
          onClick={() => onCardClick?.(c)}
        >
          <SingleCardPoster card={c} />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3" style={{ zIndex: 2 }}>
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </div>
            <span className="text-white/50 text-xs font-medium">{c.title}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />
        </div>
        <span className="text-[10px] tracking-wider uppercase mt-2.5" style={{ color: `${panel.color1}60` }}>
          {panel.type === 'sound' ? '1 track · 点击预览' : '1 work · 点击预览'}
        </span>
      </div>
    );
  }

  // Multiple cards — pure native scroll, no duplication, no reset
  return (
    <div className="w-full flex flex-col">
      <div className="relative">
        {/* Nav buttons — desktop only, fade based on scroll position */}
        {!isTouch && (
          <>
            {canScrollLeft && (
              <button
                onClick={(e) => { e.stopPropagation(); scrollByAmount(-1); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={(e) => { e.stopPropagation(); scrollByAmount(1); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}

        {/* Pure native horizontal scroll — mouse drag on desktop, touch on mobile */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPos}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="flex items-center gap-3.5 px-4 overflow-x-auto scrollbar-hide"
          style={{
            height: CARD_H + 8,
            WebkitOverflowScrolling: 'touch',
            cursor: isTouch ? 'default' : 'grab',
            userSelect: 'none',
          }}
        >
          {sizedCards.map((c) => {
            const a = active === c.id;
            return (
              <VideoCardItem
                key={c.id}
                card={c}
                panelColor={panel.color1}
                isActive={a}
                isTouch={isTouch}
                onEnter={() => setActive(c.id)}
                onLeave={() => setActive(null)}
                onClick={() => onCardClick?.(c)}
                dragMovedRef={dragMovedRef}
              />
            );
          })}
        </div>

        {/* Edge gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(20,20,30,0.95), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(20,20,30,0.95), transparent)' }} />
      </div>

      {/* Footer */}
      <div className="text-center pb-2.5 pt-1.5 flex-shrink-0">
        <span className="text-[10px] tracking-wider uppercase" style={{ color: `${panel.color1}60` }}>
          {`${cards.length} works · 点击预览`}
        </span>
      </div>
    </div>
  );
}

// === Single Card Poster ===
function SingleCardPoster({ card }: { card: VideoCard & { cardW: number; cardH: number } }) {
  const [imgError, setImgError] = useState(false);

  if (card.poster && !imgError) {
    return (
      <img
        src={card.poster}
        className="absolute inset-0 w-full h-full object-cover"
        alt={card.title}
        loading="eager"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        style={{ transform: 'translateZ(0)' }}
      />
    );
  }
  return <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${card.gradient}, #0a0a0f)` }} />;
}

// === Image Content ===
function ImageContent({ panel, onImageClick }: { panel: Panel; onImageClick?: (src: string, title: string) => void }) {
  const handleClick = () => {
    if (panel.imageSrc && onImageClick) {
      onImageClick(panel.imageSrc, panel.imageTitle || panel.label);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 pb-3 py-2">
      <div
        className="relative rounded-xl overflow-hidden max-w-full cursor-pointer transition-transform hover:scale-[1.02]"
        style={{
          border: `1px solid ${panel.color1}30`,
          boxShadow: `0 0 60px ${panel.color1}10`,
        }}
        onClick={handleClick}
      >
        {panel.imageSrc ? (
          <img
            src={panel.imageSrc}
            className="object-contain max-w-full"
            style={{ maxHeight: '38vh', maxWidth: '78vw', transform: 'translateZ(0)' }}
            alt={panel.imageTitle || panel.label}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8"
            style={{
              width: 'min(300px, 75vw)',
              height: 'min(220px, 35vh)',
              background: `linear-gradient(135deg, ${panel.color1}12, ${panel.color2}06)`,
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: `${panel.color1}15`, border: `1px solid ${panel.color1}25` }}
            >
              <PanelIcon type="image" className="w-7 h-7 text-white/25" />
            </div>
            <p className="text-white/40 text-sm font-medium">{panel.imageTitle || panel.label}</p>
            <p className="text-white/20 text-xs mt-1.5 tracking-wider">图片待上传</p>
          </div>
        )}
      </div>
      <span className="text-[10px] tracking-wider uppercase mt-2.5" style={{ color: `${panel.color1}60` }}>
        {(panel.imageTitle || panel.label) + ' · 点击放大'}
      </span>
    </div>
  );
}
