
import { useRef, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, MessageSquare, Heart, Zap } from "lucide-react";
import { analyzeScreenshot } from "@/services/imageAnalysisService";
import ScreenshotAnalysis from "@/components/ScreenshotAnalysis";

const Index = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    extractedText: string;
    suggestions: string[];
  } | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined);
  const [processingTime, setProcessingTime] = useState<number | null>(null);
  const processingStartTime = useRef<number | null>(null);

  // Update processing time every 100ms
  useEffect(() => {
    let timerId: number;
    
    if (isAnalyzing && processingStartTime.current) {
      timerId = window.setInterval(() => {
        if (processingStartTime.current) {
          const delta = Math.floor((Date.now() - processingStartTime.current) / 100) / 10;
          setProcessingTime(delta);
        }
      }, 100);
    }
    
    return () => {
      if (timerId) window.clearInterval(timerId);
    };
  }, [isAnalyzing]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith('image/')) {
      return;
    }

    // Clear any previous analysis result first
    setAnalysisResult(null);
    
    const objectUrl = URL.createObjectURL(selectedFile);
    setScreenshotUrl(objectUrl);

    setIsAnalyzing(true);
    processingStartTime.current = Date.now();
    setProcessingTime(0);
    
    try {
      console.log(`Processing image: ${selectedFile.name} (${selectedFile.size} bytes)`);
      const result = await analyzeScreenshot(selectedFile);
      
      if (result.error) {
        console.error("Analysis error:", result.error);
        return;
      }
      
      console.log(`Analysis complete. Text length: ${result.text.length}, Suggestions: ${result.suggestions.length}`);
      console.log("Generated suggestions:", JSON.stringify(result.suggestions.map(s => s.substring(0, 20) + "..."), null, 2));
      
      // Capture total processing time
      const totalTime = (Date.now() - (processingStartTime.current || 0)) / 1000;
      console.log(`Total processing time: ${totalTime.toFixed(2)} seconds`);
      
      setAnalysisResult({
        extractedText: result.text,
        suggestions: result.suggestions,
      });
    } catch (error) {
      console.error("Error analyzing screenshot:", error);
    } finally {
      setIsAnalyzing(false);
      processingStartTime.current = null;
      setProcessingTime(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, []);

  const handleDismissAnalysis = useCallback(() => {
    setAnalysisResult(null);
    if (screenshotUrl) {
      URL.revokeObjectURL(screenshotUrl);
      setScreenshotUrl(undefined);
    }
  }, [screenshotUrl]);

  const handleNewUpload = useCallback(() => {
    // First dismiss the current analysis
    handleDismissAnalysis();
    // Then trigger the file input click
    fileInputRef.current?.click();
  }, [handleDismissAnalysis]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C2E9FB] to-[#FFCEF3] flex flex-col">
      <header className="flex justify-between items-center p-6">
        <button className="p-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
        
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/7dd7dae5-a3c6-4673-9485-8f5a7006305d.png" 
            alt="NaijaRizz Logo" 
            className="h-[86.4px]"
          />
        </div>
        
        <button 
          className="p-2"
          onClick={handleUploadClick}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*"
          capture="environment"
        />
      </header>

      <main className="flex-1 flex flex-col p-6">
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold mb-8">Upload a screenshot<br />of a chat or bio</h1>
          
          <div className="relative w-full max-w-md flex items-center justify-center flex-1">
            <img 
              src="/lovable-uploads/1b7cc83e-caa3-4459-81b6-542f23b06f95.png" 
              alt="Nigerian guy using phone" 
              className="w-full mx-auto animate-fade-in"
              style={{ maxHeight: "500px", objectFit: "contain", transform: "scale(2.2)" }}
            />
          </div>
        </div>
        
        <div className="w-full space-y-4 mt-auto">
          <Button 
            className={`w-full py-6 rounded-full bg-black hover:bg-gray-800 text-white text-lg relative overflow-hidden ${isAnalyzing ? 'animate-pulse' : ''}`}
            onClick={handleUploadClick}
            disabled={isAnalyzing}
          >
            {/* Glint/sweep effect */}
            <span className="absolute inset-0 overflow-hidden">
              <span className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-[#ffffff30] to-transparent transform -skew-x-12 animate-sweep"></span>
            </span>
            {isAnalyzing ? (
              <span className="flex items-center">
                <span className="mr-2">Analyzing</span>
                {processingTime !== null && (
                  <span className="text-sm opacity-80">({processingTime.toFixed(1)}s)</span>
                )}
              </span>
            ) : "Upload a Screenshot"}
          </Button>
          
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 py-5 rounded-full bg-white text-black border-none hover:bg-gray-100"
              onClick={() => navigate("/manual")}
            >
              Enter Manually
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 py-5 rounded-full bg-white text-black border-none hover:bg-gray-100"
              onClick={() => navigate("/rizz-lines")}
            >
              <Zap className="mr-2" />
              Rizz Lines
            </Button>
          </div>
        </div>
      </main>

      {analysisResult && (
        <ScreenshotAnalysis
          extractedText={analysisResult.extractedText}
          suggestions={analysisResult.suggestions}
          onDismiss={handleDismissAnalysis}
          screenshotUrl={screenshotUrl}
          onUploadNew={handleNewUpload}
        />
      )}
    </div>
  );
};

export default Index;
