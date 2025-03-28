
import React from "react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  totalSteps: number;
  currentStep: number;
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 w-2 rounded-full transition-all",
            i === currentStep
              ? "bg-[#3155F6] w-4"
              : "bg-gray-300"
          )}
        />
      ))}
    </div>
  );
};

export default OnboardingProgress;
