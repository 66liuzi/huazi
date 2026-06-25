'use client';

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CardData { id: number; title: string; color: string; gradient: string; src?: string; poster?: string; }
interface Props { label: string; color1: string; color2: string; cards: CardData[]; isExpanded: boolean; onExpand: () => void; onCollapse: () => void; onCardClick?: (card: CardData) => void; }

export default function GlassFolder({ label, color1, color2, cards, isExpanded, onExpand, onCollapse, onCardClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enteringRef = useRef(false);
  const isTouchRef = useRef(false);

  useEffect(() => {
    isTouchRef.current = window.matchMedia('(hover: none)').matches;
  }, []);

  const handleMouseEnter = () => {
    if (isTouchRef.current) return;
    clearTimeout(leaveTimer.current);
    enteringRef.current = true;
    onExpand();
    setTimeout(() => { enteringRef.current = false; }, 100);
  };

  const handleMouseLeave = () => {
    if (isTouchRef.current) return;
    if (enteringRef.current) return;
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => { onCollapse(); }, 350);
  };

  useEffect(() => { return () => clearTimeout(leaveTimer.current); }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ minHeight: isExpanded ? undefined : '320px' }}
    >
      <div
        className="flex justify-center transition-all duration-300"
        style={{
          opacity: isExpanded ? 0 : 1, pointerEvents: isExpanded ? 'none' : 'auto',
          transform: isExpanded ? 'scale(0.95)' : 'scale(1)',
          position: isExpanded ? 'absolute' : 'relative', inset: isExpanded ? 0 : undefined,
        }}
      >
        <div className="w-60 md:w-72 cursor-pointer" onClick={onExpand}>
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_80px_rgba(168,85,247,0.2)]"
            style={{ background: `linear-gradient(135deg,${color1}30,${color2}20)`, border:`1px solid ${color1}40` }}>
            <div className="absolute top-[12%] left-[8%] right-[8%] h-px rounded-full" style={{background:`linear-gradient(90deg,transparent,${color1}40,transparent)`}}/>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-7 rounded-t-xl border border-b-0" style={{background:`linear-gradient(180deg,${color1}20,${color1}08)`,borderColor:`${color1}30`}}/>
            <div className="absolute inset-0 flex items-center justify-center">
              {cards.slice(0,3).map((c,i)=>(
                <div key={c.id} className="absolute w-[70%] rounded-xl border overflow-hidden" style={{aspectRatio:'3/4',background:'#2a2a2a',borderColor:`${color1}30`,transform:`rotate(${(i-1)*3}deg) translateY(${i*4}px)`,zIndex:10+3-i}}>
                  {c.poster ? <img src={c.poster} className="absolute inset-0 w-full h-full object-cover" alt={c.title} style={{zIndex:0}} loading="lazy" /> : null}
                  <div className="absolute inset-0 flex items-center justify-center" style={{zIndex:1}}><svg className="w-6 h-6 text-white/70 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg></div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center"><span className="text-xs font-medium tracking-[0.2em] uppercase text-white/70">{label}</span></div>
          </div>
        </div>
      </div>

      <motion.div className="w-full" initial={false}
        animate={{ opacity: isExpanded ? 1 : 0, pointerEvents: isExpanded ? 'auto' : 'none' }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ position: isExpanded ? 'relative' : 'absolute', inset: isExpanded ? undefined : 0 }}>
        <ExpandedInner color1={color1} color2={color2} cards={cards} onCardClick={onCardClick} label={label} />
      </motion.div>
    </div>
  );
}

const DRAG_THRESHOLD = 5; // px — any move beyond this = drag, not click

