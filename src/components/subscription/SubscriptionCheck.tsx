
import React from "react";
import { useSubscriptionModal } from "@/hooks/useSubscriptionModal";
import SubscriptionModal from "@/components/subscription/SubscriptionModal";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  onAccess: () => void;
  featureName?: string;
}

/**
 * A wrapper component that checks for subscription access before allowing
 * a user to access premium features. If the user doesn't have access,
 * it shows the subscription modal.
 */
const SubscriptionCheck: React.FC<SubscriptionCheckProps> = ({
  children,
  onAccess,
  featureName,
}) => {
  const {
    isModalOpen,
    setIsModalOpen,
    checkFeatureAccess,
    handleSubscribe,
    handleRestore,
    handleEmailSupport,
  } = useSubscriptionModal();

  const handleClick = async () => {
    checkFeatureAccess(onAccess, featureName);
  };

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      
      <SubscriptionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubscribe={handleSubscribe}
        onRestore={handleRestore}
        onEmailSupport={handleEmailSupport}
      />
    </>
  );
};

export default SubscriptionCheck;
