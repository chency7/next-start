'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Particles from '@/components/particles';
import { Github } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

const navigation = [
  { name: '随记', href: '/views/projects' },
  // { name: "博客", href: "/views/contact" },
  // { name: "关于", href: "/views/ablut" },
];

export default function ThemeDark() {
  const controls = useAnimation();
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const scrollThreshold = 100;

  // 添加滚动相关状态
  const [scrollStartTime, setScrollStartTime] = React.useState<number | null>(null);
  const [totalScroll, setTotalScroll] = React.useState(0);

  // 配置参数
  const TIME_WINDOW = 500; // 时间窗口：500ms
  const SCROLL_THRESHOLD = 300; // 滚动阈值：300px

  const [isHovered, setIsHovered] = useState(false);

  // 波浪动画配置
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 增加间隔时间，让字母出现的更慢
        delayChildren: 0.15 * i, // 增加延迟
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20, // 增加阻尼，减少弹跳
        stiffness: 100, // 降低刚度，让动画更柔和
        duration: 1, // 增加动画持续时间
      },
    },
    hidden: {
      opacity: 0,
      y: 30, // 增加初始位移距离
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 100,
        duration: 1,
      },
    },
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const currentTime = Date.now();

      // 如果是新的滚动开始
      if (!scrollStartTime) {
        setScrollStartTime(currentTime);
        setTotalScroll(Math.abs(e.deltaY));
      } else {
        // 在时间窗口内累计滚动距离
        if (currentTime - scrollStartTime < TIME_WINDOW) {
          setTotalScroll((prev) => prev + Math.abs(e.deltaY));
        } else {
          // 超出时间窗口，重置计数
          setScrollStartTime(currentTime);
          setTotalScroll(Math.abs(e.deltaY));
        }
      }

      // 检查是否达到快速滚动阈值
      if (totalScroll > SCROLL_THRESHOLD) {
        setScrollProgress(scrollThreshold); // 直接设置为100%
      } else {
        // 正常渐进式填充
        setScrollProgress((prev) => {
          const newProgress = Math.min(Math.max(prev + e.deltaY, 0), scrollThreshold);
          return newProgress;
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollStartTime, totalScroll]);

  const fillPercentage = Math.min((scrollProgress / scrollThreshold) * 100, 100);

  useEffect(() => {
    controls.start({
      clipPath: `inset(0 ${100 - fillPercentage}% 0 0)`,
      transition: {
        duration: fillPercentage === 100 ? 0.5 : 0.3, // 增加动画持续时间
        ease: fillPercentage === 100 ? [0.4, 0, 0.2, 1] : 'easeInOut', // 使用更平滑的缓动函数
      },
    });
  }, [fillPercentage, controls]);

  return (
    <div className="fixed inset-0 flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/10 to-black">
      <nav className="mb-20 animate-fade-in">
        <ul className="flex items-center justify-center gap-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-l text-zinc-500 duration-500 hover:text-zinc-300"
            >
              {item.name}
            </Link>
          ))}
        </ul>
      </nav>

      <div className="animate-glow hidden h-px w-screen animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />

      <div className="relative">
        {/* 背景文字（灰色） */}
        <motion.h1
          className="z-10 flex h-[300px] w-fit cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-r from-zinc-500 to-zinc-500 bg-clip-text px-16 font-pacifico text-4xl text-transparent sm:text-6xl md:text-9xl"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {Array.from('Chency').map((letter, index) => (
            <motion.span
              key={index}
              variants={child}
              className="inline-block transition-colors duration-300 hover:text-pink-500"
              style={{
                display: 'inline-block',
                transform: isHovered ? `translateY(${Math.sin(index * 0.3) * 8}px)` : 'none', // 减小波浪幅度和频率
                transition: 'transform 0.5s ease', // 增加过渡时间
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* 渐变填充文字 */}
        <motion.h1
          animate={controls}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          className="absolute inset-0 z-20 flex h-[300px] cursor-pointer select-none items-center justify-center overflow-hidden whitespace-nowrap bg-gradient-to-r from-white via-pink-500 to-white bg-clip-text px-16 font-pacifico text-4xl text-transparent transition-all duration-300 hover:scale-105 sm:text-6xl md:text-9xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            backgroundPosition: ['0%', '100%'],
            transition: {
              duration: 1,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'reverse',
            },
          }}
        >
          {Array.from('Chency').map((letter, index) => (
            <motion.span
              key={index}
              className="inline-block"
              style={{
                display: 'inline-block',
                transform: isHovered ? `translateY(${Math.sin(index * 0.3) * 8}px)` : 'none', // 减小波浪幅度和频率
                transition: 'transform 0.5s ease', // 增加过渡时间
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <div className="animate-glow hidden h-px w-screen animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0 md:block" />

      <Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={500} />

      <div className="mt-16 animate-fade-in text-center">
        <h2 className="text-sm text-zinc-500">
          <Github className="mr-1 inline h-4 w-4" />
          <Link
            target="_blank"
            href="https://github.com/chency7"
            className="duration-500 hover:text-zinc-300 hover:underline"
          >
            chency.github
          </Link>
        </h2>
      </div>
    </div>
  );
}
