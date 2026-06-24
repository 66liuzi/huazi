'use client';

export default function PrismFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#090909' }}>
      {/* Ambient glow spots */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] animate-breathe" />
      <div className="absolute bottom-1/3 right-1/4 w-56 h-56 bg-purple-500/8 rounded-full blur-[80px] animate-breathe" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px] animate-breathe" style={{ animationDelay: '0.8s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
              opacity: 0.2 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}
