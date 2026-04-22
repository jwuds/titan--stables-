
/**
 * Performance Monitoring and Core Web Vitals Tracking
 * Tracks LCP, FID, CLS, FCP, TTFB and other metrics
 */

import { supabase } from '@/lib/customSupabaseClient';

const METRICS_BUFFER = [];
const BUFFER_SIZE = 10;
const FLUSH_INTERVAL = 30000; // 30 seconds

// Performance thresholds (good, needs improvement, poor)
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

let metricsCollected = {
  LCP: null,
  FID: null,
  CLS: null,
  FCP: null,
  TTFB: null,
};

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined') return;

  // Track Core Web Vitals using web-vitals library if available
  if (window.performance && window.PerformanceObserver) {
    trackLCP();
    trackFID();
    trackCLS();
    trackFCP();
    trackTTFB();
  }

  // Track navigation timing
  trackNavigationTiming();

  // Flush metrics periodically
  setInterval(flushMetrics, FLUSH_INTERVAL);

  // Flush on page unload
  window.addEventListener('beforeunload', flushMetrics);

  console.log('✅ Performance monitoring initialized');
};

/**
 * Track Largest Contentful Paint (LCP)
 */
const trackLCP = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const value = lastEntry.renderTime || lastEntry.loadTime;
      metricsCollected.LCP = value;
      
      trackMetric('LCP', value, getRating(value, THRESHOLDS.LCP));
      
      if (value > THRESHOLDS.LCP.poor) {
        console.warn(`⚠️ Poor LCP: ${value}ms (should be < ${THRESHOLDS.LCP.good}ms)`);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('LCP tracking failed:', error);
  }
};

/**
 * Track First Input Delay (FID)
 */
const trackFID = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const value = entry.processingStart - entry.startTime;
        metricsCollected.FID = value;
        
        trackMetric('FID', value, getRating(value, THRESHOLDS.FID));
        
        if (value > THRESHOLDS.FID.poor) {
          console.warn(`⚠️ Poor FID: ${value}ms (should be < ${THRESHOLDS.FID.good}ms)`);
        }
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('FID tracking failed:', error);
  }
};

/**
 * Track Cumulative Layout Shift (CLS)
 */
const trackCLS = () => {
  try {
    let clsValue = 0;
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      metricsCollected.CLS = clsValue;
      trackMetric('CLS', clsValue, getRating(clsValue, THRESHOLDS.CLS));
      
      if (clsValue > THRESHOLDS.CLS.poor) {
        console.warn(`⚠️ Poor CLS: ${clsValue} (should be < ${THRESHOLDS.CLS.good})`);
      }
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('CLS tracking failed:', error);
  }
};

/**
 * Track First Contentful Paint (FCP)
 */
const trackFCP = () => {
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const value = entry.startTime;
          metricsCollected.FCP = value;
          
          trackMetric('FCP', value, getRating(value, THRESHOLDS.FCP));
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('FCP tracking failed:', error);
  }
};

/**
 * Track Time to First Byte (TTFB)
 */
const trackTTFB = () => {
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0];
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      metricsCollected.TTFB = value;
      
      trackMetric('TTFB', value, getRating(value, THRESHOLDS.TTFB));
      
      if (value > THRESHOLDS.TTFB.poor) {
        console.warn(`⚠️ Poor TTFB: ${value}ms (should be < ${THRESHOLDS.TTFB.good}ms)`);
      }
    }
  } catch (error) {
    console.warn('TTFB tracking failed:', error);
  }
};

/**
 * Track navigation timing
 */
const trackNavigationTiming = () => {
  if (!window.performance || !window.performance.timing) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      const timing = performance.timing;
      const metrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domComplete - timing.domLoading,
        load: timing.loadEventEnd - timing.loadEventStart,
        total: timing.loadEventEnd - timing.navigationStart,
      };

      Object.entries(metrics).forEach(([name, value]) => {
        trackMetric(`navigation_${name}`, value, 'info');
      });
    }, 0);
  });
};

/**
 * Track custom metric
 */
export const trackMetric = (metricName, value, rating = 'info') => {
  const metric = {
    metric_name: metricName,
    value: parseFloat(value.toFixed(2)),
    rating,
    navigation_type: getNavigationType(),
    path: window.location.pathname,
    user_agent: navigator.userAgent,
    created_at: new Date().toISOString(),
  };

  METRICS_BUFFER.push(metric);

  // Flush if buffer is full
  if (METRICS_BUFFER.length >= BUFFER_SIZE) {
    flushMetrics();
  }
};

/**
 * Get performance rating
 */
const getRating = (value, thresholds) => {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
};

/**
 * Get navigation type
 */
const getNavigationType = () => {
  if (!window.performance || !window.performance.navigation) return 'unknown';
  
  const type = performance.navigation.type;
  switch (type) {
    case 0: return 'navigate';
    case 1: return 'reload';
    case 2: return 'back-forward';
    default: return 'unknown';
  }
};

/**
 * Flush metrics to database
 */
const flushMetrics = async () => {
  if (METRICS_BUFFER.length === 0) return;

  const metricsToSend = [...METRICS_BUFFER];
  METRICS_BUFFER.length = 0;

  try {
    const { error } = await supabase
      .from('web_vitals')
      .insert(metricsToSend);

    if (error) {
      console.warn('Failed to send metrics:', error);
      // Add back to buffer for retry
      METRICS_BUFFER.push(...metricsToSend);
    }
  } catch (error) {
    console.warn('Error flushing metrics:', error);
  }
};

/**
 * Track API response time
 */
export const trackAPIResponse = (endpoint, duration, success = true) => {
  trackMetric(`api_${success ? 'success' : 'error'}_${endpoint}`, duration, success ? 'good' : 'poor');
};

/**
 * Report Web Vitals (for external monitoring)
 */
export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      // web-vitals not available, using custom implementation
    });
  }
};

/**
 * Get current performance stats
 */
export const getPerformanceStats = () => {
  return {
    metrics: { ...metricsCollected },
    bufferSize: METRICS_BUFFER.length,
    thresholds: THRESHOLDS,
  };
};

/**
 * Track error rate
 */
let errorCount = 0;
let totalRequests = 0;

export const trackError = (error, context = {}) => {
  errorCount++;
  totalRequests++;

  const errorRate = (errorCount / totalRequests) * 100;

  trackMetric('error_rate', errorRate, errorRate > 5 ? 'poor' : 'good');

  // Log to Supabase error_logs
  logError(error, context);
};

/**
 * Log error to Supabase
 */
const logError = async (error, context) => {
  try {
    await supabase.from('error_logs').insert([{
      error_message: error.message || String(error),
      error_stack: error.stack || '',
      page_path: window.location.pathname,
      severity: 'error',
      timestamp: new Date().toISOString(),
      ...context,
    }]);
  } catch (err) {
    console.warn('Failed to log error:', err);
  }
};

/**
 * Track successful request
 */
export const trackSuccess = () => {
  totalRequests++;
};
