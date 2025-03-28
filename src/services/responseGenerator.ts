import { responseTemplates, responseCategories, conversationFillers } from './nigerianContent';
import { supabase } from "@/integrations/supabase/client";
import { MessageContext, determineConversationType, analyzeContext } from '../utils/contextUtils';

// Log initialization status for debugging
if (!supabase) {
  console.warn('⚠️ Supabase client initialization failed');
  console.warn('Make sure to set Supabase environment variables in your Lovable project settings');
} else {
  console.log('✅ Supabase client initialized successfully');
}

// Enhanced in-memory and localStorage cache for responses
interface CacheEntry {
  value: string;
  timestamp: number;
}

const CACHE_EXPIRY = 1000 * 60 * 30; // 30 minutes
const LOCAL_STORAGE_KEY = 'naijaRizz_responseCache';
const MAX_CACHE_ENTRIES = 100; // Prevent cache from growing too large

// In-memory cache
const responseCache: Record<string, CacheEntry> = {};

// Initialize cache from localStorage if available
try {
  const storedCache = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (storedCache) {
    const parsedCache = JSON.parse(storedCache);
    // Only load non-expired entries
    Object.entries(parsedCache).forEach(([key, entry]) => {
      if (Date.now() - (entry as CacheEntry).timestamp < CACHE_EXPIRY) {
        responseCache[key] = entry as CacheEntry;
      }
    });
    console.log(`📦 Loaded ${Object.keys(responseCache).length} cached responses from localStorage`);
  }
} catch (error) {
  console.warn('Failed to load cache from localStorage:', error);
}

/**
 * Gets a random item from an array that's different from previous items
 */
export const getRandomUniqueItem = <T>(array: T[], previousItems: T[] = []): T => {
  if (array.length === 0) return null as unknown as T;
  if (array.length === 1) return array[0];
  
  // Filter out previously used items if possible
  const availableItems = previousItems.length > 0 && previousItems.length < array.length
    ? array.filter(item => !previousItems.includes(item))
    : array;
  
  const randomIndex = Math.floor(Math.random() * availableItems.length);
  return availableItems[randomIndex];
};

/**
 * Adds natural variation to responses
 */
export const addNaturalVariation = (response: string): string => {
  const { prefixFillers, endingsFillers } = conversationFillers;
  
  // Apply prefix fillers (30% chance)
  if (Math.random() < 0.3) {
    const randomFiller = prefixFillers[Math.floor(Math.random() * prefixFillers.length)];
    response = randomFiller + response.charAt(0).toLowerCase() + response.slice(1);
  }
  
  // Apply ending fillers (40% chance)
  if (Math.random() < 0.4) {
    const randomEnding = endingsFillers[Math.floor(Math.random() * endingsFillers.length)];
    response = response + randomEnding;
  }
  
  return response;
};

/**
 * Generates a better cache key for API responses with text simplification
 * and improved hash function
 */
const generateCacheKey = (
  text: string,
  type: 'genuine' | 'nsfw' | 'rizz',
  language: 'english' | 'pidgin',
  context?: MessageContext
): string => {
  // Create a cache key that includes the full text content for more accurate caching
  // This ensures different images produce different responses
  
  // Normalize text but keep more of its unique characteristics
  const normalizedText = text.toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');  // Normalize whitespace only
  
  // Include more context in the hash for better uniqueness
  const contextSignature = context?.conversationType || 'unknown';
  const sourceSignature = context?.source || 'unknown';
  
  // More robust hash function (FNV-1a hash)
  let hash = 2166136261; // FNV offset basis
  const stringToHash = `${normalizedText}|${contextSignature}|${sourceSignature}`;
  
  for (let i = 0; i < stringToHash.length; i++) {
    hash ^= stringToHash.charCodeAt(i);
    hash *= 16777619; // FNV prime
  }
  
  // Use absolute value to avoid negative numbers
  hash = Math.abs(hash);
  
  console.log(`Generated cache key: ${type}_${language}_${contextSignature}_${hash} for text: ${text.substring(0, 30)}...`);
  
  return `${type}_${language}_${contextSignature}_${hash}`;
};

/**
 * Gets a cached response if available, otherwise returns null
 */
