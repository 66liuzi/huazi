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

// === Main Component ===
export default function PortfolioGrid({ panels, onVideoClick }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);

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
    <div
      className="relative w-full"
      style={{ contain: 'layout style' }}
    >
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
            isTouch={isTouch}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// === Collapsed Panel (lightweight, static) ===
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
      className="relative rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:border-white/20"
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
        {/* Icon */}
        <div
          className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
          style={{ background: `${panel.color1}15`, border: `1px solid ${panel.color1}28` }}
        >
          <PanelIcon type={panel.icon} className="w-5 h-5" style={{ color: panel.color1 }} />
        </div>

        {/* Label */}
        <span className="text-sm font-medium text-white/80">{panel.label}</span>
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">{panel.labelEn}</span>

        {/* Count */}
        <span className="text-[10px] text-white/20">
          {panel.type === 'image' ? `${cardCount || 1} \u5f20` : `${cardCount} \u4e2a\u4f5c\u54c1`}
        </span>

        {/* Mini preview thumbnails — desktop only, static */}
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

        {/* Sound wave decoration — CSS only, no JS animation */}
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

      {/* Hover hint glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${panel.color1}08, transparent 70%)`,
        }}
      />
    </div>
  );
}

// === Expanded Overlay ===
function ExpandedOverlay({
  panel,
  onClose,
  onVideoClick,
  isTouch,
}: {
  panel: Panel;
  onClose: () => void;
  onVideoClick?: (card: VideoCard) => void;
  isTouch: boolean;
}) {
  if (isTouch) {
    // Mobile: fixed full-screen modal with backdrop
    return (
      <>
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 z-40 bg-black/70"
          style={{ backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        {/* Modal panel */}
        <motion.div
          className="fixed inset-3 z-50 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(20,20,30,0.97), rgba(15,15,25,0.97))',
            border: `1px solid ${panel.color1}40`,
            boxShadow: `0 0 60px ${panel.color1}20`,
            willChange: 'transform, opacity',
          }}
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ExpandedContent
            panel={panel}
            onClose={onClose}
            onVideoClick={onVideoClick}
            isTouch={isTouch}
          />
        </motion.div>
      </>
    );
  }

  // Desktop: absolute overlay covering the grid area
  return (
    <>
      {/* Invisible backdrop to catch outside clicks */}
      <div
        className="fixed inset-0 z-20"
        onClick={onClose}
        style={{ cursor: 'default' }}
      />
      <motion.div
        className="absolute inset-0 z-30 rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(20,20,30,0.96), rgba(15,15,25,0.96))',
          border: `1px solid ${panel.color1}40`,
          boxShadow: `0 0 80px ${panel.color1}15`,
          willChange: 'transform, opacity',
          minHeight: '380px',
          height: 'min(58vh, 520px)',
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpandedContent
          panel={panel}
          onClose={onClose}
          onVideoClick={onVideoClick}
          isTouch={isTouch}
        />
      </motion.div>
    </>
  );
}

