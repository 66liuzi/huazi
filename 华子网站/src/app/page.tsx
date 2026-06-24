'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Prism from '@/components/Prism';
import PrismFallback from '@/components/PrismFallback';
import MouseGlow from '@/components/MouseGlow';
import HeroText from '@/components/HeroText';
import GlassFolder from '@/components/GlassFolder';
import VideoViewer from '@/components/VideoViewer';

const videoCards = [
  { id: 1, title: '鼓楼', color: '#3a1a3e', gradient: '#3a1a3e', src: '/videos/real/0321鼓楼.mp4' },
  { id: 2, title: '12月9日', color: '#2a1a4e', gradient: '#2a1a4e', src: '/videos/real/12月9日(2).mp4' },
  { id: 3, title: '纯AI版', color: '#4e2a1a', gradient: '#4e2a1a', src: '/videos/real/1月27日纯AI版(19).mp4' },
  { id: 4, title: '2月25日', color: '#1a3e2a', gradient: '#1a3e2a', src: '/videos/real/2月25日(1).mp4' },
  { id: 5, title: '7月24日', color: '#2a3a4e', gradient: '#2a3a4e', src: '/videos/real/7月24日(1).mp4' },
  { id: 6, title: '8月4日', color: '#3e2a2a', gradient: '#3e2a2a', src: '/videos/real/8月4日(2).mp4' },
  { id: 7, title: '8月9日', color: '#2a4e3a', gradient: '#2a4e3a', src: '/videos/real/8月9日(2).mp4' },
  { id: 8, title: '啤酒视频优化', color: '#4e3a1a', gradient: '#4e3a1a', src: '/videos/real/啤酒视频优化.mp4' },
  { id: 9, title: '滨海运动会', color: '#1a4e4e', gradient: '#1a4e4e', src: '/videos/real/滨海运动会.mp4' },
];

function SafePrism() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasError(true);
    } catch {
      setHasError(true);
    }
  }, []);

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

export default function Home() {
  const [videoViewerOpen, setVideoViewerOpen] = useState(false);
  const [videoData, setVideoData] = useState({ src: '', title: '' });
  const [expandedFolder, setExpandedFolder] = useState(false);

  const handleVideoCardClick = (card: { id: number; title: string; src?: string }) => {
    setVideoData({ src: card.src || '', title: card.title });
    setVideoViewerOpen(true);
  };

  return (
    <main className="relative overflow-hidden">
      <MouseGlow />
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0" style={{ zIndex: 0 }}>
          <SafePrism />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(9,9,9,0.6) 100%)',
            zIndex: 1,
          }}
        />
        <div className="relative z-10">
          <HeroText />
        </div>
      </section>

      <section id="portfolio-section" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-[family-name:var(--font-cinzel)]">
            <span className="bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">Portfolio</span>
          </h2>
        </motion.div>

        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <GlassFolder
              label="Video Portfolio"
              color1="#a855f7"
              color2="#7c3aed"
              cards={videoCards}
              isExpanded={expandedFolder}
              onExpand={() => setExpandedFolder(true)}
              onCollapse={() => setExpandedFolder(false)}
              onCardClick={handleVideoCardClick}
            />
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 text-center py-12 border-t border-white/[0.03]">
        <p className="text-slate-600 text-sm">&copy; 2026 刘洋华子. All rights reserved.</p>
      </footer>

      <VideoViewer isOpen={videoViewerOpen} onClose={() => setVideoViewerOpen(false)} videoSrc={videoData.src} title={videoData.title} />
    </main>
  );
}
