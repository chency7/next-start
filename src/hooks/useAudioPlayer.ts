import { useState, useEffect, useRef, useCallback } from "react";
import type { MusicInfo } from "../types/music";

interface UseAudioPlayerProps {
  musicList: MusicInfo[];
  autoPlay?: boolean;
  loop?: boolean;
  initialVolume?: number;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  isMuted: boolean;
  currentMusic: MusicInfo;
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  songName: string;
}

export function useAudioPlayer({
  musicList,
  autoPlay = true,
  loop = true,
  initialVolume = 0.1,
}: UseAudioPlayerProps): UseAudioPlayerReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!autoPlay);
  const [volume, setVolume] = useState(initialVolume);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wasPlayingRef = useRef(false);
  const previousVolumeRef = useRef(initialVolume);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const currentMusic = musicList[currentIndex];

  // 音量设置逻辑
  const handleSetVolume = useCallback((newVolume: number) => {
    if (newVolume === 0) {
      setIsMuted(false);
    } else {
      setVolume(newVolume);
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = newVolume;
      }
    }
  }, []);

  // 切换静音状态
  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      handleSetVolume(previousVolumeRef.current); // 恢复之前的音量
    } else {
      previousVolumeRef.current = volume;
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = 0; // 同时更新 GainNode
      }
    }
  }, [isMuted]);

  // 切歌时的资源清理和初始化
  useEffect(() => {
    if (currentMusic) {
      wasPlayingRef.current = isPlaying;

      // 清理旧的音频资源
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }

      // 初始化新的音频资源
      const audio = new Audio(currentMusic.path);
      audio.loop = loop;
      audioRef.current = audio;

      const audioContext = new (window.AudioContext || window.AudioContext)();
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(gainNode).connect(audioContext.destination);

      audioContextRef.current = audioContext;
      sourceRef.current = source;
      gainNodeRef.current = gainNode;

      if (wasPlayingRef.current) {
        audio.play().catch(() => {
          setIsPlaying(false);
          setIsMuted(true);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    };
  }, [currentMusic, loop, isPlaying, isMuted]);

  // 播放方法
  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsMuted(false);
        })
        .catch((error) => {
          console.error("播放失败:", error);
          setIsPlaying(false);
          setIsMuted(true);
        });
    }
  }, []);

  // 暂停方法
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setIsMuted(true);
    }
  }, []);

  // 切换播放/暂停
  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  // 下一首
  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % musicList.length);
  }, [musicList.length]);

  // 上一首
  const previous = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + musicList.length) % musicList.length);
  }, [musicList.length]);

  return {
    isPlaying,
    isMuted,
    currentMusic,
    volume,
    play,
    pause,
    toggle,
    next,
    previous,
    setVolume: handleSetVolume,
    toggleMute,
    songName: currentMusic?.name.split("-")[1]?.trim() || currentMusic?.name || "未知歌曲",
  };
}
