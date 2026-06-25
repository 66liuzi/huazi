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

  useEffect(() => { setMounted(true); }, []);

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
        timeScale={0.4}
        height={3.5}
        baseWidth={5.5}
        scale={3.0}
        hueShift={0.8}
        colorFrequency={1.2}
        noise={0}
        glow={1.2}
        bloom={1.0}
        hoverStrength={2.5}
        inertia={0.06}
        transparent={true}
      />
    </ErrorBoundary>
  );
}
