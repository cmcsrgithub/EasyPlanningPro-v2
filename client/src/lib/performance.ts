// Performance monitoring utilities for Enterprise Grade quality

export interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

// Measure Web Vitals
export function measureWebVitals(callback: (metrics: PerformanceMetrics) => void) {
  const metrics: PerformanceMetrics = {};

  // Measure FCP
  const fcpObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        metrics.fcp = entry.startTime;
      }
    }
  });
  fcpObserver.observe({ entryTypes: ['paint'] });

  // Measure LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure FID
  const fidObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      metrics.fid = (entry as any).processingStart - entry.startTime;
    }
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Measure CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
        metrics.cls = clsValue;
      }
    }
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  // Measure TTFB
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
  }

  // Report metrics after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      callback(metrics);
    }, 0);
  });
}

// Log performance metrics to console (development only)
export function logPerformanceMetrics() {
  if (import.meta.env.DEV) {
    measureWebVitals((metrics) => {
      console.group('🚀 Performance Metrics');
      console.log('FCP (First Contentful Paint):', metrics.fcp?.toFixed(2), 'ms');
      console.log('LCP (Largest Contentful Paint):', metrics.lcp?.toFixed(2), 'ms');
      console.log('FID (First Input Delay):', metrics.fid?.toFixed(2), 'ms');
      console.log('CLS (Cumulative Layout Shift):', metrics.cls?.toFixed(4));
      console.log('TTFB (Time to First Byte):', metrics.ttfb?.toFixed(2), 'ms');
      console.groupEnd();
    });
  }
}

// Preload critical resources
export function preloadCriticalResources(resources: string[]) {
  resources.forEach((resource) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (resource.endsWith('.woff2') || resource.endsWith('.woff')) {
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
    } else if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|avif)$/)) {
      link.as = 'image';
    }
    
    link.href = resource;
    document.head.appendChild(link);
  });
}

// Prefetch next page resources
export function prefetchPage(url: string) {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  document.head.appendChild(link);
}

