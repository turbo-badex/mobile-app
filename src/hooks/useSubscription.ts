
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserSubscription, getTrialInfo, Subscription } from '@/services/subscriptionService';
import { useToast } from '@/hooks/use-toast';

export function useSubscription() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    data: subscription,
    error,
    refetch
  } = useQuery({
    queryKey: ['subscription'],
    queryFn: fetchUserSubscription,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    if (error) {
      console.error('Error fetching subscription:', error);
      toast({
        title: 'Error',
        description: 'Could not fetch subscription information',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  }, [error, toast]);
  
  const trialInfo = getTrialInfo(subscription);
  
  return {
    subscription,
    isLoading,
    isPremium: subscription?.is_premium || false,
    isInTrial: trialInfo.isInTrial,
    trialDaysLeft: trialInfo.daysLeft,
    trialHoursLeft: trialInfo.hoursLeft,
    creditsRemaining: subscription?.daily_credits_remaining || 0,
    status: subscription?.status || 'free',
    refetchSubscription: refetch,
  };
}
