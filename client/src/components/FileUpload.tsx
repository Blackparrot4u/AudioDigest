import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CloudUpload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function FileUpload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/files/upload", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      setIsProcessing(true);
      
      // Simulate processing progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setUploadProgress(0);
          toast({
            title: "File processed successfully!",
            description: "Your audio summary and flashcards are ready.",
          });
        }
      }, 500);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: "There was an error processing your file. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = useCallback((files: FileList) => {
    const file = files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'text/plain', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'audio/mpeg',
      'audio/wav'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a PDF, TXT, DOCX, JPG, PNG, MP3, or WAV file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("summaryLength", "standard");
    formData.append("language", "en");
    formData.append("voiceSpeed", "1.0");

    uploadMutation.mutate(formData);
  }, [uploadMutation, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.txt,.docx,.jpg,.jpeg,.png,.mp3,.wav";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        handleFileSelect(target.files);
      }
    };
    input.click();
  };

  return (
    <div>
      <div
        data-testid="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer bg-white dark:bg-slate-800 transition-colors duration-200 ${
          isDragOver
            ? "border-primary bg-blue-50 dark:bg-blue-900/20"
            : "border-slate-300 dark:border-slate-600 hover:border-primary"
        }`}
      >
        <div className="mb-4">
          <CloudUpload className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Drop files here or click to upload</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Supports PDF, TXT, DOCX, JPG, PNG, MP3, WAV
        </p>
        <Button className="bg-primary hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Choose Files
        </Button>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div 
          data-testid="processing-status"
          className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 dark:text-blue-200">Processing your file...</span>
            <span className="text-blue-600 dark:text-blue-400">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
    </div>
  );
}
