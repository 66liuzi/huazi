import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth scroll to target element using GSAP (no ScrollToPlugin needed)
 */
export function smoothScrollTo(target: string | HTMLElement, duration = 1.2) {
  const el = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
  if (!el) return;

  const targetY = el.getBoundingClientRect().top + window.scrollY;
  const proxy = { y: window.scrollY };

  gsap.to(proxy, {
    y: targetY,
    duration,
    ease: 'power3.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  });
}

export { gsap, ScrollTrigger };
