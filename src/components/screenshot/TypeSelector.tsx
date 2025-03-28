
import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Flame, Star } from "lucide-react";

export type SuggestionType = 'genuine' | 'nsfw' | 'rizz';

interface TypeSelectorProps {
  selectedType: SuggestionType;
  onTypeChange: (type: SuggestionType) => void;
}

const TypeSelector: React.FC<TypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  return (
    <div className="flex items-center gap-2 mb-3 justify-center">
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
  );
};

export default TypeSelector;