// === Expanded Content (shared between desktop overlay and mobile modal) ===
function ExpandedContent({
  panel,
  onClose,
  onVideoClick,
  isTouch,
}: {
  panel: Panel;
  onClose: () => void;
  onVideoClick?: (card: VideoCard) => void;
  isTouch: boolean;
}) {
  return (
    <div className="w-full h-full flex flex-col relative">
      {/* Close button — prominent */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-3 right-3 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        style={{
          background: `${panel.color1}25`,
          border: `1.5px solid ${panel.color1}55`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 0 24px ${panel.color1}40, inset 0 0 12px ${panel.color1}15`,
        }}
        aria-label="Close panel"
      >
        <svg className="w-5 h-5 text-white/90 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Label header */}
      <div className="px-5 md:px-7 pt-4 md:pt-5 pb-1 pointer-events-none flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <PanelIcon type={panel.icon} className="w-4 h-4" style={{ color: panel.color1 }} />
          <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase" style={{ color: panel.color1 }}>
            {panel.labelEn}
          </span>
        </div>
        <h3 className="text-base md:text-lg font-medium text-white/85 mt-1">{panel.label}</h3>
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {panel.type === 'image' ? (
          <ImageContent panel={panel} />
        ) : (
          <VideoGallery panel={panel} onCardClick={onVideoClick} isTouch={isTouch} />
        )}
      </div>
    </div>
  );
}

// === Video Gallery ===
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
  const isResetting = useRef(false);
  const lastResetTime = useRef(0);

  const cards = panel.cards || [];
  const hasMultiple = cards.length > 1;

  const CARD_H = isTouch ? 180 : 190;
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

  const oneSetWidth = sizedCards.reduce((s, it) => s + it.cardW + GAP, 0);

  // Reduced from 5x to 3x for lighter DOM
  const TRIPLE = useMemo(() => {
    if (!hasMultiple) return sizedCards;
    return [...sizedCards, ...sizedCards, ...sizedCards];
  }, [sizedCards, hasMultiple]);

  const doReset = useCallback((el: HTMLDivElement, offset: number) => {
    const now = performance.now();
    if (now - lastResetTime.current < 100) return;
    lastResetTime.current = now;
    isResetting.current = true;
    el.scrollLeft += offset;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { isResetting.current = false; });
    });
  }, []);

  useEffect(() => {
    if (hasMultiple && scrollRef.current) {
      scrollRef.current.scrollLeft = oneSetWidth;
    }
  }, [oneSetWidth, hasMultiple]);

  const handleScroll = useCallback(() => {
    if (!hasMultiple) return;
    const el = scrollRef.current;
    if (!el || isResetting.current) return;
    if (isTouch) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const threshold = oneSetWidth;
    if (el.scrollLeft < threshold) {
      doReset(el, oneSetWidth);
    } else if (el.scrollLeft > maxScroll - threshold) {
      doReset(el, -oneSetWidth);
    }
  }, [oneSetWidth, doReset, hasMultiple, isTouch]);

  const scrollByAmount = useCallback((dir: 1 | -1) => {
    if (!hasMultiple) return;
    const el = scrollRef.current;
    if (!el) return;
    const avgStep = oneSetWidth / cards.length;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const threshold = oneSetWidth;
    if (dir === 1 && el.scrollLeft > maxScroll - threshold * 2) {
      doReset(el, -oneSetWidth);
    } else if (dir === -1 && el.scrollLeft < threshold * 2) {
      doReset(el, oneSetWidth);
    }
    el.scrollBy({ left: dir * avgStep, behavior: 'smooth' });
  }, [cards.length, oneSetWidth, doReset, hasMultiple]);

  // Single card centered
  if (!hasMultiple) {
    const c = sizedCards[0];
    if (!c) return null;
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-4">
        <div
          className="rounded-xl overflow-hidden cursor-pointer transition-transform duration-200 hover:scale-[1.03] relative group"
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
          {c.poster ? (
            <img src={c.poster} className="absolute inset-0 w-full h-full object-cover" alt={c.title} loading="lazy" style={{ zIndex: 0 }} />
          ) : (
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.gradient}, #0a0a0f)`, zIndex: 0 }} />
          )}
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
        <span className="text-[11px] tracking-wider uppercase mt-3" style={{ color: `${panel.color1}60` }}>
          {panel.type === 'sound' ? '1 track \u00b7 Click to preview' : '1 work \u00b7 Click to preview'}
        </span>
      </div>
    );
  }

  // Multiple cards — scrolling gallery
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 min-h-0">
        {/* Nav buttons */}
        <button
          onClick={(e) => { e.stopPropagation(); scrollByAmount(-1); }}
          className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); scrollByAmount(1); }}
          className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex items-center gap-3.5 px-[6%] overflow-x-auto scrollbar-hide h-full"
          style={{
            scrollSnapType: isTouch ? 'none' : 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-x',
          }}
        >
          {TRIPLE.map((c, i) => {
            const id = c.id * 1000 + i;
            const a = active === id;
            const dimmed = active !== null && !a;
            return (
              <div
                key={id}
                onMouseEnter={() => setActive(id)}
                onMouseLeave={() => setActive(null)}
                onClick={() => { const orig = cards.find(x => x.id === c.id); if (orig) onCardClick?.(orig); }}
                className="flex-shrink-0 rounded-xl border overflow-hidden cursor-pointer transition-all duration-200 snap-center"
                style={{
                  width: c.cardW,
                  maxWidth: '50vw',
                  height: c.cardH,
                  background: '#1a1a1a',
                  borderColor: a ? `${panel.color1}45` : `${panel.color1}12`,
                  opacity: dimmed ? 0.65 : 1,
                  transform: a ? 'scale(1.05)' : dimmed ? 'scale(0.96)' : 'scale(1)',
                  position: 'relative',
                }}
              >
                {c.poster ? (
                  <img src={c.poster} className="absolute inset-0 w-full h-full object-cover" alt={c.title} loading="lazy" style={{ zIndex: 0 }} />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c.gradient}, #0a0a0f)`, zIndex: 0 }} />
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2.5" style={{ zIndex: 2 }}>
                  <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center mb-2">
                    <svg className="w-4 h-4 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                  <span className="text-white/45 text-[10px] font-medium tracking-wider">{String(c.id).padStart(2, '0')}</span>
                  <span className="text-white/65 text-[10px] mt-0.5 text-center leading-tight px-1" style={{ opacity: a ? 1 : 0, transition: 'opacity 0.15s' }}>
                    {c.title}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)', zIndex: 1 }} />
              </div>
            );
          })}
        </div>

        {/* Edge gradients */}
        <div className="absolute left-0 top-0 bottom-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(to right, rgba(15,15,25,0.9), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(to left, rgba(15,15,25,0.9), transparent)' }} />
      </div>

      {/* Footer */}
      <div className="text-center pb-2.5 pt-1 flex-shrink-0">
        <span className="text-[11px] tracking-wider uppercase" style={{ color: `${panel.color1}60` }}>
          {`${cards.length} works · Infinite scroll · Click to preview`}
        </span>
      </div>
    </div>
  );
}

