
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe, Heart, Flame, Star, Loader2 } from "lucide-react";
import { type SuggestionType } from "@/components/screenshot/TypeSelector";
import { type LanguageType } from "@/components/screenshot/LanguageSelector";

interface ControlsSectionProps {
  selectedType: SuggestionType;
  selectedLanguage: LanguageType;
  isGenerating: boolean;
  onTypeChange: (type: SuggestionType) => void;
  onLanguageChange: (language: LanguageType) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({
  selectedType,
  selectedLanguage,
  isGenerating,
  onTypeChange,
  onLanguageChange,
  onGenerate,
  disabled
}) => {
  const getRegenerateButtonStyle = (type: SuggestionType) => {
    switch(type) {
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

  return (
    <>
      <div className="flex justify-center mt-8">
        <div className="bg-white p-1 rounded-full flex items-center space-x-1 shadow-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange('english')}
            className={`rounded-full px-4 ${selectedLanguage === 'english' 
              ? 'bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800' 
              : 'hover:bg-gray-100'}`}
          >
            <Globe size={16} className="mr-2" />
            English
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLanguageChange('pidgin')}
            className={`rounded-full px-4 ${selectedLanguage === 'pidgin' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800' 
              : 'hover:bg-gray-100'}`}
          >
            🇳🇬 Pidgin
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 justify-center mt-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onTypeChange('genuine')}
          className={`rounded-full p-0 w-12 h-12 ${selectedType === 'genuine' 
            ? 'bg-purple-100 text-purple-600 border-purple-300' 
            : 'bg-white text-gray-500'}`}
        >
          <Heart size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onTypeChange('nsfw')}
          className={`rounded-full p-0 w-12 h-12 ${selectedType === 'nsfw' 
            ? 'bg-pink-100 text-pink-600 border-pink-300' 
            : 'bg-white text-gray-500'}`}
        >
          <Flame size={20} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onTypeChange('rizz')}
          className={`rounded-full p-0 w-12 h-12 ${selectedType === 'rizz' 
            ? 'bg-blue-100 text-blue-600 border-blue-300' 
            : 'bg-white text-gray-500'}`}
        >
          <Star size={20} />
        </Button>
      </div>
      
      <Button 
        className={`w-full ${getRegenerateButtonStyle(selectedType)} py-6 rounded-2xl text-lg font-semibold transition-all mt-4`}
        disabled={disabled || isGenerating}
        onClick={onGenerate}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            Generate {selectedType === 'rizz' ? 'Rizz' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Response
          </>
        )}
      </Button>
    </>
  );
};

export default ControlsSection;
