/**
 * Mobile Device Detection Hook
 * Detects if user is on mobile/tablet via user agent + touch capability
 */

import { useState, useEffect } from 'react';

interface MobileDetectResult {
  isMobile: boolean;
  isTablet: boolean;
  isTouchDevice: boolean;
}

export function useMobileDetect(): MobileDetectResult {
  const [result, setResult] = useState<MobileDetectResult>({
    isMobile: false,
    isTablet: false,
    isTouchDevice: false,
  });

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // Check for mobile devices
      const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
      const isMobile = mobileRegex.test(userAgent);

      // Check for tablets
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
      const isTablet = tabletRegex.test(userAgent);

      // Check for touch capability
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-expect-error - msMaxTouchPoints is IE-specific
        navigator.msMaxTouchPoints > 0;

      setResult({
        isMobile,
        isTablet,
        isTouchDevice,
      });
    };

    checkDevice();

    // Re-check on resize (for responsive testing)
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return result;
}

/**
 * Simple function to check if device is mobile (for non-hook contexts)
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|tablet/i;

  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;

  return mobileRegex.test(userAgent) || (isTouchDevice && window.innerWidth < 1024);
}
