import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Brain, Mic, Moon, Sun, Home as HomeIcon, Headphones, Layers, History } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import AudioPlayer from "@/components/AudioPlayer";
import FlashcardViewer from "@/components/FlashcardViewer";
import VoiceCommandModal from "@/components/VoiceCommandModal";
import RecentFiles from "@/components/RecentFiles";
import QuickSettings from "@/components/QuickSettings";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import type { File as AppFile } from "@shared/schema";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("home");
  const isMobile = useIsMobile();

  const { data: files = [], isLoading } = useQuery<AppFile[]>({
    queryKey: ["/api/files"],
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const processedFiles = files.filter(f => f.processed);
  const currentFile = processedFiles[0]; // Show first processed file by default

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="text-2xl text-primary" />
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">SummaryStream</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                data-testid="button-voice-command"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-2 rounded-lg bg-accent hover:bg-amber-600 text-white"
                size="sm"
              >
                <Mic className="h-4 w-4" />
              </Button>
              
              <Button
                data-testid="button-dark-mode"
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="p-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                  JD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
        {/* Mobile section switching */}
        {isMobile && (
          <div className="mb-6">
            {currentSection === "home" && (
              <>
                {/* Hero Section */}
                <section className="mb-8">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      Transform Any Content into Audio Learning
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">
                      Upload files, get AI-powered summaries, and learn on the go
                    </p>
                  </div>

                  <FileUpload />
                </section>

                <QuickSettings />
              </>
            )}
            {currentSection === "audio" && currentFile && <AudioPlayer files={processedFiles} />}
            {currentSection === "cards" && currentFile && <FlashcardViewer file={currentFile} />}
            {currentSection === "history" && <RecentFiles files={files} />}
          </div>
        )}

        {/* Desktop layout */}
        {!isMobile && (
          <>
            {/* Hero Section */}
            <section className="mb-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Transform Any Content into Audio Learning
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Upload files, get AI-powered summaries, and learn on the go
                </p>
              </div>

              <FileUpload />
            </section>

            <QuickSettings />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <AudioPlayer files={processedFiles} />
              {currentFile && <FlashcardViewer file={currentFile} />}
            </div>
            
            <RecentFiles files={files} />
          </>
        )}
      </main>

      {/* Mobile Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          <div className="flex justify-around items-center py-2">
            <button
              data-testid="nav-home"
              onClick={() => setCurrentSection("home")}
              className={`flex flex-col items-center py-2 px-4 ${currentSection === "home" ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
            >
              <HomeIcon className="h-5 w-5 mb-1" />
              <span className="text-xs">Home</span>
            </button>
            <button
              data-testid="nav-audio"
              onClick={() => setCurrentSection("audio")}
              className={`flex flex-col items-center py-2 px-4 ${currentSection === "audio" ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Headphones className="h-5 w-5 mb-1" />
              <span className="text-xs">Audio</span>
            </button>
            <button
              data-testid="nav-cards"
              onClick={() => setCurrentSection("cards")}
              className={`flex flex-col items-center py-2 px-4 ${currentSection === "cards" ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
            >
              <Layers className="h-5 w-5 mb-1" />
              <span className="text-xs">Cards</span>
            </button>
            <button
              data-testid="nav-history"
              onClick={() => setCurrentSection("history")}
              className={`flex flex-col items-center py-2 px-4 ${currentSection === "history" ? "text-primary" : "text-slate-600 dark:text-slate-400"}`}
            >
              <History className="h-5 w-5 mb-1" />
              <span className="text-xs">History</span>
            </button>
          </div>
        </nav>
      )}

      <VoiceCommandModal 
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
    </div>
  );
}
