import { useRef, useCallback, useEffect } from 'react';

// Tension/suspense style audio URL (royalty-free)
const TENSION_AUDIO_URL = 'https://assets.mixkit.co/music/preview/mixkit-suspenseful-tension-601.mp3';

export const useBackgroundAudio = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);

  useEffect(() => {
    // Create audio element once
    audioRef.current = new Audio(TENSION_AUDIO_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
    };
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && !isPlayingRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay may be blocked - will play on first user interaction
        console.log('Audio autoplay blocked - will play on user interaction');
      });
      isPlayingRef.current = true;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
    }
  }, []);

  const fadeOutAndStop = useCallback(() => {
    if (audioRef.current && isPlayingRef.current) {
      const audio = audioRef.current;
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          clearInterval(fadeInterval);
          audio.pause();
          audio.currentTime = 0;
          audio.volume = 0.3;
          isPlayingRef.current = false;
        }
      }, 100);
    }
  }, []);

  return { play, stop, fadeOutAndStop };
};
