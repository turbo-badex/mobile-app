
// This file is kept for backwards compatibility but all onboarding functionality has been removed

// These functions now immediately return default values since onboarding has been removed
export const hasCompletedOnboarding = (): boolean => {
  return true; // Always return true to indicate onboarding is complete
};

// These functions no longer have any effect
export const markOnboardingComplete = (): void => {
  // No-op function
};

export const resetOnboarding = (): void => {
  // No-op function
};
