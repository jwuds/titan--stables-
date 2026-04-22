# Performance Optimization Documentation

## Overview
This document outlines the performance optimizations implemented for the Titan Stables web application. The goal is to improve Core Web Vitals (LCP, CLS, INP) and ensure a fast, seamless experience for global users.

## 1. Core Web Vitals Monitoring
We have implemented a `PerformanceMonitor` component that tracks:
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **INP (Interaction to Next Paint)**: Target < 200ms
- **FCP (First Contentful Paint)**: Target < 1.8s

Metrics are logged to the console in development and sent to the `web_vitals` Supabase table in production.

## 2. Image Optimization
- **Component**: `src/components/ImageOptimizer.jsx`
- **Features**:
  - **Lazy Loading**: Images below the fold use `loading="lazy"` and `IntersectionObserver`.
  - **WebP Support**: Automatic format selection via `<picture>` tag.
  - **Layout Stability**: Explicit `width` and `height` or `aspect-ratio` to prevent CLS.
  - **Fallbacks**: JPG/PNG fallback for older browsers.
  - **Blur-up Effect**: Smooth transition on load.

## 3. Caching Strategy
- **Service Worker**: `public/sw.js` implements a "Cache First" strategy for images, fonts, and scripts, and "Network First" for HTML navigation.
- **Offline Support**: `offline.html` is served when network is unavailable.
- **Headers**: `.htaccess` configuration enables:
  - Long-term caching (1 year) for immutable assets (CSS, JS, Fonts).
  - Gzip/Deflate compression for all text-based resources.
  - `Cache-Control` headers optimized for static generation.

## 4. Code Splitting & Lazy Loading
- **Route-based Splitting**: All pages in `App.jsx` are loaded via `React.lazy()` and `Suspense`.
- **Component Splitting**: Non-critical floating elements (`FloatingWhatsApp`, `FloatingContact`) are lazy-loaded to reduce initial bundle size.
- **Vendor Chunking**: `vite.config.js` splits heavy libraries (`recharts`, `supabase`, `framer-motion`) into separate chunks to improve caching hits.

## 5. Font Optimization
- **Display Swap**: All fonts use `font-display: swap` to prevent "Flash of Invisible Text" (FOIT).
- **Preloading**: Critical Google Fonts are preconnected in `index.html`.

## 6. CSS Optimization
- **Critical CSS**: A minimal spinner and background style is inlined in `index.html` to improve FCP.
- **Minification**: Enabled `cssMinify: true` in `vite.config.js`.

## 7. Testing Instructions
1. **Lighthouse**: Open Chrome DevTools > Lighthouse > Analyze "Navigation".
2. **PageSpeed Insights**: Deploy to staging and run URL through PSI.
3. **Validation**: Check `web_vitals` table in Supabase for real user data.

## 8. Current Status vs Targets
| Metric | Target | Status |
|--------|--------|--------|
| LCP    | < 2.5s | Optimized (Image Preloading + WebP) |
| CLS    | < 0.1  | Optimized (Dimensions on Images) |
| INP    | < 200ms| Optimized (JS Minification + Chunking) |