
import React from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

export const SubscriptionBanner = () => {
  const { 
    isPremium, 
    isInTrial, 
    trialDaysLeft, 
    trialHoursLeft, 
    creditsRemaining,
    status
  } = useSubscription();

  if (isPremium) {
    return (
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="font-bold">Premium Account</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">Unlimited Access</span>
        </div>
      </div>
    );
  }

  if (isInTrial) {
    return (
      <div className="bg-amber-100 border border-amber-300 p-4 rounded-lg shadow-sm mb-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="font-medium text-amber-800">Trial Period</div>
            <Button variant="outline" size="sm" className="text-xs h-8 bg-white border-amber-300 hover:bg-amber-50">
              Upgrade Now
            </Button>
          </div>
          <div className="text-sm text-amber-700">
            {trialDaysLeft > 0 ? (
              <>Your trial ends in {trialDaysLeft} days {trialHoursLeft} hours</>
            ) : (
              <>Your trial ends in {trialHoursLeft} hours</>
            )}
          </div>
          <Progress value={(creditsRemaining / 5) * 100} className="h-2 bg-amber-200" />
          <div className="text-xs text-amber-600 flex justify-between">
            <span>{creditsRemaining} free credits remaining today</span>
            <span>Max: 5</span>
          </div>
        </div>
      </div>
    );
  }

  // Free user
  return (
    <div className="bg-gray-100 border border-gray-200 p-4 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-700">Free Account</div>
          <Button variant="default" size="sm" className="text-xs h-8">
            Upgrade to Premium
          </Button>
        </div>
        <Progress value={(creditsRemaining / 5) * 100} className="h-2" />
        <div className="text-xs text-gray-600 flex justify-between">
          <span>{creditsRemaining} free credits remaining today</span>
          <span>Max: 5</span>
        </div>
      </div>
    </div>
  );
};
