'use client';

import { useEffect, useRef } from 'react';

export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    let x = 0;
    let y = 0;
    let currentX = 0;
    let currentY = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      currentX += (x - currentX) * 0.08;
      currentY += (y - currentY) * 0.08;
      glow.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    const frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
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
