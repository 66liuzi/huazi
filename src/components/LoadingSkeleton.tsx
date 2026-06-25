'use client';

export function HeroSkeleton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[#090909]" />
      <div className="relative z-10 text-center px-6 space-y-6">
        <div className="h-4 w-24 bg-white/[0.03] rounded mx-auto animate-pulse" />
        <div className="h-16 md:h-24 w-64 md:w-96 bg-white/[0.03] rounded mx-auto animate-pulse" />
        <div className="h-5 w-48 bg-white/[0.02] rounded mx-auto animate-pulse" />
        <div className="h-12 w-40 bg-white/[0.02] rounded-full mx-auto animate-pulse mt-10" />
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="h-10 w-48 bg-white/[0.03] rounded mb-16 animate-pulse" />
      <div className="w-full max-w-3xl mx-auto">
        <div className="h-[420px] w-full bg-white/[0.02] rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function VideoViewerSkeleton() {
  return null; // VideoViewer opens as overlay, no skeleton needed
}
