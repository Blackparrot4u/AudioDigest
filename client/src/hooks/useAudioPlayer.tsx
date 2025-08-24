import { useState, useCallback, useRef, useEffect } from "react";
import type { File } from "@shared/schema";

interface AudioPlayerHook {
  currentTrack: File | null;
  isPlaying: boolean;
  progress: number;
  currentIndex: number;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
}

export function useAudioPlayer(files: File[]): AudioPlayerHook {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = files[currentIndex] || null;

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      
      const audio = audioRef.current;
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        nextTrack();
      });

      audio.addEventListener('loadedmetadata', () => {
        setProgress(0);
      });

      return () => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('ended', () => {});
          audio.removeEventListener('loadedmetadata', () => {});
        }
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
    }
  }, [currentTrack]);

  // Progress tracking
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressIntervalRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
          const progressPercent = (audio.currentTime / audio.duration) * 100;
          setProgress(progressPercent);
        }
      }, 1000);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying]);

  const play = useCallback(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Audio play failed:', error);
          // For demo purposes, simulate playing
          setIsPlaying(true);
        });
    } else {
      // Simulate playing for demo
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    }
  }, [currentIndex, files.length]);

  const previousTrack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  const selectTrack = useCallback((index: number) => {
    if (index >= 0 && index < files.length) {
      setCurrentIndex(index);
      setProgress(0);
      setIsPlaying(false);
    }
  }, [files.length]);

  return {
    currentTrack,
    isPlaying,
    progress,
    currentIndex,
    play,
    pause,
    nextTrack,
    previousTrack,
    selectTrack,
  };
}
