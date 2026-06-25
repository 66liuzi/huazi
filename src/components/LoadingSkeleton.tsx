'use client';

export function HeroSkeleton() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-[#090909]" />
      <div className="relative z-10 text-center px-4 sm:px-6 space-y-4 sm:space-y-6">
        <div className="h-3 w-16 sm:w-24 bg-white/[0.04] rounded mx-auto animate-pulse" />
        <div className="h-12 sm:h-16 md:h-20 w-48 sm:w-64 md:w-80 bg-white/[0.04] rounded mx-auto animate-pulse mt-2" />
        <div className="h-3 sm:h-4 w-36 sm:w-48 bg-white/[0.03] rounded mx-auto animate-pulse" />
        <div className="h-3 w-40 sm:w-56 bg-white/[0.02] rounded mx-auto animate-pulse" />
        <div className="h-10 sm:h-12 w-32 sm:w-40 bg-white/[0.03] rounded-full mx-auto animate-pulse mt-8 sm:mt-10" />
      </div>
    </div>
  );
}

export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="h-8 sm:h-10 w-36 sm:w-48 bg-white/[0.03] rounded mb-16 animate-pulse" />
      <div className="w-full max-w-3xl mx-auto">
        <div className="h-[320px] sm:h-[420px] w-full bg-white/[0.02] rounded-3xl animate-pulse" />
      </div>
    </div>
  );
}

export function VideoViewerSkeleton() {
  return null;
}
