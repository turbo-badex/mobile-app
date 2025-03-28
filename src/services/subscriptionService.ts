
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type SubscriptionStatus = 'trial' | 'active' | 'cancelled' | 'expired' | 'free';

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  trial_start_date: string;
  trial_end_date: string | null;
  is_premium: boolean;
  daily_credits_remaining: number;
  credits_last_reset_at: string;
  plan_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

/**
 * Fetches the current user's subscription information
 */
export const fetchUserSubscription = async (): Promise<Subscription | null> => {
  try {
    const { data: subscriptionData, error } = await supabase
      .from('subscriptions')
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return null;
    }
    
    if (!subscriptionData) return null;
    
    // Ensure the status is of type SubscriptionStatus
    const subscription = {
      ...subscriptionData,
      status: subscriptionData.status as SubscriptionStatus
    };
    
    return subscription as Subscription;
  } catch (error) {
    console.error('Unexpected error fetching subscription:', error);
    return null;
  }
};

/**
 * Decrements the daily credits for free users
 */
export const useCredit = async (): Promise<boolean> => {
  try {
    const subscription = await fetchUserSubscription();
    
    if (!subscription) {
      toast({
        title: "Couldn't verify subscription",
        description: "Please try again later",
        variant: "destructive"
      });
      return false;
    }
    
    // Premium users don't use credits
    if (subscription.is_premium) {
      return true;
    }
    
    // Check if user has any credits left
    if (subscription.daily_credits_remaining <= 0) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade to premium for unlimited use",
        variant: "destructive"
      });
      return false;
    }
    
    // Decrement credits
    const { error } = await supabase
      .from('subscriptions')
      .update({ daily_credits_remaining: subscription.daily_credits_remaining - 1 })
      .eq('id', subscription.id);
    
    if (error) {
      console.error('Error updating credits:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error using credit:', error);
    return false;
  }
};

/**
 * Checks if a user can use a premium feature
 * Returns true if user is premium or has credits remaining
 */
export const canUseFeature = async (): Promise<boolean> => {
  const subscription = await fetchUserSubscription();
  
  if (!subscription) {
    return false;
  }
  
  // Premium users always have access
  if (subscription.is_premium) {
    return true;
  }
  
  // Free users need available credits
  return subscription.daily_credits_remaining > 0;
};

/**
 * Calculate remaining trial time
 * @returns Object with trial information
 */
export const getTrialInfo = (subscription: Subscription | null): {
  isInTrial: boolean;
  daysLeft: number;
  hoursLeft: number;
} => {
  const defaultResponse = { isInTrial: false, daysLeft: 0, hoursLeft: 0 };
  
  if (!subscription || !subscription.trial_end_date) {
    return defaultResponse;
  }
  
  if (subscription.status !== 'trial') {
    return defaultResponse;
  }
  
  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);
  
  // If trial has ended
  if (now >= trialEnd) {
    return defaultResponse;
  }
  
  // Calculate time difference
  const diffMs = trialEnd.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return {
    isInTrial: true,
    daysLeft: diffDays,
    hoursLeft: diffHours
  };
};
