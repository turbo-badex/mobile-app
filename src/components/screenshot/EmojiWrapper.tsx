
import React from 'react';

interface EmojiWrapperProps {
  emoji: string;
  position: 'start' | 'end';
}

const EmojiWrapper: React.FC<EmojiWrapperProps> = ({ emoji, position }) => {
  if (!emoji) return null;
  
  return (
    <span className={`${position === 'end' ? 'ml-1' : 'mr-1'} inline-block`}>
      {emoji}
    </span>
  );
};

export default EmojiWrapper;
