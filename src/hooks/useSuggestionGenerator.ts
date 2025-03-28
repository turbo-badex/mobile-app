
import { useState, useCallback } from 'react';
import { generateTypeSpecificResponse } from "@/services/responseGenerator";
import { addEmoticons } from "@/utils/textUtils";

export interface SuggestionItem {
  id: string;
  text: string;
  type: 'genuine' | 'nsfw' | 'rizz';
  language: 'english' | 'pidgin';
  copied: boolean;
}

interface UseSuggestionGeneratorProps {
  extractedText: string;
  initialSuggestions?: string[];
}

export function useSuggestionGenerator({ 
  extractedText, 
  initialSuggestions = [] 
}: UseSuggestionGeneratorProps) {
  const [suggestionsList, setSuggestionsList] = useState<SuggestionItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [usedResponses, setUsedResponses] = useState<Record<'genuine' | 'nsfw' | 'rizz', string[]>>({
    genuine: [],
    nsfw: [],
    rizz: []
  });

  // Format initial suggestion when provided
  const initializeSuggestions = useCallback((
    suggestion: string,
    type: 'genuine' | 'nsfw' | 'rizz' = 'genuine',
    language: 'english' | 'pidgin' = 'english'
  ) => {
    if (!suggestion) return;
    
    const formattedSuggestion = addEmoticons(suggestion, type, language);
    
    setSuggestionsList([{
      id: Date.now().toString(),
      text: formattedSuggestion,
      type,
      language,
      copied: false
    }]);
    
    setUsedResponses(prev => ({
      ...prev,
      [type]: [...prev[type], suggestion]
    }));
  }, []);

  // Handle copy functionality
  const handleCopy = useCallback((id: string) => {
    const suggestionToCopy = suggestionsList.find(item => item.id === id);
    if (!suggestionToCopy) return;

    navigator.clipboard.writeText(suggestionToCopy.text)
      .then(() => {
        setSuggestionsList(prev => prev.map(item => 
          item.id === id ? { ...item, copied: true } : item
        ));
        
        // Reset copied state after 2 seconds
        setTimeout(() => {
          setSuggestionsList(prev => prev.map(item => 
            item.id === id ? { ...item, copied: false } : item
          ));
        }, 2000);
      })
      .catch(err => {
        console.error("Copy failed:", err);
      });
  }, [suggestionsList]);

  // Generate new suggestion
  const generateSuggestion = useCallback(async (
    type: 'genuine' | 'nsfw' | 'rizz',
    language: 'english' | 'pidgin'
  ) => {
    setIsGenerating(true);
    
    try {
      const newResponse = await generateTypeSpecificResponse(
        extractedText, 
        type, 
        usedResponses[type], 
        language
      );
      
      const formattedResponse = addEmoticons(newResponse, type, language);
      
      setSuggestionsList(prev => [{
        id: Date.now().toString(),
        text: formattedResponse,
        type,
        language,
        copied: false
      }, ...prev]);
      
      setUsedResponses(prev => ({
        ...prev,
        [type]: [...prev[type], newResponse]
      }));
    } catch (error) {
      console.error('Error generating suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [extractedText, usedResponses]);

  return {
    suggestionsList,
    isGenerating,
    initializeSuggestions,
    generateSuggestion,
    handleCopy
  };
}