function ExpandedInner({ color1, color2, cards, onCardClick, label }: { color1: string; color2: string; cards: CardData[]; onCardClick?: (card: CardData) => void; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const isResetting = useRef(false);
  const lastResetTime = useRef(0);
  const CW = 200; const GAP = 16; const CARD_STEP = CW + GAP;
  const cardCount = cards.length;
  const TRIPLE = useMemo(() => [...cards, ...cards, ...cards, ...cards, ...cards], [cards]);

  // ── Drag state (ref so closures always see current values) ──
  const drag = useRef({
    active: false,
    didDrag: false,
    startX: 0,
    startScrollLeft: 0,
    velX: 0,
    lastX: 0,
    lastTime: 0,
  });
  const momentumRaf = useRef(0);
  const suppressHoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const suppressHover = useRef(false);

  const doReset = useCallback((el: HTMLDivElement, offset: number) => {
    const now = performance.now();
    if (now - lastResetTime.current < 100) return;
    lastResetTime.current = now;
    isResetting.current = true;
    el.scrollLeft += offset;
    // Also update the drag reference so position stays consistent if dragging
    drag.current.startScrollLeft += offset;
    requestAnimationFrame(() => { requestAnimationFrame(() => { isResetting.current = false; }); });
  }, []);

  // ── Momentum / inertia scrolling ──
  const stopMomentum = useCallback(() => {
    if (momentumRaf.current) { cancelAnimationFrame(momentumRaf.current); momentumRaf.current = 0; }
  }, []);

  const startMomentum = useCallback(() => {
    stopMomentum();
    const friction = 0.94;
    const minVel = 0.3;
    const animate = () => {
      const el = scrollRef.current;
      if (!el || Math.abs(drag.current.velX) < minVel) {
        momentumRaf.current = 0;
        if (el) checkBoundaries(el);
        return;
      }
      drag.current.velX *= friction;
      el.scrollLeft -= drag.current.velX;
      checkBoundaries(el);
      momentumRaf.current = requestAnimationFrame(animate);
    };
    momentumRaf.current = requestAnimationFrame(animate);
  }, [stopMomentum]);

  const checkBoundaries = useCallback((el: HTMLDivElement) => {
    if (!el || isResetting.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const threshold = CARD_STEP * cardCount;
    if (el.scrollLeft < threshold) {
      doReset(el, CARD_STEP * cardCount * 2);
    } else if (el.scrollLeft > maxScroll - threshold) {
      doReset(el, -(CARD_STEP * cardCount * 2));
    }
  }, [cardCount, CARD_STEP, doReset]);

  // ── Mouse drag handlers ──
  const onContainerMouseDown = useCallback((e: React.MouseEvent) => {
    // Only left button
    if (e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;

    stopMomentum();
    drag.current = {
      active: true,
      didDrag: false,
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      velX: 0,
      lastX: e.clientX,
      lastTime: performance.now(),
    };
    setIsGrabbing(true);

    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('mouseup', onDocumentMouseUp);
  }, [stopMomentum]);

  const onDocumentMouseMove = useCallback((e: MouseEvent) => {
    const d = drag.current;
    const dx = e.clientX - d.startX;

    if (!d.didDrag && Math.abs(dx) > DRAG_THRESHOLD) {
      d.didDrag = true;
      // Suppress card hover effects during drag
      suppressHover.current = true;
      // Prevent text selection once we know it's a drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    if (d.didDrag && scrollRef.current) {
      const now = performance.now();
      const dt = Math.max(now - d.lastTime, 1);
      d.velX = (e.clientX - d.lastX) / dt * 16; // normalised to ~60 fps
      d.lastX = e.clientX;
      d.lastTime = now;
      scrollRef.current.scrollLeft = d.startScrollLeft - dx;
    }
  }, []);

  const onDocumentMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', onDocumentMouseMove);
    document.removeEventListener('mouseup', onDocumentMouseUp);
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    const wasDrag = drag.current.didDrag;
    drag.current.active = false;
    setIsGrabbing(false);

    if (wasDrag) {
      startMomentum();
    }

    // Clear hover suppression after a cooldown (so momentum doesn't trigger flicker)
    clearTimeout(suppressHoverTimer.current);
    suppressHoverTimer.current = setTimeout(() => {
      suppressHover.current = false;
    }, 250);
  }, [onDocumentMouseMove, startMomentum]);

  // ── Touch drag handlers (mobile) ──
  const onContainerTouchStart = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || e.touches.length !== 1) return;
    stopMomentum();

    const t = e.touches[0];
    drag.current = {
      active: true,
      didDrag: false,
      startX: t.clientX,
      startScrollLeft: el.scrollLeft,
      velX: 0,
      lastX: t.clientX,
      lastTime: performance.now(),
    };
  }, [stopMomentum]);

  const onContainerTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const d = drag.current;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;

    if (!d.didDrag && Math.abs(dx) > DRAG_THRESHOLD) {
      d.didDrag = true;
      suppressHover.current = true;
    }

    if (d.didDrag && scrollRef.current) {
      const now = performance.now();
      const dt = Math.max(now - d.lastTime, 1);
      d.velX = (t.clientX - d.lastX) / dt * 16;
      d.lastX = t.clientX;
      d.lastTime = now;
      scrollRef.current.scrollLeft = d.startScrollLeft - dx;
    }
  }, []);

  const onContainerTouchEnd = useCallback(() => {
    const wasDrag = drag.current.didDrag;
    drag.current.active = false;

    if (wasDrag) {
      startMomentum();
    }

    clearTimeout(suppressHoverTimer.current);
    suppressHoverTimer.current = setTimeout(() => {
      suppressHover.current = false;
    }, 250);
  }, [startMomentum]);

  // ── Card click: only fire when NOT a drag ──
  const handleCardClick = useCallback((card: CardData) => (e: React.MouseEvent) => {
    // If a drag just happened, swallow the click
    if (drag.current.didDrag) {
      e.preventDefault();
      e.stopPropagation();
      // Reset didDrag after a short delay so subsequent clicks work
      setTimeout(() => { drag.current.didDrag = false; }, 0);
      return;
    }
    const original = cards.find(x => x.id === card.id);
    if (original) onCardClick?.(original);
  }, [cards, onCardClick]);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onDocumentMouseMove);
      document.removeEventListener('mouseup', onDocumentMouseUp);
      stopMomentum();
      clearTimeout(suppressHoverTimer.current);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [onDocumentMouseMove, onDocumentMouseUp, stopMomentum]);

  // ── Initial scroll position ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (TRIPLE.length * CARD_STEP) / 2;
    }
  }, [TRIPLE.length, CARD_STEP]);

  // Arrow button scroll
  const scrollByAmount = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    stopMomentum();
    const maxScroll = el.scrollWidth - el.clientWidth;
    const threshold = CARD_STEP * cardCount;
    if (dir === 1 && el.scrollLeft > maxScroll - threshold * 2) {
      doReset(el, -(CARD_STEP * cardCount * 2));
    } else if (dir === -1 && el.scrollLeft < threshold * 2) {
      doReset(el, CARD_STEP * cardCount * 2);
    }
    el.scrollBy({ left: dir * CARD_STEP, behavior: 'smooth' });
  }, [cardCount, CARD_STEP, doReset, stopMomentum]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="w-full">
      <div className="relative w-full rounded-3xl overflow-hidden"
        style={{ background: `linear-gradient(135deg,rgba(20,20,30,0.92),rgba(15,15,25,0.92))`, border:`1px solid ${color1}20`, boxShadow:`0 0 120px ${color1}10` }}>
        {/* Title bar */}
        <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-8 py-5 pointer-events-none">
          <span className="text-sm md:text-base font-medium tracking-[0.2em] uppercase" style={{color:color1}}>{label}</span>
        </div>

        {/* Left / Right arrow buttons */}
        <button onClick={(e)=>{e.stopPropagation();scrollByAmount(-1)}} className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 group/arrow" style={{background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 0 20px rgba(0,0,0,0.4)'}}>
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={(e)=>{e.stopPropagation();scrollByAmount(1)}} className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all duration-200 group/arrow" style={{background:'rgba(255,255,255,0.1)', backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 0 20px rgba(0,0,0,0.4)'}}>
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>

        {/* Scrollable card track */}
        <div
          ref={scrollRef}
          onMouseDown={onContainerMouseDown}
          onTouchStart={onContainerTouchStart}
          onTouchMove={onContainerTouchMove}
          onTouchEnd={onContainerTouchEnd}
          className="flex items-center gap-4 py-10 md:py-14 px-[8%] overflow-x-auto scrollbar-hide"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            cursor: isGrabbing ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'pan-x',
          }}
        >
          {TRIPLE.map((c, i) => {
            const id = c.id * 1000 + i;
            const a = active === id;
            const d = active !== null && !a;
            return (
              <div
                key={id}
                onMouseEnter={() => { if (!suppressHover.current) setActive(id); }}
                onMouseLeave={() => { if (!suppressHover.current) setActive(null); }}
                onClick={handleCardClick(c)}
                className="flex-shrink-0 rounded-2xl border overflow-hidden transition-all duration-200 snap-center group"
                style={{
                  width: CW,
                  maxWidth: '55vw',
                  aspectRatio: '3/4',
                  background: '#1a1a1a',
                  borderColor: a ? `${color1}40` : `${color1}10`,
                  opacity: d ? 0.7 : 1,
                  transform: a ? 'scale(1.06)' : d ? 'scale(0.96)' : 'scale(1)',
                  position: 'relative',
                  cursor: 'pointer',
                }}
              >
                {/* Poster / gradient background */}
                {c.poster ? (
                  <img src={c.poster} className="absolute inset-0 w-full h-full object-cover" alt={c.title} style={{ zIndex: 0 }} loading="lazy" />
                ) : (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg,${c.gradient},#0a0a0f)`, zIndex: 0 }} />
                )}

                {/* Dark gradient overlay for readability */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.05) 70%, transparent 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Play button overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 2 }}
                >
                  <div
                    className="flex items-center justify-center rounded-full transition-all duration-300"
                    style={{
                      width: '52px',
                      height: '52px',
                      background: 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      WebkitBackdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      boxShadow: a
                        ? `0 0 30px ${color1}30, 0 0 8px rgba(255,255,255,0.15)`
                        : '0 4px 16px rgba(0,0,0,0.3)',
                      transform: a ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    <svg
                      className="text-white"
                      style={{ width: '20px', height: '20px', marginLeft: '3px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5.14v14l11-7-11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Card info (bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none" style={{ zIndex: 3 }}>
                  <span className="block text-white/60 text-[11px] font-medium tracking-wider">{String(c.id).padStart(2, '0')}</span>
                  <span
                    className="block text-white/80 text-xs mt-0.5 leading-tight"
                    style={{ opacity: a ? 1 : 0.6, transition: 'opacity 0.2s' }}
                  >
                    {c.title}
                  </span>
                </div>

                {/* Hover highlight border ring */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                  style={{
                    zIndex: 4,
                    opacity: a ? 1 : 0,
                    boxShadow: `inset 0 0 0 2px ${color1}50, 0 0 20px ${color1}10`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{ background: `linear-gradient(transparent,rgba(15,15,25,0.8))` }} />
      </div>

      <div className="text-center mt-4">
        <span className="text-xs tracking-wider uppercase" style={{ color: `${color1}70` }}>
          {cards.length} works · Drag or click · Preview on tap
        </span>
      </div>
    </motion.div>
  );
}
