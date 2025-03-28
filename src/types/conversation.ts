
export interface ConversationMessage {
  id: string;
  text: string;
  type: 'their' | 'my';
  timestamp: number;
}

export type ConversationHistory = ConversationMessage[];
