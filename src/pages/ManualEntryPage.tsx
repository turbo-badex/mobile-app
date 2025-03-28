
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { generateResponses } from "@/services/responseGenerator";
import { MessageContext } from "@/utils/contextUtils";
import ScreenshotAnalysis from "@/components/ScreenshotAnalysis";
import MessageInput from "@/components/manual/MessageInput";
import ControlsSection from "@/components/manual/ControlsSection";
import { SuggestionType } from "@/components/screenshot/TypeSelector";
import { LanguageType } from "@/components/screenshot/LanguageSelector";
import { ConversationHistory, ConversationMessage } from "@/types/conversation";
import "./ManualEntryPage.css";

const ManualEntryPage = () => {
  const navigate = useNavigate();
  const [theirMessage, setTheirMessage] = useState("");
  const [myMessage, setMyMessage] = useState("");
  const [focusWords, setFocusWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedType, setSelectedType] = useState<SuggestionType>('genuine');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>('english');
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory>([]);

  // Load conversation history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('conversationHistory');
      if (savedHistory) {
        setConversationHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  }, []);

  // Save conversation history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('conversationHistory', JSON.stringify(conversationHistory));
    } catch (error) {
      console.error('Error saving conversation history:', error);
    }
  }, [conversationHistory]);

  const handleGenerateResponses = useCallback(async () => {
    if (!theirMessage.trim()) {
      toast.error("Input required", {
        description: "Please enter their message to generate responses.",
        position: "top-center",
        className: "manual-toast",
        duration: 2000
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const messageContext: MessageContext = {
        source: 'manual' as 'manual',
        conversationType: selectedType,
        theirMessage: theirMessage.trim(),
        myMessage: myMessage.trim(),
        focusWords: focusWords.trim()
      };
      
      // Add the current messages to conversation history
      const updatedHistory = [...conversationHistory];
      
      if (theirMessage.trim()) {
        updatedHistory.push({
          id: Date.now().toString(),
          text: theirMessage.trim(),
          type: 'their',
          timestamp: Date.now()
        });
      }
      
      if (myMessage.trim()) {
        updatedHistory.push({
          id: (Date.now() + 1).toString(),
          text: myMessage.trim(),
          type: 'my',
          timestamp: Date.now()
        });
      }
      
      setConversationHistory(updatedHistory);
      
      const messageToAnalyze = theirMessage;
      
      const responses = await generateResponses(messageToAnalyze, selectedLanguage, messageContext);
      setSuggestions(responses);
      setShowAnalysis(true);
      
      // Clear the input fields
      setTheirMessage("");
      setMyMessage("");
    } catch (error) {
      console.error('Error generating responses:', error);
      toast.error("Generation failed", {
        description: "Failed to generate responses. Please try again.",
        position: "top-center",
        className: "manual-toast", 
        duration: 2000
      });
    } finally {
      setIsGenerating(false);
    }
  }, [theirMessage, myMessage, focusWords, selectedType, selectedLanguage, conversationHistory]);

  const handleDismissAnalysis = useCallback(() => {
    setShowAnalysis(false);
  }, []);

  const handleContinueConversation = useCallback(() => {
    setShowAnalysis(false);
  }, []);

  // Display the last message from the conversation history if it exists
  const lastTheirMessage = conversationHistory.filter(msg => msg.type === 'their').pop()?.text || "";
  
  // If there's a conversation in progress and we're not showing analysis, display the previous message
  const displayPreviousMessage = conversationHistory.length > 0 && !showAnalysis;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#E5DEFF] to-[#D3E4FD] z-50 flex flex-col">
      <div className="flex justify-between items-center p-6">
        <button className="p-2" onClick={() => navigate(-1)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
            alt="NaijaRizz Logo" 
            className="h-[86.4px]"
          />
        </div>
        
        <div className="w-10" /> {/* Spacer to maintain header alignment */}
      </div>

      <div className="flex-1 overflow-auto px-4">
        <div className="space-y-6 max-w-2xl mx-auto py-6">
          {displayPreviousMessage && (
            <div className="p-6 rounded-[32px] bg-white shadow-md max-w-xl mx-auto mb-8 relative">
              <div className="text-black text-xl font-semibold">
                {lastTheirMessage}
              </div>
            </div>
          )}

          {!displayPreviousMessage && (
            <div className="bg-amber-100 p-4 rounded-xl flex items-start gap-3">
              <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={20} />
              <p className="text-amber-800 text-sm">
                Note: Please enter at least one message to get replies
              </p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4">
            <MessageInput
              label="Their Reply"
              value={theirMessage}
              onChange={setTheirMessage}
              placeholder="Enter their message here..."
              className="flex-1"
            />
            
            <MessageInput
              label="My Reply"
              value={myMessage}
              onChange={setMyMessage}
              placeholder="Enter your message here if any..."
              optional={true}
              className="flex-1"
            />
          </div>
          
          <MessageInput
            label="Give us a word or two to focus on"
            value={focusWords}
            onChange={setFocusWords}
            placeholder="e.g., dinner, coffee, weekend..."
            minHeight="60px"
            optional={true}
          />

          <ControlsSection 
            selectedType={selectedType}
            selectedLanguage={selectedLanguage}
            isGenerating={isGenerating}
            onTypeChange={setSelectedType}
            onLanguageChange={setSelectedLanguage}
            onGenerate={handleGenerateResponses}
            disabled={!theirMessage.trim()}
          />
        </div>
      </div>

      {showAnalysis && (
        <ScreenshotAnalysis
          extractedText={theirMessage}
          suggestions={suggestions}
          onDismiss={handleDismissAnalysis}
          source="manual"
          myMessage={myMessage}
          conversationHistory={conversationHistory}
          onContinue={handleContinueConversation}
        />
      )}
    </div>
  );
};

export default ManualEntryPage;
