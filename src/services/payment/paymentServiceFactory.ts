
import { PaymentService } from './PaymentService';
import { IOSPaymentService } from './iOSPaymentService';
import { AndroidPaymentService } from './androidPaymentService';
import { WebPaymentService } from './webPaymentService';
import { getCurrentPlatform } from '@/utils/platformUtils';

let paymentServiceInstance: PaymentService | null = null;

/**
 * Returns the appropriate payment service for the current platform
 */
export function getPaymentService(): PaymentService {
  if (!paymentServiceInstance) {
    const platform = getCurrentPlatform();
    
    switch (platform) {
      case 'ios':
        paymentServiceInstance = new IOSPaymentService();
        break;
      case 'android':
        paymentServiceInstance = new AndroidPaymentService();
        break;
      default:
        paymentServiceInstance = new WebPaymentService();
        break;
    }
    
    // Initialize the service
    paymentServiceInstance.initialize().catch(error => {
      console.error('Failed to initialize payment service:', error);
    });
  }
  
  return paymentServiceInstance;
}
