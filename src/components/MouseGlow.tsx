'use client';

import { useEffect, useRef } from 'react';

const IDLE_TIMEOUT_MS = 1500;
const LERP_FACTOR = 0.08;

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0;
    let y = 0;
    let currentX = 0;
    let currentY = 0;
    let running = true;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;

    const resetIdle = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (!running) running = true;
      idleTimer = setTimeout(() => { running = false; }, IDLE_TIMEOUT_MS);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      resetIdle();
    };

    const animate = () => {
      if (running) {
        currentX += (x - currentX) * LERP_FACTOR;
        currentY += (y - currentY) * LERP_FACTOR;
        glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    const frame = requestAnimationFrame(animate);

    return () => {
      running = false;
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none"
      style={{
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, rgba(59,130,246,0.03) 30%, transparent 70%)',
        zIndex: 1,
        top: 0,
        left: 0,
      }}
    />
  );
}
