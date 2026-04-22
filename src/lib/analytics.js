// Utility for tracking Google Ads and GA4 events
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  } else {
    console.log('Analytics Event:', eventName, params);
  }
};

export const trackConversion = (conversionId) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      'send_to': conversionId
    });
  } else {
    console.log('Conversion Event:', conversionId);
  }
};