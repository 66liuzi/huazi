'use client';

import React, { useState, useEffect } from 'react';
import { GridScan } from '@/components/GridScan';
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

export default function SafeGridScan() {
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
      <GridScan
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#bedf2a"
        gridScale={0.09}
        scanColor="#dd81df"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.002}
        noiseIntensity={0.01}
        lineJitter={0.04}
      />
    </ErrorBoundary>
  );
}
