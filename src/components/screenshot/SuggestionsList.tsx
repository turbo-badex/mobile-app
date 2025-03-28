
import React from 'react';
import SuggestionItem from './SuggestionItem';

interface SuggestionItem {
  id: string;
  text: string;
  type: 'genuine' | 'nsfw' | 'rizz';
  language: 'english' | 'pidgin';
  copied: boolean;
}

interface SuggestionsListProps {
  suggestions: SuggestionItem[];
  onCopy: (id: string) => void;
  isLoading: boolean;
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({ 
  suggestions, 
  onCopy,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse text-gray-800">Generating responses...</div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mb-20">
      {suggestions.map((suggestion, index) => (
        <SuggestionItem
          key={suggestion.id}
          id={suggestion.id}
          text={suggestion.text}
          copied={suggestion.copied}
          isFirst={index === 0}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
};

export default React.memo(SuggestionsList);
