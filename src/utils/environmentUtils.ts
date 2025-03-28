
/**
 * Utility functions for validating environment variables
 */

/**
 * Validates that required Supabase environment variables are set
 * @returns An object with validation results
 */
export const validateSupabaseEnv = (): { 
  isValid: boolean; 
  missingVars: string[]; 
  message: string 
} => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const missingVars: string[] = [];
  
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  const isValid = missingVars.length === 0;
  
  let message = isValid 
    ? "Supabase environment variables properly configured."
    : `Missing Supabase environment variables: ${missingVars.join(', ')}`;
    
  return {
    isValid,
    missingVars,
    message
  };
};

/**
 * Validates that required API key environment variables are set
 * @returns An object with validation results
 */
export const validateApiKeyEnv = (): { 
  isValid: boolean; 
  missingVars: string[]; 
  message: string 
} => {
  const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  
  const missingVars: string[] = [];
  
  // Check if at least one API key is available
  if (!openaiApiKey && !deepseekApiKey) {
    missingVars.push('VITE_OPENAI_API_KEY or VITE_DEEPSEEK_API_KEY');
  }
  
  const isValid = missingVars.length === 0;
  
  let message = isValid 
    ? "API key environment variables properly configured."
    : `Missing API key environment variables: ${missingVars.join(', ')}`;
    
  return {
    isValid,
    missingVars,
    message
  };
};

/**
 * Returns developer-friendly instruction for setting Supabase environment variables
 */
export const getSupabaseSetupInstructions = (): string => {
  return `
To set up Supabase properly, you need to:

1. Create a .env file in your project root (if it doesn't exist)
2. Add the following variables:
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Restart your development server

You can find these values in your Supabase project settings > API section.
`;
};

/**
 * Returns developer-friendly instruction for setting API keys
 */
export const getApiKeySetupInstructions = (): string => {
  return `
To set up API keys properly, you need to:

1. Add at least one of the following variables to your .env file:
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_DEEPSEEK_API_KEY=your_deepseek_api_key
2. Deploy these keys as secrets in your Supabase Edge Functions environment
3. Restart your development server

You can obtain these keys from the respective API provider websites.
`;
};