const getCachedResponse = (
  cacheKey: string,
): string | null => {
  // Try exact match first (fastest)
  const cacheEntry = responseCache[cacheKey];
  
  if (cacheEntry) {
    // Check if cache entry has expired
    if (Date.now() - cacheEntry.timestamp > CACHE_EXPIRY) {
      delete responseCache[cacheKey];
      // Also remove from localStorage
      persistCacheToLocalStorage();
      return null;
    }
    
    console.log('🔄 Using exact cached response for:', cacheKey);
    return cacheEntry.value;
  }
  
  return null;
};

/**
 * Persists the cache to localStorage
 */
const persistCacheToLocalStorage = (): void => {
  try {
    // Enforce cache size limit
    const cacheEntries = Object.entries(responseCache);
    if (cacheEntries.length > MAX_CACHE_ENTRIES) {
      // Sort by timestamp (oldest first) and keep only the newest MAX_CACHE_ENTRIES
      cacheEntries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const entriesToKeep = cacheEntries.slice(-MAX_CACHE_ENTRIES);
      
      // Reset the cache with only the entries to keep
      Object.keys(responseCache).forEach(key => delete responseCache[key]);
      entriesToKeep.forEach(([key, value]) => {
        responseCache[key] = value;
      });
    }
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responseCache));
    console.log(`💾 Saved ${Object.keys(responseCache).length} cached responses to localStorage`);
  } catch (error) {
    console.warn('Failed to persist cache to localStorage:', error);
  }
};

/**
 * Caches a response and persists to localStorage
 */
const cacheResponse = (
  cacheKey: string,
  response: string
): void => {
  responseCache[cacheKey] = {
    value: response,
    timestamp: Date.now()
  };
  console.log('💾 Cached response for:', cacheKey);
  
  // Persist to localStorage
  persistCacheToLocalStorage();
};

/**
 * Truncates response to optimal length - enhanced for more aggressive trimming
 */
const truncateResponse = (response: string, maxLength: number = 100): string => {
  if (response.length <= maxLength) return response;
  
  // Find a good breaking point (end of sentence or punctuation)
  const breakPoints = [...response.matchAll(/[.!?]\s/g)].map(m => m.index);
  const lastGoodBreak = breakPoints.reverse().find(point => point && point < maxLength);
  
  if (lastGoodBreak) {
    return response.substring(0, lastGoodBreak + 2); // +2 to include the punctuation and space
  }
  
  // If no good breaking point, break at a word boundary
  const truncated = response.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? 
    truncated.substring(0, lastSpace) + '...' : 
    truncated + '...';
};

/**
 * Post-processes AI responses to make them more concise
 */
const postProcessResponse = (response: string): string => {
  // Remove common filler phrases
  let processed = response
    .replace(/^(I think that|I would say|I believe|In my opinion|Well,|You know what,|Let me tell you,|To be honest,|I must say,)\s+/i, '')
    .replace(/\s+(you know|right|I guess|I think|I suppose|if you know what I mean)\.?$/i, '.');
  
  // Remove redundant punctuation
  processed = processed
    .replace(/\.{2,}/g, '...')
    .replace(/\!{2,}/g, '!')
    .replace(/\?{2,}/g, '?');
  
  return processed;
};

/**
 * Clears the response cache (useful for testing)
 */
export const clearResponseCache = (): void => {
  Object.keys(responseCache).forEach(key => delete responseCache[key]);
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log('🧹 Response cache cleared');
  } catch (error) {
    console.warn('Failed to clear cache from localStorage:', error);
  }
};

/**
 * Calls the Supabase Edge Function to get AI-enhanced responses from OpenAI
 * This is optimized for speed compared to the DeepSeek version
 */
