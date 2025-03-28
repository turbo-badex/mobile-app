
/**
 * Extract emojis from text
 * @param text Text to parse for emojis
 * @returns Object containing start emoji, end emoji, and main text content
 */
export const extractEmojis = (text: string) => {
  const startEmoji = text.match(/^([\p{Emoji}]+)/u)?.[0] || '';
  const endEmoji = text.match(/\s([\p{Emoji}]+)$/u)?.[1] || '';
  const mainText = text.replace(/^[\p{Emoji}]+\s|\s[\p{Emoji}]+$/gu, '');
  
  return {
    startEmoji,
    endEmoji,
    mainText
  };
};
