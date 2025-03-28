
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Upload, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check if it's an image
    if (!selectedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Check if it's an image
    if (!droppedFile.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    setFile(droppedFile);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeScreenshot = async () => {
    if (!file) return;

    setIsUploading(true);

    try {
      // In a real implementation, you would upload the file to a server here
      // and get back the analysis results
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just show a success toast and pretend we processed it
      toast({
        title: "Screenshot analyzed!",
        description: "Your screenshot has been successfully processed."
      });
      
      // Navigate to results or next step
      // navigate("/results");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your screenshot. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Upload a Screenshot</h1>
        </div>

        <p className="text-gray-600">
          Upload a screenshot of a chat conversation or dating profile to get personalized response suggestions.
        </p>

        <div 
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
            preview ? 'border-gray-300 bg-white' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <div className="w-full flex flex-col items-center">
              <img 
                src={preview} 
                alt="Screenshot preview" 
                className="max-h-80 max-w-full object-contain rounded-lg mb-4" 
              />
              <p className="text-sm text-gray-500 mb-2">
                {file?.name} ({(file?.size ? file.size / 1024 / 1024 : 0).toFixed(2)} MB)
              </p>
              <Button 
                variant="outline" 
                onClick={handleBrowseClick}
                className="mt-2"
              >
                Choose Another File
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4 text-center">
                Drag and drop your screenshot here, or click to browse
              </p>
              <Button 
                onClick={handleBrowseClick}
                className="bg-black hover:bg-gray-800"
              >
                Browse Files
              </Button>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*"
          />
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            disabled={!file || isUploading} 
            className="w-64 py-5 rounded-full bg-black hover:bg-gray-800 text-white"
            onClick={analyzeScreenshot}
          >
            {isUploading ? "Processing..." : "Analyze Screenshot"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default UploadPage;
