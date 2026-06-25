let gsap: any = null;
let initialized = false;

function ensureGSAP() {
  if (initialized && gsap) return gsap;
  try {
    // Dynamic require to avoid SSR/build-time issues
    gsap = require('gsap').gsap || require('gsap').default || require('gsap');
    initialized = true;
    return gsap;
  } catch {
    // Fallback: use native scroll if GSAP fails to load
    return null;
  }
}

/**
 * Smooth scroll to target element.
 * Falls back to native smooth scroll if GSAP is unavailable.
 */
export function smoothScrollTo(target: string | HTMLElement, duration = 0.6) {
  const el = typeof target === 'string' ? document.querySelector(target) as HTMLElement : target;
  if (!el) return;

  const gsapLib = ensureGSAP();
  if (!gsapLib) {
    // Fallback to native smooth scroll
    el.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const targetY = el.getBoundingClientRect().top + window.scrollY;
  const proxy = { y: window.scrollY };

  gsapLib.to(proxy, {
    y: targetY,
    duration,
    ease: 'power2.inOut',
    onUpdate: () => window.scrollTo(0, proxy.y),
  });
}
