import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, FileText, FileImage, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import type { File as AppFile } from "@shared/schema";

interface AudioPlayerProps {
  files: AppFile[];
}

export default function AudioPlayer({ files }: AudioPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    progress,
    currentIndex,
    play,
    pause,
    nextTrack,
    previousTrack,
    selectTrack
  } = useAudioPlayer(files);

  if (!files.length) {
    return (
      <section>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2 text-primary" />
            Audio Summaries
          </h3>
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              No audio summaries available. Upload and process a file to get started.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileIcon className="text-white text-sm" />;
    if (type.includes('image')) return <FileImage className="text-white text-sm" />;
    return <FileText className="text-white text-sm" />;
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-primary to-secondary",
      "bg-gradient-to-br from-secondary to-accent", 
      "bg-gradient-to-br from-accent to-primary"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="mr-2 text-primary" />
          Audio Summaries
        </h3>
        
        {/* Current Playing */}
        {currentTrack && (
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getGradientClass(currentIndex)}`}>
                {getFileIcon(currentTrack.type)}
              </div>
              
              <div className="flex-1">
                <h4 data-testid="text-current-track" className="font-medium">{currentTrack.name}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentTrack.summary ? "Audio Summary" : "Processing..."}
                </p>
                
                <div className="mt-2">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            </div>
            
            {/* Audio Controls */}
            <div className="flex items-center justify-center space-x-6 mt-4">
              <Button
                data-testid="button-previous"
                onClick={previousTrack}
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <SkipBack className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
              <Button
                data-testid="button-play-pause"
                onClick={isPlaying ? pause : play}
                className="p-4 rounded-full bg-primary hover:bg-blue-700 text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                data-testid="button-next"
                onClick={nextTrack}
                variant="ghost"
                size="sm"
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                <SkipForward className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Playlist */}
        <div>
          <h4 className="font-medium mb-3">Playlist</h4>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div 
                key={file.id}
                data-testid={`playlist-item-${index}`}
                onClick={() => selectTrack(index)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentIndex === index 
                    ? "bg-blue-50 dark:bg-blue-900/20" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${getGradientClass(index)}`}>
                  {getFileIcon(file.type)}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-sm">{file.name}</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {file.processed ? "Ready" : "Processing..."} • {file.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
                >
                  <Play className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
