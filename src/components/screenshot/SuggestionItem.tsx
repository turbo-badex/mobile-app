
import React, { memo } from 'react';
import TextContent from './TextContent';
import CopiedIndicator from './CopiedIndicator';
import { extractEmojis } from '@/utils/textUtils';

interface SuggestionItemProps {
  id: string;
  text: string;
  copied: boolean;
  isFirst: boolean;
  onCopy: (id: string) => void;
}

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  id,
  text,
  copied,
  isFirst,
  onCopy
}) => {
  // Extract emojis from start and end
  const { startEmoji, endEmoji, mainText } = extractEmojis(text);

  return (
    <div 
      onClick={() => onCopy(id)}
      className={`p-5 bg-white rounded-3xl ${isFirst ? 'rounded-tl-sm' : 'rounded-tl-3xl'} relative animate-fade-in shadow cursor-pointer`}
    >
      <TextContent 
        mainText={mainText}
        startEmoji={startEmoji}
        endEmoji={endEmoji}
      />
      
      <CopiedIndicator isVisible={copied} />
    </div>
  );
};

export default memo(SuggestionItem);
