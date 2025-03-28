
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingScreenProps {
  title: string;
  description: string;
  image: string;
  onNext: () => void;
  isLastScreen?: boolean;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  title,
  description,
  image,
  onNext,
  isLastScreen = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-between px-6 py-10 h-full">
      <div className="flex-1 flex items-center justify-center w-full">
        <img 
          src={image} 
          alt={title}
          className="w-full max-w-xs object-contain h-64" 
        />
      </div>
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>
      <div className="mt-10 w-full">
        <Button 
          onClick={onNext} 
          className="w-full bg-[#3155F6] hover:bg-[#2845d9]"
        >
          {isLastScreen ? "Get Started" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
