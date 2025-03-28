
/**
 * DeepSeek API service for generating Nigerian-style flirty responses
 * Provides a cost-effective alternative to OpenAI for high-volume usage
 */

// DeepSeek API models
export enum DeepSeekModel {
  LITE = 'deepseek-lite',
  CHAT = 'deepseek-chat',
}

// DeepSeek API configuration interface
export interface DeepSeekConfig {
  model: DeepSeekModel;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

// Message format for DeepSeek API
interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Response format from DeepSeek API
interface DeepSeekResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generates a response using the DeepSeek API
 */
export const generateDeepSeekResponse = async (
  messages: DeepSeekMessage[],
  config: DeepSeekConfig
): Promise<DeepSeekResponse> => {
  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages,
        temperature: config.temperature || 0.9,
        max_tokens: config.maxTokens || 150,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DeepSeek API Error: ${error.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  } catch (error) {
    console.error('DeepSeek API error:', error);
    throw error;
  }
};
