
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ArrowLeft, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import "./RizzLinesPage.css";

const RizzLinesPage = () => {
  const navigate = useNavigate();
  const [currentRizzIndex, setCurrentRizzIndex] = useState(0);
  const [rizzHistory, setRizzHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * rizzLines.length);
    setCurrentRizzIndex(randomIndex);
    setRizzHistory([rizzLines[randomIndex].text]);
  }, []);

  const getNewRizzLine = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * rizzLines.length);
    } while (newIndex === currentRizzIndex && rizzLines.length > 1);
    
    setCurrentRizzIndex(newIndex);
    setRizzHistory(prev => [...prev, rizzLines[newIndex].text]);
    setHistoryIndex(-1);
  };

  const cycleHistory = () => {
    if (rizzHistory.length <= 1) return;
    
    let newIndex;
    if (historyIndex === -1) {
      newIndex = 1;
    } else {
      newIndex = (historyIndex + 1) % rizzHistory.length;
    }
    
    setHistoryIndex(newIndex);
    
    const historyText = rizzHistory[rizzHistory.length - 1 - newIndex];
    const matchingRizzLine = rizzLines.find(line => line.text === historyText);
    if (matchingRizzLine) {
      const matchingIndex = rizzLines.indexOf(matchingRizzLine);
      setCurrentRizzIndex(matchingIndex);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard!", {
          position: "top-center",
          className: "rizz-toast",
          duration: 2000
        });
      },
      () => {
        toast.error("Failed to copy", {
          position: "top-center",
          className: "rizz-toast",
          duration: 2000
        });
      }
    );
  };

  const currentRizz = rizzLines[currentRizzIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D3E4FD] via-[#E5DEFF] to-[#FFDEE2] flex flex-col">
      <header className="flex justify-between items-center p-6">
        <button 
          className="p-3 hover:bg-black/10 rounded-full" 
          onClick={() => navigate(-1)}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
            alt="NaijaRizz Logo" 
            className="h-20"
          />
        </div>
        
        <div className="w-10" />
      </header>

      <main className="flex-1 flex flex-col px-6 items-center justify-center">
        <div className="relative max-w-md w-full mb-6 animate-fade-in">
          <Card className="rizz-card bg-black text-white rounded-3xl p-6 shadow-lg">
            <p className="text-xl mb-6">"{currentRizz.text}"</p>
            <div className="flex justify-between items-center">
              <span className="text-yellow-300 text-sm">{currentRizz.category}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="copy-button text-white"
                onClick={() => copyToClipboard(currentRizz.text)}
              >
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <footer className="px-6 py-8">
        <div className="flex items-center justify-center gap-4">
          <Button
            className="w-14 h-14 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
            onClick={cycleHistory}
            disabled={rizzHistory.length <= 1}
          >
            <RefreshCcw className="h-6 w-6" />
          </Button>
          
          <Button
            className="flex-1 py-6 rounded-full bg-black text-white hover:bg-gray-800 text-lg w-3/4"
            onClick={getNewRizzLine}
          >
            Another Rizz
          </Button>
        </div>
      </footer>
    </div>
  );
};

const rizzLines = [
  {
    text: "Your smile is brighter than all of Lagos at night.",
    category: "Smooth",
    likes: 345
  },
  {
    text: "Are you a Nigerian jollof? Because you're looking absolutely irresistible.",
    category: "Clean",
    likes: 289
  },
  {
    text: "Dem say true love no dey but I never see person wey fine pass you.",
    category: "Nigerian",
    likes: 421
  },
  {
    text: "I dey find who go show me road, but na your eyes be the map wey I need.",
    category: "Nigerian",
    likes: 256
  },
  {
    text: "They should add your picture to the wonders of Nigeria.",
    category: "Romantic",
    likes: 242
  },
  {
    text: "You must be the future of Nigeria because I want to invest everything in you.",
    category: "Clean",
    likes: 311
  },
  {
    text: "If I be artist, you go be my inspiration. Every line of code I write dey remind me of you.",
    category: "Romantic",
    likes: 386
  },
  {
    text: "E be like say my network just dey always strong whenever you dey online.",
    category: "Nigerian",
    likes: 275
  },
  {
    text: "Your beauty go make person delete all dating apps.",
    category: "Smooth",
    likes: 318
  },
  {
    text: "Sunlight no fit compare to the way your energy dey light up room.",
    category: "Clean",
    likes: 267
  }
];

export default RizzLinesPage;
