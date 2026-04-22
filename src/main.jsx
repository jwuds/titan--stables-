
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import { initPerformanceMonitoring, reportWebVitals } from '@/lib/performanceMonitoring';
import { checkServiceHealth } from '@/lib/supabaseErrorRecovery';

// Initialize performance monitoring before app renders
try {
  initPerformanceMonitoring();
  console.log('✅ Performance monitoring initialized');
} catch (error) {
  console.warn('⚠️ Failed to initialize performance monitoring:', error);
}

// Check service health on startup
checkServiceHealth()
  .then((health) => {
    if (health.healthy) {
      console.log(`✅ Supabase healthy (${health.duration}ms)`);
    } else {
      console.warn('⚠️ Supabase health check failed:', health.error);
    }
  })
  .catch(() => {});

// Track web vitals
reportWebVitals((metric) => {
  console.log(`📊 ${metric.name}:`, metric.value);
});

// Global error boundary for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Register Service Worker for offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('✅ Service Worker registered:', registration);
      },
      (registrationError) => {
        console.warn('⚠️ Service Worker registration failed:', registrationError);
      }
    );
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <PerformanceMonitor />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