// === Image Content ===
function ImageContent({ panel }: { panel: Panel }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 pb-4">
      <div
        className="relative rounded-xl overflow-hidden max-w-full max-h-full"
        style={{
          border: `1px solid ${panel.color1}30`,
          boxShadow: `0 0 60px ${panel.color1}10`,
        }}
      >
        {panel.imageSrc ? (
          <img
            src={panel.imageSrc}
            className="object-contain max-w-full"
            style={{ maxHeight: 'calc(100% - 40px)', maxWidth: '85vw' }}
            alt={panel.imageTitle || panel.label}
            loading="lazy"
          />
        ) : (
          <div
            className="flex flex-col items-center justify-center p-8"
            style={{
              width: 'min(400px, 80vw)',
              height: 'min(300px, 50vh)',
              background: `linear-gradient(135deg, ${panel.color1}12, ${panel.color2}06)`,
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${panel.color1}15`, border: `1px solid ${panel.color1}25` }}
            >
              <PanelIcon type="image" className="w-8 h-8 text-white/25" />
            </div>
            <p className="text-white/40 text-sm font-medium">{panel.imageTitle || panel.label}</p>
            <p className="text-white/20 text-xs mt-1.5 tracking-wider">{'\u56fe\u7247\u5f85\u4e0a\u4f20'}</p>
          </div>
        )}
      </div>
      <span className="text-[11px] tracking-wider uppercase mt-3" style={{ color: `${panel.color1}60` }}>
        {(panel.imageTitle || panel.label) + ' \u00b7 Click to view'}
      </span>
    </div>
  );
}
