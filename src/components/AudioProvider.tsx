"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AudioContext = createContext<AudioContext | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        setAudioContext(ctx);
      }
    };

    // 只在用户交互后初始化
    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("touchstart", initAudio, { once: true });

    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("touchstart", initAudio);
    };
  }, [audioContext]);

  return <AudioContext.Provider value={audioContext}>{children}</AudioContext.Provider>;
}
