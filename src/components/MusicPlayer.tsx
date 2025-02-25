'use client';
import { Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { ScrollingText } from './ScrollingText';
import { useEffect, useState, useRef } from 'react';
import type { MusicInfo } from '@/types/music';
import { throttle } from 'lodash';
import { useMediaQuery } from 'react-responsive';

export default function MusicPlayer() {
  const [musicList, setMusicList] = useState<MusicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [volume, setVolume] = useState(0.1);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    isPlaying,
    isMuted,
    toggle,
    next,
    previous,
    songName,
    currentMusic,
    setVolume: setAudioVolume,
  } = useAudioPlayer({
    musicList,
    autoPlay: false,
    loop: true,
    initialVolume: volume,
  });

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    fetch('/api/music')
      .then((res) => res.json())
      .then(setMusicList)
      .catch((error) => {
        console.error('Failed to load music list:', error);
        console.error('无法加载音乐列表，请稍后重试！');
      });
  }, []);

  useEffect(() => {
    if (currentMusic) {
      setIsLoading(true);
      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.preload = 'metadata';
      }
      const audio = audioRef.current;

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.AudioContext)();
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = volume;
      }

      const audioContext = audioContextRef.current;
      audio.src = currentMusic.path;
      audio.volume = volume;

      audio.load();
      audio.oncanplaythrough = () => setIsLoading(false);

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audio);
        if (gainNodeRef.current) {
          sourceRef.current.connect(gainNodeRef.current).connect(audioContext.destination);
        }
      }

      audio.onerror = () => {
        setIsLoading(false);
        console.error('音频加载失败');
        alert(`无法加载音频：${currentMusic.name}`);
      };

      const handleTimeUpdate = throttle(() => {}, 1000);
      audio.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        handleTimeUpdate.cancel();
      };
    }
  }, [currentMusic]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
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
  }, []);

  // 处理点击事件
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 如果点击的不是按钮本身或其子元素
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsVolumeVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setAudioVolume(newVolume);
  };

  return (
    <>
      <div className="absolute right-4 top-4 z-50 flex flex-col items-center gap-2">
        <button
          ref={buttonRef}
          onClick={toggle}
          className="relative rounded-full p-3 text-zinc-400 transition-all hover:bg-zinc-900 hover:text-zinc-100"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          onMouseEnter={() => setIsVolumeVisible(true)}
          onMouseLeave={() => setIsVolumeVisible(false)}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          <AnimatePresence>
            {isVolumeVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="volume-slider-container flex w-10 flex-col items-center justify-center rounded-full py-2"
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onClick={(e) => e.stopPropagation()}
                  onChange={handleVolumeChange}
                  onMouseDown={(e) => e.stopPropagation()}
                  className="h-20 w-28 -rotate-90 appearance-none bg-transparent"
                  style={{
                    WebkitAppearance: 'none',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`absolute z-50 flex items-center gap-4 overflow-hidden rounded-full bg-zinc-900/90 px-4 py-2 text-zinc-400 shadow-lg backdrop-blur-sm ${
              isMobile ? 'bottom-4 left-0 right-0 mx-auto w-[280px]' : 'bottom-8 right-8 w-60'
            }`}
          >
            <button
              onClick={previous}
              className="rounded-full p-1 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="mr-[16px] flex h-4 items-end gap-[2px]">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-full w-[2px] bg-pink-400 will-change-transform"
                  animate={{
                    height: ['40%', '90%', '40%'],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
            <div className="w-16 whitespace-nowrap">
              {isLoading ? (
                <div className="ml-2 text-xs text-zinc-400">加载中...</div>
              ) : (
                <ScrollingText text={songName} className="text-sm font-medium" />
              )}
            </div>
            <button
              onClick={next}
              className="rounded-full p-1 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <ChevronRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
