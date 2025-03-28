
export const extractEmojis = (text: string) => {
  // Function to check if a character is an emoji using regex
  const isEmoji = (str: string) => /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u.test(str);
  
  let startEmoji = '';
  let endEmoji = '';
  let mainText = text;
  
  // Extract starting emoji
  if (text.length > 0 && isEmoji(text[0])) {
    startEmoji = text[0];
    mainText = mainText.substring(1).trim();
  }
  
  // Extract ending emoji
  if (mainText.length > 0 && isEmoji(mainText[mainText.length - 1])) {
    endEmoji = mainText[mainText.length - 1];
    mainText = mainText.substring(0, mainText.length - 1).trim();
  }
  
  return { startEmoji, endEmoji, mainText };
};

export const addEmoticons = (text: string, type: 'genuine' | 'nsfw' | 'rizz', language: 'english' | 'pidgin'): string => {
  const emoticonsByType = {
    genuine: ['🥰', '✨', '💫', '💕'],
    nsfw: ['🔥', '💋', '👀', '😏'],
    rizz: ['💯', '💘', '⚡', '✌️']
  };
  
  const emoticons = emoticonsByType[type];
  const randomEmoticon1 = emoticons[Math.floor(Math.random() * emoticons.length)];
  const randomEmoticon2 = emoticons[Math.floor(Math.random() * emoticons.length)];
  
  return `${randomEmoticon1} ${text} ${randomEmoticon2}`;
};
