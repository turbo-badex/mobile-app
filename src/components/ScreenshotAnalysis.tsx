
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import SuggestionsList from './screenshot/SuggestionsList';
import LanguageSelector, { type LanguageType } from './screenshot/LanguageSelector';
import TypeSelector, { type SuggestionType } from './screenshot/TypeSelector';
import RegenerateButton from './screenshot/RegenerateButton';
import ChatMessages from './screenshot/ChatMessages';
import { type ConversationHistory } from '@/types/conversation';
import { useSuggestionGenerator } from '@/hooks/useSuggestionGenerator';
import "./ScreenshotAnalysis.css";

interface ScreenshotAnalysisProps {
  extractedText: string;
  suggestions: string[];
  onDismiss: () => void;
  screenshotUrl?: string;
  onUploadNew?: () => void;
  source?: 'screenshot' | 'manual' | 'unknown';
  myMessage?: string;
  conversationHistory?: ConversationHistory;
  onContinue?: () => void;
}

const ScreenshotAnalysis: React.FC<ScreenshotAnalysisProps> = ({
  extractedText,
  suggestions,
  onDismiss,
  screenshotUrl,
  onUploadNew,
  source = 'screenshot',
  myMessage,
  conversationHistory = [],
  onContinue
}) => {
  const [scanningComplete, setScanningComplete] = useState(false);
  const [scanPosition, setScanPosition] = useState(0);
  const [selectedType, setSelectedType] = useState<SuggestionType>('genuine');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('english');
  const [readyToShowSuggestions, setReadyToShowSuggestions] = useState(false);

  const {
    suggestionsList,
    isGenerating,
    initializeSuggestions,
    generateSuggestion,
    handleCopy
  } = useSuggestionGenerator({ extractedText });

  // Initialize scanning animation or skip for manual input
  useEffect(() => {
    let scanInterval: number;
    
    if (source === 'manual') {
      setScanningComplete(true);
      if (suggestions && suggestions.length > 0) {
        initializeSuggestions(suggestions[0], 'genuine', selectedLanguage);
        setReadyToShowSuggestions(true);
      }
      return;
    }
    
    scanInterval = window.setInterval(() => {
      setScanPosition(prev => {
        if (prev >= 100) {
          clearInterval(scanInterval);
          setTimeout(() => {
            setScanningComplete(true);
            if (suggestions && suggestions.length > 0) {
              initializeSuggestions(suggestions[0], 'genuine', selectedLanguage);
              setReadyToShowSuggestions(true);
            }
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => {
      clearInterval(scanInterval);
    };
  }, [suggestions, source, selectedLanguage, initializeSuggestions]);

  const handleTypeChange = (type: SuggestionType) => {
    setSelectedType(type);
    generateSuggestion(type, selectedLanguage);
  };

  const handleLanguageChange = (language: LanguageType) => {
    setSelectedLanguage(language);
    generateSuggestion(selectedType, language);
  };

  const handleCopyWithToast = (id: string) => {
    handleCopy(id);
    toast.success("Copied to clipboard!", {
      position: "top-center",
      className: "screenshot-toast",
      duration: 2000
    });
  };

  const showContinueButton = source === 'manual' && !!onContinue;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#E5DEFF] to-[#D3E4FD] z-50 flex flex-col">
      <div className="flex justify-between items-center p-6">
        <button className="p-2" onClick={onDismiss}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
            alt="NaijaRizz Logo" 
            className="h-[86.4px]"
          />
        </div>
        
        {onUploadNew ? (
          <button 
            className="p-2"
            onClick={onUploadNew}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <div className="w-full bg-[#1A1F2C] rounded-3xl overflow-hidden mb-4">
            <ChatMessages 
              theirMessage={extractedText}
              myMessage={myMessage}
              source={source}
              screenshotUrl={screenshotUrl}
              scanningComplete={scanningComplete}
              scanPosition={scanPosition}
              conversationHistory={conversationHistory}
            />
          </div>
          
          {scanningComplete && (
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
          )}
          
          {scanningComplete && readyToShowSuggestions && (
            <div className="text-center py-4 text-gray-800 font-medium mb-4">
              ⚡ tap to copy ⚡
            </div>
          )}
          
          {scanningComplete && readyToShowSuggestions && (
            <SuggestionsList 
              suggestions={suggestionsList}
              onCopy={handleCopyWithToast}
              isLoading={isGenerating && suggestionsList.length === 0}
            />
          )}
        </div>
      </div>
      
      {scanningComplete && (
        <div className="p-4 pt-2 pb-8 bg-gradient-to-t from-[#E5DEFF] via-[#E5DEFF] to-transparent">
          <TypeSelector 
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
          />
          
          <RegenerateButton 
            selectedType={selectedType}
            isGenerating={isGenerating}
            onRegenerate={() => generateSuggestion(selectedType, selectedLanguage)}
            onContinue={onContinue}
            showContinue={showContinueButton}
          />
        </div>
      )}
    </div>
  );
};

export default ScreenshotAnalysis;
