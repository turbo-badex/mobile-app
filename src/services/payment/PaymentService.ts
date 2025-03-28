
/**
 * Interface for platform-specific payment implementations
 */
export interface PaymentService {
  /**
   * Initializes the payment system
   */
  initialize: () => Promise<void>;
  
  /**
   * Starts the subscription process for the premium plan
   */
  subscribe: () => Promise<boolean>;
  
  /**
   * Restores previous purchases
   */
  restorePurchases: () => Promise<boolean>;
  
  /**
   * Checks if the user has an active subscription
   */
  checkSubscription: () => Promise<boolean>;
}
