import { useState, useEffect } from "react";
import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceCommandModal({ isOpen, onClose }: VoiceCommandModalProps) {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const {
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  const processCommandMutation = useMutation({
    mutationFn: async (command: string) => {
      const response = await apiRequest("POST", "/api/voice-command", { command });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Voice command processed",
        description: data.response,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Command not recognized",
        description: "Please try rephrasing your command.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (isOpen && isSupported) {
      resetTranscript();
      startListening();
      setIsListening(true);
    } else {
      stopListening();
      setIsListening(false);
    }
  }, [isOpen, isSupported, startListening, stopListening, resetTranscript]);

  useEffect(() => {
    if (transcript && transcript.length > 10) {
      // Process command when we have enough text
      processCommandMutation.mutate(transcript);
      stopListening();
      setIsListening(false);
    }
  }, [transcript, processCommandMutation, stopListening]);

  const handleStopListening = () => {
    stopListening();
    setIsListening(false);
    onClose();
  };

  if (!isSupported) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <h3 className="text-xl font-semibold mb-2">Voice Commands Not Supported</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Your browser doesn't support speech recognition. Please use a modern browser like Chrome or Edge.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-testid="voice-modal" className="max-w-md">
        <div className="text-center py-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isListening ? 'bg-accent animate-pulse' : 'bg-slate-300'
          }`}>
            <Mic className="text-white text-2xl" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {isListening ? "Listening..." : "Voice Commands"}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {isListening 
              ? 'Try saying: "Summarize this for tomorrow\'s test" or "Create flashcards from this document"'
              : "Click to start voice recognition"
            }
          </p>

          {transcript && (
            <div className="mb-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
              <p data-testid="text-transcript" className="text-sm">{transcript}</p>
            </div>
          )}
          
          {/* Waveform Animation */}
          {isListening && (
            <div className="flex items-center justify-center space-x-1 mb-6">
              {[0, 150, 300, 450, 600].map((delay, index) => (
                <div 
                  key={index}
                  className="w-1 bg-accent rounded animate-bounce"
                  style={{ 
                    height: `${Math.random() * 20 + 20}px`,
                    animationDelay: `${delay}ms`,
                    animationDuration: '1s'
                  }}
                />
              ))}
            </div>
          )}
          
          <Button
            data-testid="button-stop-listening"
            onClick={handleStopListening}
            variant={isListening ? "destructive" : "default"}
            className="w-full"
          >
            {isListening ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
