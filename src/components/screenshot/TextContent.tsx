
import React, { useState, useEffect, useCallback } from 'react';
import { Typewriter } from "@/components/ui/typewriter";
import EmojiWrapper from './EmojiWrapper';

interface TextContentProps {
  mainText: string;
  startEmoji: string;
  endEmoji: string;
}

const TextContent: React.FC<TextContentProps> = ({ mainText, startEmoji, endEmoji }) => {
  const [showTypewriter, setShowTypewriter] = useState(false);
  const [isTyped, setIsTyped] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure the suggestion item is ready
    const timer = setTimeout(() => {
      setShowTypewriter(true);
    }, 300); // Increased delay for better stability
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTypewriterComplete = useCallback(() => {
    setIsTyped(true);
  }, []);
  
  return (
    <p className="pr-8 text-black text-base font-bold">
      {startEmoji && <EmojiWrapper emoji={startEmoji} position="start" />}
      {showTypewriter ? (
        isTyped ? (
          mainText // Show static text after typing is complete
        ) : (
          <Typewriter 
            text={mainText} 
            speed={48}
            onComplete={handleTypewriterComplete}
          />
        )
      ) : (
        mainText
      )}
      {endEmoji && <EmojiWrapper emoji={endEmoji} position="end" />}
    </p>
  );
};

export default React.memo(TextContent);
