
import { useState } from "react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { getPaymentService } from "@/services/payment/paymentServiceFactory";

export function useSubscriptionModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPremium } = useSubscription();
  const { checkAccess } = useFeatureAccess();
  const paymentService = getPaymentService();

  // Function to check if a feature can be accessed
  const checkFeatureAccess = async (
    onSuccess: () => void, 
    featureName: string = "premium feature"
  ) => {
    // If user is already premium, allow access immediately
    if (isPremium) {
      onSuccess();
      return true;
    }

    // Otherwise check if they have free credits or trial access
    const hasAccess = await checkAccess();
    
    if (hasAccess) {
      onSuccess();
      return true;
    } else {
      // Show subscription modal if no access
      setIsModalOpen(true);
      return false;
    }
  };

  const handleSubscribe = async () => {
    // Close the modal first for better UX
    setIsModalOpen(false);
    
    try {
      // Start the platform-specific subscription process
      const success = await paymentService.subscribe();
      
      if (success) {
        toast({
          title: "Trial Activated",
          description: "You have started your 3-day free trial!",
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: "There was an error processing your subscription.",
        variant: "destructive"
      });
    }
  };

  const handleRestore = async () => {
    // Close the modal first for better UX
    setIsModalOpen(false);
    
    toast({
      title: "Restore Purchases",
      description: "Checking for previous purchases...",
    });
    
    try {
      // Use the platform-specific restore process
      const success = await paymentService.restorePurchases();
      
      if (success) {
        // This would be updated with actual success/failure handling
        // based on what the platform-specific restore returns
        setTimeout(() => {
          toast({
            title: "Restore Complete",
            description: "No previous purchases found.",
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Restore purchases error:', error);
      toast({
        title: "Restore Error",
        description: "There was an error restoring your purchases.",
        variant: "destructive"
      });
    }
  };

  const handleEmailSupport = () => {
    // This will open the default email client with a pre-filled support email
    toast({
      title: "Email Support",
      description: "Opening email client...",
    });
    
    // Simple email support implementation - can be enhanced later
    const subject = encodeURIComponent("Naija Rizz Support Request");
    const body = encodeURIComponent("Please describe your issue here.");
    window.open(`mailto:support@naijarizz.com?subject=${subject}&body=${body}`);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    checkFeatureAccess,
    handleSubscribe,
    handleRestore,
    handleEmailSupport,
  };
}
