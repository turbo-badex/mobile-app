
import { Capacitor } from '@capacitor/core';

export type Platform = 'ios' | 'android' | 'web';

/**
 * Returns the current platform the app is running on
 */
export function getCurrentPlatform(): Platform {
  return Capacitor.getPlatform() as Platform;
}

/**
 * Check if the app is running on a native mobile platform
 */
export function isNativeMobile(): boolean {
  const platform = getCurrentPlatform();
  return platform === 'ios' || platform === 'android';
}

/**
 * Check if the app is running on iOS
 */
export function isIOS(): boolean {
  return getCurrentPlatform() === 'ios';
}

/**
 * Check if the app is running on Android
 */
export function isAndroid(): boolean {
  return getCurrentPlatform() === 'android';
}