export const getAIEnhancedResponse = async (
  text: string,
  type: 'genuine' | 'nsfw' | 'rizz',
  previousResponses: string[] = [],
  language: 'english' | 'pidgin' = 'pidgin',
  messageContext?: MessageContext
): Promise<string> => {
  try {
    // Check if Supabase client is available
    if (!supabase) {
      console.warn('Supabase client not initialized - falling back to template-based responses');
      
      // Return a helpful message about missing configuration
      return language === 'english' ? 
        "AI service needs Supabase configuration. Click on Supabase in the top menu to connect your project." :
        "We need Supabase setup before AI go work. Click Supabase for top menu make you connect your project.";
    }

    // Generate a cache key based on request parameters
    const cacheKey = generateCacheKey(
      messageContext?.theirMessage || text, 
      type, 
      language, 
      messageContext
    );
    
    // Check cache before making API call
    const cachedResponse = getCachedResponse(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    console.log(`Generating ${language} response using OpenAI with enhanced performance`);

    // Ensure we're passing the most contextually relevant text
    const textToUse = messageContext?.theirMessage || text;

    // Track start time for performance monitoring
    const startTime = performance.now();

    // Call the new OpenAI Edge Function
    const { data, error } = await supabase.functions.invoke('generate-openai-response', {
      body: { 
        text: textToUse, 
        type, 
        previousResponses,
        language,
        messageContext: {
          conversationType: messageContext?.conversationType || 'unknown',
          extractedFrom: messageContext?.source === 'screenshot' ? 'screenshot' : 'manual',
          theirMessage: messageContext?.theirMessage || textToUse,
          myMessage: messageContext?.myMessage || '',
          focusWords: messageContext?.focusWords || ''
        }
      }
    });

    // Calculate total client-side processing time
    const totalTime = performance.now() - startTime;
    console.log(`Total response time: ${totalTime.toFixed(2)}ms`);

    if (error) {
      console.error('Error calling AI function:', error);
      
      // Generate template-based fallback responses
      return language === 'english' ? 
        "I'd love to respond, but I'm having trouble. Try again?" :
        "I wan respond but system dey act up. Try again?";
    }

    // If AI generation was successful, return the AI response
    if (data?.aiResponse) {
      console.log('OpenAI response generated successfully', {
        modelUsed: data.modelUsed,
        provider: data.provider,
        language: data.language,
        processingTime: data.processingTime,
        promptTokens: data.promptTokens,
        completionTokens: data.completionTokens
      });
      
      // If there was an error but we still got a fallback response
      if (data.error) {
        console.warn('Using fallback response because of API error:', data.error);
      }
      
      // Minimal post-processing for speed
      const processedResponse = postProcessResponse(data.aiResponse);
      
      // Cache the response for future use
      cacheResponse(cacheKey, processedResponse);
      
      return processedResponse;
    }

    return language === 'english' 
      ? "I'm having trouble right now. Please try again."
      : "I dey experience small wahala. Try again.";
  } catch (error) {
    console.error('Error in AI-enhanced response generation:', error);
    return language === 'english'
      ? `I'm having trouble. Please try again.`
      : `I no fit generate response. Try again.`;
  }
};

/**
 * Generates flirty responses based on text, type, and language
 */
export const generateTypeSpecificResponse = async (
  text: string, 
  type: 'genuine' | 'nsfw' | 'rizz', 
  previousResponses: string[] = [],
  language: 'english' | 'pidgin' = 'pidgin',
  messageContext?: MessageContext
): Promise<string> => {
  try {
    return await getAIEnhancedResponse(text, type, previousResponses, language, messageContext);
  } catch (error) {
    console.error('AI response error:', error);
    return language === 'english' ? 
      "Something went wrong. Try again?" : 
      "Wahala happen. Try again?";
  }
};

/**
 * Generates all flirty responses in parallel for better performance
 */
export const generateResponses = async (
  text: string,
  language: 'english' | 'pidgin' = 'pidgin',
  context?: MessageContext
): Promise<string[]> => {
  if (!text || text.trim().length < 3) {
    if (language === 'english') {
      return [
        "Can't read this. Send a clearer picture?",
        "Image not clear enough. Try again?",
        "Nothing to respond to. Send something better?"
      ];
    }
    
    return [
      "I no fit read this. Send better picture.",
      "Picture no clear. Try again.",
      "Nothing to respond to. Send better one."
    ];
  }
  
  // Ensure we use context.theirMessage when available
  const textToUse = context?.theirMessage || text;
  console.log(`Using text for response generation: ${textToUse.substring(0, 50)}${textToUse.length > 50 ? '...' : ''}`);
  
  // Generate different types of responses in parallel for better performance
  const [genuineResponse, nsfwResponse, rizzResponse] = await Promise.all([
    generateTypeSpecificResponse(textToUse, 'genuine', [], language, context),
    generateTypeSpecificResponse(textToUse, 'nsfw', [], language, context),
    generateTypeSpecificResponse(textToUse, 'rizz', [], language, context)
  ]);
  
  return [
    genuineResponse,
    nsfwResponse,
    rizzResponse
  ];
};
