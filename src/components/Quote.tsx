"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 定义接口类型
interface HitokotoResponse {
  id: number;
  hitokoto: string;
  from: string;
  from_who: string | null;
  creator: string;
}

interface QuoteProps {
  className?: string;
  interval?: number;
}

// 进度条组件
const ProgressLine = ({ progress }: { progress: number }) => {
  return (
    <div className="absolute -bottom-px left-1/2 h-px w-3/4 -translate-x-1/2 overflow-hidden">
      <motion.div
        className="h-full w-full bg-gradient-to-r from-zinc-500/0 via-zinc-400/70 to-zinc-500/0"
        initial={{ x: "-100%" }}
        animate={{ x: `${progress - 100}%` }}
        transition={{ duration: 0.1, ease: "linear" }}
      />
    </div>
  );
};

// 本地语录数据
const localQuotes: HitokotoResponse[] = [
  {
    id: 1,
    hitokoto: "人生就像一本书，不会读书的人只能读到封面。",
    from: "名人语录",
    from_who: "叔本华",
    creator: "local",
  },
  {
    id: 2,
    hitokoto: "世界上最宽阔的是海洋，比海洋更宽阔的是天空，比天空更宽阔的是人的胸怀。",
    from: "哲理",
    from_who: "雨果",
    creator: "local",
  },
  {
    id: 3,
    hitokoto: "生活明朗，万物可爱。",
    from: "生活感悟",
    from_who: null,
    creator: "local",
  },
  {
    id: 4,
    hitokoto: "不要等待机会，而要创造机会。",
    from: "励志",
    from_who: "拉丁谚语",
    creator: "local",
  },
  {
    id: 5,
    hitokoto: "最美的不是下雨天，是曾与你躲过雨的屋檐。",
    from: "周杰伦",
    from_who: "不能说的秘密",
    creator: "local",
  },
];

// 主组件
export default function Quote({ className = "", interval = 5000 }: QuoteProps) {
  const [quote, setQuote] = useState<HitokotoResponse | null>(localQuotes[0] || null);
  const [progress, setProgress] = useState(0);
  const [useLocalQuotes, setUseLocalQuotes] = useState(false);

  // 获取随机本地语录
  const getRandomQuote = () => {
    if (localQuotes.length === 0) return; // 防止空数组
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    setQuote(localQuotes[randomIndex]);
    setProgress(0); // 重置进度条
  };

  // 从 API 获取新语录
  const fetchNewQuote = async () => {
    try {
      const response = await fetch("/api/proxy");
      if (!response.ok) throw new Error("Network response was not ok");
      const data: HitokotoResponse = await response.json();
      if (data?.hitokoto) {
        setQuote(data);
      } else {
        throw new Error("Invalid data");
      }
    } catch (error) {
      console.error("Failed to fetch quote:", error);
      setUseLocalQuotes(true); // 切换到本地语录
      getRandomQuote(); // 立即更新语录
    }
  };

  // 更新语录
  const updateQuote = () => {
    if (useLocalQuotes) {
      getRandomQuote();
    } else {
      fetchNewQuote();
    }
  };

  // 初始化和定时器设置
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let progressTimer: NodeJS.Timeout | null = null;

    const setupTimers = () => {
      updateQuote(); // 初始加载

      // 清除旧定时器
      if (timer) clearInterval(timer);
      if (progressTimer) clearInterval(progressTimer);

      // 设置语录更新定时器
      timer = setInterval(updateQuote, interval);

      // 设置进度条更新定时器
      progressTimer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + 100 / (interval / 16.67)));
      }, 16.67);
    };

    setupTimers();

    // 清理定时器
    return () => {
      if (timer) clearInterval(timer);
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [interval, useLocalQuotes]);

  return (
    <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 animate-fade-in ${className}`}>
      <div className="relative max-w-[90vw]">
        {/* 背景 */}
        <div
          className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-zinc-900/50 via-zinc-800/50 to-zinc-900/50 blur-md"
          aria-hidden="true"
        />

        {/* 动画效果 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quote?.id ?? "empty"} // 确保 key 始终有值
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex flex-col rounded-lg px-6 py-3 text-center font-wenkai text-sm text-zinc-400 transition-colors duration-500 hover:text-zinc-300 sm:text-base"
          >
            <p className="flex items-center justify-center gap-2">
              <span>{quote?.hitokoto}</span>
              {quote?.from && (
                <span className="text-xs text-zinc-500">
                  —— {quote.from} {quote.from_who && ` · ${quote.from_who}`}
                </span>
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 进度条 */}
      <ProgressLine progress={progress} />
    </div>
  );
}
