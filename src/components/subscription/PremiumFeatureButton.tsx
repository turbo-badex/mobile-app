
import React from "react";
import { Button } from "@/components/ui/button";
import SubscriptionCheck from "@/components/subscription/SubscriptionCheck";
import { cn } from "@/lib/utils";

interface PremiumFeatureButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  featureName?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

/**
 * A button that checks for subscription access before executing
 * the provided onClick handler. If the user doesn't have access,
 * it shows the subscription modal.
 */
const PremiumFeatureButton: React.FC<PremiumFeatureButtonProps> = ({
  onClick,
  children,
  className,
  featureName,
  variant = "default",
  size = "default",
  disabled = false,
}) => {
  return (
    <SubscriptionCheck onAccess={onClick} featureName={featureName}>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        disabled={disabled}
        type="button"
      >
        {children}
      </Button>
    </SubscriptionCheck>
  );
};

export default PremiumFeatureButton;
