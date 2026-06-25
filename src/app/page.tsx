'use client';
import React from 'react';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import HeroText from '@/components/HeroText';
import { HeroSkeleton, PortfolioSkeleton } from '@/components/LoadingSkeleton';

const COS_VIDEO_BASE = 'https://huazi-1324532363.cos.ap-beijing.myqcloud.com/media/videos';
const COS_THUMB_BASE = `${COS_VIDEO_BASE}/thumbnails`;

const videoCards = [
  { id: 1, title: '鼓楼', color: '#3a1a3e', gradient: '#3a1a3e', src: `${COS_VIDEO_BASE}/gulou.mp4`, poster: `${COS_THUMB_BASE}/gulou.jpg` },
  { id: 2, title: '12月9日', color: '#2a1a4e', gradient: '#2a1a4e', src: `${COS_VIDEO_BASE}/dec09.mp4`, poster: `${COS_THUMB_BASE}/dec09.jpg` },
  { id: 3, title: '纯AI版', color: '#4e2a1a', gradient: '#4e2a1a', src: `${COS_VIDEO_BASE}/jan27.mp4`, poster: `${COS_THUMB_BASE}/jan27.jpg` },
  { id: 4, title: '2月25日', color: '#1a3e2a', gradient: '#1a3e2a', src: `${COS_VIDEO_BASE}/feb25.mp4`, poster: `${COS_THUMB_BASE}/feb25.jpg` },
  { id: 5, title: '7月24日', color: '#2a3a4e', gradient: '#2a3a4e', src: `${COS_VIDEO_BASE}/jul24.mp4`, poster: `${COS_THUMB_BASE}/jul24.jpg` },
  { id: 6, title: '8月4日', color: '#3e2a2a', gradient: '#3e2a2a', src: `${COS_VIDEO_BASE}/aug04.mp4`, poster: `${COS_THUMB_BASE}/aug04.jpg` },
  { id: 7, title: '8月9日', color: '#2a4e3a', gradient: '#2a4e3a', src: `${COS_VIDEO_BASE}/aug09.mp4`, poster: `${COS_THUMB_BASE}/aug09.jpg` },
  { id: 8, title: '啤酒视频优化', color: '#4e3a1a', gradient: '#4e3a1a', src: `${COS_VIDEO_BASE}/beer.mp4`, poster: `${COS_THUMB_BASE}/beer.jpg` },
  { id: 9, title: '滨海运动会', color: '#1a4e4e', gradient: '#1a4e4e', src: `${COS_VIDEO_BASE}/sports.mp4`, poster: `${COS_THUMB_BASE}/sports.jpg` },
];

// Lazy-load heavy components for code splitting
const MouseGlow = dynamic(() => import('@/components/MouseGlow'), { ssr: false });
const SafePrism = dynamic(() => import('@/components/SafePrism'), { ssr: false, loading: () => <HeroSkeleton /> });
const Orb = dynamic(() => import('@/components/Orb'), { ssr: false, loading: () => <div className="absolute inset-0 bg-[#1a1a2e]" /> });
const GlassFolder = dynamic(() => import('@/components/GlassFolder'), { ssr: false, loading: () => <PortfolioSkeleton /> });
const VideoViewer = dynamic(() => import('@/components/VideoViewer'), { ssr: false });

export default function Home() {
  const [videoViewerOpen, setVideoViewerOpen] = useState(false);
  const [videoData, setVideoData] = useState({ src: '', title: '' });
  const [expandedFolder, setExpandedFolder] = useState(false);

  // Auto-expand portfolio on touch devices
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) {
      setExpandedFolder(true);
    }
  }, []);

  const handleVideoCardClick = (card: { id: number; title: string; src?: string }) => {
    setVideoData({ src: card.src || '', title: card.title });
    setVideoViewerOpen(true);
  };

  return (
    <main className="relative overflow-hidden">
      <MouseGlow />

      {/* Hero Section */}
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

      {/* Portfolio Section */}
      <section id="portfolio-section" className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-24">
        <div
          className="absolute top-0 left-0 overflow-hidden pointer-events-auto"
          style={{
            zIndex: 0,
            width: '100%',
            height: '100%',
            minHeight: '100vh',
          }}
        >
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={260}
            forceHoverState={false}
            backgroundColor="#1a1a2e"
          />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 70%, rgba(9,9,11,0.15) 100%)',
            zIndex: 1,
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-16 relative z-10"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight font-[family-name:var(--font-cinzel)]">
            <span className="bg-gradient-to-br from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">Portfolio</span>
          </h2>
        </motion.div>

        <div className="w-full max-w-3xl mx-auto relative z-10">
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
