
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart, Flame, Star, MessageSquare } from "lucide-react";
import { type SuggestionType } from './TypeSelector';

interface RegenerateButtonProps {
  selectedType: SuggestionType;
  isGenerating: boolean;
  onRegenerate: () => void;
  onContinue?: () => void;
  showContinue?: boolean;
}

const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  selectedType,
  isGenerating,
  onRegenerate,
  onContinue,
  showContinue = false
}) => {
  const getButtonStyle = () => {
    switch(selectedType) {
      case 'genuine':
        return "bg-purple-500 hover:bg-purple-600 text-white";
      case 'nsfw':
        return "bg-pink-500 hover:bg-pink-600 text-white";
      case 'rizz':
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const getButtonIcon = () => {
    switch(selectedType) {
      case 'genuine':
        return <Heart size={20} className="mr-2" />;
      case 'nsfw':
        return <Flame size={20} className="mr-2" />;
      case 'rizz':
        return <Star size={20} className="mr-2" />;
      default:
        return null;
    }
  };

  if (showContinue && onContinue) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={onRegenerate}
          disabled={isGenerating}
          className={`w-full ${getButtonStyle()} py-6 rounded-2xl text-lg font-semibold transition-all`}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={20} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {getButtonIcon()}
              Regenerate
            </>
          )}
        </Button>
        <Button 
          onClick={onContinue}
          disabled={isGenerating}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl text-lg font-semibold transition-all"
        >
          <MessageSquare size={20} className="mr-2" />
          Continue
        </Button>
      </div>
    );
  }

  return (
    <Button 
      onClick={onRegenerate}
      disabled={isGenerating}
      className={`w-full ${getButtonStyle()} py-6 rounded-2xl text-lg font-semibold transition-all`}
    >
      {isGenerating ? (
        <>
          <RefreshCw size={20} className="mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          {getButtonIcon()}
          Regenerate {selectedType === 'rizz' ? 'Rizz' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Response
        </>
      )}
    </Button>
  );
};

export default RegenerateButton;
