import { supabase } from '@/lib/customSupabaseClient';
import { onLCP, onFID, onCLS, onTTFB, onFCP } from 'web-vitals';

// Store metrics temporarily to batch them
let metricsQueue = [];
let isProcessingQueue = false;

const processMetricsQueue = async () => {
  if (isProcessingQueue || metricsQueue.length === 0) return;
  isProcessingQueue = true;
  
  try {
    const batch = [...metricsQueue];
    metricsQueue = [];
    
    // Schema only has id, page_path, load_time, timestamp
    const { error } = await supabase
      .from('performance_metrics')
      .insert(batch.map(metric => ({
        page_path: metric.path || window.location.pathname,
        load_time: metric.value,
        timestamp: new Date().toISOString()
      })));
      
    if (error) console.error('Failed to log performance metrics:', error);
  } catch (err) {
    console.error('Error processing metrics:', err);
  } finally {
    isProcessingQueue = false;
  }
};

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export const trackMetric = (name, value) => {
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${name}:`, value);
  }
  
  // We include name in the console log, but schema doesn't support it in DB
  metricsQueue.push({ value, path: window.location.pathname });
  
  if (metricsQueue.length >= 5) {
    processMetricsQueue();
  } else {
    // Process queue after a delay
    setTimeout(processMetricsQueue, 5000);
  }
};

export const trackQueryTime = async (queryName, queryPromise) => {
  const start = performance.now();
  try {
    const result = await queryPromise;
    const duration = performance.now() - start;
    
    if (duration > 2000) {
      console.warn(`[Slow Query Alert] ${queryName} took ${duration.toFixed(2)}ms`);
      trackMetric(`query_slow_${queryName}`, duration);
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    trackMetric(`query_error_${queryName}`, duration);
    throw error;
  }
};

export const initPerformanceMonitoring = () => {
  reportWebVitals((metric) => {
    trackMetric(`web_vital_${metric.name}`, metric.value);
  });
};