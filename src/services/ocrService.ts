
import { createWorker } from 'tesseract.js';

/**
 * Extracts text from an image using OCR
 */
export const extractTextFromImage = async (imageFile: File): Promise<string> => {
  try {
    const worker = await createWorker('eng');
    
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Recognize text in the image using the URL
    const { data } = await worker.recognize(imageUrl);
    
    // Revoke the object URL to free up memory
    URL.revokeObjectURL(imageUrl);
    
    // Terminate worker when done
    await worker.terminate();
    
    return data.text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
};
