import React from 'react';
import { MessageSquare } from "lucide-react";
import type { ConversationHistory } from "@/types/conversation";

interface ChatMessagesProps {
  theirMessage: string;
  myMessage?: string;
  source: 'screenshot' | 'manual' | 'unknown';
  screenshotUrl?: string;
  scanningComplete: boolean;
  scanPosition: number;
  conversationHistory?: ConversationHistory;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  theirMessage,
  myMessage,
  source,
  screenshotUrl,
  scanningComplete,
  scanPosition,
  conversationHistory = []
}) => {
  if (source === 'manual') {
    if (conversationHistory.length > 0) {
      return (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white shadow-md border border-gray-100">
            <div className="flex items-start gap-3">
              <MessageSquare size={24} className="text-blue-500 mt-1 shrink-0" />
              <div className="space-y-4 w-full">
                {conversationHistory.map((message) => (
                  <div key={message.id} className="space-y-1">
                    <div 
                      className={`p-6 ${
                        message.type === 'their' 
                          ? 'bg-white rounded-[32px] text-black mx-auto' 
                          : 'bg-white rounded-[32px] text-black ml-auto'
                      } font-medium shadow-sm`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                
                {(theirMessage || myMessage) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {theirMessage && (
                      <div className="p-6 bg-white rounded-[32px] text-black font-medium shadow-sm">
                        {theirMessage}
                      </div>
                    )}
                    
                    {myMessage && (
                      <div className="p-6 bg-white rounded-[32px] text-black font-medium ml-auto shadow-sm mt-4">
                        {myMessage}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="p-6 rounded-3xl bg-white shadow-md border border-gray-100">
          <div className="flex items-start gap-3">
            <MessageSquare size={24} className="text-blue-500 mt-1 shrink-0" />
            <div className="space-y-1 w-full">
              {theirMessage && (
                <div className="p-6 bg-white rounded-[32px] text-black font-medium shadow-sm">
                  {theirMessage}
                </div>
              )}
              
              {myMessage && (
                <div className="p-6 bg-white rounded-[32px] text-black font-medium ml-auto shadow-sm mt-4">
                  {myMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {screenshotUrl ? (
        <div className="relative">
          <img 
            src={screenshotUrl} 
            alt="Chat Screenshot" 
            className="w-full"
          />
          
          {!scanningComplete && (
            <div 
              className="absolute left-0 w-full h-1 bg-[#FFFF00] z-10 opacity-70"
              style={{ 
                top: `${scanPosition}%`,
                boxShadow: '0 0 8px 2px rgba(255, 255, 0, 0.5)'
              }}
            />
          )}
        </div>
      ) : (
        <div className="p-4 h-64 flex items-center justify-center text-white">
          No screenshot available
        </div>
      )}
    </>
  );
};

export default ChatMessages;
