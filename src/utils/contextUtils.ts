
/**
 * Utility functions for handling conversation context in a simplified manner
 */

export interface MessageContext {
  source?: 'screenshot' | 'manual' | 'unknown';
  conversationType?: string;
  theirMessage?: string;
  myMessage?: string;
  focusWords?: string;
}

/**
 * Determines conversation type based on text content
 */
export const determineConversationType = (text: string): string => {
  text = text.toLowerCase();
  
  if (text.length < 20 || /hey|hi|hello|how are you|sup|what'?s up|howdy|how far|wetin dey/i.test(text)) {
    return "greeting";
  }
  
  if (/beautiful|handsome|cute|fine|pretty|nice|like your|profile|picture|smile|eyes|face|look/i.test(text)) {
    return "compliment";
  }
  
  if (/meet|date|hang out|when are you free|coffee|dinner|drink|link up|see you|weekend|free time|available/i.test(text)) {
    return "asking_out";
  }
  
  if (/tease|joke|play|just kidding|lol|haha|kidding|funny|laugh|wahala|werey|form/i.test(text)) {
    return "teasing";
  }
  
  if (/question|ask|wondering|curious|tell me|want to know/i.test(text)) {
    return "question";
  }
  
  if (/sad|upset|sorry|hurt|pain|angry|mad|frustrat|disappoint/i.test(text)) {
    return "emotional";
  }
  
  return "continuation";
};

/**
 * Analyzes text context and extracts the most relevant part
 */
export const analyzeContext = (text: string): string => {
  // Simple context extraction
  const sentences = text.split(/[.!?]+/).filter(s => s.length > 10);
  
  if (sentences.length === 0) {
    return text.slice(0, 30);
  }
  
  // Find the most relevant sentence (has the most significant words)
  const mostRelevantSentence = sentences.reduce((best, current) => 
    (current.length > best.length) ? current : best, sentences[0]);
    
  return mostRelevantSentence.trim();
};

/**
 * Creates a standardized context object for response generation
 */
export const createStandardContext = (
  text: string,
  source: 'screenshot' | 'manual' | 'unknown' = 'unknown',
  additionalContext: Partial<MessageContext> = {}
): MessageContext => {
  return {
    source,
    conversationType: determineConversationType(text),
    theirMessage: text,
    ...additionalContext
  };
};

