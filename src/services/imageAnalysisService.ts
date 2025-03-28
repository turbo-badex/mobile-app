
import { extractTextFromImage } from './ocrService';
import { generateResponses, generateTypeSpecificResponse } from './responseGenerator';
import { toast } from 'sonner';
import { determineConversationType, createStandardContext } from '../utils/contextUtils';

interface AnalysisResult {
  text: string;
  suggestions: string[];
  isLoading: boolean;
  error?: string;
  context?: {
    source: 'screenshot';
    conversationType?: string;
    theirMessage?: string;
  };
}

/**
 * Analyzes an image and generates responses based on the content
 */
export const analyzeScreenshot = async (file: File, language: 'english' | 'pidgin' = 'english'): Promise<AnalysisResult> => {
  try {
    // Track when extraction starts for metrics
    const extractionStartTime = Date.now();
    
    // Extract text from the image
    let extractedText: string;
    try {
      extractedText = await extractTextFromImage(file);
      console.log(`OCR completed in ${Date.now() - extractionStartTime}ms`);
    } catch (ocrError) {
      console.error('OCR extraction error:', ocrError);
      toast.error('Image text extraction failed. Trying another method...');
      
      // Attempt fallback OCR method or notify user of the issue
      return {
        text: '',
        suggestions: language === 'english' ? [
          "Can't read the image. Try a clearer photo?",
          "OCR failed. Maybe try manual text entry?",
          "Image text extraction failed. Try again?"
        ] : [
          "I no fit read this image. Try better one?",
          "OCR no work. Try type the text instead?",
          "Picture too blur. Try another one?"
        ],
        isLoading: false,
        error: 'OCR extraction failed. Try a clearer image or enter text manually.',
        context: {
          source: 'screenshot'
        }
      };
    }
    
    if (!extractedText || extractedText.trim().length === 0) {
      return {
        text: '',
        suggestions: language === 'english' ? [
          "Can't read anything. Try a clearer image?",
          "No readable text found. Try another?",
          "Can't see any text. Upload a better image?"
        ] : [
          "I no fit read this one. Send better picture.",
          "Picture no clear. Try upload am again.",
          "Nothing wey I fit respond to. Send better one."
        ],
        isLoading: false,
        error: 'No text extracted. Try a clearer image.',
        context: {
          source: 'screenshot'
        }
      };
    }
    
    // Create standardized context
    const standardContext = createStandardContext(extractedText, 'screenshot');
    console.log(`Conversation type detected: ${standardContext.conversationType}`);
    console.log(`Generating contextual responses for extracted text`);
    
    // Generate responses with improved error handling and recovery
    let suggestions: string[] = [];
    
    try {
      // Generate contextual responses based on the extracted text
      console.log(`Using extracted text for response generation: ${extractedText}\n`);
      
      suggestions = await generateResponses(extractedText, language, standardContext);
      
    } catch (generationError) {
      console.error('Response generation error:', generationError);
      
      // Provide helpful fallback responses even when everything fails
      suggestions = language === 'english' ? [
        "I see what you mean. Tell me more?",
        "That's interesting! What else is going on?",
        "I'd love to keep this conversation going!"
      ] : [
        "I see wetin you mean. Tell me more?",
        "Dat one interesting! Wetin else dey happen?",
        "I wan continue dis convo with you!"
      ];
      
      // Notify the user about the issue
      toast.error(language === 'english' 
        ? 'Having some trouble generating responses. Try again?' 
        : 'Problem dey with response. Try again?');
    }
    
    return {
      text: extractedText,
      suggestions,
      isLoading: false,
      context: {
        source: 'screenshot',
        conversationType: standardContext.conversationType,
        theirMessage: extractedText
      }
    };
  } catch (error) {
    console.error('Screenshot analysis error:', error);
    
    return {
      text: '',
      suggestions: language === 'english' ? [
        "Something went wrong. Try again?",
        "Error during analysis. Try again?",
        "Technical issue. Retry upload?"
      ] : [
        "Wahala dey! Try again?",
        "Error don happen. Try again?",
        "System crash. Retry?"
      ],
      isLoading: false,
      error: 'Failed to analyze screenshot. Please try again.',
      context: {
        source: 'screenshot'
      }
    };
  }
};
