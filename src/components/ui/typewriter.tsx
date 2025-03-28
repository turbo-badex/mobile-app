
import React, { useState, useEffect, useCallback } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speed = 48, // 20% slower than original 40
  className = "",
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  // Typing animation with optimized rendering
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      // Add a small delay before calling onComplete to ensure stability
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 100);
      
      return () => clearTimeout(completeTimer);
    }
  }, [currentIndex, text, speed, isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="cursor animate-pulse">|</span>
      )}
    </span>
  );
};

export default React.memo(Typewriter);
