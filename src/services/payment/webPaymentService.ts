
import { PaymentService } from './PaymentService';
import { toast } from '@/hooks/use-toast';

/**
 * Implementation of PaymentService for web testing
 */
export class WebPaymentService implements PaymentService {
  async initialize(): Promise<void> {
    console.log('Initializing web payment service (simulation only)');
  }

  async subscribe(): Promise<boolean> {
    console.log('Web: Simulating subscription process');
    
    toast({
      title: "Trial Activated",
      description: "You have started your 3-day free trial!",
    });
    
    return true;
  }

  async restorePurchases(): Promise<boolean> {
    console.log('Web: Simulating restore purchases');
    
    setTimeout(() => {
      toast({
        title: "Restore Complete",
        description: "No previous purchases found.",
      });
    }, 2000);
    
    return true;
  }

  async checkSubscription(): Promise<boolean> {
    console.log('Web: Checking subscription status (simulation)');
    return false;
  }
}
