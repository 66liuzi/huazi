'use client';

import React, { useState, useEffect } from 'react';
import Prism from '@/components/Prism';
import PrismFallback from '@/components/PrismFallback';

class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function SafePrism() {
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches || window.innerWidth < 768);
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasError(true);
    } catch {
      setHasError(true);
    }
  }, []);

  if (!mounted) return null;
  if (hasError) return <PrismFallback />;

  return (
    <ErrorBoundary fallback={<PrismFallback />}>
      <Prism
        animationType="hover"
        timeScale={0.55}
        height={3.5}
        baseWidth={5.5}
        scale={isMobile ? 2.5 : 3.2}
        hueShift={0.35}
        colorFrequency={2.2}
        noise={0.02}
        glow={isMobile ? 0.8 : 1.1}
        bloom={isMobile ? 0.6 : 0.8}
        hoverStrength={isMobile ? 1.5 : 2.5}
        inertia={0.06}
        transparent={true}
        maxDpr={isMobile ? 1.25 : 2}
      />
    </ErrorBoundary>
  );
}
