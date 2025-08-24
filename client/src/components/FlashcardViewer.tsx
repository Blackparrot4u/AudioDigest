import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, AlertTriangle, RotateCcw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { File, Flashcard } from "@shared/schema";

interface FlashcardViewerProps {
  file: File;
}

export default function FlashcardViewer({ file }: FlashcardViewerProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const queryClient = useQueryClient();

  const flashcards = file.flashcards || [];
  const currentCard = flashcards[currentCardIndex];

  const updateCardMutation = useMutation({
    mutationFn: async ({ difficulty }: { difficulty: "easy" | "hard" | "again" }) => {
      const updatedFlashcards = [...flashcards];
      updatedFlashcards[currentCardIndex] = { ...currentCard, difficulty };
      
      return apiRequest("PATCH", `/api/files/${file.id}`, {
        flashcards: updatedFlashcards
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
    },
  });

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const markDifficulty = (difficulty: "easy" | "hard" | "again") => {
    updateCardMutation.mutate({ difficulty });
    if (currentCardIndex < flashcards.length - 1) {
      nextCard();
    }
  };

  if (!flashcards.length) {
    return (
      <section>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Layers className="mr-2 text-primary" />
            Study Flashcards
          </h3>
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No flashcards available. Upload and process a file to generate study cards.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Layers className="mr-2 text-primary" />
          Study Flashcards
        </h3>
        
        {/* Flashcard */}
        <div className="relative perspective-1000 mb-4">
          <div 
            data-testid="flashcard"
            onClick={flipCard}
            className={`w-full h-64 rounded-xl p-6 flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-105 ${
              isFlipped ? 'bg-gradient-to-br from-secondary to-accent' : 'bg-gradient-to-br from-primary to-secondary'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            <div className="text-center text-white">
              {!isFlipped ? (
                <>
                  <h4 data-testid="text-question" className="text-xl font-semibold mb-2">
                    {currentCard.question}
                  </h4>
                  <p className="text-sm opacity-80">Click to reveal answer</p>
                </>
              ) : (
                <div style={{ transform: 'rotateY(180deg)' }}>
                  <p data-testid="text-answer" className="text-lg">
                    {currentCard.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Card Navigation */}
        <div className="flex items-center justify-between mb-4">
          <Button
            data-testid="button-previous-card"
            onClick={previousCard}
            disabled={currentCardIndex === 0}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
          
          <div className="text-center">
            <span data-testid="text-card-progress" className="text-sm text-slate-600 dark:text-slate-400">
              {currentCardIndex + 1} of {flashcards.length}
            </span>
          </div>
          
          <Button
            data-testid="button-next-card"
            onClick={nextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Card Actions */}
        <div className="flex space-x-2">
          <Button
            data-testid="button-mark-easy"
            onClick={() => markDifficulty("easy")}
            className="flex-1 bg-secondary hover:bg-emerald-600 text-white"
          >
            <Check className="h-4 w-4 mr-1" />
            Easy
          </Button>
          <Button
            data-testid="button-mark-hard"
            onClick={() => markDifficulty("hard")}
            className="flex-1 bg-accent hover:bg-amber-600 text-white"
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Hard
          </Button>
          <Button
            data-testid="button-mark-again"
            onClick={() => markDifficulty("again")}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Again
          </Button>
        </div>
      </div>
    </section>
  );
}
