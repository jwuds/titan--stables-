/**
 * Core Web Vitals Optimization Strategies for 2026 Benchmarks
 * Targets: LCP < 2.5s, FID < 100ms, CLS < 0.1, INP < 200ms
 */

export const WebVitalsStrategies = {
  // 1. Image Optimization Helpers
  images: {
    getSrcSet: (url, widths = [320, 640, 768, 1024, 1280]) => {
      if(!url) return '';
      return widths.map(w => `${url}?w=${w}&format=webp ${w}w`).join(', ');
    },
    getSizes: () => "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
    getPreloadTags: (heroImageUrl) => {
      return `<link rel="preload" as="image" href="${heroImageUrl}" fetchpriority="high">`;
    }
  },

  // 2. Code Splitting Recommendations
  codeSplitting: {
    strategy: "Implement React.lazy() for routes and below-the-fold components. Use dynamic imports for heavy libraries (e.g., charting tools, 3D viewers)."
  },

  // 3. Font Optimization
  fonts: {
    recommendation: "Use font-display: swap in @font-face. Preload critical fonts.",
    cssExample: `
      @font-face {
        font-family: 'Inter';
        src: url('/fonts/Inter.woff2') format('woff2');
        font-display: swap;
      }
    `
  },

  // 4. Render-blocking resource detection
  resources: {
    strategy: "Defer non-critical CSS. Use async or defer attributes on external scripts. Inline critical CSS in the head."
  },

  // 5. JavaScript execution optimization
  javascript: {
    strategy: "Minimize main thread work. Break up long tasks using requestIdleCallback or setTimeout. Debounce scroll and resize handlers."
  },

  // 6. Service worker caching
  serviceWorker: {
    strategy: "Cache static assets (images, CSS, JS) using Cache-First strategy. Use Stale-While-Revalidate for API data that doesn't need immediate freshness."
  },
  
  // 7. Main Thread Work Minimization
  mainThread: {
     strategy: "Offload heavy computations to Web Workers. Avoid deep component trees in React. Memoize expensive calculations."
  }
};

/**
 * Performance Monitoring functions
 */
export const initWebVitalsTracking = () => {
  if (typeof window === 'undefined') return;

  const sendToAnalytics = ({ name, delta, id, value }) => {
    // Console log for development, replace with actual analytics endpoint
    // console.log(`Web Vitals [${name}]:`, { value, delta, id });
    
    // Threshold warnings
    if (name === 'LCP' && value > 2500) console.warn('LCP threshold exceeded (>2.5s)');
    if (name === 'FID' && value > 100) console.warn('FID threshold exceeded (>100ms)');
    if (name === 'CLS' && value > 0.1) console.warn('CLS threshold exceeded (>0.1)');
    if (name === 'INP' && value > 200) console.warn('INP threshold exceeded (>200ms)');
  };

  try {
    // Dynamic import to avoid breaking build if web-vitals is not available globally
    import('web-vitals').then(({ onLCP, onFID, onCLS, onINP }) => {
      onCLS(sendToAnalytics);
      onFID(sendToAnalytics);
      onLCP(sendToAnalytics);
      onINP(sendToAnalytics);
    }).catch(err => console.error("Failed to load web-vitals", err));
  } catch(e) {
    console.warn("web-vitals package not found or failed to init");
  }
};