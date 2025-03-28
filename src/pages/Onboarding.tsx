import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import { hasCompletedOnboarding, markOnboardingComplete } from "@/utils/onboarding";

const ONBOARDING_DATA = [
  {
    title: "Get ready to ginger your crush",
    description: "Navigate awkward chats with confidence using Naija-style responses",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Spice am up!",
    description: "From smooth talk to outright funny, we go show you how to shine!",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=500",
  },
  {
    title: "Start Your Rizz Journey",
    description: "Upload chats, type messages, or browse pickup lines - the choice is yours!",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=500",
  },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      navigate("/");
    }
  }, [navigate]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_DATA.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      markOnboardingComplete();
      navigate("/");
    }
  };

  const currentScreen = ONBOARDING_DATA[currentStep];
  const isLastScreen = currentStep === ONBOARDING_DATA.length - 1;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col">
        <OnboardingScreen
          title={currentScreen.title}
          description={currentScreen.description}
          image={currentScreen.image}
          onNext={handleNext}
          isLastScreen={isLastScreen}
        />
        <OnboardingProgress
          totalSteps={ONBOARDING_DATA.length}
          currentStep={currentStep}
        />
      </main>
    </div>
  );
};

export default Onboarding;
