
import { useEffect, useState } from 'react';
import { canUseFeature, useCredit } from '@/services/subscriptionService';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';

export function useFeatureAccess() {
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const { isPremium, creditsRemaining, refetchSubscription } = useSubscription();
  const { toast } = useToast();

  // Check if user can access a premium feature
  const checkAccess = async (): Promise<boolean> => {
    setIsCheckingAccess(true);
    
    try {
      const hasAccess = await canUseFeature();
      
      if (!hasAccess) {
        if (isPremium) {
          toast({
            title: "Subscription issue",
            description: "There's a problem with your subscription. Please try again.",
            variant: "destructive"
          });
        } else if (creditsRemaining <= 0) {
          toast({
            title: "Daily limit reached",
            description: "Upgrade to premium for unlimited use",
            variant: "destructive"
          });
        }
      }
      
      return hasAccess;
    } finally {
      setIsCheckingAccess(false);
    }
  };

  // Use a credit and execute the callback if successful
  const useFeature = async <T>(featureCallback: () => Promise<T>): Promise<T | null> => {
    setIsCheckingAccess(true);
    
    try {
      const creditUsed = await useCredit();
      
      if (!creditUsed) {
        return null;
      }
      
      // Refetch subscription to get updated credit count
      refetchSubscription();
      
      // Execute the feature callback
      return await featureCallback();
    } catch (error) {
      console.error('Error using feature:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsCheckingAccess(false);
    }
  };

  return {
    checkAccess,
    useFeature,
    isCheckingAccess,
  };
}
