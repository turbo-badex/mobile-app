
import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export type LanguageType = 'english' | 'pidgin';

interface LanguageSelectorProps {
  selectedLanguage: LanguageType;
  onLanguageChange: (language: LanguageType) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className="flex justify-center mb-4">
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
  );
};

export default LanguageSelector;
