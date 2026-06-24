'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CardData { id: number; title: string; color: string; gradient: string; src?: string; }
interface Props { label: string; color1: string; color2: string; cards: CardData[]; isExpanded: boolean; onExpand: () => void; onCollapse: () => void; onCardClick?: (card: CardData) => void; }

export default function GlassFolder({ label, color1, color2, cards, isExpanded, onExpand, onCollapse, onCardClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enteringRef = useRef(false);

  const handleMouseEnter = () => {
    clearTimeout(leaveTimer.current);
    enteringRef.current = true;
    onExpand();
    setTimeout(() => { enteringRef.current = false; }, 100);
  };

  const handleMouseLeave = () => {
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
            style={{ background: `linear-gradient(135deg,${color1}10,${color2}08)`, backdropFilter:'blur(40px)', WebkitBackdropFilter:'blur(40px)', border:`1px solid ${color1}20` }}>
            <div className="absolute top-[12%] left-[8%] right-[8%] h-px rounded-full" style={{background:`linear-gradient(90deg,transparent,${color1}25,transparent)`}}/>
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-7 rounded-t-xl border border-b-0" style={{background:`linear-gradient(180deg,${color1}12,${color1}04)`,borderColor:`${color1}18`}}/>
            <div className="absolute inset-0 flex items-center justify-center">
              {cards.slice(0,3).map((c,i)=>(
                <div key={c.id} className="absolute w-[70%] rounded-xl border overflow-hidden" style={{aspectRatio:'3/4',background:'#0a0a0f',borderColor:`${color1}10`,transform:`rotate(${(i-1)*3}deg) translateY(${i*4}px)`,zIndex:10+3-i}}>
                  {c.src ? <video src={c.src} className="absolute inset-0 w-full h-full object-cover opacity-50" muted preload="auto" playsInline /> : null}
                  <div className="absolute inset-0 flex items-center justify-center" style={{background:'rgba(0,0,0,0.2)'}}><svg className="w-6 h-6 text-white/60 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg></div>
                </div>
              ))}
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center"><span className="text-xs font-medium tracking-[0.2em] uppercase text-white/35">{label}</span></div>
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

function ExpandedInner({ color1, color2, cards, onCardClick, label }: { color1: string; color2: string; cards: CardData[]; onCardClick?: (card: CardData) => void; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const isResetting = useRef(false);
  const CW = 200; const GAP = 16; const CARD_STEP = CW + GAP;
  const TRIPLE = [...cards, ...cards, ...cards, ...cards, ...cards];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = (TRIPLE.length * CARD_STEP) / 2;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isResetting.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const threshold = CARD_STEP * cards.length;
    if (el.scrollLeft < threshold) { isResetting.current = true; el.scrollLeft += CARD_STEP * cards.length * 2; isResetting.current = false; }
    else if (el.scrollLeft > maxScroll - threshold) { isResetting.current = true; el.scrollLeft -= CARD_STEP * cards.length * 2; isResetting.current = false; }
  }, [cards.length, CARD_STEP]);

  const scrollByAmount = (dir: 1 | -1) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * CARD_STEP, behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} className="w-full">
      <div className="relative w-full rounded-3xl overflow-hidden"
        style={{ background: `linear-gradient(135deg,${color1}08,${color2}05)`, backdropFilter:'blur(60px)', WebkitBackdropFilter:'blur(60px)', border:`1px solid ${color1}20`, boxShadow:`0 0 120px ${color1}10` }}>
        <div className="absolute top-0 left-0 right-0 z-20 px-6 md:px-8 py-5 pointer-events-none"><span className="text-sm md:text-base font-medium tracking-[0.2em] uppercase" style={{color:color1}}>{label}</span></div>
        <button onClick={(e)=>{e.stopPropagation();scrollByAmount(-1)}} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors" style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(10px)'}}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7"/></svg></button>
        <button onClick={(e)=>{e.stopPropagation();scrollByAmount(1)}} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors" style={{background:'rgba(255,255,255,0.03)',backdropFilter:'blur(10px)'}}><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7"/></svg></button>
        <div ref={scrollRef} onScroll={handleScroll}
          className="flex items-center gap-4 py-10 md:py-14 px-[8%] overflow-x-auto scrollbar-hide"
          style={{ scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', maskImage:'linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%)', WebkitMaskImage:'linear-gradient(90deg,transparent 0%,black 8%,black 92%,transparent 100%)' }}>
          {TRIPLE.map((c,i)=>{
            const id=c.id*1000+i; const a=active===id; const d=active!==null&&!a;
            return (<div key={id} onMouseEnter={()=>setActive(id)} onMouseLeave={()=>setActive(null)}
              onClick={()=>{const o=cards.find(x=>x.id===c.id);if(o)onCardClick?.(o)}}
              className="flex-shrink-0 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 snap-center"
              style={{width:CW,maxWidth:'55vw',aspectRatio:'3/4',background:'#0a0a0f',borderColor:a?`${color1}40`:`${color1}10`,filter:d?'brightness(0.5)':'brightness(1)',opacity:d?0.6:1,transform:a?'scale(1.06)':d?'scale(0.96)':'scale(1)'}}>
              {c.src ? <video src={c.src} className="absolute inset-0 w-full h-full object-cover" muted preload="auto" playsInline /> : <div className="absolute inset-0" style={{background:`linear-gradient(135deg,${c.gradient},#0a0a0f)`}}/>}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3" style={{background:'rgba(0,0,0,0.3)'}}>
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-3"><svg className="w-5 h-5 text-white/50 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14l11-7-11-7z"/></svg></div>
                <span className="text-white/40 text-xs font-medium tracking-wider">{String(c.id).padStart(2,'0')}</span>
                <span className="text-white/60 text-[10px] mt-1 text-center leading-tight px-1" style={{opacity:a?1:0,transition:'opacity 0.1s'}}>{c.title}</span>
              </div>
            </div>);
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" style={{background:`linear-gradient(transparent,${color1}06)`}}/>
      </div>
      <div className="text-center mt-4"><span className="text-xs tracking-wider uppercase" style={{color:`${color1}70`}}>{cards.length} works · Infinite scroll · Click to preview</span></div>
    </motion.div>
  );
}
